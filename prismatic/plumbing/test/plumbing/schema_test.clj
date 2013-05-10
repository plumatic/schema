(ns plumbing.schema-test
  (:use clojure.test)
  (:require [plumbing.schema :as s]))


(s/defrecord Explainer
    [^long foo ^String bar]
  {(s/optional-key :baz) clojure.lang.Keyword})

(deftest explain-test
  (is (= (s/explain {(s/required-key :x) long
                     String [(s/one int "foo") (s/maybe Explainer)]})
         '{(required-key :x) long
           java.lang.String [("foo" int)
                             &
                             (maybe
                              (plumbing.schema_test.Explainer
                               {(required-key :foo) long
                                (required-key :bar) java.lang.String
                                (optional-key :baz) clojure.lang.Keyword}))]})))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema validation

(defmacro valid! [s x] `(is (do (s/validate ~s ~x) true)))
(defmacro invalid! [s x] `(is (~'thrown? Exception (s/validate ~s ~x))))

;;; leaves

(deftest class-test
  (valid! String "foo")
  (invalid! String :foo))

(deftest fn-test
  (valid! odd? 1)
  (invalid! odd? 2)
  (invalid! odd? :foo))

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
  (valid! "[Ljava.lang.String;" (into-array String ["a"]))
  (invalid! "[Ljava.lang.Object;" (into-array String ["a"]))
  (valid! "[Ljava.lang.Double;" (into-array Double [1.0]))
  (valid! "[D" (double-array [1.0])))

(deftest enum-test
  (let [schema (s/enum :a :b 1)]
    (valid! schema :a)
    (valid! schema 1)
    (invalid! schema :c)
    (invalid! schema 2)))

(defprotocol ATestProtocol)
(def +protocol-schema+ ATestProtocol) ;; make sure we don't fuck it up by capturing the earlier value.
(defrecord DirectTestProtocolSatisfier [] ATestProtocol)
(defrecord IndirectTestProtocolSatisfier []) (extend-type IndirectTestProtocolSatisfier ATestProtocol)
(defrecord NonTestProtocolSatisfier [])

(deftest protocol-test
  (let [s (s/protocol ATestProtocol)]
    (valid! s (DirectTestProtocolSatisfier.))
    (valid! s (IndirectTestProtocolSatisfier.))
    (invalid! s (NonTestProtocolSatisfier.))
    (invalid! s nil)
    (invalid! s 117)))

;;; helpers/wrappers

(deftest anything-test
  (valid! s/Top 1)
  (valid! s/Top nil)
  (valid! s/Top #{:hi :there}))

(deftest either-test
  (let [schema (s/either
                {(s/required-key :l) long}
                {(s/required-key :d) double})]
    (valid! schema {:l 1})
    (valid! schema {:d 1.0})
    (invalid! schema {:l 1.0})
    (invalid! schema {:d 1})))

(deftest both-test
  (let [schema (s/both
                (fn equal-keys? [m] (doseq [[k v] m] (s/check (= k v) "Got non-equal key-value pair: %s %s" k v)) true)
                {clojure.lang.Keyword clojure.lang.Keyword})]
    (valid! schema {})
    (valid! schema {:foo :foo :bar :bar})
    (invalid! schema {"foo" "foo"})
    (invalid! schema {:foo :bar})))

(deftest maybe-test
  (let [schema (s/maybe long)]
    (is (= schema (s/? long)))
    (valid! schema nil)
    (valid! schema 1)
    (invalid! schema 1.0)))

(deftest named-test
  (let [schema [(s/one String "topic") (s/one (s/named double "score") "asdf")]]
    (valid! schema ["foo" 1.0])
    (invalid! schema [1 2])))

;;; maps

(deftest simple-map-schema-test
  (let [schema {(s/required-key :foo) long
                (s/required-key :bar) double}]
    (valid! schema {:foo 1 :bar 2.0})
    (invalid! schema [[:foo 1] [:bar 2.0]])
    (invalid! schema {:foo 1 :bar 2.0 :baz 1})
    (invalid! schema {:foo 1})
    (invalid! schema {:foo 1.0 :bar 1.0})))

(deftest fancier-map-schema-test
  (let [schema {(s/required-key :foo) long
                String double}]
    (valid! schema {:foo 1})
    (valid! schema {:foo 1 "bar" 2.0})
    (valid! schema {:foo 1 "bar" 2.0 "baz" 10.0})
    (invalid! schema {:foo 1 :bar 2.0})
    (invalid! schema {:foo 1 :bar 2.0 "baz" 2.0})
    (invalid! schema {:foo 1 "bar" 2})))

(deftest another-fancy-map-schema-test
  (let [schema {(s/required-key :foo) (s/maybe long)
                (s/optional-key :bar) double
                (s/required-key :baz) {(s/required-key :b1) odd?}}]
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
  (let [schema [long]]
    (valid! schema [])
    (valid! schema [1 2 3])
    (invalid! schema {})
    (invalid! schema [1 2 1.0])))

(deftest simple-one-seq-test
  (let [schema [(s/one long "long") (s/one double "double")]]
    (valid! schema [1 1.0])
    (invalid! schema [1])
    (invalid! schema [1 1.0 2])
    (invalid! schema [1 1])
    (invalid! schema [1.0 1.0])))

(deftest combo-seq-test
  (let [schema [(s/one (s/maybe long) "maybe-long") double]]
    (valid! schema [1])
    (valid! schema [1 1.0 2.0 3.0])
    (valid! schema [nil 1.0 2.0 3.0])
    (invalid! schema [1.0 2.0 3.0])
    (invalid! schema [])))

;;; records

(defrecord Foo [x ^long y])

(deftest record-test
  (let [schema (s/record Foo {(s/required-key :x) s/+anything+ (s/optional-key :y) long})]
    (valid! schema (Foo. :foo 1))
    (invalid! schema {:x :foo :y 1})
    (invalid! schema (assoc (Foo. :foo 1) :bar 2))))

(deftest record-with-extra-keys test
  (let [schema (s/record Foo {(s/required-key :x) s/+anything+
                              (s/required-key :y) long
                              clojure.lang.Keyword s/+anything+})]
    (valid! schema  (Foo. :foo 1))
    (valid! schema (assoc (Foo. :foo 1) :bar 2))
    (invalid! schema {:x :foo :y 1})))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized defrecord


(deftest fixup-tag-metadata-test
  (let [correct! (fn [symbol desired-meta]
                   (let [fix (@#'s/fixup-tag-metadata {} symbol)]
                     (is (= symbol fix))
                     (is (= desired-meta (or (meta fix) {})))))]
    (correct! 'foo {})
    (correct! (with-meta 'foo {:tag 'long}) {:tag 'long})
    (correct! (with-meta 'foo {:tag 'String}) {:tag 'String})
    (correct! (with-meta 'foo {:tag 'asdf}) {:schema 'asdf})))

(deftest extract-schema-form-test
  (let [correct! (fn [m out]
                   (is (= out (s/extract-schema-form (with-meta 'foo m)))))]
    (correct! {} s/+anything+)
    (correct! {:asdf :foo} s/+anything+)
    (correct! {:tag 'long} 'long)
    (correct! {:schema []} [])
    (correct! {:s []} [])
    (correct! {:s? []} `(s/maybe []))
    (correct! {:tag 'long :s? []} `(s/maybe []))
    (is (thrown? Exception (s/extract-schema-form (with-meta 'foo {:s [] :schema []}))))))



(defprotocol PProtocol
  (do-something [this]))

;; exercies some different arities
(s/defrecord Bar
    [^long foo ^String bar]
  {(s/optional-key :baz) clojure.lang.Keyword})

(s/defrecord Bar2
    [^long foo ^String bar]
  {(s/optional-key :baz) clojure.lang.Keyword}
  PProtocol
  (do-something [this] 2))

(s/defrecord Bar3
    [^long foo ^String bar]
  PProtocol
  (do-something [this] 3))

(s/defrecord Bar4
    [^{:s [long]} foo ^{:s? {String String}} bar]
  PProtocol
  (do-something [this] 4))

(deftest defrecord-schema-test
  (is (= (s/class-schema Bar)
         (s/record Bar {(s/required-key :foo) long
                        (s/required-key :bar) String
                        (s/optional-key :baz) clojure.lang.Keyword})))
  (is (Bar. 1 :foo))
  (is (= #{:foo :bar} (set (keys (map->Bar {:foo 1})))))
  (is (thrown? Exception (map->Bar {}))) ;; check for primitive long
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


;; Now test that schemata and protocols work as type hints.

(def LongOrString (s/either long String))

(s/defrecord Nested [^Bar4 b ^LongOrString c ^PProtocol p])

(deftest fancier-defrecord-schema-test
  (let [bar1 (Bar. 1 "a")
        bar2 (Bar2. 1 "a")]
    (is (= (s/class-schema Nested)
           (s/record Nested {(s/required-key :b) Bar4
                             (s/required-key :c) LongOrString
                             (s/required-key :p) (s/protocol PProtocol)})))
    (valid! Nested (Nested. (Bar4. [1] {}) 1 bar2))
    (valid! Nested (Nested. (Bar4. [1] {}) "hi" bar2))
    (invalid! Nested (Nested. (Bar4. [1] {}) "hi" bar1))
    (invalid! Nested (Nested. (Bar4. [1] {}) (int 5) bar2))
    (invalid! Nested (Nested. (Bar4. [1] {:foo :bar}) 1 bar2))
    (invalid! Nested (Nested. nil "hi" bar2))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized functions

;; helpers

(deftest split-rest-arg-test
  (is (= (@#'s/split-rest-arg ['a '& 'b])
         '[[a] b]))
  (is (= (@#'s/split-rest-arg ['a 'b])
         '[[a b] nil])))

;;; fn

(def OddLong (s/both odd? long))

(def +test-fn-schema+
  "Schema for (s/fn ^String [^OddLong x y])"
  (s/make-fn-schema
   [(s/->Arity
     [(s/one OddLong "x") (s/one s/+anything+ "y")]
     String)]))

(deftest simple-validated-meta-test
  (let [f (s/fn ^String [^OddLong x y])]
    (is (= +test-fn-schema+ (s/fn-schema f)))))

(deftest simple-validated-fn-test
  (let [f (s/fn test-fn ^{:s even?} [^long x ^{:s {(s/required-key :foo) (s/both long odd?)}} y]
            (+ x (:foo y -100)))]
    (s/with-fn-validation
      (is (= 4 (f 1 {:foo 3})))
      (is (thrown? Exception (.invokePrim f 1 {:foo 3}))) ;; primitive type hints don't work on fns
      (is (thrown? Exception (f 1 {:foo 4}))) ;; foo not odd?
      (is (thrown? Exception (f 2 {:foo 3}))))  ;; return not even?

    (is (= 5 (f 1 {:foo 4}))) ;; foo not odd?
    (is (= 4 (f (Integer. (int 1)) {:foo 3}))) ;; first arg not long
    (is (= 5 (f 2 {:foo 3})))  ;; return not even?
    ))

(deftest destructured-validated-fn-test
  (let [LongPair [(s/one long "a") (s/one long "b")]
        f (s/fn ^long [^{:s LongPair} [a b] ^long y]
            (+ a b y))]
    (is (= (s/make-fn-schema
            [(s/->Arity
              [(s/one LongPair "gensym") (s/one long "y")]
              long)])
           (assoc-in (s/fn-schema f)
                     [:arities 0 :input-schema 0 :name] ;; ugh
                     "gensym")))
    (s/with-fn-validation
      (is (= 6 (f [1 2] 3)))
      (is (thrown? Exception (f [(Integer. 1) 2] 3))))))

(deftest two-arity-fn-test
  (let [f (s/fn foo
            (^long [^String x ^long y] (+ y (foo x)))
            (^long [^String x] (Long/parseLong x)))]
    (is (= (s/make-fn-schema
            [(s/->Arity [(s/one String "x")] long)
             (s/->Arity [(s/one String "x") (s/one long "y")] long)])
           (s/fn-schema f)))
    (is (= 3 (f "3")))
    (is (= 10 (f "3" 7)))))

(deftest infinite-arity-fn-test
  (let [f (s/fn foo
            (^Long [^Long x] (inc x))
            (^Long [^Long x & ^{:s [String]} strs]
                   (reduce + (foo x) (map count strs))))]
    (is (= (s/make-fn-schema
            [(s/->Arity [(s/one Long "x")] Long)
             (s/->Arity [(s/one Long "x") String] Long)])
           (s/fn-schema f)))
    (s/with-fn-validation
      (is (= 5 (f 4)))
      (is (= 16 (f 4 "55555" "666666")))
      (is (thrown? Exception (f (int 4) "55555" "666666")))
      (is (thrown? Exception (f 4 [3 3 3]))))))


;;; defn

(def OddLongString
  (s/both String #(odd? (Long/parseLong %))))

(s/defn simple-validated-defn
  "I am a simple schema fn"
  {:metadata :bla}
  ^OddLongString [^OddLong x]
  (str x))

(def +simple-validated-defn-schema+
  (s/make-fn-schema
   [(s/->Arity
     [(s/one OddLong "x")]
     OddLongString)]))

(deftest simple-validated-defn-test
  (let [{:keys [tag schema doc metadata]} (meta #'simple-validated-defn)]
    (is (= tag String))
    (is (= +simple-validated-defn-schema+ schema))
    (is (= doc "I am a simple schema fn"))
    (is (= metadata :bla)))
  (is (= +simple-validated-defn-schema+ (s/fn-schema simple-validated-defn)))

  (s/with-fn-validation
    (is (= "3" (simple-validated-defn 3)))
    (is (thrown? Exception (simple-validated-defn 4)))
    (is (thrown? Exception (simple-validated-defn "a"))))

  (is (= "4" (simple-validated-defn 4))))


(def +primitive-validated-defn-schema+
  (s/make-fn-schema [(s/->Arity [(s/one OddLong "x")] long)]))

(s/defn primitive-validated-defn
  ^long [^long ^{:s OddLong} x]
  (inc x))

(deftest simple-validated-defn-test
  (is (= +primitive-validated-defn-schema+ (s/fn-schema primitive-validated-defn)))

  (is ((ancestors (class primitive-validated-defn)) clojure.lang.IFn$LL))
  (s/with-fn-validation
    (is (= 4 (primitive-validated-defn 3)))
    (is (= 4 (.invokePrim primitive-validated-defn 3)))
    (is (thrown? Exception (primitive-validated-defn 4))))

  (is (= 5 (primitive-validated-defn 4))))

;; TODO: multi-arity defn tests.

;;; Benchmarks

(defn ^String simple-defn [x] (str x))

(require '[plumbing.timing :as timing])
(defn validated-fn-benchmark []
  (timing/microbenchmark
   (s/with-fn-validation
     (reduce #(when (simple-validated-defn %2) %1) (range 1 1000001 2)))
   (reduce #(when (simple-validated-defn %2) %1) (range 1 1000001 2))
   (reduce #(when (simple-defn %2) %1) (range 1 1000001 2))))
