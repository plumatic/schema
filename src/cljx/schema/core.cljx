(ns schema.core
  "A library for data structure schema definition and validation.

   For example,

   (check {:foo long :bar [double]} {:foo 1 :bar [1.0 2.0 3.0]})

   returns nil (for successful validation) but the following all return
   truthy objects that look like the bad portions of the input object,
   with leaf values replaced by descriptions of the validation failure:

   (check {:foo long :bar [double]} {:bar [1.0 2.0 3.0]})
   ==> {:foo missing-required-key}

   (check {:foo long :bar [double]} {:foo \"1\" :bar [1.0 2.0 3.0]})
   ==> {:foo (not (instance? java.lang.Long \"1\"))}

   (check {:foo long :bar [double]} {:foo 1 :bar [1.0 2.0 3.0] :baz 1})
   ==> {:baz disallowed-key}

   Schemas are also supported as field/argument metadata in special
   defrecord/fn/defn replacements, using standard ^long ^Class ^Record
   syntax for classes and primitives as usual.  For more complex
   schemata, you must use a map like:

   ^{:schema +a-schema+} or ^{:s +a-schema+} for short, or

   ^{:s? +a-schema+} as shorthand for ^{:s (s/maybe +a-schema+)}.

   This metadata is bakwards compatible, and is ignored by usual
   Clojure forms.

   The new forms are also able to directly accept hints of the form
   ^+a-schema+ where +a-schema+ is a symbol referencing a schema,
   and ^AProtocol where AProtocol is a protocol but these hints are
   not backwards compatible with ordinary
   defrecord/ defn/etc.

   As an alternative, you can also provide schemas in s/defrecord
    and s/defn using the following syntax:

   (s/defn foo :- return-schema
     [a :- a-schema
      b :- b-schema] ...)

   These forms are all compatible and can be mixed and matched
   within a single s/defn (although we wouldn't recommend that for
   readability's sake)."
  (:refer-clojure :exclude [Keyword])
  (:require
   [clojure.string :as str]
   #+clj potemkin
   #+clj [schema.macros :as macros]
   [schema.utils :as utils])
  #+cljs (:require-macros [schema.macros :as macros]))

#+clj (set! *warn-on-reflection* true)

;; Allow the file to be reloaded in Clojure, undoing some weirdness below
#+clj (do (ns-unmap *ns* 'String) (ns-unmap *ns* 'Number)
          (import 'java.lang.String 'java.lang.Number))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema protocol

(defprotocol Schema
  (check [this x]
    "Check that x satisfies this schema, returning nil for success or a datum that looks
     like the 'bad' parts of x with ValidationErrors at the leaves describing the error.

     Examples:
     user> (s/check s/Keyword :a)
     nil

     user> (s/check s/Keyword 'a)
     (not (keyword? a)) ;; pretty-printed validation error in clojure

     user> (s/check {:a s/Keyword :b [s/Int]}
                    {:a :z        :b [1 :whoops 3]})
     {:b [nil (not (integer? :whoops)) nil]}")
  (explain [this]
    "Expand this schema to a human-readable format suitable for pprinting,
     also expanding classes schematas at the leaves.  Example:

     user> (s/explain {:a s/Keyword :b [s/Int]} )
     {:a Keyword, :b [Int]}"))

#+clj ;; Schemas print as their explains
(do (defmethod print-method schema.core.Schema [s writer]
      (print-method (explain s) writer))
    (prefer-method print-method schema.core.Schema clojure.lang.IRecord)
    (prefer-method print-method schema.core.Schema java.util.Map)
    (prefer-method print-method schema.core.Schema clojure.lang.IPersistentMap))

(defn validate [schema value & [value-name]]
  (when-let [error (check schema value)]
    (utils/error! "%s does not match schema: %s" (or value-name "Value") (pr-str error))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Simple Schemas

;;; The schemas here are defined as records (rather than reify), so they behave like data
;;; and print reasonably (even when not going through print-method/explain above).


;;; Any(thing)

(defrecord AnythingSchema [_]
  ;; _ is to work around bug in Clojure where eval-ing defrecord with no fields
  ;; loses type info, which makes this unusable in schema-fn.
  ;; http://dev.clojure.org/jira/browse/CLJ-1196
  Schema
  (check [this x] nil)
  (explain [this] 'Any))

(def Any
  "Any value, including nil."
  (AnythingSchema. nil))


;;; maybe (nil)

(defrecord Maybe [schema]
  Schema
  (check [this x]
    (when-not (nil? x)
      (check schema x)))
  (explain [this] (list 'maybe (explain schema))))

(defn maybe
  "A value that must either be nil or satisfy schema"
  [schema]
  (Maybe. schema))


;;; named (schema elements)

(defrecord NamedSchema [schema name]
  Schema
  (check [this x]
    (when-let [err (check schema x)]
      (utils/->NamedError name err)))
  (explain [this] (list 'named (explain schema) name)))

(defn named
  "A value that must satisfy schema, and has a name for documentation purposes."
  [schema name]
  (NamedSchema. schema name))


;;; eq (to a single allowed value)

(defrecord EqSchema [v]
  Schema
  (check [this x]
    (when-not (= v x)
      (macros/validation-error this x (list '= v (utils/value-name x)))))
  (explain [this] (list 'eq v)))

(defn eq
  "A value that must be (= v)."
  [v]
  (EqSchema. v))


;;; enum (in a set of allowed values)

(defrecord EnumSchema [vs]
  Schema
  (check [this x]
    (when-not (contains? vs x)
      (macros/validation-error this x (list vs (utils/value-name x)))))
  (explain [this] (cons 'enum vs)))

(defn enum
  "A value that must be = to some element of vs."
  [& vs]
  (EnumSchema. (set vs)))


;;; either (satisfies this schema or that one)

(defrecord Either [schemas]
  Schema
  (check [this x]
    (when (every? #(check % x) schemas)
      (macros/validation-error this x
                               (list 'every? (list 'check '% (utils/value-name x)) 'schemas))))
  (explain [this] (cons 'either (map explain schemas))))

(defn either
  "A value that must satisfy at least one schema in schemas."
  [& schemas]
  (Either. schemas))


;;; both (satisfies this schema and that one)

(defrecord Both [schemas]
  Schema
  (check [this x]
    (when-let [errors (seq (keep #(check % x) schemas))]
      (if (= 1 (count errors))
        (first errors)
        (macros/validation-error this x (list 'empty? (vec errors))))))
  (explain [this] (cons 'both (map explain schemas))))

(defn both
  "A value that must satisfy every schema in schemas."
  [& schemas]
  (Both. schemas))


;;; protocol (which value must satisfy?)

(defn protocol-name [protocol]
  #+clj (-> protocol :p :var meta :name)
  #+cljs (-> protocol meta :proto-sym))

;; In cljs, satisfies? is a macro so we must precompile (partial satisfies? p)
;; and put it in metadata of the record so that equality is preserved, along with the name.
(defrecord Protocol [p]
  Schema
  (check [this x]
    (when-not #+clj (satisfies? p x) #+cljs ((:proto-pred (meta this)) x)
              (macros/validation-error this x (list 'satisfies? (protocol-name this) (utils/value-name x)))))
  (explain [this] (list 'protocol (protocol-name this))))

#+clj ;; The cljs version is macros/protocol
(defn protocol
  "A value that must satsify? protocol p"
  [p]
  (macros/assert-iae (:on p) "Cannot make protocol schema for non-protocol %s" p)
  (Protocol. p))


;;; predicate (which must return truthy for value)

(defrecord Predicate [p? pred-name]
  Schema
  (check [this x]
    (when-let [reason (try (when-not (p? x) 'not)
                           (catch #+clj Exception #+cljs js/Error e 'throws?))]
      (macros/validation-error this x (list pred-name (utils/value-name x)) reason)))
  (explain [this]
    (cond (= p? integer?) 'Int
          (= p? keyword?) 'Keyword
          :else (list 'pred pred-name))))

(defn pred
  "A value for which p? returns true (and does not throw).
   Optional pred-name can be passed for nicer validation errors."
  ([p?] (pred p? p?))
  ([p? pred-name]
     (when-not (fn? p?)
       (utils/error! "Not a function: %s" p?))
     (Predicate. p? pred-name)))


;;; conditional (choice of schema, based on predicates on the value)

(defrecord ConditionalSchema [preds-and-schemas]
  Schema
  (check [this x]
    (if-let [[_ match] (first (filter (fn [[pred]] (pred x)) preds-and-schemas))]
      (check match x)
      (macros/validation-error this x (list 'matches-some-condition? (utils/value-name x)))))
  (explain [this]
    (->> preds-and-schemas
         (mapcat (fn [[pred schema]] [pred (explain schema)]))
         (cons 'conditional))))

(defn conditional
  "Define a conditional schema.  Takes args like cond,
   (conditional pred1 schema1 pred2 schema2 ...),
   and checks the first schema where pred is true on the value.
   Unlike cond, throws if the value does not match any condition.
   :else may be used as a final condition in the place of (constantly true).
   More efficient than either, since only one schema must be checked."
  [& preds-and-schemas]
  (macros/assert-iae (and (seq preds-and-schemas) (even? (count preds-and-schemas)))
                     "Expected even, nonzero number of args; got %s" (count preds-and-schemas))
  (ConditionalSchema. (for [[pred schema] (partition 2 preds-and-schemas)]
                        [(if (= pred :else) (constantly true) pred) schema])))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Map Schemas

;; A map schema is itself a Clojure map, which can provide value schemas for specific required
;; and optional keys, as well as a single, optional schema for additional key-value pairs.

;; Specific keys are mapped to value schemas, and given as either:
;;  - (required-key k), a required key (= k)
;;  - a keyword, also a required key
;;  - (optional-key k), an optional key (= k)
;; For example, {:a Int (optional-key :b) String} describes a map with key :a mapping to an
;; integer, an optional key :b mapping to a String, and no other keys.

;; There can also be a single additional key, itself a schema, mapped to the schema for
;; corresponding values, which applies to all key-value pairs not covered by an explicit
;; key.
;; For example, {Int String} is a mapping from integers to strings, and
;; {:a Int Int String} is a mapping from :a to an integer, plus zero or more additional
;; mappings from integers to strings.


;;; Definitions for required and optional keys

(defrecord RequiredKey [k])

(defn required-key
  "A required key in a map"
  [k]
  (RequiredKey. k))

(defn required-key? [ks]
  (or (keyword? ks)
      (instance? RequiredKey ks)))

(defrecord OptionalKey [k])

(defn optional-key
  "An optional key in a map"
  [k]
  (OptionalKey. k))


;;; Implementation helper functions

(defn- explicit-schema-key [ks]
  (cond (keyword? ks) ks
        (instance? RequiredKey ks) (.-k ^RequiredKey ks)
        (instance? OptionalKey ks) (.-k ^OptionalKey ks)
        :else (utils/error! "Bad explicit key: %s" ks)))

(defn- specific-key? [ks]
  (or (required-key? ks)
      (instance? OptionalKey ks)))

(defn- find-extra-keys-schema [map-schema]
  (let [key-schemata (remove specific-key? (keys map-schema))]
    (macros/assert-iae (< (count key-schemata) 2)
                       "More than one non-optional/required key schemata: %s"
                       (vec key-schemata))
    (first key-schemata)))

(defn- check-explicit-key
  "Validate a single schema key and dissoc the value from m"
  [value [key-schema val-schema]]
  (let [optional? (instance? OptionalKey key-schema)
        k (explicit-schema-key key-schema)
        present? (contains? value k)]
    (cond (and (not optional?) (not present?))
          [k 'missing-required-key]

          present?
          (when-let [error (check val-schema (get value k))]
            [k error]))))

(defn- check-extra-key
  "Validate a single schema key and dissoc the value from m"
  [key-schema val-schema [value-k value-v]]
  (if-not key-schema
    [value-k 'disallowed-key]
    (if-let [error (check key-schema value-k)]
      [error 'invalid-key]
      (when-let [error (check val-schema value-v)]
        [value-k error]))))

(defn- check-map [map-schema value]
  (let [extra-keys-schema (find-extra-keys-schema map-schema)
        extra-vals-schema (get map-schema extra-keys-schema)
        explicit-schema (dissoc map-schema extra-keys-schema)
        errors (concat
                (keep #(check-explicit-key value %)
                      explicit-schema)
                (keep #(check-extra-key extra-keys-schema extra-vals-schema %)
                      (apply dissoc value (map explicit-schema-key (keys explicit-schema)))))]
    (when (seq errors)
      (into {} errors))))

(defn safe-get
  "Like get but throw an exception if not found"
  [m k]
  (if-let [pair (find m k)]
    (val pair)
    (utils/error! "Key %s not found in %s" k m)))


;;; Extending the Schema protocol to Clojure maps.

(extend-protocol Schema
  #+clj clojure.lang.APersistentMap
  #+cljs cljs.core.PersistentArrayMap
  (check [this x]
    (if-not (map? x)
      (macros/validation-error this x (list 'map? (utils/value-name x)))
      (check-map this x)))
  (explain [this]
    (into {}
          (for [[k v] this]
            [(if (specific-key? k)
               (if (keyword? k)
                 k
                 (list (cond (instance? RequiredKey k) 'required-key
                             (instance? OptionalKey k) 'optional-key)
                       (safe-get k :k)))
               (explain k))
             (explain v)]))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Set schemas

;; A set schema is a Clojure set with a single element, a schema that all values must satisfy

(extend-protocol Schema
  #+clj clojure.lang.APersistentSet
  #+cljs cljs.core.PersistentHashSet
  (check [this x]
    (macros/assert-iae (= (count this) 1) "Set schema must have exactly one element")
    (or (when-not (set? x)
          (macros/validation-error this x (list 'set? (utils/value-name x))))
        (when-let [out (seq (keep #(check (first this) %) x))]
          (set out))))
  (explain [this] (set [(explain (first this))])))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Sequence Schemas

;; A sequence schema looks like [one* optional* rest-schema?].
;; one matches a single required element, and must be the output of 'one' below.
;; optional matches a single optional element, and must be the output of 'optional' below.
;; Finally, rest-schema is any schema, which must match any remaining elements.
;; (if optional elements are present, they must be matched before the rest-schema is applied).

(defrecord One [schema optional? name])

(defn one
  "A single required element of a sequence (not repeated, the implicit default)"
  ([schema name]
     (One. schema false name)))

(defn optional
  "A single optional element of a sequence (not repeated, the implicit default)"
  ([schema name]
     (One. schema true name)))

(defn- parse-sequence-schema [s]
  (let [[required more] (split-with #(and (instance? One %) (not (:optional? %))) s)
        [optional more] (split-with #(and (instance? One %) (:optional? %)) more)]
    (macros/assert-iae
     (and (<= (count more) 1) (every? #(not (instance? One %)) more))
     "Sequence schema must look like [one* optional* rest-schema?]")
    [(concat required optional) (first more)]))

(extend-protocol Schema
  #+clj clojure.lang.APersistentVector
  #+cljs cljs.core.PersistentVector
  (check [this x]
    (or (when (map? x)
          (macros/validation-error this x (list 'not (list 'map? (utils/value-name x)))))
        (try (seq x) nil
             (catch #+clj Exception #+cljs js/Error e
                    (macros/validation-error this x (list 'seq? (utils/value-name x)))))
        (let [[singles multi] (parse-sequence-schema this)]
          (#(when (some identity %) %)
           (loop [singles singles x x out []]
             (if-let [[^One first-single & more-singles] (seq singles)]
               (if (empty? x)
                 (if (.-optional? first-single)
                   out
                   (conj out
                         (macros/validation-error
                          (vec singles)
                          nil
                          (list* 'present?
                                 (for [^One single singles
                                       :while (not (.-optional? single))]
                                   (.-name single))))))
                 (recur more-singles
                        (rest x)
                        (conj out
                              (when-let [err (check (.-schema first-single) (first x))]
                                (utils/->NamedError (.-name first-single) err)))))
               (cond multi
                     (into out (map #(check multi %) x))

                     (seq x)
                     (conj out (macros/validation-error nil x (list 'has-extra-elts? (count x))))

                     :else
                     out)))))))
  (explain [this]
    (let [[singles multi] (parse-sequence-schema this)]
      (vec
       (concat
        (for [^One s singles]
          (list (if (.-optional? s) 'optional 'one) (explain (:schema s)) (:name s)))
        (when multi
          [(explain multi)]))))))

(defn pair
  "A schema for a pair of schemas and their names"
  [first-schema first-name second-schema second-name]
  [(one first-schema first-name)
   (one second-schema second-name)])


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Record Schemas

;; A Record schema describes a value that must have the correct type, and its body must
;; also satisfy a map schema.  An optional :extra-validator-fn can also be passed to do
;; additional validation.

(defrecord Record [klass schema]
  Schema
  (check [this r]
    (or (when-not (instance? klass r)
          (macros/validation-error this r (list 'instance? klass (utils/value-name r))))
        (check-map schema r)
        (when-let [f (:extra-validator-fn this)]
          (check (pred f) r))))
  (explain [this]
    (list 'record #+clj (symbol (.getName ^Class klass)) #+cljs (symbol (pr-str klass)) (explain schema))))

(defn record
  "A Record instance of type klass, whose elements match map schema 'schema'."
  [klass schema]
  #+clj (macros/assert-iae (class? klass) "Expected record class, got %s" (utils/type-of klass))
  (macros/assert-iae (map? schema) "Expected map, got %s" (utils/type-of schema))
  (Record. klass schema))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Function Schemas

;; A function schema describes a function of one or more arities.
;; The function can only have a single output schema (across all arities), and each input
;; schema is a sequence schema describing the argument vector.

;; Currently function schemas are purely descriptive, and do not carry any validation logic.

(defn explain-input-schema [input-schema]
  (let [[required more] (split-with #(instance? One %) input-schema)]
    (concat (map #(explain (.-schema ^One %)) required)
            (when (seq more)
              ['& (mapv explain more)]))))

(defrecord FnSchema [output-schema input-schemas] ;; input-schemas sorted by arity
  Schema
  (check [this x] nil
    (when-not (fn? x)
      (macros/validation-error this x (list 'fn? (utils/value-name x)))))
  (explain [this]
    (if (> (count input-schemas) 1)
      (list* '=>* (explain output-schema) (map explain-input-schema input-schemas))
      (list* '=> (explain output-schema) (explain-input-schema (first input-schemas))))))

(defn- arity [input-schema]
  (if (seq input-schema)
    (if (instance? One (last input-schema))
      (count input-schema)
      #+clj Long/MAX_VALUE #+cljs js/Number.MAX_VALUE)
    0))

(defn make-fn-schema
  "A function outputting a value in output schema, whose argument vector must match one of
   input-schemas, each of which should be a sequence schema.
   Currently function schemas are purely descriptive; they validate against any function,
   regargless of actual input and output types."
  [output-schema input-schemas]
  (macros/assert-iae (seq input-schemas) "Function must have at least one input schema")
  (macros/assert-iae (every? vector? input-schemas) "Each arity must be a vector.")
  (macros/assert-iae (apply distinct? (map arity input-schemas)) "Arities must be distinct")
  (FnSchema. output-schema (sort-by arity input-schemas)))

;; => and =>* are convenience macros for making function schemas.
;; Clojurescript users must use them from schema.macros, but Clojure users can get them here.
#+clj (potemkin/import-vars macros/=> macros/=>*)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Cross-platform Schema leaves, for writing Schemas that are valid in both clj and cljs.

#+clj (ns-unmap *ns* 'String)
(def String
  "Satisfied only by String.
   Is (pred string?) and not js/String in cljs because of keywords."
  #+clj java.lang.String #+cljs (pred string?))

#+clj (ns-unmap *ns* 'Number)
(def Number
  "Any number"
  #+clj java.lang.Number #+cljs js/Number)

(def Int
  "Any integral number"
  (pred integer? 'integer?))

(def Keyword
  "A keyword"
  (pred keyword? 'keyword?))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Platform-specific Schemas

;; On the JVM, a Class itself is a schema, and the primitive coercion functions (double, long,
;; etc) match only instances of that concrete type (identical to Double, Long, etc).
#+clj
(do
  (defn- check-class [schema class value]
    (when-not (instance? class value)
      (macros/validation-error schema value (list 'instance? class (utils/value-name value)))))

  (extend-protocol Schema
    Class
    (check [this x]
      (or (check-class this this x)
          (when-let [more-schema (utils/class-schema this)]
            (check more-schema x))))
    (explain [this]
      (if-let [more-schema (utils/class-schema this)]
        (explain more-schema)
        (symbol (.getName ^Class this)))))

  ;; prevent coersion, so you have to be exactly the given type.
  (defmacro extend-primitive [cast-sym class-sym]
    `(extend-protocol Schema
       ~cast-sym
       (check [this# x#]
         (check-class ~cast-sym ~class-sym x#))
       (explain [this#] '~(symbol (last (.split (name cast-sym) "\\$"))))))

  (extend-primitive clojure.core$double Double)
  (extend-primitive clojure.core$float Float)
  (extend-primitive clojure.core$long Long)
  (extend-primitive clojure.core$int Integer)
  (extend-primitive clojure.core$short Short)
  (extend-primitive clojure.core$char Character)
  (extend-primitive clojure.core$byte Byte)
  (extend-primitive clojure.core$boolean Boolean))

;; On JS, we treat functions as prototypes so any function prototype checks
;; objects for compatibility (Prototype constructor hack)
#+cljs
(extend-protocol Schema
  js/Function
  (check [this x]
    (if-let [schema (utils/class-schema this)]
      (check schema x)
      ;; Am I from this proto
      (when (or (nil? x)
                (not (or (identical? this (.-constructor x))
                         (js* "~{} instanceof ~{}" x this))))
        (macros/validation-error this x (list 'instance? this (utils/value-name x))))))
  (explain [this]
    (if-let [more-schema (utils/class-schema this)]
      (explain more-schema)
      this)))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized records and functions

;; TODO: describe the binding syntax here.

;; Metadata syntax is the same as for schema/defrecord.

;; Currently, there is zero overhead with compile-fn-validation off,
;; since we're sneaky and apply the schema metadata to the fn class
;; rather than using metadata (which seems to yield wrapping in a
;; non-primitive AFn wrapper of some sort, giving 2x slowdown).

;; For fns we're stuck with this 2x slowdown for now, and
;; no primitives, unless we can figure out how to pull a similar trick

;; The overhead for checking if run-time validation should be used
;; is very small -- about 5% of a very small fn call.  On top of that,
;; actual validation costs what it costs.


;; Clojure has a bug that makes it impossible to extend a protocol and define
;; your own fn in the same namespace [1], so we have to be sneaky about
;; defining fn -- we can't :exclude it above, but we can unmap and then def
;; it at the last minute down here, once we've already done our extending
;; [1] http://dev.clojure.org/jira/browse/CLJ-1195


(defn ^FnSchema fn-schema
  "Produce the schema for a fn.  Since storing metadata on fns currently
   destroys their primitive-ness, and also adds an extra layer of fn call
   overhead, we store the schema on the class when we can (for defns)
   and on metadata otherwise (for fns)."
  [f]
  (macros/assert-iae (fn? f) "Non-function %s" (utils/type-of f))
  (or (utils/class-schema (utils/type-of f))
      (safe-get (meta f) :schema)))

(defn input-schema
  "Convenience method for fns with single arity"
  [f]
  (let [input-schemas (.-input-schemas (fn-schema f))]
    (macros/assert-iae (= 1 (count input-schemas))
                       "Expected single arity fn, got %s" (count input-schemas))
    (first input-schemas)))

(defn output-schema
  "Convenience method for fns with single arity"
  [f]
  (.-output-schema (fn-schema f)))

;; In Clojure, we can keep the defn/defrecord macros in this file
;; In ClojureScript, you have to use from clj schema.macros
#+clj
(do
  (doseq [s ['fn 'defn 'defrecord]] (ns-unmap *ns* s))
  ;; schema.core/defrecord gens
  ;; potemkin records on JVM
  (reset! macros/*use-potemkin* true)
  (potemkin/import-vars
   macros/with-fn-validation
   macros/=>
   macros/=>*
   macros/defrecord
   macros/fn
   macros/defn
   macros/defschema)
  (set! *warn-on-reflection* false))
