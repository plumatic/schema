(ns schema.fn-schema-test
  (:require [clojure.test :refer [deftest is testing]]
            ;sut
            [schema.fn-schema :as =>]
            [schema.core :as s]))

(deftest fn-schema?-test
  (is (not (=>/fn-schema? s/Any)))
  (is (=>/fn-schema? (s/=> s/Any)))
  (is (=>/fn-schema? (s/=>* s/Any [])))
  (is (not (=>/fn-schema? (=>/all [a] (s/=> a))))))

(deftest inst-test
  (is (= (=>/inst (=>/all [a] (s/=> a))
                  s/Int)
         (s/=> s/Int)))
  (is (= (=>/inst (=>/all [a] (s/=> a a))
                  s/Int)
         (s/=> s/Int s/Int)))
  (is (= (=>/inst (=>/all [a b] (s/=> a b a b))
                  s/Int s/Bool)
         (s/=> s/Int s/Bool s/Int s/Bool)))
  (is (= (=>/inst (=>/all [^:nat n1 ^:nat n2] (s/=> (s/enum n1 n2)))
                  42
                  24)
         (s/=> (s/enum 42 24)))))

(deftest args-schema-test
  (let [s (=>/args-schema (s/=> s/Any s/Int s/Bool))]
    (is (= [1 true] (s/validate s [1 true])))
    (is (thrown? Exception (s/validate s [true 1]))))
  (let [s (=>/args-schema (=>/all [a] (s/=> s/Any a s/Bool)))]
    (is (= [1 true] (s/validate s [1 true])))
    (is (= [:a false] (s/validate s [:a false])))
    (is (thrown? Exception (s/validate s [1 :a])))))

(deftest return-schema-test
  (is (= s/Bool (=>/return-schema (s/=> s/Bool))))
  (is (= s/Any (=>/return-schema (=>/all [a] (s/=> a)))))
  (is (= s/Bool (=>/return-schema (=>/all [a] (s/=> s/Bool a))))))

#_;;TODO
(deftest select-arities-test)

(deftest =>fn+coerce-test
  (testing "bad args"
    (let [s (s/=> s/Int s/Bool)]
      (doseq [[id f] [[:=>/fn (=>/fn :=> s
                                [a] (case a true 1 false 0))]
                      [:=>/coerce (=>/coerce
                                    s
                                    (fn [a] (case a true 1 false 0)))]]]
        (testing id
          (is (= 1 (f true)))
          (is (= 0 (f false)))
          (is (thrown? Exception (f :a)))))))
  (testing "bad return"
    (let [s (s/=> s/Int s/Bool)]
      (doseq [[id bad-return] [[:=>/fn (=>/fn :=> s
                                         [a] (case a true 1 false :a))]
                               [:=>/coerce (=>/coerce 
                                             s
                                             (fn [a] (case a true 1 false :a)))]]]
        (testing id
          (is (= 1 (bad-return true)))
          (is (thrown? Exception (bad-return false)))))))
  (testing "poly instantiates with most general schemas"
    (let [s (=>/all [a] (s/=> [(s/one a 'a)
                               (s/one s/Int 'int)]
                              a
                              s/Bool))]
      (doseq [[id poly] [[:=>/fn (=>/fn :=> s
                                   [a b] [a 1])]
                         [:=>/coerce (=>/coerce 
                                       s
                                       (fn [a b] [a 1]))]]]
        (testing id
          (is (= [42 1] (poly 42 true)))
          (is (= [:a 1] (poly :a true)))
          (is (thrown? Exception (poly :a :a))))))))

(s/defn foo-sdefn :- s/Keyword [a :- s/Int, b :- s/Bool])

(deftest =>partial-test
  (is (= (=>/partial (s/=> s/Any (s/named s/Any 'foo)))
         (s/=> s/Any (s/named s/Any 'foo))))
  (is (= (=>/partial (s/=> s/Any (s/named s/Any 'foo)) 'foo)
         (s/=> s/Any)))
  (is (thrown? Error (=>/partial (s/=> s/Any (s/named s/Any 'foo)) 'bar)))
  (is (thrown? Error (=>/partial (s/=> s/Any (s/named s/Any 'foo)) 'arg0)))
  ;;TODO
  (comment
    (=>/partial (s/fn-schema foo-sdefn) 'a)
    (=>/partial (s/fn-schema foo-sdefn) 'wrong)
    (=>/partial (s/fn-schema foo-sdefn) 'a 'b)
    (=>/partial (s/fn-schema foo-sdefn) 'a 'b)
    (s/defn bar :- s/Keyword [a :- s/Int, b :- s/Bool & rest :- [s/Int]])
    (partial (s/fn-schema bar) 'a)
    (partial (s/fn-schema bar) 'a 'b)
    (partial (s/fn-schema bar) 'a 'b 'rest) ;;error
    (s/defn multi :- s/Keyword 
      ([a :- s/Int])
      ([a :- s/Int, b :- s/Bool])
      ([a :- s/Int, b :- s/Bool & rest :- [s/Int]]))
    (partial (s/fn-schema multi) 'a)
    )
  )
