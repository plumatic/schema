<img src="https://raw.github.com/wiki/prismatic/schema/images/logo.png" width="270" />

A Clojure(Script) library for declarative data description and validation.

--

One of the difficulties with bringing Clojure into a team is the overhead of understanding the kind of data (e.g., list of strings versus, nested map from long to string to double) that a function expects and returns. While a full-blown type system is one solution to this problem, we present a lighter weight solution: schemas. 

## Simple Schema Examples



```clojure

(ns schema-examples
  (:require [schema.core :as s]))

;; Leaf schema values that work on JVM and JS

(s/validate s/Number 42)  
(throws? (s/validate s/Number "42"))
;; RuntimeException Value does not match schema: (not (instance java.lang.Number "42")) 
(s/validate s/Keyword :key) 
(s/validate s/Int 42) 
(s/validate s/String "hello")
(throws? (s/validate s/Keyword "hello")
;; RuntimeException: Value does not match schema: (not (keyword? "hello"))

;; On the JVM, you can use classes for instance? checks
(s/validate java.lang.String "schema")
;; On JS, you can use prototype functions 
(s/validate Element document.getElementById("some-div-id"))

;; Schemas on Sequences
;; [elem-schema] encodes a sequence where each elem matches the elem-schema

(s/validate [s/Num] [1 2 3.0])
(throws? (s/validate [s/Int] [1 2 3.0]))
;; RuntimeException Value does not match schema: [nil nil (not (integer? 3.0))]

;; Enum Schemas 
(s/validate (s/enum :a :b :c) :a)
(s/invalid! (s/enum :a :b :c) :d) ;; throws, ":d not in enum (:a :b :C)"

;; Schemas on Maps
;; {:key1 val1-schema, :key2 val2-schema}
;; encodes map must have :key1 and :key2 (and no other keys)
;; and the respective values must match va1-schema val2-schema
(s/validate {:name s/String :id s/Int} {:name "Bob" :id "42"})
(s/validate {:type s/Keyword :id s/Int} {:type :rss :id "42"})

;; You can also encode generic requirements on maps
;; For instance, the schema below encodes a map with
;; keys in an enum mapped to Num
(s/validate {(s/enum :a :b :c) s/Number} {:a 1 :b 2 :c 3})

;; General Schemas on Functions
;; (s/pred fn?) is a schema that is valid when data passes fn?
;; (s/both a b) is valid when data passes the a and b schemas
(s/validate (s/both [(s/both s/Str (s/pred (comp odd? count))] ["a" "aaa" "aaaaa"])
;; A schema for sequences of strings of odd length
```

