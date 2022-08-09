(ns schema.generators.fn-schema-test
  (:require [clojure.test :refer [deftest is testing]]
            [clojure.test.check.generators :as gen]
            [schema.fn-schema :as =>]
            [schema.generators.fn-schema :as sut]
            [schema.core :as s]))

(deftest check-test
  (testing "success"
    (let [atm (atom [])
          res (sut/check
                (s/fn [a :- s/Int] (swap! atm conj a) a)
                {:num-tests 2
                 :seed 1634677540521})]
      (is (= {:result true, :pass? true, :num-tests 2, :seed 1634677540521}
             (dissoc res :time-elapsed-ms)))
      (is (= [-1N 0] @atm))))
  (testing "failure"
    (let [res (sut/check
                (s/fn foo :- s/Int [a])
                {:num-tests 2
                 :seed 1634677540521})]
      (is (= {:pass? false
              :seed 1634677540521
              :num-tests 1}
             (select-keys res #{:pass? :seed :num-tests :cause})))
      (is (= {:smallest '[{args [0]}]}
             (select-keys (:shrunk res) #{:smallest})))
      (is (re-find #"Output of foo does not match schema.*"
                   (-> res
                       (get-in [:shrunk :result])
                       ex-message)))
      (is (= {:type :schema.core/error, :schema s/Int, :value nil}
             (-> res
                 (get-in [:shrunk :result])
                 ex-data
                 (select-keys #{:type :schema :value})))))))

(deftest generator-test
  (is (integer? ((gen/generate
                   (sut/generator (s/=> s/Int s/Int)))
                 1)))
  (is (thrown? Exception
               ((gen/generate
                  (sut/generator (s/=> s/Int s/Int)))
                :foo))))

;; TODO improve blame msg (should be 'something here, not arg0)
(comment
  ((gen/generate
     (generator (s/=> s/Int (s/named s/Int 'something))))
   :foo)
  ;=> Value does not match schema: [(named (named (not (integer? :foo)) something) arg0)]
  )
