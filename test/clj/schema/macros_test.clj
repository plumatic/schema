(ns schema.macros-test
  (:use clojure.test)
  (:require
   [schema.core :as s]
   [schema.macros :as macros]))

(deftest normalized-defn-args-test
  (doseq [explicit-meta [{} {:a -1 :c 3}]
          [schema-attrs schema-forms] {{:schema `s/Any} []
                                       {:schema 'Long :tag 'Long} [:- 'Long]}
          [doc-attrs doc-forms] {{} []
                                 {:doc "docstring"} ["docstring"]}
          [attr-map attr-forms] {{} {}
                                 {:a 1 :b 2} [{:a 1 :b 2}]}]
    (let [simple-body ['[x] `(+ 1 1)]
          full-args (concat [(with-meta 'abc explicit-meta)] schema-forms doc-forms attr-forms simple-body)
          [name & more] (macros/normalized-defn-args {} full-args)]
      (testing (vec full-args)
        (is (= (concat ['abc (merge explicit-meta schema-attrs doc-attrs attr-map) simple-body])
               (concat [name (meta name) more])))))))

(deftest clj-primitives
  (doseq [symbol '#{float double byte char short int long
                        floats doubles bytes chars shorts ints longs objects}]
    (is (macros/primitive-sym? symbol)))
  (is (nil? (macros/primitive-sym? 'boolean)))
  (is (nil? (macros/primitive-sym? 'booleans))))

(deftest compile-fn-validation?-test
  (is (macros/compile-fn-validation? {} 'foo))
  (is (not (macros/compile-fn-validation? {} (with-meta 'foo {:never-validate true}))))
  (macros/set-compile-fn-validation! false)
  (is (not (macros/compile-fn-validation? {} 'foo)))
  (is (not (macros/compile-fn-validation? {} (with-meta 'foo {:always-validate true}))))
  (macros/set-compile-fn-validation! true)
  (binding [*assert* false]
    (is (not (macros/compile-fn-validation? {} 'foo)))
    (is (macros/compile-fn-validation? {} (with-meta 'foo {:always-validate true})))))
