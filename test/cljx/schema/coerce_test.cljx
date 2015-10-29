(ns schema.coerce-test
  #+clj (:use clojure.test)
  #+cljs (:use-macros
          [cemerick.cljs.test :only [is deftest]])
  (:require
   [schema.core :as s]
   [schema.utils :as utils]
   [schema.coerce :as coerce]
   #+cljs cemerick.cljs.test))

;; s/Num s/Int

(def Generic
  {:i s/Int
   (s/optional-key :b) s/Bool
   (s/optional-key :n) s/Num
   (s/optional-key :s) s/Str
   (s/optional-key :k1) {s/Int s/Keyword}
   (s/optional-key :k2) s/Keyword
   (s/optional-key :e) (s/enum :a :b :c)
   (s/optional-key :eq) (s/eq :k)
   (s/optional-key :set) #{s/Keyword}
   (s/optional-key :u) s/Uuid})

(def JSON
  {(s/optional-key :is) [s/Int]})

#+clj
(def JVM
  {(s/optional-key :jb) Boolean
   (s/optional-key :l) long
   (s/optional-key :d) Double
   (s/optional-key :jk) clojure.lang.Keyword})

(defn err-ks [res]
  (set (keys (utils/error-val res))))

(deftest json-coercer-test
  (let [coercer (coerce/coercer
                 (merge Generic JSON)
                 coerce/json-coercion-matcher)
        res {:i 1 :is [1 2] :n 3.0 :s "asdf" :k1 {1 :hi} :k2 :bye :e :a :eq :k :set #{:a :b}}]
    (is (= res
           (coercer {:i 1.0 :is [1.0 2.0] :n 3.0 :s "asdf" :k1 {1.0 "hi"} :k2 "bye" :e "a" :eq "k" :set ["a" "a" "b"]})))
    (is (= res (coercer res)))
    (is (= {:i 1 :b true} (coercer {:i 1.0 :b "TRUE"})))
    (is (= {:i 1 :b false} (coercer {:i 1.0 :b "Yes"})))
    (is (= #{:i :set} (err-ks (coercer {:i 1.1 :n 3 :set "a"})))))

  #+clj (testing "jvm specific"
          (let [coercer (coerce/coercer JVM coerce/json-coercion-matcher)
                res {:l 1 :d 1.0 :jk :asdf}]
            (is (= res (coercer {:l 1.0 :d 1 :jk "asdf"})))
            (is (= res (coercer res)))
            (is (= {:jb true} (coercer {:jb "TRUE"})))
            (is (= {:jb false} (coercer {:jb "Yes"})))
            (is (= #{:l :jk} (err-ks (coercer {:l 1.2 :jk 1.0}))))
            (is (= #{:d} (err-ks (coercer {:d nil}))))
            (is (= #{:d} (err-ks (coercer {:d "1.0"}))))))
  #+clj (testing "malformed uuid"
          (let [coercer (coerce/coercer Generic coerce/json-coercion-matcher)]
            (is (= #{:u} (err-ks (coercer {:i 1 :u "uuid-wannabe"})))))))

(deftest string-coercer-test
  (let [coercer (coerce/coercer Generic coerce/string-coercion-matcher)]
    (is (= {:b true :i 1 :n 3.0 :s "asdf" :k1 {1 :hi} :k2 :bye :e :a :eq :k :u #uuid "550e8400-e29b-41d4-a716-446655440000" :set #{:a :b}}
           (coercer {:b "true" :i "1" :n "3.0" :s "asdf" :k1 {"1" "hi"} :k2 "bye" :e "a" :eq "k" :u "550e8400-e29b-41d4-a716-446655440000" :set ["a" "a" "b"]})))
    (is (= #{:i} (err-ks (coercer {:i "1.1"})))))

  #+clj (testing "jvm specific"
          (let [coercer (coerce/coercer JVM coerce/string-coercion-matcher)
                res {:jb false :l 2 :d 1.0 :jk :asdf}]
            (is (= res (coercer {:jb "false" :l "2.0" :d "1" :jk "asdf"})))
            (is (= #{:l} (err-ks (coercer {:l "1.2"})))))))

(deftest coercer!-test
  (let [coercer (coerce/coercer! {:k s/Keyword :i s/Int} coerce/string-coercion-matcher)]
    (is (= {:k :key :i 12} (coercer {:k "key" :i "12"})))
    (is (thrown-with-msg? #+clj Exception #+cljs js/Error  #"keyword\? 12" (coercer {:k 12 :i 12})))))

#+clj
(do
  (def NestedVecs
    [(s/one s/Num "Node ID") (s/recursive #'NestedVecs)])

  (deftest recursive-coercion-test
    "Test that recursion (which rebinds subschema-walker) works with coercion."
    (is (= [1 [2 [3] [4]]]
           ((coerce/coercer NestedVecs coerce/string-coercion-matcher)
            ["1" ["2" ["3"] ["4"]]])))))

(deftest constrained-test
  (is (= 1 ((coerce/coercer! (s/constrained s/Int odd?) coerce/string-coercion-matcher) "1")))
  (is (= {1 1} ((coerce/coercer! (s/constrained {s/Int s/Int} #(odd? (count %))) coerce/string-coercion-matcher) {"1" "1"}))))
