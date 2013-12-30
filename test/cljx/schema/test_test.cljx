(ns schema.test-test
  #+clj (:use clojure.test)
  (:require
   [schema.core :as s]
   [schema.test :as st]))

#+clj
(do
  (s/defn test-fn :- s/Str [] 5)

  (deftest validation-off-test
    (is (= 5 (test-fn))))

  (st/deftest validation-on-test
    (is (thrown? Exception (test-fn)))))
