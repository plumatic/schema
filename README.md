<img src="https://raw.github.com/wiki/plumatic/schema/images/logo.png" width="270" />

A Clojure(Script) library for declarative data description and validation.

[![Clojars Project](http://clojars.org/prismatic/schema/latest-version.svg)](http://clojars.org/prismatic/schema)

[![Circle CI](https://circleci.com/gh/plumatic/schema.svg?style=svg)](https://circleci.com/gh/plumatic/schema)

[Latest codox API docs](http://plumatic.github.io/schema).

**NOTE: this README is updated for the recent 1.0.0 release.  Please refer to the git history for previous versions of schema.**

--

One of the difficulties with bringing Clojure into a team is the overhead of understanding the kind of data (e.g., list of strings, nested map from long to string to double) that a function expects and returns.  While a full-blown type system is one solution to this problem, we present a lighter weight solution: schemas.  (For more details on why we built Schema, check out [this post](http://plumatic.github.io/schema-for-clojurescript-data-shape-declaration-and-validation).)

Schema is a rich language for describing data shapes, with a variety of features:

 - Data validation, with descriptive error messages of failures (targeted at programmers)
 - Annotation of function arguments and return values, with optional runtime validation
 - Schema-driven data **coercion**, which can automatically, succinctly, and safely convert complex data types (see the Coercion section below)
 - Schema also supports experimental `clojure.test.check` data **generation** from Schemas, as well as **completion** of partial datums, features we've found very useful when writing tests.  ** As of 1.1.0, this functionality can be found in the separate [`schema-generators`](https://github.com/plumatic/schema-generators) library. **
 - Schema is also built into our [`plumbing`](https://github.com/plumatic/plumbing) and [`fnhouse`](https://github.com/plumatic/fnhouse) libraries, which illustrate how we build services and APIs easily and safely with Schema.

## Meet Schema

A Schema is a Clojure(Script) data structure describing a data shape, which can be used to document and validate functions and data.

```clojure
(ns schema-examples
  (:require [schema.core :as s
             :include-macros true ;; cljs only
             ]))

(def Data
  "A schema for a nested data type"
  {:a {:b s/Str
       :c s/Int}
   :d [{:e s/Keyword
        :f [s/Num]}]})

(s/validate
  Data
  {:a {:b "abc"
       :c 123}
   :d [{:e :bc
        :f [12.2 13 100]}
       {:e :bc
        :f [-1]}]})
;; Success!

(s/validate
  Data
  {:a {:b 123
       :c "ABC"}})
;; Exception -- Value does not match schema:
;;  {:a {:b (not (instance? java.lang.String 123)),
;;       :c (not (integer? "ABC"))},
;;   :d missing-required-key}
```

The simplest schemas describe leaf values like Keywords, Numbers, and instances of Classes (on the JVM) and prototypes (in ClojureScript):

```clojure
;; s/Any, s/Bool, s/Num, s/Keyword, s/Symbol, s/Int, and s/Str are cross-platform schemas.

(s/validate s/Num 42)
;; 42
(s/validate s/Num "42")
;; RuntimeException: Value does not match schema: (not (instance java.lang.Number "42"))

(s/validate s/Keyword :whoa)
;; :whoa
(s/validate s/Keyword 123)
;; RuntimeException: Value does not match schema: (not (keyword? 123))

;; On the JVM, you can use classes for instance? checks
(s/validate java.lang.String "schema")

;; On JS, you can use prototype functions
(s/validate Element (js/document.getElementById "some-div-id"))
```

From these simple building blocks, we can build up more complex schemas that look like the data they describe.  Taking the examples above:

```clojure
;; list of strings
(s/validate [s/Str] ["a" "b" "c"])

;; nested map from long to String to double
(s/validate {long {String double}} {1 {"2" 3.0 "4" 5.0}})
```

Since schemas are just data, you can also `def` them and reuse and compose them as you would expect:

```clojure
(def StringList [s/Str])
(def StringScores {String double})
(def StringScoreMap {long StringScores})
```

What about when things go bad?  Schema's `s/check` and `s/validate` provide meaningful errors that look like the bad parts of your data, and are (hopefully) easy to understand.

```clojure
(s/validate StringList ["a" :b "c"])
;; RuntimeException: Value does not match schema:
;;  [nil (not (instance? java.lang.String :b)) nil]

(s/validate StringScoreMap {1 {"2" 3.0 "3" [5.0]} 4.0 {}})
;; RuntimeException: Value does not match schema:
;;  {1 {"3" (not (instance? java.lang.Double [5.0]))},
;;   (not (instance? java.lang.Long 4.0)) invalid-key}

```

See the "More Examples" section below for more examples and explanation, or the [custom Schemas types](https://github.com/plumatic/schema/wiki/Defining-New-Schema-Types-1.0) page for details on how Schema works under the hood.


## Beyond type hints

If you've done much Clojure, you've probably seen code with documentation like this:

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
(s/defrecord StampedNames
  [date :- Long
   names :- [s/Str]])

(s/defn stamped-names :- StampedNames
  [names :- [s/Str]]
  (StampedNames. (str (System/currentTimeMillis)) names))
```

Here, `x :- y` means that `x` must satisfy schema `y`, replacing and extending the more familiar metadata hints such as `^y x`.

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

First, we ensure that all data types that will be shared across namespaces (or heavily used within namespaces) have Schemas, either by `def`ing them or using `s/defrecord`.  This allows us to compactly and precisely refer to this data type in more complex data types, or when documenting function arguments and return values.

This documentation is probably the most important benefit of Schema, which is why we've optimized Schemas for easy readability and reuse -- and sometimes, this is all you need. Schemas are purely descriptive, not prescriptive, so unlike a type system they should never get in your way, or constrain the types of functions you can write.

After documentation, the next-most important benefit is validation.  Thus far, we've found four key use cases for validation.  First, you can globally turn on function validation within a given test namespace by adding this line:

```clojure
(use-fixtures :once schema.test/validate-schemas)
```

As long as your tests cover all call boundaries, this means you should catch any 'type-like' bugs in your code at test time.

Second, it may be handy to enable schema validation during development. To enable it, you can either type this into the repl or put it in your `user.clj`:

```clojure
(s/set-fn-validation! true)
```

To disable it again, call the same function, but with `false` as parameter instead.

Third, we manually call `s/validate` to check any data we read and write over the wire or to persistent storage, ensuring that we catch and debug bad data before it strays too far from its source.  If you need maximal performance, you can avoid the schema processing overhead on each call by create a validator once with `s/validator` and calling the resulting function on each datum you want to validate (`s/defn` does this under the hood).  Analogously, `s/check` and `s/checker` are similar, but *return* the error (or nil for success) rather than throwing exceptions on bad data.

Alternatively, you can force validation for key functions (without the need for `with-fn-validation`):

```clojure
(s/defn ^:always-validate stamped-names ...)
```

Thus, each time you invoke `stamped-names`, Schema will perform validation.

To reduce generated code size, you can use the `*assert*` flag and `set-compile-fn-validation!` functions to control when validation code is generated ([details](https://github.com/plumatic/schema/blob/master/src/clj/schema/macros.clj#L181)).

Schema will attempt to reduce the verbosity of its output by restricting the size of values that fail validation to 19 characters.  If a value exceeds this, it will be replaced by the name of its class.  You can adjust this size limitation by calling `set-max-value-length!`.

Finally, we use validation with coercion for API inputs and outputs.  See the coercion section below for details.

## More examples

The source code in [schema/core.cljx](https://github.com/plumatic/schema/blob/master/src/cljx/schema/core.cljx) provides a wealth of extra tools for defining schemas, which are described in docstrings. The file [schema/core_test.cljx](https://github.com/plumatic/schema/blob/master/test/cljx/schema/core_test.cljx) demonstrates a variety of sample schemas and many examples of passing & failing clojure data.  We'll just touch on a few more examples here, and refer the reader to the code for more details and examples (for now).

### Map schema details

In addition to uniform maps (like String to double), map schemas can also capture maps with specific key requirements:

```clojure
(def FooBar {(s/required-key :foo) s/Str (s/required-key :bar) s/Keyword})

(s/validate FooBar {:foo "f" :bar :b})
;; {:foo "f" :bar :b}

(s/validate FooBar {:foo :f})
;; RuntimeException: Value does not match schema:
;;  {:foo (not (instance? java.lang.String :f)),
;;   :bar missing-required-key}
```

For the special case of keywords, you can omit the `required-key`, like `{:foo s/Str :bar s/Keyword}`. You can also provide specific optional keys, and combine specific keys with generic schemas for the remaining key-value mappings:

```clojure

(def FancyMap
  "If foo is present, it must map to a Keyword.  Any number of additional
   String-String mappings are allowed as well."
  {(s/optional-key :foo) s/Keyword
    s/Str s/Str})

(s/validate FancyMap {"a" "b"})

(s/validate FancyMap {:foo :f "c" "d" "e" "f"})
```

### Sequence schema details

Similarly, you can also write sequence schemas that expect particular values in specific positions:

```clojure
(def FancySeq
  "A sequence that starts with a String, followed by an optional Keyword,
   followed by any number of Numbers."
  [(s/one s/Str "s")
   (s/optional s/Keyword "k")
   s/Num])

(s/validate FancySeq ["test"])
(s/validate FancySeq ["test" :k])
(s/validate FancySeq ["test" :k 1 2 3])
;; all ok

(s/validate FancySeq [1 :k 2 3 "4"])
;; RuntimeException: Value does not match schema:
;;  [(named (not (instance? java.lang.String 1)) "s")
;;   nil nil nil
;;   (not (instance? java.lang.Number "4"))]
```

### Other schema types

[`schema.core`](https://github.com/plumatic/schema/blob/master/src/cljx/schema/core.cljx) provides many more utilities for building schemas, including `maybe`, `eq`, `enum`, `pred`, `conditional`, `cond-pre`, `constrained`, and more.  Here are a few of our favorites:

```clojure
;; anything
(s/validate [s/Any] ["woohoo!" 'go-nuts 42.0])

;; maybe
(s/validate (s/maybe s/Keyword) :a)
(s/validate (s/maybe s/Keyword) nil)

;; eq and enum
(s/validate (s/eq :a) :a)
(s/validate (s/enum :a :b :c) :a)

;; pred
(s/validate (s/pred odd?) 1)

;; conditional (i.e. variant or option)
(def StringListOrKeywordMap (s/conditional map? {s/Keyword s/Keyword} :else [String]))
(s/validate StringListOrKeywordMap ["A" "B" "C"])
;; => ["A" "B" "C"]
(s/validate StringListOrKeywordMap {:foo :bar})
;; => {:foo :bar}
(s/validate StringListOrKeywordMap [:foo])
;; RuntimeException:  Value does not match schema: [(not (instance? java.lang.String :foo))]

;; if (shorthand for conditional)
(def StringListOrKeywordMap (s/if map? {s/Keyword s/Keyword} [String]))

;; cond-pre (experimental), also shorthand for conditional, allows you to skip the
;; predicate when the options are superficially different by doing a greedy match
;; on the preconditions of the options.
(def StringListOrKeywordMap (s/cond-pre {s/Keyword s/Keyword} [String]))
;; but don't do this -- this will never validate `{:b :x}` because the first schema
;; will be chosen based on the `map?` precondition (use `if` or `abstract-map-schema` instead):
(def BadSchema (s/cond-pre {:a s/Keyword} {:b s/Keyword}))

;; conditional can also be used to apply extra validation to a single type,
;; but constrained is often more desirable since it applies the validation
;; as a *postcondition*, which typically provides better error messages
;; and works better with coercion
(def OddLong (s/constrained long odd?))
(s/validate OddLong 1)
;; 1
(s/validate OddLong 2)
;; RuntimeException: Value does not match schema: (not (odd? 2))
(s/validate OddLong (int 3))
;; RuntimeException: Value does not match schema: (not (instance? java.lang.Long 3))

;; recursive
(def Tree {:value s/Int :children [(s/recursive #'Tree)]})
(s/validate Tree {:value 0, :children [{:value 1, :children []}]})

;; abstract-map (experimental) models "abstract classes" and "subclasses" with maps.
(require '[schema.experimental.abstract-map :as abstract-map])
(s/defschema Animal
  (abstract-map/abstract-map-schema
   :type
   {:name s/Str}))
(abstract-map/extend-schema Cat Animal [:cat] {:claws? s/Bool})
(abstract-map/extend-schema Dog Animal [:dog] {:barks? s/Bool})
(s/validate Cat {:type :cat :name "melvin" :claws? true})
(s/validate Animal {:type :cat :name "melvin" :claws? true})
(s/validate Animal {:type :dog :name "roofer" :barks? true})
(s/validate Animal {:type :cat :name "confused kitty" :barks? true})
;; RuntimeException: Value does not match schema: {:claws? missing-required-key, :barks? disallowed-key}
```

You can also define schemas for [recursive data types](https://github.com/plumatic/schema/wiki/Recursive-Schemas), or create [your own custom schemas types](https://github.com/plumatic/schema/wiki/Defining-New-Schema-Types-1.0).

## Transformations and Coercion

Schema also supports schema-driven data transformations, with *coercion* being the main application fleshed out thus far.  Coercion is like validation, except a schema-dependent transformation can be applied to the input data before validation.

An example application of coercion is converting parsed JSON (e.g., from an HTTP post request) to a domain object with a richer set of types (e.g., Keywords).

```clojure
(def CommentRequest
  {(s/optional-key :parent-comment-id) long
   :text String
   :share-services [(s/enum :twitter :facebook :google)]})

(def parse-comment-request
  (coerce/coercer CommentRequest coerce/json-coercion-matcher))

(= (parse-comment-request
    {:parent-comment-id (int 2128123123)
     :text "This is awesome!"
     :share-services ["twitter" "facebook"]})
   {:parent-comment-id 2128123123
    :text "This is awesome!"
    :share-services [:twitter :facebook]})
;; ==> true
```

Here, `json-coercion-matcher` provides some useful defaults for coercing from JSON, such as:

 - Numbers should be coerced to the expected type, if this can be done without losing precision.
 - When a Keyword is expected, a String can be coerced to the correct type by calling keyword

There's nothing special about `json-coercion-matcher` though; it's just as easy to [make your own schema-specific transformations](https://github.com/plumatic/schema/wiki/Writing-Custom-Transformations) to do even more.

For more details, see [this blog post](http://plumatic.github.io//schema-0-2-0-back-with-clojurescript-data-coercion).

## Generation and Completion

** As of 1.1.0, this functionality can be found in the separate [`schema-generators`](https://github.com/plumatic/schema-generators) library. **


## For the Future

Longer-term, we have lots more in store for Schema. Just a couple of the crazy ideas we have brewing are:
 - Automatically generate API client libraries based on API schemas
 - Compile to `core.typed` annotations for more typey goodness, if that's your thing

## Community

Please feel free to join the Plumbing [mailing list](https://groups.google.com/forum/#!forum/prismatic-plumbing) to ask questions or discuss how you're using Schema.

We welcome contributions in the form of bug reports and pull requests; please see `CONTRIBUTING.md` in the repo root for guidelines.  Libraries that extend `schema` with new functionality are great too; here are a few that we know of:

 - https://github.com/metosin/schema-tools has lots of useful utilities for working with schemas
 - https://github.com/cddr/integrity includes a variety of extensions, including helpers for producing error messages suitable for end-users.
 - https://github.com/gfredericks/schema-bijections has support for bijections, which are like a precise, two-way version of coercion, created for use with JSON APIs.
 - https://github.com/outpace/schema-transit couples Schema to Cognitect's Transit library
 - https://github.com/plumatic/schema-generators provides out-of-the box generation and partial datum completion from Schemas.
 - https://github.com/KitApps/schema-refined provides `constrained` and `conditional` on steroids to make your schemas as precise as it's possible using set of flexible and composable predicates

If you make something new, please feel free to PR to add it here!

## Supported Clojure versions

Schema is currently supported on 1.6 through 1.8 and the latest version of ClojureScript.

## License

Distributed under the Eclipse Public License, the same as Clojure.
