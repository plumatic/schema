(ns schema.experimental.complete-test
  (:use clojure.test)
  (:require
   [schema.coerce :as coerce]
   [schema.core :as s]
   [schema.experimental.abstract-map :as abstract-map]
   [schema.experimental.complete :as complete]))

(deftest complete-test
  (let [s [{:a s/Int :b s/Str :c [s/Str]}]
        [r1 r2 r3 :as rs] (complete/complete [{:a 1} {:b "bob"} {:c ["foo" "bar"]}] s)]
    (is (not (s/check s rs)))
    (is (= (:a r1) 1))
    (is (= (:b r2) "bob"))
    (is (= (:c r3) ["foo" "bar"])))
  (testing "complete through variant"
    (let [s (s/cond-pre s/Str {:foo s/Int})]
      (is (= "test" (complete/complete "test" s)))
      (is (integer? (:foo (complete/complete {} s)))))))

(s/defschema Animal
  (abstract-map/abstract-map-schema
   :type
   {:name s/Str}))

(abstract-map/extend-schema Cat Animal [:cat] {:claws? s/Bool})
(abstract-map/extend-schema Dog Animal [:dog] {:barks? s/Bool})

(s/defrecord User
    [id :- long
     cash :- double
     friends :- [User]
     pet :- (s/maybe Animal)])

(def complete-user
  (complete/completer
   User
   {User (fn [x] (if (number? x) {:id x} x))
    Animal (fn [x] (if (keyword? x) {:type x} x))}))

(defn pull-pattern-matcher [s]
  (when (and (instance? clojure.lang.APersistentMap s)
             (not (s/find-extra-keys-schema s)))
    (fn [x]
      (select-keys x (->> s keys (map s/explicit-schema-key))))))

(defn pull [s x]
  ((coerce/coercer s pull-pattern-matcher) x))

(deftest fancy-complete-test
  (is (s/validate User (complete-user {})))
  (is (= {:id 2}
         (pull {:id long} (complete-user 2))))
  (is (= {:id 2 :pet {:type :cat}}
         (pull {:id s/Any :pet {:type s/Keyword}} (complete-user {:id 2 :pet :cat}))))
  (is (= {:id 10 :friends [{:id 2} {:id 3}]}
         (pull {:id s/Any :friends [{:id long}]}
               (complete-user {:id 10 :friends [2 {:id 3}]}))))
  (is (= {:id 10 :friends [{:id 2 :pet nil} {:id 3 :pet {:type :dog}}]}
         (pull {:id s/Any :friends [{:id long :pet (s/maybe {:type s/Keyword})}]}
               (complete-user {:id 10 :friends [{:id 2 :pet nil} {:id 3 :pet :dog}]})))))
