<img src="https://raw.github.com/wiki/prismatic/schema/images/logo.png" width="270" />

A Clojure(Script) library for declarative data description and validation.

Leiningen dependency (Clojars): `[prismatic/schema "0.1.1"]`

**This is an alpha release. The API and organizational structure are
subject to change. Comments and contributions are much appreciated.**

--

One of the difficulties with bringing Clojure into a team is the overhead of understanding the kind of data (e.g., list of strings, nested map from long to string to double) that a function expects and returns.  While a full-blown type system is one solution to this problem, we present a lighter weight solution: schemas.


## Meet Schema

A Schema is just a Clojure(Script) data structure describing a data shape, which can be used to document and validate functions and data.  The simplest schemas describe leaf values like Keywords, Numbers, and instances of Classes (on the JVM) and prototypes (in ClojureScript):

```clojure
(ns schema-examples
  (:require [schema.core :as s]))

;; s/Any, s/Number, s/Keyword, s/Integer, and s/String are cross-platform schemas.

(s/validate s/Number 42)  
(throws? (s/validate s/Number "42"))  
;; RuntimeException: Value does not match schema: (not (instance java.lang.Number "42")) 

(s/validate s/Keyword :whoa)  
(throws? (s/validate s/Keyword 123))
;; RuntimeException: Value does not match schema: (not (keyword? 123))

;; On the JVM, you can use classes for instance? checks
(s/validate java.lang.String "schema")

;; On JS, you can use prototype functions 
(s/validate Element document.getElementById("some-div-id"))
```

From these simple building blocks, we can build up more complex schemas that look like the data they describe.  Taking the examples above:

```clojure 
;; list of strings 
(s/validate [s/String] ["a" "b" "c"])

;; nested map from long to String to double
(s/validate {long {String double}} {1 {"2" 3.0 "4" 5.0}})
```

Since schemas are just data, you can also `def` them and reuse and compose them as you would expect:

```clojure 
(def StringList [s/String])
(def StringScores {String double})
(def StringScoreMap {long StringScores}) 
```

What about when things go bad?  Schema's `s/check` and `s/validate` provide meaningful errors that look like the bad parts of your data, and are (hopefully) easy to understand.

```clojure 
(throws? (s/validate StringList ["a" :b "c"]))
;; RuntimeException: Value does not match schema:
;;  [nil (not (instance? java.lang.String :b)) nil]

(throws? (s/validate StringScoreMap {1 {"2" 3.0 "3" [5.0]} 4.0 {}}))
;; RuntimeException: Value does not match schema:
;;  {1 {"3" (not (instance? java.lang.Double [5.0]))}, 
;;   (not (instance? java.lang.Long 4.0)) invalid-key}

```

See the "More Examples" section below for more examples and explanation.


## Beyond type hints

If you've done much Clojure, you've probably seen code like this:

```clojure
(defrecord StampedNames
  [^Long date
   names ;; a list of Strings   
   ])
   
(defn ^StampedNames stamped-names 
  "names is a list of Strings"
  [names]
  (StampedNames. (str (System/currentTimeMillis)) names))
```

Clojure's type hints make great documentation, but they fall short for complex types, often leading to ad-hoc descriptions of data in comments and doc-strings.  This is better than nothing, but these ad hoc descriptions are often imprecise, hard to read, and prone to bit-rot.  

Schema provides macros `defrecord`, `defn`, and `fn` that help bridge this gap, by allowing arbitrary schemas as type hints on fields, arguments, and return values.  This is a graceful extension of Clojure's type hinting system, because every type hint is a valid Schema, and Schemas that represent valid type hints are automatically passed through to Clojure.

```clojure
;; only necessary for cljs, macros are imported to schema.core in clj
(require '[schema.macros :as sm]) 

(sm/defrecord StampedNames
  [date :- Long
   names :- [s/String]])
   
(sm/defn stamped-names :- StampedNames
  "names is a list of Strings"
  [names :- [s/String]]
  (StampedNames. (str (System/currentTimeMillis)) names))
```

Here, `x :- y` means that `x` must satisfy schema `y`, replacing the more familiar metadata hints (like `^y x` -- which are also supported, but clunkier for complex schemas -- see `(doc schema.core)` for details).  

As you can see, these type hints are precise, easy to read, and shorter than the comments they replace.  Moreover, they produce Schemas that are *data*, and can be inspected, manipulated, and used for validation on-demand (did you spot the bug in `stamped-names`?)

```clojure
;; You can inspect the schemas of the record and function

(s/explain StampedNames)
==> (record user.StampedNames {:date java.lang.Long, :names [java.lang.String]})

(s/explain (s/fn-schema stamped-names))
==> (=> (record user.StampedNames {:date java.lang.Long, :names [java.lang.String]}) 
        [java.lang.String])
    
;; And you can turn on validation to catch bugs in your functions and schemas  
(s/with-fn-validation 
  (stamped-names ["bob"]))
==> RuntimeException: Output of stamped-names does not match schema: 
     {:date (not (instance? java.lang.Long "1378267311501"))} 
     
;; Oops, I guess we should remove that `str` from `stamped-names`.     
```

## Schemas in practice

We've already seen how we can build up Schemas via composition, attach them to functions, and use them to validate data. What does this look like in practice?

First, we ensure that all data types that will be shared across namespaces (or heavily used within namespaces) have Schemas, either by `def`ing them or using `sm/defrecord`.  This allows us to compactly and precisely refer to this data type in more complex data types, or when documenting function arguments and return vales. 

This documentation is probably the most important benefit of Schema, which is why we've optimized Schemas for easy readability and reuse -- and sometimes, this is all you need. Schemas are purely descriptive, not prescriptive, so unlike a type system they should never get in your way, or constrain the types of functions you can write.  

After documentation, the next-most important benefit is validation.  Thus far, we've found two key use cases for validation.  First, you can globally turn on function validation within a given test namespace by adding this line:

```clojure
(use-fixtures :once schema.test/validate-schemata)
```

As long as your tests cover all call boundaries, this means you will should catch any 'type-like' bugs in your code at test time. 

Second, we manually call `s/validate` to check any data we read and write over the wire or to persistent storage, ensuring that we catch and debug bad data before it strays too far from its source.

Longer-term, we have lots more in store for Schema.  Just a few of the crazy ideas we have brewing are:
 - Automatically generate API client libraries based on API schemas
 - Automatically generate test data from schemas
 - Compile to `core.typed` annotations for more typey goodness, if that's your thing


## More examples

[`schema.core`](https://github.com/Prismatic/schema/blob/master/src/cljx/schema/core.cljx) provides a wealth of extra tools for defining schemas, which are described in docstrings and well-tested in [`schema.core-test`](https://github.com/Prismatic/schema/blob/master/test/cljx/schema/core_test.cljx).  We'll just touch on a few more examples here, and refer the reader to the code for more details and examples (for now).

### Map schema details

In addition to uniform maps (like String to double), map schemas can also capture maps with specific key requirements:

```clojure
(s/validate {:foo s/String :bar s/Keyword} {:foo "f" :bar :b})

(throws? (s/validate {:foo s/String :bar s/Keyword} {:foo :f}))
;; RuntimeException: Value does not match schema: 
;;  {:foo (not (instance? java.lang.String :f)), 
;;   :bar missing-required-key}
```

You can also provide specific optional keys, and combine specific keys with generic schemas for the remaining key-value mappings:

```clojure

(def FancyMap 
  "If foo is present, it must map to a Keyword.  Any number of additional 
   String-String mappings are allowed as well."
  {(s/optional-key :foo) s/Keyword 
    s/String s/String})

(s/validate FancyMap {"a" "b"})

(s/validate FancyMap {:foo :f "c" "d" "e" "f"})
```

### Sequence schema details

Similarly, you can also write sequence schemas that expect particular values in specific positions:

```clojure
(def FancySeq 
  "A sequence that starts with a String, followed by an optional Keyword,
   followed by any number of Numbers."
  [(s/one s/String "s")
   (s/optional s/Keyword "k")
   s/Number])

(s/validate FancySeq ["test"])
(s/validate FancySeq ["test" :k])
(s/validate FancySeq ["test" :k 1 2 3])

(throws? (s/validate FancySeq [1 :k 2 3 "4"]))
;; RuntimeException: Value does not match schema: 
;;  [(named (not (instance? java.lang.String 1)) "s") 
;;   nil nil nil 
;;   (not (instance? java.lang.Number "4"))]
```

### Other schema types

[`schema.core`](https://github.com/Prismatic/schema/blob/master/src/cljx/schema/core.cljx) provides many more utilities for building schemas, including `maybe`, `eq`, `enum`, `either`, `both`, `pred`, and more.  Here are a few of our favorites:

```clojure

;; maybe 
(s/validate (s/maybe s/Keyword) :a)
(s/validate (s/maybe s/Keyword) nil)

;; enum 
(s/validate (s/enum :a :b :c) :a)

;; both and pred
(def OddLong (s/both long (s/pred odd? 'odd?)))
(s/validate OddLong 1)
(throws? (s/validate OddLong 2))
;; RuntimeException: Value does not match schema: (not (odd? 2)) 
(throws? (s/validate OddLong (int 3)))
;; RuntimeException: Value does not match schema: (not (instance? java.lang.Long 3))
```

## Community

Please feel free to join the Plumbing [mailing list](https://groups.google.com/forum/#!forum/prismatic-plumbing) to ask questions or discuss how you're using Schema.

For announcements of new releases, you can also follow on [@PrismaticEng](http://twitter.com/prismaticeng) on Twitter.

## Supported Clojure versions

Schema is currently supported on 1.5.1 and the latest version of ClojureScript.

## License

Copyright (C) 2013 Prismatic.  Distributed under the Eclipse Public License, the same as Clojure.
