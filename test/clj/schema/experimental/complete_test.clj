(ns schema.experimental.complete-test
  (:use clojure.test)
  (:require
   [schema.core :as s]
   [schema.experimental.complete :as complete]))

(deftest complete-test
  (let [s [{:a s/Int :b s/Str}]
        [r1 r2 :as rs] (complete/complete [{:a 1} {:b "bob"}] s)]
    (is (not (s/check s rs)))
    (is (= (:a r1) 1))
    (is (= (:b r2) "bob"))))
