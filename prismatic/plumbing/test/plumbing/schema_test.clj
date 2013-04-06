(ns plumbing.schema-test
  (:use clojure.test plumbing.schema))

(defmacro valid! [s x] `(is (do (validate ~s ~x) true)))
(defmacro invalid! [s x] `(is (~'thrown? Exception (validate ~s ~x))))

(deftest class-test
  (valid! String "foo")
  (invalid! String :foo))

(deftest fn-test
  (valid! odd? 1)
  (invalid! odd? 2)
  (invalid! odd? :foo))

(deftest primitive-test
  (valid! float (float 1.0))
  (invalid! float 1.0)
  (valid! double 1.0)
  (invalid! double (float 1.0))
  (valid! boolean true)
  (invalid! boolean 1)
  (doseq [f [byte char short int]]
    (valid! f (f 1))
    (invalid! f 1))
  (valid! long 1)
  (invalid! long (byte 1)))

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


(defrecord Foo [x ^long y])

(deftest record-test
  (let [schema (record Foo {:x +anything+ :y long})]
    (valid! schema (Foo. :foo 1))
    (invalid! schema {:x :foo :y 1})
    (invalid! schema (assoc (Foo. :foo 1) :bar 2))))

(deftest record-with-extra-keys test
  (let [schema (record Foo {:x +anything+ :y long (key-schema clojure.lang.Keyword) +anything+})]
    (valid! schema  (Foo. :foo 1))
    (valid! schema (assoc (Foo. :foo 1) :bar 2))
    (invalid! schema {:x :foo :y 1})))


(defrecord-schema Bar [+bar-schema+ {:foo long :bar String (optional-key :baz) clojure.lang.Keyword}])

(deftest defrecord-schema-test
  (is (= +bar-schema+ (record Bar {:foo long :bar String (optional-key :baz) clojure.lang.Keyword})))
  (is (Bar. 1 :foo))
  (is (= #{:foo :bar} (set (keys (map->Bar {:foo 1})))))
  (is (thrown? Exception (map->Bar {})))
  (valid! +bar-schema+ (Bar. 1 "test"))
  (invalid! +bar-schema+ (Bar. 1 :foo))
  (valid! +bar-schema+ (assoc (Bar. 1 "test") :baz :foo))
  (invalid! +bar-schema+ (assoc (Bar. 1 "test") :baaaz :foo))
  (invalid! +bar-schema+ (assoc (Bar. 1 "test") :baz "foo")))



(defmacro valid-call! [o c] `(is (= ~o (validated-call ~@c))))
(defmacro invalid-call! [c] `(is (~'thrown? Exception (validated-call ~@c))))

(deftest validated-call-test
  (let [f (with-meta 
            (fn schematized-fn [l m] 
              (if (= l 100)
                {:baz l}
                {:bar (when (= l 1) (+ l (:foo m)))}))
            {:input-schema [(single long) (single {:foo double})]
             :output-schema {:bar (nillable double)}})]
    (valid-call! {:bar nil} (f 2 {:foo 1.0}))
    (valid-call! {:bar 4.0} (f 1 {:foo 3.0}))
    (invalid-call! (f 3.0 {:foo 1.0}))
    (invalid-call! (f 3 {:foo 1}))
    (invalid-call! (f 100 {:foo 1.0}))))


