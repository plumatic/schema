(ns plumbing.schema-test
  (:use clojure.test plumbing.schema))

(defmacro valid! [s x] `(is (do (validate ~s ~x) true)))
(defmacro invalid! [s x] `(is (~'thrown? Exception (validate ~s ~x))))

(deftest simple-map-schema-test
 (let [schema {:foo long
               :bar double}]
   (valid! schema {:foo 1 :bar 2.0})
   (invalid! schema [[:foo 1] [:bar 2.0]])
   (invalid! schema {:foo 1 :bar 2.0 :baz 1})
   (invalid! schema {:foo 1})
   (invalid! schema {:foo 1.0 :bar 1.0})))

(deftest fancier-map-schema-test
 (let [schema {:foo long
               (key-schema String) double}]
   (valid! schema {:foo 1})
   (valid! schema {:foo 1 "bar" 2.0})
   (valid! schema {:foo 1 "bar" 2.0 "baz" 10.0})  
   (invalid! schema {:foo 1 :bar 2.0})
   (invalid! schema {:foo 1 :bar 2.0 "baz" 2.0})
   (invalid! schema {:foo 1 "bar" 2})))

(deftest another-fancy-map-schema-test
 (let [schema {:foo (nillable long)
               (optional-key :bar) double
               :baz {:b1 odd?}}]
   (valid! schema {:foo 1 :bar 1.0 :baz {:b1 3}})
   (valid! schema {:foo 1 :baz {:b1 3}})
   (valid! schema {:foo nil :baz {:b1 3}})
   (invalid! schema {:foo 1 :bar 1.0 :baz [[:b1 3]]})
   (invalid! schema {:foo 1 :bar 1.0 :baz {:b2 3}})
   (invalid! schema {:foo 1 :bar 1.0 :baz {:b1 4}})
   (invalid! schema {:bar 1.0 :baz {:b1 3}})
   (invalid! schema {:foo 1 :bar nil :baz {:b1 3}})))

(deftest multi-validator-test
 (let [schema (multi-validator
               (fn equal-keys? [m] (doseq [[k v] m] (check (= k v) "Got non-equal key-value pair: %s %s" k v)) true)
               {(key-schema clojure.lang.Keyword) clojure.lang.Keyword})]
   (valid! schema {})
   (valid! schema {:foo :foo :bar :bar})
   (invalid! schema {"foo" "foo"})
   (invalid! schema {:foo :bar})))

(deftest simple-repeated-seq-test
 (let [schema [long]]
   (valid! schema [])
   (valid! schema [1 2 3])
   (invalid! schema {})
   (invalid! schema [1 2 1.0])))

(deftest simple-single-seq-test
 (let [schema [(single long) (single double)]]
   (valid! schema [1 1.0])
   (invalid! schema [1])
   (invalid! schema [1 1.0 2])
   (invalid! schema [1 1])
   (invalid! schema [1.0 1.0])))

(deftest combo-seq-test
 (let [schema [(single (nillable long)) double]]
   (valid! schema [1])
   (valid! schema [1 1.0 2.0 3.0])
   (valid! schema [nil 1.0 2.0 3.0])
   (invalid! schema [1.0 2.0 3.0])
   (invalid! schema [])))

(deftest named-test
 (let [schema [(single (named "topic" String)) (single (named "score" double))]]
   (valid! schema ["foo" 1.0])
   (invalid! schema [1 2])))
