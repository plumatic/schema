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
  #+clj
  (:refer-clojure :exclude [defrecord defn])
  (:require
   [clojure.string :as str]
   #+clj potemkin
   #+clj [schema.macros :as macros]
   [schema.utils :as utils])
  #+cljs
  (:require-macros [schema.macros :as macros]))

#+clj (set! *warn-on-reflection* true)

;; TODO: better error messages for fn schema validation

(deftype ValidationError [schema value expectation-delay])

#+clj
(defmethod print-method ValidationError [^ValidationError err writer]
  (print-method (list 'not @(.-expectation-delay err)) writer))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema protocol

(defprotocol Schema
  (check [this x]
    "Validate that x satisfies this schema, returning a ValidationError when
     `x` doesn't satisfy the schema and nil for success.")
  (explain [this]
    "Expand this schema to a human-readable format suitable for pprinting,
     also expanding classes schematas at the leaves"))

#+clj
(defmethod print-method Schema [s writer]
  (print-method (explain s) writer))

;; TODO(JW): some sugar macro for simple validations that just takes an expression and does the
;; check and produces the validation-error automatically somehow.

(clojure.core/defn validate [schema value]
  (when-let [error (check schema value)]
    (utils/error! "Value does not match schema: %s" (pr-str error))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Simple Schemas

;; eq: single required value

(clojure.core/defrecord EqSchema [v]
  Schema
  (check [this x]
         (when-not (= v x)
           (macros/validation-error this x (list '= v (utils/value-name x)))))
  (explain [this] (list 'eq v)))

(clojure.core/defn eq
  "A value that must be = to one element of v."
  [v]
  (EqSchema. v))

;; either: satisfy one of the schemas

(clojure.core/defrecord Either [schemas]
  Schema
  (check [this x]
         (when (every? #(check % x) schemas)
           (macros/validation-error this x
                                    (list 'every? (list 'check '% (utils/value-name x)) 'schemas))))
  (explain [this] (cons 'either (map explain schemas))))

(clojure.core/defn either
  "The disjunction of multiple schemas."
  [& schemas]
  (Either. schemas))


;; both: satisfy all schemas

(clojure.core/defrecord Both [schemas]
  Schema
  (check [this x]
         (when-let [errors (seq (keep #(check % x) schemas))]
           (macros/validation-error this x (cons 'empty? [errors]))))
  (explain [this] (cons 'both (map explain schemas))))

(clojure.core/defn both
  "The intersection of multiple schemas.  Useful, e.g., to combine a special-
   purpose function validator with a normal map schema."
  [& schemas]
  (Both. schemas))


;; maybe: Can be nil, or if not, satisfy schema

(clojure.core/defrecord Maybe [schema]
  Schema
  (check [this x]
         (when-not (nil? x)
           (check schema x)))
  (explain [this] (list 'maybe (explain schema))))

(clojure.core/defn maybe
  "Value can be nil or must satisfy schema"
  [schema]
  (Maybe. schema))

(def ? maybe)


;; enum: Must satisfy one of the passed in elems

(clojure.core/defrecord EnumSchema [vs]
  Schema
  (check [this x]
         (when-not (contains? vs x)
           (macros/validation-error this x (list vs (utils/value-name x)))))
  (explain [this] (cons 'enum vs)))

(clojure.core/defn enum
  "A value that must be = to one element of vs."
  [& vs]
  (EnumSchema. (set vs)))

;; protocol: Must satisfy? protocol to pass schema

(clojure.core/defn safe-get
  "Like get but throw an exception if not found"
  [m k]
  (if-let [pair (find m k)]
    (val pair)
    (utils/error! "Key %s not found in %s" k m)))

;; in cljs, satisfies? is a macro so we must precompile (partial satisfies? p)
;; and put it in metadata of the record so that equality is preserved.
(clojure.core/defrecord Protocol [p]
  Schema
  (check [this x]
         (when-not #+clj (satisfies? p x) #+cljs ((:proto-pred (meta this)) x)
                   (macros/validation-error this x (list 'satisfies? p (utils/value-name x)))))
  (explain [this] (list 'protocol p)))

#+clj
(clojure.core/defn protocol [p]
  (macros/assert-iae (:on p) "Cannot make protocol schema for non-protocol %s" p)
  (Protocol. p))

;; pred: Passed in predicate must be true on object to pass

(clojure.core/defrecord Predicate [p?]
  Schema
  (check [this x]
         (try
           (when-not (p? x)
             (macros/validation-error this x (list p? (utils/value-name x))))
           (catch #+clj Exception #+cljs js/Error e
                  (macros/validation-error this x (list p? (utils/value-name x))))))
  (explain [this]
           (cond (= p? integer?) 'Int
                 (= p? keyword?) 'Keyword
                 :else (list 'pred p?))))

(clojure.core/defn pred [p?]
  (when-not (fn? p?)
    (utils/error! "Not a function: %s" p?))
  (Predicate. p?))


;; named: A schema with just a name field

(clojure.core/defrecord NamedSchema [schema name]
  Schema
  (check [this x] (check schema x))
  (explain [this] (list 'named (explain schema) name)))

(clojure.core/defn named
  "Provide an explicit name for this schema element, useful for seqs."
  [schema name]
  (NamedSchema. schema name))


;; conditional

(clojure.core/defrecord ConditionalSchema [preds-and-schemas]
  Schema
  (check [this x]
         (if-let [[_ match] (first (filter (clojure.core/fn [[pred]] (pred x)) preds-and-schemas))]
           (check match x)
           (macros/validation-error this x (list 'not-any? (list 'matches-pred? (utils/value-name x))
                                                 (map first preds-and-schemas)))))
  (explain [this]
           (cons 'conditional
                 (->> preds-and-schemas
                      (partition 2)
                      (mapcat (fn [pred schema] [pred (explain schema)]))))))

(clojure.core/defn conditional
  "Define a conditional schema.  Takes args like cond,
   (conditional pred1 schema1 pred2 schema2 ...),
   and checks the first schema where pred is true on the value.
   Unlike cond, throws if the value does not match any condition.
   :else may be used as a final condition in the place of (constantly true)."
  [& preds-and-schemas]
  (macros/assert-iae (and (seq preds-and-schemas) (even? (count preds-and-schemas)))
                     "Expected even, nonzero number of args; got %s" (count preds-and-schemas))
  (ConditionalSchema. (for [[pred schema] (partition 2 preds-and-schemas)]
                        [(if (= pred :else) (constantly true) pred) schema])))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Map schemata

(clojure.core/defrecord RequiredKey [k])

(clojure.core/defn required-key
  "A required key in a map"
  [k]
  (RequiredKey. k))

(clojure.core/defn required-key? [ks]
  (or (keyword? ks)
      (instance? RequiredKey ks)))

(clojure.core/defrecord OptionalKey [k])

(clojure.core/defn optional-key
  "An optional key in a map"
  [k]
  (OptionalKey. k))

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
;;; Sequence schemata

;; A sequence schema looks like [one* optional* rest-schema?].
;; one matches a single required element.  Then optional matches a single
;; optional element (with arguments always matching the earliest optional schema).
;; Finally, rest-schema must match any remaining elements.

(clojure.core/defrecord One [schema optional? name])

(clojure.core/defn one
  "A single required element of a sequence (not repeated, the implicit default)"
  ([schema name]
     (One. schema false name)))

(clojure.core/defn optional
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
                          (vec singles) nil (list 'has-enough-elts? (count singles)))))
                 (recur more-singles
                        (rest x)
                        (conj out (check (.-schema first-single) (first x)))))
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

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Set schemas

;; Set schemas should look like the key half of map schemas
;; with the exception that required entires don't really make sense
;; as a result, they can have at most *one* schema for elements
;; which roughly corresponds to the 'more-keys' part of map schemas

(extend-protocol Schema
  #+clj clojure.lang.APersistentSet
  #+cljs cljs.core.PersistentHashSet
  (check [this x]
    (macros/assert-iae (= (count this) 1) "Set schema must have exactly one element")
    (or (when-not (set? x)
          (macros/validation-error this x (list 'set? (utils/value-name x))))
        (when-let [out (seq (keep #(check (first this) %) x))]
          (macros/validation-error this x (set out)))))
  (explain [this] (set [(explain (first this))])))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Record schemata

(clojure.core/defrecord Record [klass schema]
  Schema
  (check [this r]
         (or (when-not (instance? klass r)
               (macros/validation-error this r (list 'instance? klass (utils/value-name r))))
             (check-map schema r)
             (when-let [f (:extra-validator-fn this)]
               (check (pred f) r))))
  (explain [this]
           (list 'record #+clj (symbol (.getName ^Class klass)) #+cljs (symbol (pr-str klass)) (explain schema))))

(clojure.core/defn record
  "A schema for record with class klass and map schema schema"
  [klass schema]
  #+clj (macros/assert-iae (class? klass) "Expected record class, got %s" (utils/type-of klass))
  (macros/assert-iae (map? schema) "Expected map, got %s" (utils/type-of schema))
  (Record. klass schema))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Function schemata

;; These are purely descriptive at this point, and carry no validation.
;; We make the assumption that for sanity, a function can only have a single output schema,
;; over all arities.

(def +infinite-arity+
  #+clj Long/MAX_VALUE
  #+cljs js/Number.MAX_VALUE)

(clojure.core/defrecord FnSchema [output-schema input-schemas] ;; input-schemas sorted by arity
  Schema
  (check [this x] nil) ;; TODO?
  (explain [this]
           (if (> (count input-schemas) 1)
             (list* '=>* (explain output-schema) (map explain input-schemas))
             (list* '=> (explain output-schema) (explain (first input-schemas))))))

(clojure.core/defn arity [input-schema]
  (if (seq input-schema)
    (if (instance? One (last input-schema))
      (count input-schema)
      +infinite-arity+)
    0))

(clojure.core/defn make-fn-schema [output-schema input-schemas]
  (macros/assert-iae (seq input-schemas) "Function must have at least one input schema")
  (macros/assert-iae (every? vector? input-schemas) "Each arity must be a vector.")
  (macros/assert-iae (apply distinct? (map arity input-schemas)) "Arities must be distinct")
  (FnSchema. output-schema (sort-by arity input-schemas)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Shared Schema leaves

(clojure.core/defrecord AnythingSchema [_]
  ;; _ is to work around bug in Clojure where eval-ing defrecord with no fields
  ;; loses type info, which makes this unusable in schema-fn.
  ;; http://dev.clojure.org/jira/browse/CLJ-1196
  Schema
  (check [this x] nil)
  (explain [this] 'Any))

(def Any
  "The (constantly true) of schemas"
  (AnythingSchema. nil))

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
  (pred integer?))

(def Keyword
  "A keyword"
  (pred keyword?))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Platform-specific Schemas

;; On JVM, a Class itself is a schema
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
;;; Schematized functions

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


(clojure.core/defn ^FnSchema fn-schema
  "Produce the schema for a fn.  Since storing metadata on fns currently
   destroys their primitive-ness, and also adds an extra layer of fn call
   overhead, we store the schema on the class when we can (for defns)
   and on metadata otherwise (for fns)."
  [f]
  (macros/assert-iae (fn? f) "Non-function %s" (utils/type-of f))
  (or (utils/class-schema (utils/type-of f))
      (safe-get (meta f) :schema)))

(clojure.core/defn input-schema
  "Convenience method for fns with single arity"
  [f]
  (let [input-schemas (.-input-schemas (fn-schema f))]
    (macros/assert-iae (= 1 (count input-schemas))
                       "Expected single arity fn, got %s" (count input-schemas))
    (first input-schemas)))

(clojure.core/defn output-schema
  "Convenience method for fns with single arity"
  [f]
  (.-output-schema (fn-schema f)))

#+clj
(definterface PSimpleCell
  (get_cell ^boolean [])
  (set_cell [^boolean x]))

#+cljs
(defprotocol PSimpleCell
  (get_cell [this])
  (set_cell [this x]))

;; adds ~5% overhead compared to no check
(deftype SimpleVCell [^:volatile-mutable ^boolean q]
  PSimpleCell
  (get_cell [this] q)
  (set_cell [this x] (set! q x)))

(def ^schema.core.PSimpleCell use-fn-validation
  "Turn on run-time function validation for functions compiled when
   *compile-function-validation* was true -- has no effect for functions compiled
   when it is false."
  (SimpleVCell. false))

#+cljs
(do
  (aset use-fn-validation "get_cell" (partial get_cell use-fn-validation))
  (aset use-fn-validation "set_cell" (partial set_cell use-fn-validation)))


;; In Clojure, we can keep the defn/defrecord macros in this file
;; In ClojureScript, you have to use from clj schema.macros
#+clj
(do
  (ns-unmap *ns* 'fn)
  ;; schema.core/defrecord gens
  ;; potemkin records on JVM
  (reset! macros/*use-potemkin* true)
  (potemkin/import-vars
   macros/with-fn-validation
   macros/=>
   macros/=>*
   macros/defrecord
   macros/fn
   macros/defn)
  (set! *warn-on-reflection* false))
