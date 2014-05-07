(ns schema.core-test
  "Tests for schema.

   Uses helpers defined in schema.test-macros (for cljs sake):
    - (valid! s x) asserts that (s/check s x) returns nil
    - (invalid! s x) asserts that (s/check s x) returns a validation failure
      - The optional last argument also checks the printed Clojure representation of the error.
    - (invalid-call! s x) asserts that calling the function throws an error."
  #+clj (:use clojure.test [schema.test-macros :only [valid! invalid! invalid-call!]])
  #+cljs (:use-macros
          [cemerick.cljs.test :only [is deftest testing]]
          [schema.test-macros :only [valid! invalid! invalid-call!]])
  #+cljs (:require-macros
          [schema.macros :as sm])
  (:require
   clojure.data
   [schema.utils :as utils]
   [schema.core :as s]
   #+clj potemkin
   #+clj [schema.macros :as sm]
   #+cljs cemerick.cljs.test))

#+cljs
(do
  (def Exception js/Error)
  (def AssertionError js/Error)
  (def Throwable js/Error))

(deftest compiling-cljs?-test
  (is (= #+cljs true #+clj false (sm/compiling-cljs-now?))))

(deftest try-catchall-test
  (let [a (atom 0)]
    (is (= 2 (sm/try-catchall (reset! a 1) (swap! a inc) (catch e (swap! a - 10)))))
    (is (= 2 @a)))
  (let [a (atom 0)]
    (is (= -9 (sm/try-catchall (reset! a 1) (swap! a #(throw (sm/error! (str %)))) (catch e (swap! a - 10)))))
    (is (= -9 @a))))

(deftest validate-return-test
  (is (= 1 (s/validate s/Int 1))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Platform-specific leaf Schemas

#+clj
(do
  (deftest class-test
    (valid! String "a")
    (invalid! String nil "(not (instance? java.lang.String nil))")
    (invalid! String :a "(not (instance? java.lang.String :a))")
    (is (= 'java.lang.String (s/explain String))))

  (deftest primitive-test
    (valid! double 1.0)
    (invalid! double (float 1.0) "(not (instance? java.lang.Double 1.0))")
    (is (= 'java.lang.Double (s/explain double)))
    (valid! float (float 1.0))
    (invalid! float 1.0)
    (valid! long 1)
    (invalid! long (byte 1))
    (valid! boolean true)
    (invalid! boolean 1)
    (valid! longs (long-array 10))
    (invalid! longs (int-array 10))
    (doseq [f [byte char short int]]
      (valid! f (f 1))
      (invalid! f 1)))

  (deftest array-test
    (valid! (Class/forName"[Ljava.lang.String;") (into-array String ["a"]))
    (invalid! (Class/forName "[Ljava.lang.Long;") (into-array String ["a"]))
    (valid! (Class/forName "[Ljava.lang.Double;") (into-array Double [1.0]))
    (valid! (Class/forName "[D") (double-array [1.0]))
    (invalid! (Class/forName "[D") (into-array Double [1.0]))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Cross-platform Schema leaves

(deftest any-test
  (valid! s/Any 10)
  (valid! s/Any nil)
  (valid! s/Any :whatever)
  (is (= 'Any (s/explain s/Any))))

(deftest eq-test
  (let [schema (s/eq 10)]
    (valid! schema 10)
    (invalid! schema 9 "(not (= 10 9))")
    (is (= '(eq 10) (s/explain schema)))))

(deftest enum-test
  (let [schema (s/enum :a :b 1)]
    (valid! schema :a)
    (valid! schema 1)
    (invalid! schema :c)
    (invalid! (s/enum :a) 2 "(not (#{:a} 2))")
    (is (= '(1 :a :b enum) (sort-by str (s/explain schema))))))

(deftest pred-test
  (let [schema (s/pred odd? 'odd?)]
    (valid! schema 1)
    (invalid! schema 2 "(not (odd? 2))")
    (invalid! schema :foo "(throws? (odd? :foo))")
    (is (= '(pred odd?) (s/explain schema)))))

(defprotocol ATestProtocol)
(defrecord DirectTestProtocolSatisfier [] ATestProtocol)
(defrecord IndirectTestProtocolSatisfier []) (extend-type IndirectTestProtocolSatisfier ATestProtocol)
(defrecord NonTestProtocolSatisfier [])

(deftest protocol-test
  (let [schema (sm/protocol ATestProtocol)]
    (valid! schema (DirectTestProtocolSatisfier.))
    (valid! schema (IndirectTestProtocolSatisfier.))
    (invalid! schema (NonTestProtocolSatisfier.))
    (invalid! schema nil)
    (invalid! schema 117 "(not (satisfies? ATestProtocol 117))")
    (is (= '(protocol ATestProtocol) (s/explain schema)))))

(deftest regex-test
  (valid! #"lex" "Alex B")
  (valid! #"lex" "lex")
  (invalid! #"lex" nil "(not (string? nil))")
  (invalid! #"lex" "Ale" "(not (re-find #\"lex\" \"Ale\"))")
  (is (= (symbol "#\"lex\"") (s/explain #"lex"))))

(deftest leaf-bool-test
  (valid! s/Bool true)
  (invalid! s/Bool nil "(not (instance? java.lang.Boolean nil))")
  #+clj (is (= 'java.lang.Boolean (s/explain s/Bool))))

(deftest leaf-string-test
  (valid! s/Str "asdf")
  (invalid! s/Str nil "(not (instance? java.lang.String nil))")
  (invalid! s/Str :a "(not (instance? java.lang.String :a))")
  #+clj (is (= 'java.lang.String (s/explain s/Str))))

(deftest leaf-number-test
  (valid! s/Num 1)
  (valid! s/Num 1.2)
  (valid! s/Num (/ 1 2))
  (invalid! s/Num nil "(not (instance? java.lang.Number nil))")
  (invalid! s/Num "1" "(not (instance? java.lang.Number \"1\"))")
  #+clj (is (= 'java.lang.Number (s/explain s/Num))))

(deftest leaf-int-test
  (valid! s/Int 1)
  (invalid! s/Int 1.2 "(not (integer? 1.2))")
  #+clj (invalid! s/Int 1.0 "(not (integer? 1.0))")
  (invalid! s/Int nil "(not (integer? nil))")
  (is (= 'Int (s/explain s/Int))))

(deftest leaf-keyword-test
  (valid! s/Keyword :a)
  (valid! s/Keyword ::a)
  (invalid! s/Keyword nil "(not (keyword? nil))")
  (invalid! s/Keyword ":a" "(not (keyword? \":a\"))")
  (is (= 'Keyword (s/explain s/Keyword))))

(deftest leaf-regex-test
  (valid! s/Regex #".*")
  (invalid! s/Regex ".*"))

(deftest leaf-inst-test
  (valid! s/Inst #inst "2013-01-01T01:15:01.840-00:00")
  (invalid! s/Inst "2013-01-01T01:15:01.840-00:00"))

(deftest leaf-uuid-test
  (valid! s/Uuid #uuid "0e98ce5b-9aca-4bf7-b5fd-d90576c80fdf")
  (invalid! s/Uuid "0e98ce5b-9aca-4bf7-b5fd-d90576c80fdf"))



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Simple composite Schemas


(deftest maybe-test
  (let [schema (s/maybe s/Int)]
    (valid! schema nil)
    (valid! schema 1)
    (invalid! schema 1.1 "(not (integer? 1.1))")
    (is (= '(maybe Int) (s/explain schema)))))

(deftest named-test
  (let [schema (s/named s/Int :score)]
    (valid! schema 12)
    (invalid! schema :a "(named (not (integer? :a)) :score)")
    (is (= '(named Int :score) (s/explain schema)))))

(deftest either-test
  (let [schema (s/either
                {:num s/Int}
                {:str s/Str})]
    (valid! schema {:num 1})
    (valid! schema {:str "hello"})
    (invalid! schema {:num "bad!"})
    (invalid! schema {:str 1})
    (is (= '(either {:a Int} Int) (s/explain (s/either {:a s/Int} s/Int))))
    (is (s/explain schema))))

(deftest both-test
  (let [schema (s/both
                (s/pred (fn equal-keys? [m] (every? (fn [[k v]] (= k v)) m)) 'equal-keys?)
                {s/Keyword s/Keyword})]
    (valid! schema {})
    (valid! schema {:foo :foo :bar :bar})
    (invalid! schema {"foo" "foo"})
    (invalid! schema {:foo :bar} "(not (equal-keys? {:foo :bar}))")
    (invalid! schema {:foo 1} "(not (equal-keys? {:foo 1}))")
    (is (= '(both (pred vector?) [Int])
           (s/explain (s/both (s/pred vector? 'vector?) [s/Int]))))))

(deftest conditional-test
  (let [schema (s/conditional #(= (:type %) :foo) {:type (s/eq :foo) :baz s/Num}
                              #(= (:type %) :bar) {:type (s/eq :bar) :baz s/Str})]
    (valid! schema {:type :foo :baz 10})
    (valid! schema {:type :bar :baz "10"})
    (invalid! schema {:type :foo :baz "10"})
    (invalid! schema {:type :bar :baz 10} "{:baz (not (instance? java.lang.String 10))}")
    (invalid! schema {:type :zzz :baz 10}
              "(not (matches-some-condition? a-clojure.lang.PersistentArrayMap))")
    (is (s/explain schema))))

(deftest if-test
  (let [schema (s/if #(= (:type %) :foo)
                 {:type (s/eq :foo) :baz s/Num}
                 {:type (s/eq :bar) :baz s/Str})]
    (valid! schema {:type :foo :baz 10})
    (valid! schema {:type :bar :baz "10"})
    (invalid! schema {:type :foo :baz "10"})
    (invalid! schema {:type :bar :baz 10})
    (invalid! schema {:type :zzz :baz 10})))


#+clj
(do (def NestedVecs
      [(s/one s/Num "Node ID")
       (s/recursive #'NestedVecs)])

    (def NestedMaps
      {:node-id s/Num
       (s/optional-key :children) [(s/recursive #'NestedMaps)]})

    (declare BlackNode)
    (def RedNode {(s/optional-key :red) (s/recursive #'BlackNode)})
    (def BlackNode {:black RedNode})

    (deftest recursive-test
      (valid! NestedVecs [1 [2 [3 [4]]]])
      (invalid! NestedVecs [1 [2 ["invalid-id" [4]]]])
      (invalid! NestedVecs [1 [2 [3 "invalid-content"]]])

      (valid! NestedMaps
              {:node-id 1
               :children [{:node-id 1
                           :children [{:node-id 4}]}
                          {:node-id 3}]})
      (invalid! NestedMaps
                {:node-id 1
                 :children [{:invalid-node-id 1
                             :children [{:node-id 4}]}
                            {:node-id 3}]})
      (invalid! NestedMaps
                {:node-id 1
                 :children [{:node-id 1
                             :children [{:node-id 4}]}
                            {:node-id "invalid-id"}]})

      (valid! BlackNode {:black {}})
      (valid! BlackNode {:black {:red {:black {}}}})
      (invalid! BlackNode {:black {:black {}}})
      (invalid! BlackNode {:black {:red {}}})

      (is (= '{:black {(optional-key :red) (recursive (var schema.core-test/BlackNode))}}
             (s/explain BlackNode)))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Map Schemas

(deftest uniform-map-test
  (let [schema {s/Keyword s/Int}]
    (valid! schema {})
    (valid! schema {:a 1 :b 2})
    (invalid! schema {'a 1 :b 2} "{(not (keyword? a)) invalid-key}")
    (invalid! schema {:a :b} "{:a (not (integer? :b))}")
    (is (= '{Keyword Int} (s/explain {s/Keyword s/Int})))))

(deftest simple-specific-key-map-test
  (let [schema-args [:foo s/Keyword :bar s/Int]]
    (doseq [[t schema] {"hash-map" (apply hash-map schema-args)
                        "array-map" (apply array-map schema-args)}]
      (testing t
        (valid! schema {:foo :a :bar 2})
        (invalid! schema [[:foo :a] [:bar 2]] "(not (map? a-clojure.lang.PersistentVector))")
        (invalid! schema {:foo :a} "{:bar missing-required-key}")
        (invalid! schema {:foo :a :bar 2 :baz 1} "{:baz disallowed-key}")
        (invalid! schema {:foo :a :bar 1.5} "{:bar (not (integer? 1.5))}")
        (is (= '{:foo Keyword, :bar Int} (s/explain schema)))))))

(deftest fancier-map-schema-test
  (let [schema {:foo s/Int
                s/Str s/Num}]
    (valid! schema {:foo 1})
    (valid! schema {:foo 1 "bar" 2.0})
    (valid! schema {:foo 1 "bar" 2.0 "baz" 10.0})
    (invalid! schema {:foo 1 :bar 2.0})
    (invalid! schema {:foo 1 :bar 2.0})
    (invalid! schema {:foo 1 :bar 2.0 "baz" 2.0})
    (invalid! schema {:foo 1 "bar" "a"})))

(deftest another-fancy-map-schema-test
  (let [schema {:foo (s/maybe s/Int)
                (s/optional-key :bar) s/Num
                :baz {:b1 (s/pred odd?)}
                s/Keyword s/Any}]
    (valid! schema {:foo 1 :bar 1.0 :baz {:b1 3}})
    (valid! schema {:foo 1 :baz {:b1 3}})
    (valid! schema {:foo nil :baz {:b1 3}})
    (valid! schema {:foo nil :baz {:b1 3} :whatever "whatever"})
    (invalid! schema {:foo 1 :bar 1.0 :baz [[:b1 3]]})
    (invalid! schema {:foo 1 :bar 1.0 :baz {:b2 3}})
    (invalid! schema {:foo 1 :bar 1.0 :baz {:b1 4}})
    (invalid! schema {:bar 1.0 :baz {:b1 3}})
    (invalid! schema {:foo 1 :bar nil :baz {:b1 3}})
    (invalid! schema {:foo 1 :bar "z" :baz {:b1 3}})))

(deftest throw-on-multiple-key-variants-test
  (is (thrown? Exception (s/checker {:foo s/Str (s/optional-key :foo) s/Str})))
  (is (thrown? Exception (s/checker {(s/required-key "A") s/Str (s/optional-key "A") s/Str}))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Set Schemas

(deftest simple-set-test
  (testing "set schemas must have exactly one entry"
    (is (thrown? Exception (s/check #{s/Int s/Num} #{})))
    (is (thrown? Exception (s/check #{} #{}))))

  (testing "basic set identification"
    (let [schema #{s/Keyword}]
      (valid! schema #{:a :b :c})
      (invalid! schema [:a :b :c] "(not (set? [:a :b :c]))")
      (invalid! schema {:a :a :b :b})
      (is (= '#{Keyword} (s/explain schema)))))

  (testing "enforces matching with single simple entry"
    (let [schema #{s/Int}]
      (valid! schema #{})
      (valid! schema #{1 2 3})
      (invalid! schema #{1 :a} "#{(not (integer? :a))}")
      (invalid! schema #{:a "c" {}})))

  (testing "more complex element schema"
    (let [schema #{[s/Int]}]
      (valid! schema #{})
      (valid! schema #{[2 4] [3 6]})
      (invalid! schema #{2})
      (invalid! schema #{[[2 3]]}))))

(deftest mixed-set-test
  (let [schema #{(s/either [s/Int] #{s/Int})}]
    (valid! schema #{})
    (valid! schema #{[3 4] [56 1] [-11 3]})
    (valid! schema #{#{3 4} #{56 1} #{-11 3}})
    (valid! schema #{[3 4] #{56 1} #{-11 3}})
    (invalid! schema #{#{[3 4]}})
    (invalid! schema #{[[3 4]]})))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Sequence Schemas

(deftest simple-repeated-seq-test
  (let [schema [s/Int]]
    (valid! schema [])
    (valid! schema [1 2 3])
    (invalid! schema {})
    #+clj (invalid! schema [1 2 1.0])
    (invalid! schema [1 2 1.1])))

(deftest simple-one-seq-test
  (let [schema [(s/one s/Int "int") (s/one s/Str "str")]]
    (valid! schema [1 "a"])
    (invalid! schema [1])
    (invalid! schema [1 1.0 2])
    (invalid! schema [1 1])
    (invalid! schema [1.0 1.0])))

(deftest optional-seq-test
  (let [schema [(s/one s/Int "int")
                (s/optional s/Str "str")
                (s/optional s/Int "int2")]]
    (valid! schema [1])
    (valid! schema [1 "a"])
    (valid! schema [1 "a" 2])
    (invalid! schema [])
    (invalid! schema [1 "a" 2 3])
    (invalid! schema [1 1])))

(deftest combo-seq-test
  (let [schema [(s/one (s/maybe s/Int) :maybe-long)
                (s/optional s/Keyword :key)
                s/Int]]
    (valid! schema [1])
    (valid! schema [1 :a])
    (valid! schema [1 :a 1 2 3])
    (valid! schema [nil :b 1 2 3])
    (invalid! schema {} "(not (sequential? {}))")
    (invalid! schema "asdf" "(not (sequential? \"asdf\"))")
    (invalid! schema [nil 1 1 2 3] "[nil (named (not (keyword? 1)) :key) nil nil nil]")
    (invalid! schema [1.4 :A 2 3] "[(named (not (integer? 1.4)) :maybe-long) nil nil nil]")
    (invalid! schema [] "[(not (present? :maybe-long))]")
    (is (= '[(one (maybe Int) :maybe-long) (optional Keyword :key) Int] (s/explain schema)))))

(deftest pair-test
  (let [schema (s/pair s/Str "user-name" s/Int "count")]
    (valid! schema ["user1" 42])
    (invalid! schema ["user2" 42.1])
    (invalid! schema [42 "user1"])
    (invalid! schema ["user1" 42 42])
    (valid! schema ["user2" 41]) ))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Record Schemas

(defrecord Foo [x ^{:s s/Int} y])

(deftest record-test
  (let [schema (s/record Foo {:x s/Any (s/optional-key :y) s/Int})]
    (valid! schema (Foo. :foo 1))
    (invalid! schema {:x :foo :y 1})
    (invalid! schema (assoc (Foo. :foo 1) :bar 2))
    #+clj (is (= '(record schema.core_test.Foo {:x Any,  (optional-key :y) Int})
                 (s/explain schema)))))

(deftest record-with-extra-keys-test
  (let [schema (s/record Foo {:x s/Any
                              :y s/Int
                              s/Keyword s/Any})]
    (valid! schema (Foo. :foo 1))
    (valid! schema (assoc (Foo. :foo 1) :bar 2))
    (invalid! schema {:x :foo :y 1})))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Function Schemas

(deftest single-arity-fn-schema-test
  (let [schema (sm/=> s/Keyword s/Int s/Int)]
    (valid! schema (fn [x y] (keyword (str (+ x y)))))
    (valid! schema (fn [])) ;; we don't actually validate what the function does
    (invalid! schema {} "(not (fn? {}))")
    (is (= '(=> Keyword Int Int) (s/explain schema)))))

(deftest single-arity-and-more-fn-schema-test
  (let [schema (sm/=> s/Keyword s/Int s/Int & [s/Keyword])]
    (valid! schema (fn [])) ;; we don't actually validate what the function does
    (invalid! schema {} "(not (fn? {}))")
    (is (= '(=> Keyword Int Int & [Keyword]) (s/explain schema)))))

(deftest multi-arity-fn-schema-test
  (let [schema (sm/=>* s/Keyword [s/Int] [s/Int & [s/Keyword]])]
    (valid! schema (fn [])) ;; we don't actually validate what the function does
    (invalid! schema {} "(not (fn? {}))")
    (is (= '(=>* Keyword [Int] [Int & [Keyword]]) (s/explain schema)))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized defrecord

(defmacro test-normalized-meta [symbol ex-schema desired-meta]
  (let [normalized (schema.macros/normalized-metadata &env symbol ex-schema)]
    `(do (is (= '~symbol '~normalized))
         (is (= ~(select-keys desired-meta [:schema :tag])
                ~(select-keys (meta normalized) [:schema :tag]))))))

#+clj
(do
  (def ASchema [long])

  (deftest normalized-metadata-test
    (testing "empty" (test-normalized-meta 'foo nil {:schema s/Any}))
    (testing "protocol" (test-normalized-meta ^ATestProtocol foo nil {:schema (s/protocol ATestProtocol)}))
    (testing "primitive" (test-normalized-meta ^long foo nil {:tag long :schema long}))
    (testing "class" (test-normalized-meta ^String foo nil {:tag String :schema String}))
    (testing "non-tag" (test-normalized-meta ^ASchema foo nil {:schema ASchema}))
    (testing "both" (test-normalized-meta ^{:tag Object :schema String} foo nil {:tag Object :schema String}))
    (testing "explicit" (test-normalized-meta ^Object foo String {:tag Object :schema String})))

  (defmacro test-meta-extraction [meta-form arrow-form]
    (let [meta-ized (schema.macros/process-arrow-schematized-args {} arrow-form)]
      `(do (is (= '~meta-form '~meta-ized))
           (is (= ~(mapv #(select-keys (meta (schema.macros/normalized-metadata {} % nil)) [:schema :tag]) meta-form)
                  ~(mapv #(select-keys (meta %) [:schema :tag]) meta-ized))))))

  (deftest extract-arrow-schematized-args-test
    (testing "empty" (test-meta-extraction [] []))
    (testing "no-tag" (test-meta-extraction [x] [x]))
    (testing "old-tags" (test-meta-extraction [^String x] [^String x]))
    (testing "new-vs-old-tag" (test-meta-extraction [^String x] [x :- String]))
    (testing "multi vars" (test-meta-extraction [x ^{:schema [String]} y z] [x y :- [String] z]))))

(#+clj potemkin/defprotocol+ #+cljs defprotocol PProtocol
       (do-something [this]))

;; exercies some different arities

(sm/defrecord Bar
    [^s/Int foo ^s/Str bar]
  {(s/optional-key :baz) s/Keyword})

(sm/defrecord Bar2
    [^s/Int foo ^s/Str bar]
  {(s/optional-key :baz) s/Keyword}
  PProtocol
  (do-something [this] 2))

(sm/defrecord Bar3
    [^s/Int foo ^s/Str bar]
  PProtocol
  (do-something [this] 3))

(sm/defrecord Bar4
    [^{:s [s/Int]} foo ^{:s? {s/Str s/Str}} bar]
  PProtocol
  (do-something [this] 4))

(deftest defrecord-schema-test
  (is (= (utils/class-schema Bar)
         (s/record Bar {:foo s/Int
                        :bar s/Str
                        (s/optional-key :baz) s/Keyword})))
  (is (identity (Bar. 1 :foo)))
  (is (= #{:foo :bar} (set (keys (map->Bar {:foo 1})))))
  ;; (is (thrown? Exception (map->Bar {}))) ;; check for primitive long
  (valid! Bar (Bar. 1 "test"))
  (invalid! Bar (Bar. 1 :foo))
  (valid! Bar (assoc (Bar. 1 "test") :baz :foo))
  (invalid! Bar (assoc (Bar. 1 "test") :baaaz :foo))
  (invalid! Bar (assoc (Bar. 1 "test") :baz "foo"))

  (valid! Bar2 (assoc (Bar2. 1 "test") :baz :foo))
  (invalid! Bar2 (assoc (Bar2. 1 "test") :baaaaz :foo))
  (is (= 2 (do-something (Bar2. 1 "test"))))

  (valid! Bar3 (Bar3. 1 "test"))
  (invalid! Bar3 (assoc (Bar3. 1 "test") :foo :bar))
  (is (= 3 (do-something (Bar3. 1 "test"))))

  (valid! Bar4 (Bar4. [1] {"test" "test"}))
  (valid! Bar4 (Bar4. [1] nil))
  (invalid! Bar4 (Bar4. ["a"] {"test" "test"}))
  (is (= 4 (do-something (Bar4. 1 "test")))))

(sm/defrecord BarNewStyle
    [foo :- s/Int
     bar :- s/Str
     zoo]
  {(s/optional-key :baz) s/Keyword})

(deftest defrecord-new-style-schema-test
  (is (= (utils/class-schema BarNewStyle)
         (s/record BarNewStyle {:foo s/Int
                                :bar s/Str
                                :zoo s/Any
                                (s/optional-key :baz) s/Keyword})))
  (is (identity (BarNewStyle. 1 :foo "a")))
  (is (= #{:foo :bar :zoo} (set (keys (map->BarNewStyle {:foo 1})))))
  ;; (is (thrown? Exception (map->BarNewStyle {}))) ;; check for primitive long
  (valid! BarNewStyle (BarNewStyle. 1 "test" "a"))
  (invalid! BarNewStyle (BarNewStyle. 1 :foo "a"))
  (valid! BarNewStyle (assoc (BarNewStyle. 1 "test" "a") :baz :foo))
  (invalid! BarNewStyle (assoc (BarNewStyle. 1 "test" "a") :baaaz :foo))
  (invalid! BarNewStyle (assoc (BarNewStyle. 1 "test" "a") :baz "foo")))


;; Now test that schemata and protocols work as type hints.
;; (auto-detecting protocols only works in clj currently)

(def LongOrString (s/either s/Int s/Str))

#+clj (sm/defrecord Nested [^Bar4 b ^LongOrString c ^PProtocol p])
#+clj (sm/defrecord NestedNew [b :- Bar4 c :- LongOrString p :- PProtocol])
(sm/defrecord NestedExplicit [b :- Bar4 c :- LongOrString p :- (sm/protocol PProtocol)])

(defn test-fancier-defrecord-schema [klass constructor]
  (let [bar1 (Bar. 1 "a")
        bar2 (Bar2. 1 "a")]
    (is (= (utils/class-schema klass)
           (s/record klass {:b Bar4
                            :c LongOrString
                            :p (sm/protocol PProtocol)})))
    (valid! klass (constructor (Bar4. [1] {}) 1 bar2))
    (valid! klass (constructor (Bar4. [1] {}) "hi" bar2))
    (invalid! klass (constructor (Bar4. [1] {}) "hi" bar1))
    (invalid! klass (constructor (Bar4. [1] {:foo :bar}) 1 bar2))
    (invalid! klass (constructor nil "hi" bar2))))

#+clj
(deftest implicit-protocol-fancier-defrecord-schema-test
  (test-fancier-defrecord-schema Nested ->Nested)
  (test-fancier-defrecord-schema NestedNew ->NestedNew))

(deftest explicit-protocol-fancier-defrecord-schema-test
  (test-fancier-defrecord-schema NestedExplicit ->NestedExplicit))


(sm/defrecord OddSum
    [a b]
  {}
  #(odd? (+ (:a %) (:b %))))

(deftest defrecord-extra-validation-test
  (valid! OddSum (OddSum. 1 2))
  (invalid! OddSum (OddSum. 1 3)))

#+clj
(do (sm/defrecord RecordWithPrimitive [x :- long])
    (deftest record-with-primitive-test
      (valid! RecordWithPrimitive (RecordWithPrimitive. 1))
      (is (thrown? Exception (RecordWithPrimitive. "a")))
      (is (thrown? Exception (RecordWithPrimitive. nil)))))

(deftest map->record-test
  (let [subset {:foo 1 :bar "a"}
        exact (assoc subset :zoo :zoo)
        superset (assoc exact :baz :baz)]
    (testing "map->record"
      (is (= (assoc subset :zoo nil)
             (into {} (map->BarNewStyle subset))))
      (is (= exact
             (into {} (map->BarNewStyle exact))))
      (is (= superset
             (into {} (map->BarNewStyle superset)))))

    (testing "strict-map->record"
      (is (thrown? Exception (strict-map->BarNewStyle subset)))
      (is (= exact (into {} (strict-map->BarNewStyle exact))))
      (is (= exact (into {} (strict-map->BarNewStyle exact true))))
      (is (thrown? Exception (strict-map->BarNewStyle superset)))
      (is (= exact (into {} (strict-map->BarNewStyle superset true)))))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized functions

#+clj
(deftest split-rest-arg-test
  (is (= (schema.macros/split-rest-arg {} ['a '& 'b])
         '[[a] b]))
  (is (= (schema.macros/split-rest-arg {} ['a 'b])
         '[[a b] nil])))

;;; fn

(def OddLong (s/both (s/pred odd?) #+cljs s/Int #+clj long))

(def +test-fn-schema+
  "Schema for (s/fn ^String [^OddLong x y])"
  (sm/=> s/Str OddLong s/Any))

(deftest simple-validated-meta-test
  (let [f (sm/fn ^s/Str foo [^OddLong arg0 arg1])]
    (is (= +test-fn-schema+ (s/fn-schema f)))))

(deftest no-schema-fn-test
  (let [f (sm/fn [arg0 arg1] (+ arg0 arg1))]
    (is (= (sm/=> s/Any s/Any s/Any) (s/fn-schema f)))
    (sm/with-fn-validation
      (is (= 4 (f 1 3))))
    (is (= 4 (f 1 3)))))

(deftest simple-validated-fn-test
  (let [f (sm/fn test-fn :- (s/pred even?)
            [^s/Int x ^{:s {:foo (s/both s/Int (s/pred odd?))}} y]
            (+ x (:foo y -100)))]
    (sm/with-fn-validation
      (is (= 4 (f 1 {:foo 3})))
      ;; Primitive Interface Test
      #+clj (is (thrown? Exception (.invokePrim f 1 {:foo 3}))) ;; primitive type hints don't work on fns
      (invalid-call! f 1 {:foo 4}) ;; foo not odd?
      (invalid-call! f 2 {:foo 3}))  ;; return not even?

    (is (= 5 (f 1 {:foo 4}))) ;; foo not odd?
    (is (= 4.0 (f 1.0 {:foo 3}))) ;; first arg not long
    (is (= 5 (f 2 {:foo 3})))  ;; return not even?
    ))

(deftest always-validated-fn-test
  (let [f (sm/fn ^:always-validate test-fn :- (s/pred even?)
            [x :- (s/pred pos?)]
            (inc x))]
    (is (= 2 (f 1)))
    (invalid-call! f 2)
    (invalid-call! f -1)))

(deftest never-validated-fn-test
  (let [f (sm/fn ^:never-validate test-fn :- (s/pred even?)
            [x :- (s/pred pos?)]
            (inc x))]
    (sm/with-fn-validation
      (is (= 2 (f 1)))
      (is (= 3 (f 2)))
      (is (= 0 (f -1))))))

(defn parse-long [x]
  #+clj (Long/parseLong x)
  #+cljs (js/parseInt x))

(deftest destructured-validated-fn-test
  (let [LongPair [(s/one s/Int 'x) (s/one s/Int 'y)]
        f (sm/fn foo :- s/Int
            [^LongPair [x y] ^s/Int arg1]
            (+ x y arg1))]
    (is (= (sm/=> s/Int LongPair s/Int)
           (s/fn-schema f)))
    (sm/with-fn-validation
      (is (= 6 (f [1 2] 3)))
      (invalid-call! f ["a" 2] 3))))

(deftest two-arity-fn-test
  (let [f (sm/fn foo :- s/Int
            ([^s/Str arg0 ^s/Int arg1] (+ arg1 (foo arg0)))
            ([^s/Str arg0] (parse-long arg0)))]
    (is (= (sm/=>* s/Int [s/Str] [s/Str s/Int])
           (s/fn-schema f)))
    (is (= 3 (f "3")))
    (is (= 10 (f "3" 7)))))

(deftest infinite-arity-fn-test
  (let [f (sm/fn foo :- s/Int
            ([^s/Int arg0] (inc arg0))
            ([^s/Int arg0  & ^{:s [s/Str]} strs]
               (reduce + (foo arg0) (map count strs))))]
    (is (= (sm/=>* s/Int [s/Int] [s/Int & [s/Str]])
           (s/fn-schema f)))
    (sm/with-fn-validation
      (is (= 5 (f 4)))
      (is (= 16 (f 4 "55555" "666666")))
      (invalid-call! f 4 [3 3 3]))))

(deftest rest-arg-destructuring-test
  (testing "no schema"
    (let [f (sm/fn foo :- s/Int
              [^s/Int arg0 & [rest0]] (+ arg0 (or rest0 2)))]
      (is (= (sm/=>* s/Int [s/Int & [(s/optional s/Any 'rest0)]])
             (s/fn-schema f)))
      (sm/with-fn-validation
        (is (= 6 (f 4)))
        (is (= 9 (f 4 5)))
        (invalid-call! f 4 9 2))))
  (testing "arg schema"
    (let [f (sm/fn foo :- s/Int
              [^s/Int arg0 & [rest0 :- s/Int]] (+ arg0 (or rest0 2)))]
      (is (= (sm/=>* s/Int [s/Int & [(s/optional s/Int 'rest0)]])
             (s/fn-schema f)))
      (sm/with-fn-validation
        (is (= 6 (f 4)))
        (is (= 9 (f 4 5)))
        (invalid-call! f 4 9 2)
        (invalid-call! f 4 1.5))))
  (testing "list schema"
    (let [f (sm/fn foo :- s/Int
              [^s/Int arg0 & [rest0] :- [s/Int]] (+ arg0 (or rest0 2)))]
      (is (= (sm/=>* s/Int [s/Int & [s/Int]])
             (s/fn-schema f)))
      (sm/with-fn-validation
        (is (= 6 (f 4)))
        (is (= 9 (f 4 5)))
        (is (= 9 (f 4 5 9)))
        (invalid-call! f 4 1.5)))))

(deftest fn-recursion-test
  (testing "non-tail recursion"
    (let [f (sm/fn fib :- s/Int [n :- s/Int]
              (if (<= n 2) 1 (+ (fib (- n 1)) (fib (- n 2)))))]
      (is (= 8 (f 6)))
      (sm/with-fn-validation
        (is (= 8 (f 6))))))
  (testing "tail recursion"
    (let [f (sm/fn fact :- s/Int [n :- s/Int ret :- s/Int]
              (if (<= n 1) ret (recur (dec n) (* ret n))))]
      (is (= 120 (f 5 1)))
      (sm/with-fn-validation
        (is (= 120 (f 5 1)))))))

;;; defn

(def OddLongString
  (s/both s/Str (s/pred #(odd? (parse-long %)) 'odd-str?)))

(sm/defn ^{:s OddLongString :tag String} simple-validated-defn
  "I am a simple schema fn"
  {:metadata :bla}
  [^OddLong arg0]
  (str arg0))

(sm/defn ^{:tag String} simple-validated-defn-new :- OddLongString
  "I am a simple schema fn"
  {:metadata :bla}
  [arg0 :- OddLong]
  (str arg0))

(sm/defn validated-pre-post-defn :- OddLong
  "I have pre/post conditions"
  [arg0 :- s/Num]
  {:pre  [(odd? arg0) (> 10 arg0)]
   :post [(odd? %)    (<  5 %)]}
  arg0)

(def +simple-validated-defn-schema+
  (sm/=> OddLongString OddLong))

(def ^String +bad-input-str+ "Input to simple-validated-defn does not match schema")

#+cljs
(deftest simple-validated-defn-test
  (doseq [f [simple-validated-defn simple-validated-defn-new]]
    (sm/with-fn-validation
      (is (= "3" (f 3)))
      (invalid-call! f 4)
      (invalid-call! f "a")))
  (sm/with-fn-validation
    (is (= 7 (validated-pre-post-defn 7)))
    (is (thrown? AssertionError (validated-pre-post-defn 0)))
    (is (thrown? AssertionError (validated-pre-post-defn 11)))
    (is (thrown? AssertionError (validated-pre-post-defn 1)))
    (invalid-call! validated-pre-post-defn "a"))
  (let [e (try (sm/with-fn-validation (simple-validated-defn 2)) nil
               (catch js/Error e e))]
    (is (>= (.indexOf (str e) +bad-input-str+) 0)))
  (is (= +simple-validated-defn-schema+ (s/fn-schema simple-validated-defn))))

#+clj
(sm/defn ^String multi-arglist-validated-defn :- OddLongString
  "I am a multi-arglist schema fn"
  {:metadata :bla}
  ([arg0 :- OddLong]
     (str arg0))
  ([arg0 :- OddLong arg1 :- Long]
     (str (+ arg0 arg1))))

#+clj
(deftest simple-validated-defn-test
  (is (= "Inputs: [arg0]\n\n  I am a simple schema fn"
         (:doc (meta #'simple-validated-defn))))
  (is (= '([arg0]) (:arglists (meta #'simple-validated-defn))))
  (is (= "Inputs: [arg0 :- OddLong]\n  Returns: OddLongString\n\n  I am a simple schema fn"
         (:doc (meta #'simple-validated-defn-new))))
  (is (= '([arg0]) (:arglists (meta #'simple-validated-defn-new))))
  (is (= "Inputs: ([arg0 :- OddLong] [arg0 :- OddLong arg1 :- Long])\n  Returns: OddLongString\n\n  I am a multi-arglist schema fn"
         (:doc (meta #'multi-arglist-validated-defn))))
  (is (= '([arg0] [arg0 arg1]) (:arglists (meta #'multi-arglist-validated-defn))))
  (sm/with-fn-validation
    (testing "pre/post"
      (is (= 7 (validated-pre-post-defn 7)))
      (is (thrown-with-msg? AssertionError #"Assert failed: \(odd\? arg0\)"
                            (validated-pre-post-defn 0)))
      (is (thrown-with-msg? AssertionError #"Assert failed: \(> 10 arg0\)"
                            (validated-pre-post-defn 11)))
      (is (thrown-with-msg? AssertionError #"Assert failed: \(< 5 %\)"
                            (validated-pre-post-defn 1)))
      (invalid-call! validated-pre-post-defn "a")))
  (doseq [[label v] {"old" #'simple-validated-defn "new" #'simple-validated-defn-new}]
    (testing label
      (let [{:keys [tag schema metadata]} (meta v)]
        #+clj (is (= tag s/Str))
        (is (= +simple-validated-defn-schema+ schema))
        (is (= metadata :bla)))
      (is (= +simple-validated-defn-schema+ (s/fn-schema @v)))

      (sm/with-fn-validation
        (is (= "3" (@v 3)))
        (invalid-call! @v 4)
        (invalid-call! @v "a"))

      (is (= "4" (@v 4)))))
  (let [e ^Exception (try (s/with-fn-validation (simple-validated-defn 2)) nil (catch Exception e e))]
    (is (.contains (.getMessage e) +bad-input-str+))
    (is (.contains (.getClassName ^StackTraceElement (first (.getStackTrace e))) "simple_validated_defn"))
    (is (.startsWith (.getFileName ^StackTraceElement (first (.getStackTrace e))) "core_test.clj"))))

(sm/defn ^:always-validate always-validated-defn :- (s/pred even?)
  [x :- (s/pred pos?)]
  (inc x))

(deftest always-validated-defn-test
  (is (= 2 (always-validated-defn 1)))
  (invalid-call! always-validated-defn 2)
  (invalid-call! always-validated-defn -1))

(sm/defn fib :- s/Int [n :- s/Int]
  (if (<= n 2) 1 (+ (fib (- n 1)) (fib (- n 2)))))

(sm/defn fact :- s/Int [n :- s/Int ret :- s/Int]
  (if (<= n 1) ret (recur (dec n) (* ret n))))


(deftest defn-recursion-test
  (testing "non-tail recursion"
    (is (= 8 (fib 6)))
    (sm/with-fn-validation
      (is (= 8 (fib 6)))))
  (testing "tail recursion"
    (is (= 120 (fact 5 1)))
    (sm/with-fn-validation
      (is (= 120 (fact 5 1))))))

;; letfn

(deftest minimal-letfn-test
  (is (= "1"
         (sm/letfn
             []
           "1"))))

(deftest simple-letfn-test
  (is (= "1"
         (sm/with-fn-validation
           (sm/letfn
               [(x :- s/Num [] 1)
                (y :- s/Str [m :- s/Num] (str m))]
             (y (x)))))))

(deftest unannotated-letfn-test
  (is (= "1"
         (sm/with-fn-validation
           (sm/letfn
               [(x [] 1)
                (y [m] (str m))]
             (y (x)))))))

(deftest no-validation-letfn-test
  (is (= "1"
         (sm/letfn
             [(x :- s/Num [] 1)
              (y :- s/Str [m :- s/Num] (str m))]
           (y (x))))))

(deftest error-letfn-test
  (is (thrown? #+clj RuntimeException #+cljs js/Error
               (sm/with-fn-validation
                 (sm/letfn
                     [(x :- s/Num [] "1")
                      (y :- s/Str [m :- s/Num] (str m))]
                   (y (x)))))))

;; Primitive validation testing for JVM
#+clj
(do

  (def +primitive-validated-defn-schema+
    (sm/=> long OddLong))

  (sm/defn ^long primitive-validated-defn
    [^long ^{:s OddLong} arg0]
    (inc arg0))

  (sm/defn primitive-validated-defn-new :- long
    [^long arg0 :- OddLong]
    (inc arg0))


  (deftest simple-primitive-validated-defn-test
    (doseq [[label f] {"old" primitive-validated-defn "new" primitive-validated-defn-new}]
      (testing label
        (is (= +primitive-validated-defn-schema+ (s/fn-schema f)))

        (is ((ancestors (class f)) clojure.lang.IFn$LL))
        (sm/with-fn-validation
          (is (= 4 (f 3)))
          (is (= 4 (.invokePrim f 3)))
          (is (thrown? Exception (f 4))))

        (is (= 5 (f 4))))))

  (sm/defn another-primitive-fn :- double
    [^long arg0]
    1.0)

  (deftest another-primitive-fn-test
    (is ((ancestors (class another-primitive-fn)) clojure.lang.IFn$LD))
    (is (= 1.0 (another-primitive-fn 10)))))


(deftest with-fn-validation-error-test
  (is (thrown? #+clj RuntimeException #+cljs js/Error
               (sm/with-fn-validation (throw #+clj (RuntimeException.) #+cljs (js/Error. "error")))))
  (is (false? (.get_cell utils/use-fn-validation))))


;; def

(deftest def-test ;; heh
  (sm/def v 1)
  (is (= 1 v))
  (sm/def v "doc" 2)
  (is (= 2 v))
  #+clj (is (= "doc" (:doc (meta #'v))))
  (sm/def v :- s/Int "doc" 3)
  (is (= 3 v))
  #+clj (is (= "doc" (:doc (meta #'v))))
  (sm/def v :- s/Int 3)
  #+clj (is (= String (:tag (meta (s/def v :- String "a")))))
  #+clj (is (thrown? Exception (sm/def v :- s/Int "doc" 1.0)))
  #+clj (is (thrown? Exception (sm/def v :- s/Int 1.0)))
  #+clj (is (thrown? Exception (sm/def ^s/Int v 1.0))))


;; defmethod

(defmulti m #(:k (first %&)))

(deftest defmethod-unannotated-test
  (sm/defmethod m :v [m x y] (+ x y))
  (is (= 3 (m {:k :v} 1 2))))

(deftest defmethod-input-annotated
  (sm/defmethod m :v [m :- {:k s/Keyword} x :- s/Num y :- s/Num] (+ x y))
  (is (= 3
         (sm/with-fn-validation (m {:k :v} 1 2)))))

(deftest defmethod-output-annotated
  (sm/defmethod m :v :- s/Num [m x y] (+ x y))
  (is (= 3
         (sm/with-fn-validation (m {:k :v} 1 2)))))

(deftest defmethod-all-annotated
  (sm/defmethod m :v :- s/Num [m :- {:k s/Keyword} x :- s/Num y :- s/Num] (+ x y))
  (is (= 3
         (sm/with-fn-validation (m {:k :v} 1 2)))))

(deftest defmethod-input-error-test
  (sm/defmethod m :v :- s/Num [m :- {:k s/Keyword} x :- s/Num y :- s/Num] (+ x y))
  (is (thrown? #+clj RuntimeException #+cljs js/Error
               (sm/with-fn-validation
                 (sm/with-fn-validation (m {:k :v} 1 "2"))))))

(deftest defmethod-output-error-test
  (sm/defmethod m :v :- s/Num [m :- {:k s/Keyword} x :- s/Num y :- s/Num] "wrong")
  (is (thrown? #+clj RuntimeException #+cljs js/Error
               (sm/with-fn-validation
                 (sm/with-fn-validation (m {:k :v} 1 2))))))

(deftest defmethod-metadata-test
  (sm/defmethod ^:always-validate m :v :- s/Num [m :- {:k s/Keyword} x :- s/Num y :- s/Num] "wrong")
  (is (thrown? #+clj RuntimeException #+cljs js/Error
              (m {:k :v} 1 2))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Composite Schemas (test a few combinations of above)


(deftest nice-error-test
  (let [schema {:a #{[s/Int]}
                :b [(s/one s/Keyword :k) s/Int]
                :c s/Any}]
    (valid! schema {:a #{[1 2 3 4] [] [1 2]}
                    :b [:k 1 2 3]
                    :c :whatever})
    (invalid! schema {:a #{[1 2 3 4] [] [1 2] [:a :b]}
                      :b [1 :a]}
              "{:c missing-required-key, :b [(named (not (keyword? 1)) :k) (not (integer? :a))], :a #{[(not (integer? :a)) (not (integer? :b))]}}")))

(sm/defrecord Explainer
    [^s/Int foo ^s/Keyword bar]
  {(s/optional-key :baz) s/Keyword})

#+clj ;; clojurescript.test hangs on this test in phantom.js, so marking clj-only
(deftest fancy-explain-test
  (is (= (s/explain {(s/required-key 'x) s/Int
                     s/Keyword [(s/one s/Int "foo") (s/maybe Explainer)]})
         `{~'(required-key x) ~'Int
           ~'Keyword [(~'one ~'Int "foo")
                      (~'maybe
                       (~'record
                        #+clj Explainer #+cljs schema.core-test/Explainer
                        {:foo ~'Int
                         :bar ~'Keyword
                         (~'optional-key :baz) ~'Keyword}))]})))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;;  Helpers for defining schemas (used in in-progress work, expanlation coming soon)

(sm/defschema TestFoo {:bar s/Str})

(deftest test-defschema
  (is (= 'TestFoo (:name (meta TestFoo)))))

(deftest schema-with-name-test
  (let [schema (s/schema-with-name {:baz s/Num} 'Baz)]
    (valid! schema {:baz 123})
    (invalid! schema {:baz "abc"})
    (is (= 'Baz (s/schema-name schema)))))

(deftest schema-name-test
  (is (= 'TestFoo (s/schema-name TestFoo))))
