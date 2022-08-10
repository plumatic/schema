(ns schema.fn-schemas-test
  (:require [clojure.test :refer [deftest is testing]]
            ;;sut
            [schema.fn-schema2 :as =>]
            [schema.core :as s]))

(deftest return-schema-test
  (is (= (=>/return-schema (s/=> s/Int))
         s/Int))
  (is (= (=>/return-schema (s/=> s/Bool s/Int))
         s/Bool))
  (is (= (=>/return-schema (s/=> s/Bool & [s/Int]))
         s/Bool))
  (is (thrown? Error (=>/return-schema s/Int))))

(deftest nth-arg-schema-test
  (is (= (=>/nth-arg-schema
           (s/=> s/Bool s/Int s/Str)
           2
           0)
         s/Int))
  (is (= (=>/nth-arg-schema
           (s/=> s/Bool s/Int s/Str)
           2
           1)
         s/Str))
  (is (thrown? Error (=>/nth-arg-schema
                       (s/=> s/Bool s/Int s/Str)
                       3
                       2)))
  (is (thrown? Error (=>/nth-arg-schema
                       (s/=> s/Bool s/Int s/Str)
                       2
                       2)))
  (is (thrown? Error (=>/nth-arg-schema
                       (s/=> s/Bool s/Int & [s/Str])
                       2
                       0)))
  (is (thrown? Error (=>/nth-arg-schema s/Int 0 0))))

(s/defschema Bool->Int
  (s/=> s/Int s/Bool))

(=>/defn :=> Bool->Int
  foo1
  [a]
  (+ (if a 1 0) (inc ((fn [a] a) 41))))

(comment
  (macroexpand-1
    '(=>/defn :=> Bool->Int
       foo1
       [a]
       1))
  )

(=>/defn :=> Bool->Int
  foo2
  ([a] (+ (if a 1 0) (inc ((fn [a] a) 41)))))

(comment
  (macroexpand-1
    '(=>/defn :=> Bool->Int
       foo2
       ([a] 1)))
  )

(deftest =>defn-test
  (is (= 43 (foo1 true)))
  (is (= 42 (foo1 false)))
  (is (= 43 (foo2 true)))
  (is (= 42 (foo2 false)))
  (is (= s/Int
         (=>/return-schema (s/fn-schema foo1))))
  (is (= [s/Bool 'a]
         ((juxt =>/nth-arg-schema
                =>/nth-arg-name)
          (s/fn-schema foo1)
          1 0)))
  (testing "no return :-"
    (is (thrown-with-msg?
          Throwable
          #"Unexpected error macroexpanding.*"
          ;#".*No :- annotations allowed.*"
          (eval
            `(=>/defn :=> Bool->Int
               ~'__return-disallowed
               :- s/Num
               ([a#] 1))))))
  (testing "no arg :-"
    (is (thrown-with-msg?
          Throwable
          #"Unexpected error macroexpanding.*"
          ;#".*No :- annotations allowed.*"
          (eval
            `(=>/defn :=> Bool->Int
               ~'__arg-ann-disallowed
               ([a# :- s/Bool] 1))))))
  (testing "no rest arg (yet)"
    (is (thrown-with-msg?
          Throwable
          #"Syntax error compiling"
          ;#"Rest arguments not yet supported"
          (eval
            `(=>/defn :=> Bool->Int
               ~'__no-rest-arg
               ([& a#] 1))))))
  (testing "missing arg annotation"
    (is (thrown-with-msg?
          AssertionError
          #"missing 2 arity"
          (=>/defn :=> Bool->Int
            __missing-arg-ann
            ([a b] 1))))))

(deftest drop-leading-args-test
  (is (= (s/=> s/Int s/Bool s/Str)
         (=>/drop-leading-args (s/=> s/Int s/Bool s/Str) 0)))
  (is (= [s/Int s/Str]
         ((juxt =>/return-schema
                #(=>/nth-arg-schema % 1 0))
          (=>/drop-leading-args (s/=> s/Int s/Bool s/Str) 1))))
  (is (= (s/=> s/Int)
         (=>/drop-leading-args (s/=> s/Int s/Bool s/Str) 2)))
  (is (thrown-with-msg? AssertionError
                        #"Dropped too many args"
                        (=>/drop-leading-args (s/=> s/Int s/Bool s/Str) 3))))


(deftest drop-trailing-args-test
  (is (= (s/=> s/Int s/Bool s/Str)
         (=>/drop-trailing-args (s/=> s/Int s/Bool s/Str) 0)))
  (is (= [s/Int s/Bool]
         ((juxt =>/return-schema
                #(=>/nth-arg-schema % 1 0))
          (=>/drop-trailing-args (s/=> s/Int s/Bool s/Str) 1))))
  (is (= (s/=> s/Int)
         (=>/drop-trailing-args (s/=> s/Int s/Bool s/Str) 2)))
  (is (thrown-with-msg? AssertionError
                        #"Dropped too many args"
                        (=>/drop-trailing-args (s/=> s/Int s/Bool s/Str) 3))))

(s/defn example-named-args
  :- s/Inst
  [a :- s/Int
   b :- s/Bool
   c :- s/Str])

(defn fan-fn-schema
  "Can't construct the same schemas as s/defn with s/=>,
  so use this helper to check s/defn schemas."
  [s arity]
  ((juxt =>/return-schema
         (fn [s]
           (mapv (fn [i]
                   [(=>/nth-arg-name s arity i)
                    (=>/nth-arg-schema s arity i)])
                 (range arity))))
   s))

(deftest add-leading-args-test
  (is (= (s/fn-schema example-named-args)
         (=>/add-leading-args
           (s/fn-schema example-named-args))))
  (is (= [s/Inst
          [['zero s/Keyword]
           ['a s/Int]
           ['b s/Bool]
           ['c s/Str]]]
         (fan-fn-schema
           (=>/add-leading-args
             (s/fn-schema example-named-args)
             (s/one s/Keyword 'zero))
           4)))
  (is (= [s/Inst
          [['zero s/Keyword]
           ['one {:foo s/Any}]
           ['a s/Int]
           ['b s/Bool]
           ['c s/Str]]]
         (fan-fn-schema
           (=>/add-leading-args
             (s/fn-schema example-named-args)
             (s/one s/Keyword 'zero)
             (s/one {:foo s/Any} 'one))
           5))))

(deftest add-trailing-args-test
  (is (= (s/fn-schema example-named-args)
         (=>/add-trailing-args
           (s/fn-schema example-named-args))))
  (is (= [s/Inst
          [['a s/Int]
           ['b s/Bool]
           ['c s/Str]
           ['zero s/Keyword]]]
         (fan-fn-schema
           (=>/add-trailing-args
             (s/fn-schema example-named-args)
             (s/one s/Keyword 'zero))
           4)))
  (is (= [s/Inst
          [['a s/Int]
           ['b s/Bool]
           ['c s/Str]
           ['zero s/Keyword]
           ['one {:foo s/Any}]]]
         (fan-fn-schema
           (=>/add-trailing-args
             (s/fn-schema example-named-args)
             (s/one s/Keyword 'zero)
             (s/one {:foo s/Any} 'one))
           5))))
