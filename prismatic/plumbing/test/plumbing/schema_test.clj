(ns plumbing.schema-test
  (:use clojure.test)
  (:require [plumbing.schema :as s]))

(defmacro valid! [s x] `(is (do (s/validate ~s ~x) true)))
(defmacro invalid! [s x] `(is (~'thrown? Exception (s/validate ~s ~x))))

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

(deftest enum-test
  (let [schema (s/enum :a :b 1)]
    (valid! schema :a)
    (valid! schema 1)
    (invalid! schema :c)
    (invalid! schema 2)))

(deftest array-test
  (valid! "[Ljava.lang.String;" (into-array String ["a"]))
  (invalid! "[Ljava.lang.Object;" (into-array String ["a"]))
  (valid! "[Ljava.lang.Double;" (into-array Double [1.0]))
  (valid! "[D" (double-array [1.0])))

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

(deftest named-test
  (let [schema [(s/one String "topic") (s/one (s/named double "score") "asdf")]]
   (valid! schema ["foo" 1.0])
   (invalid! schema [1 2])))


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

(defprotocol PProtocol
  (do-something [this]))

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
  (valid! (s/class-schema Bar) (Bar. 1 "test"))
  (invalid! (s/class-schema Bar) (Bar. 1 :foo))
  (valid! (s/class-schema Bar) (assoc (Bar. 1 "test") :baz :foo))
  (invalid! (s/class-schema Bar) (assoc (Bar. 1 "test") :baaaz :foo))
  (invalid! (s/class-schema Bar) (assoc (Bar. 1 "test") :baz "foo"))
  
  (valid! (s/class-schema Bar2) (assoc (Bar2. 1 "test") :baz :foo))
  (invalid! (s/class-schema Bar2) (assoc (Bar2. 1 "test") :baaaaz :foo))
  (is (= 2 (do-something (Bar2. 1 "test"))))
  
  (valid! (s/class-schema Bar3) (Bar3. 1 "test"))
  (invalid! (s/class-schema Bar3) (assoc (Bar3. 1 "test") :foo :bar))
  (is (= 3 (do-something (Bar3. 1 "test"))))
  
  (valid! (s/class-schema Bar4) (Bar4. [1] {"test" "test"}))
  (valid! (s/class-schema Bar4) (Bar4. [1] nil))
  (invalid! (s/class-schema Bar4) (Bar4. ["a"] {"test" "test"}))
  (is (= 4 (do-something (Bar4. 1 "test")))))

(deftest fixup-tag-metadata-test
  (let [correct! (fn [symbol desired-meta]
                   (let [fix (@#'s/fixup-tag-metadata {} symbol)]                     
                     (is (= symbol fix))
                     (is (= desired-meta (or (meta fix) {})))))]
    (correct! 'foo {})
    (correct! (with-meta 'foo {:tag 'long}) {:tag 'long})
    (correct! (with-meta 'foo {:tag 'String}) {:tag 'String})
    (correct! (with-meta 'foo {:tag 'asdf}) {:schema 'asdf})))

(deftest extract-schema-test
  (let [correct! (fn [m out]
                   (is (= out (s/extract-schema (with-meta 'foo m)))))]
    (correct! {} s/+anything+)
    (correct! {:asdf :foo} s/+anything+)
    (correct! {:tag 'long} 'long)
    (correct! {:schema []} [])    
    (correct! {:s []} [])
    (correct! {:s? []} `(s/maybe []))
    (correct! {:tag 'long :s? []} `(s/maybe []))
    (is (thrown? Throwable (s/extract-schema (with-meta 'foo {:s [] :schema []}))))))

(s/defrecord Nested [^Bar4 b])



(defmacro valid-call! [o c] `(is (= ~o (s/validated-call ~@c))))
(defmacro invalid-call! [c] `(is (~'thrown? Exception (s/validated-call ~@c))))

(deftest validated-call-test
  (let [f (with-meta 
            (fn schematized-fn [l m] 
              (if (= l 100)
                {:baz l}
                {:bar (when (= l 1) (+ l (:foo m)))}))
            {:input-schema [(s/one long "l") (s/one {(s/required-key :foo) double} "dm")]
             :output-schema {(s/required-key :bar) (s/maybe double)}})]
    (valid-call! {:bar nil} (f 2 {:foo 1.0}))
    (valid-call! {:bar 4.0} (f 1 {:foo 3.0}))
    (invalid-call! (f 3.0 {:foo 1.0}))
    (invalid-call! (f 3 {:foo 1}))
    (invalid-call! (f 100 {:foo 1.0}))))

(deftest explain-test
  (is (= (s/explain {(s/required-key :x) long
                     String [(s/one int "foo") (s/maybe Bar)]})
         '{(required-key :x) long
           java.lang.String [("foo" int)
                             &
                             (maybe 
                              (plumbing.schema_test.Bar 
                               {(required-key :foo) long
                                (required-key :bar) java.lang.String
                                (optional-key :baz) clojure.lang.Keyword}))]})))
