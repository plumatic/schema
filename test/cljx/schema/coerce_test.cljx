(ns schema.coerce-test
  #+clj (:use clojure.test)
  #+cljs (:use-macros
          [cemerick.cljs.test :only [is deftest]])
  (:require
   [schema.core :as s]
   [schema.utils :as utils]
   [schema.coerce :as coerce]))

;; s/Num s/Int

(def Generic
  {:i s/Int
   (s/optional-key :n) s/Num
   (s/optional-key :s) s/Str
   (s/optional-key :k1) {s/Int s/Keyword}
   (s/optional-key :k2) s/Keyword
   (s/optional-key :e) (s/enum :a :b :c)})

(def JSON
  {(s/optional-key :is) [s/Int]})

#+clj
(def JVM
  {(s/optional-key :l) long
   (s/optional-key :d) Double
   (s/optional-key :jk) clojure.lang.Keyword})

(defn err-ks [res]
  (set (keys (utils/error-val res))))

(deftest json-coercer-test
  (let [coercer (coerce/coercer
                 (merge Generic JSON)
                 coerce/json-coercion-matcher)
        res {:i 1 :is [1 2] :n 3.0 :s "asdf" :k1 {1 :hi} :k2 :bye :e :a}]
    (is (= res
           (coercer {:i 1.0 :is [1.0 2.0] :n 3.0 :s "asdf" :k1 {1.0 "hi"} :k2 "bye" :e "a"})))
    (is (= res (coercer res)))
    (is (= #{:i} (err-ks (coercer {:i 1.1 :n 3})))))

  #+clj (testing "jvm specific"
          (let [coercer (coerce/coercer JVM coerce/json-coercion-matcher)
                res {:l 1 :d 1.0 :jk :asdf}]
            (is (= res (coercer {:l 1.0 :d 1 :jk "asdf"})))
            (is (= res (coercer res)))
            (is (= #{:l :jk} (err-ks (coercer {:l 1.2 :jk 1.0})))))))

(deftest string-coercer-test
  (let [coercer (coerce/coercer Generic coerce/string-coercion-matcher)]
    (is (= {:i 1 :n 3.0 :s "asdf" :k1 {1 :hi} :k2 :bye :e :a}
           (coercer {:i "1" :n "3.0" :s "asdf" :k1 {"1" "hi"} :k2 "bye" :e "a"})))
    (is (= #{:i} (err-ks (coercer {:i "1.1"})))))

  #+clj (testing "jvm specific"
          (let [coercer (coerce/coercer JVM coerce/string-coercion-matcher)
                res {:l 2 :d 1.0 :jk :asdf}]
            (is (= res (coercer {:l "2.0" :d "1" :jk "asdf"})))
            (is (= #{:l} (err-ks (coercer {:l "1.2"})))))))

#+clj
(do
  (def NestedVecs
    [(s/one s/Num "Node ID") (s/recursive #'NestedVecs)])

  (deftest recursive-coercion-test
    "Test that recursion (which rebinds subschema-walker) works with coercion."
    (is (= [1 [2 [3] [4]]]
           ((coerce/coercer NestedVecs coerce/string-coercion-matcher)
            ["1" ["2" ["3"] ["4"]]])))))
