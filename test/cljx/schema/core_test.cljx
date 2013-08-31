(ns schema.core-test
  #+clj
  (:use clojure.test [schema.test-macros :only [valid! invalid! invalid-call!]])
  #+cljs
  (:use-macros
   [cljs-test.macros :only [is is= deftest]]
   [schema.test-macros :only [testing valid! invalid! invalid-call! thrown?]])
  #+cljs
  (:require-macros
   [schema.macros :as sm])
  (:require
   clojure.data
   [schema.utils :as utils]
   [schema.core :as s]
   #+clj potemkin
   #+clj [schema.macros :as sm]
   #+cljs cljs-test.core))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Helpers

;;; Eq Tests

(deftest eq-test
  (let [schema (s/eq 10)]
    (valid! schema 10)
    (invalid! schema 9)))

;;; Enum Tests

(deftest enum-test
  (let [schema (s/enum :a :b 1)]
    (valid! schema :a)
    (valid! schema 1)
    (invalid! schema :c)
    (invalid! schema 2)))

;;; leaves

(deftest map-test
  (let [Str->Num {s/String s/Number}]
    (valid! Str->Num {"a" 1 "b" 2})
    (valid! Str->Num {"a" 1 "b" 2.0})
    (invalid! Str->Num {:a 1 "b" 2})
    (invalid! Str->Num {"a" "1"})))

(deftest pred-test
  (valid! (s/pred odd?) 1)
  (invalid! (s/pred odd?) 2)
  (valid! (s/pred string?) "foo")
  (valid! (s/pred (constantly true)) nil)
  (invalid! (s/pred odd?) :foo))

#+clj
(do
  (deftest primitive-test
    (valid! float (float 1.0))
    (invalid! float 1.0)
    (valid! double 1.0)
    (invalid! double (float 1.0))
    (valid! boolean true)
    (invalid! boolean 1)
    (doseq [f [byte char short int]]
      (valid! f (f 1))
      (invalid! f 1))
    (valid! long 1)
    (invalid! long (byte 1)))

  (deftest array-test
    (valid! (Class/forName"[Ljava.lang.String;") (into-array String ["a"]))
    (invalid! (Class/forName "[Ljava.lang.Long;") (into-array String ["a"]))
    (valid! (Class/forName "[Ljava.lang.Double;") (into-array Double [1.0]))
    (valid! (Class/forName "[D") (double-array [1.0]))))

(deftest class-test
  (valid! s/String "foo")
  (invalid! s/String :foo)
  (valid! s/Int 4)
  (invalid! s/Int nil)
  (invalid! s/Int 1.5)
  (valid! s/Keyword :foo)
  (invalid! s/Keyword 'foo))

(defprotocol ATestProtocol)
(def +protocol-schema+ ATestProtocol) ;; make sure we don't fuck it up by capturing the earlier value.
(defrecord DirectTestProtocolSatisfier [] ATestProtocol)
(defrecord IndirectTestProtocolSatisfier []) (extend-type IndirectTestProtocolSatisfier ATestProtocol)
(defrecord NonTestProtocolSatisfier [])

(deftest protocol-test
  (let [s (sm/protocol ATestProtocol)]
    (valid! s (DirectTestProtocolSatisfier.))
    (valid! s (IndirectTestProtocolSatisfier.))
    (invalid! s (NonTestProtocolSatisfier.))
    (invalid! s nil)
    (invalid! s 117)))

;; ;;; helpers/wrappers

(deftest anything-test
  (valid! s/Any 1)
  (valid! s/Any nil)
  (valid! s/Any #{:hi :there}))

(deftest either-test
  (let [schema (s/either
                {:num s/Int}
                {:str s/String})]
    (valid! schema {:num 1})
    (valid! schema {:str "hello"})
    (invalid! schema {:num "bad!"})
    (invalid! schema {:str 1})))

(deftest both-test
  (let [schema (s/both
                (s/pred (fn equal-keys? [m] (every? (fn [[k v]] (= k v)) m)))
                {s/Keyword s/Keyword})]
    (valid! schema {})
    (valid! schema {:foo :foo :bar :bar})
    (invalid! schema {"foo" "foo"})
    (invalid! schema {:foo :bar})))

(deftest maybe-test
  (let [schema (s/maybe s/Int)]
    (is (= schema (s/? s/Int)))
    (valid! schema nil)
    (valid! schema 1)
    (invalid! schema 1.1)
    ;; JVM cares about number type
    #+clj (invalid! schema 1.0)))

(deftest named-test
  (let [schema [(s/one s/String "topic") (s/one (s/named s/Number "score") "asdf")]]
    (valid! schema ["foo" 1.0])
    (invalid! schema [1 2])))

(deftest conditional-test
  (let [schema (s/conditional #(= (:type %) :foo) {:type (s/eq :foo) :baz s/Number}
                              #(= (:type %) :bar) {:type (s/eq :bar) :baz s/String})]
    (valid! schema {:type :foo :baz 10})
    (valid! schema {:type :bar :baz "10"})
    (invalid! schema {:type :foo :baz "10"})
    (invalid! schema {:type :bar :baz 10})
    (invalid! schema {:type :zzz :baz 10})))



;; ;;; maps

(deftest simple-map-schema-test
  (let [schema {:foo s/Int
                :bar s/Number}]
    (valid! schema {:foo 1 :bar 2.0})
    (invalid! schema [[:foo 1] [:bar 2.0]])
    (invalid! schema {:foo 1 :bar 2.0 :baz 1})
    (invalid! schema {:foo 1})
    (invalid! schema {:foo 1.1 :bar 1.0})))

(deftest fancier-map-schema-test
  (let [schema {:foo s/Int
                s/String s/Number}]
    (valid! schema {:foo 1})
    (valid! schema {:foo 1 "bar" 2.0})
    (valid! schema {:foo 1 "bar" 2.0 "baz" 10.0})
    (invalid! schema {:foo 1 :bar 2.0})
    (invalid! schema {:foo 1 :bar 2.0 "baz" 2.0})
    (invalid! schema {:foo 1 "bar" "a"})))

(deftest another-fancy-map-schema-test
  (let [schema {:foo (s/maybe s/Int)
                (s/optional-key :bar) s/Number
                :baz {:b1 (s/pred odd?)}}]
    (valid! schema {:foo 1 :bar 1.0 :baz {:b1 3}})
    (valid! schema {:foo 1 :baz {:b1 3}})
    (valid! schema {:foo nil :baz {:b1 3}})
    (invalid! schema {:foo 1 :bar 1.0 :baz [[:b1 3]]})
    (invalid! schema {:foo 1 :bar 1.0 :baz {:b2 3}})
    (invalid! schema {:foo 1 :bar 1.0 :baz {:b1 4}})
    (invalid! schema {:bar 1.0 :baz {:b1 3}})
    (invalid! schema {:foo 1 :bar nil :baz {:b1 3}})))

;;; sequences

(deftest simple-repeated-seq-test
  (let [schema [s/Int]]
    (valid! schema [])
    (valid! schema [1 2 3])
    (invalid! schema {})
    #+clj (invalid! schema [1 2 1.0])
    (invalid! schema [1 2 1.1])))

(deftest simple-one-seq-test
  (let [schema [(s/one s/Int "int") (s/one s/String "str")]]
    (valid! schema [1 "a"])
    (invalid! schema [1])
    (invalid! schema [1 1.0 2])
    (invalid! schema [1 1])
    (invalid! schema [1.0 1.0])))

(deftest optional-seq-test
  (let [schema [(s/one s/Int "int")
                (s/optional s/String "str")
                (s/optional s/Int "int2")]]
    (valid! schema [1])
    (valid! schema [1 "a"])
    (valid! schema [1 "a" 2])
    (invalid! schema [])
    (invalid! schema [1 "a" 2 3])
    (invalid! schema [1 1])))

(deftest combo-seq-test
  (let [schema [(s/one (s/maybe s/Int) "maybe-long")
                (s/optional s/String "str")
                s/Number]]
    (valid! schema [1])
    (valid! schema [1 "a"])
    (valid! schema [1 "a" 1.0 2.0 3.0])
    (valid! schema [nil "b" 1.0 2.0 3.0])
    (invalid! schema [nil 1 1.0 2.0 3.0])
    #+clj (invalid! schema [1.0 "A" 2.0 3.0])
    (invalid! schema [1.1 "A" 2.01 3.9])
    (invalid! schema [])))

;; TODO: most of the invalid! cases above should be replaced with
;; explicit checks on the error returned by check?
#+clj
(deftest nice-error-test
  (is (= (str (s/check
               {:a long
                :b [(s/one double "d") long]}
               {:a "test"
                :b [1 2 2]
                :c "foo"}))
         (str (array-map
               :a '(not (instance? java.lang.Long "test"))
               :b '[(not (instance? java.lang.Double 1)) nil nil]
               :c 'disallowed-key)))))

;;; sets

(deftest simple-set-test
  (testing "basic set identification"
    (let [schema #{s/Keyword}]
      (valid! schema #{:a :b :c})
      (invalid! schema [:a :b :c])
      (invalid! schema {:a :a :b :b})))

  (testing "enforces matching with single simple entry"
    (let [schema #{s/Int}]
      (valid! schema #{})
      (valid! schema #{1 2 3})
      (invalid! schema #{1 0.5 :a})
      (invalid! schema #{3 4 "a"})))

  (testing "set schemas must have exactly one entry"
    (is (thrown? Exception (s/check #{s/Int s/Number} #{}))))

  (testing "more complex element schema"
    (let [schema #{[s/Int]}]
      (valid! schema #{})
      (valid! schema #{[2 4]})
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


;;; records

(defrecord Foo [x ^{:s s/Int} y])

(deftest record-test
  (let [schema (s/record Foo {:x s/Any (s/optional-key :y) s/Int})]
    (valid! schema (Foo. :foo 1))
    (invalid! schema {:x :foo :y 1})
    (invalid! schema (assoc (Foo. :foo 1) :bar 2))))

(deftest record-with-extra-keys-test
  (let [schema (s/record Foo {:x s/Any
                              :y s/Int
                              s/Keyword s/Any})]
    (valid! schema (Foo. :foo 1))
    (valid! schema (assoc (Foo. :foo 1) :bar 2))
    (invalid! schema {:x :foo :y 1})))

;;; Explains

(sm/defrecord Explainer
    [^s/Int foo ^s/Keyword bar]
  {(s/optional-key :baz) s/Keyword})

(deftest explain-test
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


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
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
    [^s/Int foo ^s/String bar]
  {(s/optional-key :baz) s/Keyword})

(sm/defrecord Bar2
    [^s/Int foo ^s/String bar]
  {(s/optional-key :baz) s/Keyword}
  PProtocol
  (do-something [this] 2))

(sm/defrecord Bar3
    [^s/Int foo ^s/String bar]
  PProtocol
  (do-something [this] 3))

(sm/defrecord Bar4
    [^{:s [s/Int]} foo ^{:s? {s/String s/String}} bar]
  PProtocol
  (do-something [this] 4))

(deftest defrecord-schema-test
  (is (= (utils/class-schema Bar)
         (s/record Bar {:foo s/Int
                        :bar s/String
                        (s/optional-key :baz) s/Keyword})))
  (is (Bar. 1 :foo))
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
     bar :- s/String
     zoo]
  {(s/optional-key :baz) s/Keyword})

(deftest defrecord-new-style-schema-test
  (is (= (utils/class-schema BarNewStyle)
         (s/record BarNewStyle {:foo s/Int
                                :bar s/String
                                :zoo s/Any
                                (s/optional-key :baz) s/Keyword})))
  (is (BarNewStyle. 1 :foo "a"))
  (is (= #{:foo :bar :zoo} (set (keys (map->BarNewStyle {:foo 1})))))
  ;; (is (thrown? Exception (map->BarNewStyle {}))) ;; check for primitive long
  (valid! BarNewStyle (BarNewStyle. 1 "test" "a"))
  (invalid! BarNewStyle (BarNewStyle. 1 :foo "a"))
  (valid! BarNewStyle (assoc (BarNewStyle. 1 "test" "a") :baz :foo))
  (invalid! BarNewStyle (assoc (BarNewStyle. 1 "test" "a") :baaaz :foo))
  (invalid! BarNewStyle (assoc (BarNewStyle. 1 "test" "a") :baz "foo")))


;; Now test that schemata and protocols work as type hints.
;; (auto-detecting protocols only works in clj currently)

(def LongOrString (s/either s/Int s/String))

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


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized functions

;; helpers
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
  (sm/=> s/String OddLong s/Any))

(deftest simple-validated-meta-test
  (let [f (sm/fn ^s/String foo [^OddLong arg0 arg1])]
    (def s2 (s/fn-schema f))
    (is (= +test-fn-schema+ (s/fn-schema f)))))

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

(defn parse-long [x]
  #+clj (Long/parseLong x)
  #+cljs (js/parseInt x))

(deftest destructured-validated-fn-test
  (let [LongPair [(s/one s/Int "x") (s/one s/Int "y")]
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
            ([^s/String arg0 ^s/Int arg1] (+ arg1 (foo arg0)))
            ([^s/String arg0] (parse-long arg0)))]
    (is (= (sm/=>* s/Int [s/String] [s/String s/Int])
           (s/fn-schema f)))
    (is (= 3 (f "3")))
    (is (= 10 (f "3" 7)))))

(deftest infinite-arity-fn-test
  (let [f (sm/fn foo :- s/Int
            ([^s/Int arg0] (inc arg0))
            ([^s/Int arg0  & ^{:s [s/String]} strs]
               (reduce + (foo arg0) (map count strs))))]
    (is (= (sm/=>* s/Int [s/Int] [s/Int & [s/String]])
           (s/fn-schema f)))
    (sm/with-fn-validation
      (is (= 5 (f 4)))
      (is (= 16 (f 4 "55555" "666666")))
      (invalid-call! f 4 [3 3 3]))))

(deftest rest-arg-destructuring-test
  (testing "no schema"
    (let [f (sm/fn foo :- s/Int
              [^s/Int arg0 & [rest0]] (+ arg0 (or rest0 2)))]
      (is (= (sm/=>* s/Int [s/Int & [(s/optional s/Any "rest0")]])
             (s/fn-schema f)))
      (sm/with-fn-validation
        (is (= 6 (f 4)))
        (is (= 9 (f 4 5)))
        (invalid-call! f 4 9 2))))
  (testing "arg schema"
    (let [f (sm/fn foo :- s/Int
              [^s/Int arg0 & [rest0 :- s/Int]] (+ arg0 (or rest0 2)))]
      (is (= (sm/=>* s/Int [s/Int & [(s/optional s/Int "rest0")]])
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

;;; defn

(def OddLongString
  (s/both s/String (s/pred #(odd? (parse-long %)))))

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

(def +simple-validated-defn-schema+
  (sm/=> OddLongString OddLong))

#+cljs
(deftest simple-validated-defn-test
  (doseq [f [simple-validated-defn simple-validated-defn-new]]
    (sm/with-fn-validation
      (is (= "3" (f 3)))
      (invalid-call! f 4)
      (invalid-call! f "a"))))

#+clj
(deftest simple-validated-defn-test
  (doseq [[label v] {"old" #'simple-validated-defn "new" #'simple-validated-defn-new}]
    (testing label
      (let [{:keys [tag schema doc metadata]} (meta v)]
        #+clj (is (= tag s/String))
        (is (= +simple-validated-defn-schema+ schema))
        (is (= doc "I am a simple schema fn"))
        (is (= metadata :bla)))
      (is (= +simple-validated-defn-schema+ (s/fn-schema @v)))

      (sm/with-fn-validation
        (is (= "3" (@v 3)))
        (invalid-call! @v 4)
        (invalid-call! @v "a"))

      (is (= "4" (@v 4))))))

;; Primitive validation testing for JVM
#+clj
(do

  (def +primitive-validated-defn-schema+
    (sm/=> long OddLong))

  (sm/defn ^long primitive-validated-defn
    [^long ^{:s OddLong} arg0]
    (inc arg0))

  (sm/defn ^long primitive-validated-defn-new :- long
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

        (is (= 5 (f 4)))))))
