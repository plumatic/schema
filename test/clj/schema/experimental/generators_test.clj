(ns schema.experimental.generators-test
  (:use clojure.test)
  (:require
   [clojure.test.check.properties :as properties]
   [clojure.test.check.generators :as check-generators]
   [clojure.test.check.clojure-test :as check-clojure-test]
   [schema.core :as s]
   [schema.experimental.generators :as generators]))


(def OGInner
  {(s/required-key "l") [s/Int]
   s/Keyword s/Str})

(def OGInner2
  {:c OGInner
   :d s/Str})

(def OGSchema
  {:a [s/Str]
   :b OGInner2})

(def FinalSchema
  {:a (s/eq ["bob"])
   :b {:c (s/conditional (fn [{:strs [l]}] (and (every? even? l) (seq l))) OGInner)
       :d (s/eq "mary")}})

(deftest sample-test
  (let [res (generators/sample
             20 OGSchema
             {[s/Str] (generators/always ["bob"])
              s/Int ((generators/fmap #(inc (* % 2))) check-generators/int)}
             {[s/Int] (comp (generators/such-that seq)
                            (generators/fmap (partial mapv inc)))
              OGInner2 (generators/merged {:d "mary"})})]
    (is (= (count res) 20))
    (is (s/validate [FinalSchema] res))))

(deftest simple-leaf-generators-smoke-test
  (doseq [leaf-schema [double float long int short char byte boolean
                       Double Float Long Integer Short Character Byte Boolean
                       doubles floats longs ints shorts chars bytes booleans
                       s/Str String s/Bool s/Num s/Int s/Keyword s/Symbol s/Inst
                       Object s/Any s/Uuid (s/eq "foo") (s/enum :a :b :c)]]
    (testing (str leaf-schema)
      (is (= 10 (count (generators/sample 10 leaf-schema)))))))

(check-clojure-test/defspec spec-test
  100
  (properties/for-all [x (generators/generator OGSchema)]
                      (not (s/check OGSchema x))))
