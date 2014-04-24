(ns schema.core
  "A library for data shape definition and validation. A Schema is just Clojure data,
   which can be used to document and validate Clojure functions and data.

   For example,

   (def FooBar {:foo Keyword :bar [Number]}) ;; a schema

   (check FooBar {:foo :k :bar [1.0 2.0 3.0]})
   ==> nil

   representing successful validation, but the following all return helpful errors
   describing how the provided data fails to measure up to schema FooBar's standards.

   (check FooBar {:bar [1.0 2.0 3.0]})
   ==> {:foo missing-required-key}

   (check FooBar {:foo 1 :bar [1.0 2.0 3.0]})
   ==> {:foo (not (keyword? 1))}

   (check FooBar {:foo :k :bar [1.0 2.0 3.0] :baz 1})
   ==> {:baz disallowed-key}

   Schema lets you describe your leaf values using the Any, Keyword, Number, String,
   and Int definitions below, or (in Clojure) you can use arbitrary Java classes or
   primitive casts to describe simple values.

   From there, you can build up schemas for complex types using Clojure syntax
   (map literals for maps, set literals for sets, vector literals for sequences,
   with details described below), plus helpers below that provide optional values,
   enumerations, arbitrary predicates, and more.

   Schema also provides macros (defined in schema.macros, and imported into this ns
   in Clojure) for defining records with schematized elements (sm/defrecord), and
   named or anonymous functions (sm/fn and sm/defn) with schematized inputs and
   return values.  In addition to producing better-documented records and functions,
   these macros allow you to retrieve the schema associated with the defined record
   or function.  Moreover, functions include optional *validation*, which will throw
   an error if the inputs or outputs do not match the provided schemas:

   (sm/defrecord FooBar
    [foo :- Int
     bar :- String])

   (sm/defn quux :- Int
    [foobar :- Foobar
     mogrifier :- Number]
    (* mogrifier (+ (:foo foobar) (Long/parseLong (:bar foobar)))))

   (quux (FooBar. 10 \"5\") 2)
   ==> 30

   (fn-schema quux)
   ==> (=> Int (record user.FooBar {:foo Int, :bar java.lang.String}) java.lang.Number)

   (sm/with-fn-validation (quux (FooBar. 10.2 \"5\") 2))
   ==> Input to quux does not match schema: [(named {:foo (not (integer? 10.2))} foobar) nil]

   As you can see, the preferred syntax for providing type hints to schema's defrecord,
   fn, and defn macros is to follow each element, argument, or function name with a
   :- schema.  Symbols without schemas default to a schema of Any.  In Clojure,
   class (e.g., clojure.lang.String) and primitive schemas (long, double) are also
   propagated to tag metadata to ensure you get the type hinting and primitive
   behavior you ask for.

   If you don't like this style, standard Clojure-style typehints are also supported:

   (fn-schema (sm/fn [^String x]))
   ==> (=> Any java.lang.String)

   You can directly type hint a symbol as a class, primitive, protocol, or simple
   schema.  For complex schemas, due to Clojure's rules about ^, you must enclose
   the schema in a {:s schema} map like so:

   (fn-schema (sm/fn [^{:s [String]} x]))
   (=> Any [java.lang.String])

   (We highly prefer the :- syntax to this abomination, however.)  See the docstrings
   of defrecord, fn, and defn in schema.macros for more details about how to use
   these macros."
  (:refer-clojure :exclude [Keyword])
  (:require
   [clojure.string :as str]
   #+clj potemkin
   #+clj [schema.macros :as macros]
   [schema.utils :as utils])
  #+cljs (:require-macros [schema.macros :as macros]))

#+clj (set! *warn-on-reflection* true)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema protocol

(defprotocol Schema
  (walker [this]
    "Produce a function that takes [data], and either returns a walked version of data
     (by default, usually just data), or a utils/ErrorContainer containing value that looks
     like the 'bad' parts of data with ValidationErrors at the leaves describing the failures.

     If this is a composite schema, should let-bind (subschema-walker sub-schema) for each
     subschema outside the returned fn.  Within the returned fn, should break down data
     into constituents, call the let-bound subschema walkers on each component, and then
     reassemble the components into a walked version of the data (or an ErrorContainer
     describing the validaiton failures).

     Attempting to walk a value that already contains a utils/ErrorContainer produces undefined
     behavior.

     User code should never call `walker` directly.  Instead, it should call `start-walker`
     below.")
  (explain [this]
    "Expand this schema to a human-readable format suitable for pprinting,
     also expanding class schematas at the leaves.  Example:

     user> (s/explain {:a s/Keyword :b [s/Int]} )
     {:a Keyword, :b [Int]}"))

;; Schemas print as their explains
#+clj
(do (defmethod print-method schema.core.Schema [s writer]
      (print-method (explain s) writer))
    (prefer-method print-method schema.core.Schema clojure.lang.IRecord)
    (prefer-method print-method schema.core.Schema java.util.Map)
    (prefer-method print-method schema.core.Schema clojure.lang.IPersistentMap))

(def ^:dynamic subschema-walker
  "The function to call within 'walker' implementations to create walkers for subschemas.
   Can be dynamically bound (using start-walker below) to create different walking behaviors.

   For the curious, implemented using dynamic binding rather than making walker take a
   subschema-walker as an argument because some behaviors (e.g. recursive schema walkers)
   seem to require mind-bending things like fixed-point combinators that way, but are
   simple this way."
  (fn [s]
    (macros/error!
     (str "Walking is unsupported outside of start-walker; "
          "all composite schemas must eagerly bind subschema-walkers "
          "outside the returned walker."))))

(defn start-walker
  "The entry point for creating walkers.  Binds the provided walker to subschema-walker,
   then calls it on the provided schema.  For simple validation, pass walker as sub-walker.
   More sophisticated behavior (coercion, etc), can be achieved by passing a sub-walker
   that wraps walker with additional behavior."
  [sub-walker schema]
  (binding [subschema-walker sub-walker]
    (subschema-walker schema)))

(defn checker
  "Compile an efficient checker for schema, which returns nil for valid values and
   error descriptions otherwise."
  [schema]
  (comp utils/error-val (start-walker walker schema)))

(defn check
  "Return nil if x matches schema; otherwise, returns a value that looks like the
   'bad' parts of x with ValidationErrors at the leaves describing the failures."
  [schema x]
  ((checker schema) x))

(defn validate
  "Throw an exception if value does not satisfy schema; otherwise, return value."
  [schema value]
  (when-let [error (check schema value)]
    (macros/error! (utils/format* "Value does not match schema: %s" (pr-str error))
                   {:schema schema :value value :error error}))
  value)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Platform-specific leaf Schemas

;; On the JVM, a Class itself is a schema. In JS, we treat functions as prototypes so any
;; function prototype checks objects for compatibility.

(extend-protocol Schema
  #+clj Class
  #+cljs js/Function
  (walker [this]
    (let [class-walker (if-let [more-schema (utils/class-schema this)]
                         ;; do extra validation for records and such
                         (subschema-walker more-schema)
                         identity)]
      (fn [x]
        (or (when #+clj (not (instance? this x))
                  #+cljs (or (nil? x)
                             (not (or (identical? this (.-constructor x))
                                      (js* "~{} instanceof ~{}" x this))))
                  (macros/validation-error this x (list 'instance? this (utils/value-name x))))
            (class-walker x)))))
  (explain [this]
    (if-let [more-schema (utils/class-schema this)]
      (explain more-schema)
      #+clj (symbol (.getName ^Class this)) #+cljs this)))


;; On the JVM, the primitive coercion functions (double, long, etc)
;; alias to the corresponding boxed number classes

#+clj
(do
  (defmacro extend-primitive [cast-sym class-sym]
    `(extend-protocol Schema
       ~cast-sym
       (walker [this#]
         (subschema-walker ~class-sym))
       (explain [this#]
         (explain ~class-sym))))

  (extend-primitive clojure.core$double Double)
  (extend-primitive clojure.core$float Float)
  (extend-primitive clojure.core$long Long)
  (extend-primitive clojure.core$int Integer)
  (extend-primitive clojure.core$short Short)
  (extend-primitive clojure.core$char Character)
  (extend-primitive clojure.core$byte Byte)
  (extend-primitive clojure.core$boolean Boolean)

  (extend-primitive clojure.core$doubles (Class/forName "[D"))
  (extend-primitive clojure.core$floats (Class/forName "[F"))
  (extend-primitive clojure.core$longs (Class/forName "[J"))
  (extend-primitive clojure.core$ints (Class/forName "[I"))
  (extend-primitive clojure.core$shorts (Class/forName "[S"))
  (extend-primitive clojure.core$chars (Class/forName "[C"))
  (extend-primitive clojure.core$bytes (Class/forName "[B"))
  (extend-primitive clojure.core$booleans (Class/forName "[Z")))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Cross-platform Schema leaves

;;; Any matches anything (including nil)

(defrecord AnythingSchema [_]
  ;; _ is to work around bug in Clojure where eval-ing defrecord with no fields
  ;; loses type info, which makes this unusable in schema-fn.
  ;; http://dev.clojure.org/jira/browse/CLJ-1093
  Schema
  (walker [this] identity)
  (explain [this] 'Any))

(def Any
  "Any value, including nil."
  (AnythingSchema. nil))

;;; eq (to a single allowed value)

(defrecord EqSchema [v]
  Schema
  (walker [this]
    (fn [x]
      (if (= v x)
        x
        (macros/validation-error this x (list '= v (utils/value-name x))))))
  (explain [this] (list 'eq v)))

(defn eq
  "A value that must be (= v)."
  [v]
  (EqSchema. v))


;;; enum (in a set of allowed values)

(defrecord EnumSchema [vs]
  Schema
  (walker [this]
    (fn [x]
      (if (contains? vs x)
        x
        (macros/validation-error this x (list vs (utils/value-name x))))))
  (explain [this] (cons 'enum vs)))

(defn enum
  "A value that must be = to some element of vs."
  [& vs]
  (EnumSchema. (set vs)))


;;; pred (matches all values for which p? returns truthy)

(defrecord Predicate [p? pred-name]
  Schema
  (walker [this]
    (fn [x]
      (if-let [reason (macros/try-catchall (when-not (p? x) 'not) (catch e 'throws?))]
        (macros/validation-error this x (list pred-name (utils/value-name x)) reason)
        x)))
  (explain [this]
    (cond (= p? integer?) 'Int
          (= p? keyword?) 'Keyword
          :else (list 'pred pred-name))))

(defn pred
  "A value for which p? returns true (and does not throw).
   Optional pred-name can be passed for nicer validation errors."
  ([p?] (pred p? p?))
  ([p? pred-name]
     (when-not (ifn? p?)
       (macros/error! (utils/format* "Not a function: %s" p?)))
     (Predicate. p? pred-name)))


;;; protocol (which value must `satisfies?`)

(defn protocol-name [protocol]
  #+clj (-> protocol :p :var meta :name)
  #+cljs (-> protocol meta :proto-sym))

;; In cljs, satisfies? is a macro so we must precompile (partial satisfies? p)
;; and put it in metadata of the record so that equality is preserved, along with the name.
(defrecord Protocol [p]
  Schema
  (walker [this]
    (fn [x]
      (if #+clj (satisfies? p x) #+cljs ((:proto-pred (meta this)) x)
          x
          (macros/validation-error this x (list 'satisfies? (protocol-name this) (utils/value-name x))))))
  (explain [this] (list 'protocol (protocol-name this))))

#+clj ;; The cljs version is macros/protocol by necessity, since cljs `satisfies?` is a macro.
(defn protocol
  "A value that must satsify? protocol p"
  [p]
  (macros/assert! (:on p) "Cannot make protocol schema for non-protocol %s" p)
  (Protocol. p))


;;; regex (validates matching Strings)

(extend-protocol Schema
  #+clj java.util.regex.Pattern
  #+cljs js/RegExp
  (walker [this]
    (fn [x]
      (cond (not (string? x))
            (macros/validation-error this x (list 'string? (utils/value-name x)))

            (not (re-find this x))
            (macros/validation-error this x (list 're-find
                                                  (explain this)
                                                  (utils/value-name x)))

            :else x)))
  (explain [this]
    #+clj (symbol (str "#\"" this "\""))
    #+cljs (symbol (str "#\"" (.slice (str this) 1 -1) "\""))))


;;; Cross-platform Schemas for atomic value types

(def Str
  "Satisfied only by String.
   Is (pred string?) and not js/String in cljs because of keywords."
  #+clj java.lang.String #+cljs (pred string?))

(def Bool
  "Boolean true or false"
  #+clj java.lang.Boolean #+cljs js/Boolean)

(def Num
  "Any number"
  #+clj java.lang.Number #+cljs js/Number)

(def Int
  "Any integral number"
  (pred integer? 'integer?))

(def Keyword
  "A keyword"
  (pred keyword? 'keyword?))

(def Regex
  "A regular expression"
  #+clj java.util.regex.Pattern #+cljs js/RegExp)

(def Inst
  "The local representation of #inst ..."
  #+clj java.util.Date #+cljs js/Date)

(def Uuid
  "The local representation of #uuid ..."
  #+clj java.util.UUID #+cljs cljs.core/UUID)



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Simple composite Schemas

;;; maybe (nil)

(defrecord Maybe [schema]
  Schema
  (walker [this]
    (let [sub-walker (subschema-walker schema)]
      (fn [x]
        (when-not (nil? x)
          (sub-walker x)))))
  (explain [this] (list 'maybe (explain schema))))

(defn maybe
  "A value that must either be nil or satisfy schema"
  [schema]
  (Maybe. schema))


;;; named (schema elements)

(defrecord NamedSchema [schema name]
  Schema
  (walker [this]
    (let [sub-walker (subschema-walker schema)]
      (fn [x] (utils/wrap-error-name name (sub-walker x)))))
  (explain [this] (list 'named (explain schema) name)))

(defn named
  "A value that must satisfy schema, and has a name for documentation purposes."
  [schema name]
  (NamedSchema. schema name))


;;; either (satisfies this schema or that one)

(defrecord Either [schemas]
  Schema
  (walker [this]
    (let [sub-walkers (mapv subschema-walker schemas)]
      (fn [x]
        (loop [sub-walkers (seq sub-walkers)]
          (if-not sub-walkers
            (macros/validation-error
             this x
             (list 'some (list 'check '% (utils/value-name x)) 'schemas))
            (let [res ((first sub-walkers) x)]
              (if-not (utils/error? res)
                res
                (recur (next sub-walkers)))))))))
  (explain [this] (cons 'either (map explain schemas))))

(defn either
  "A value that must satisfy at least one schema in schemas."
  [& schemas]
  (Either. schemas))


;;; both (satisfies this schema and that one)

(defrecord Both [schemas]
  Schema
  (walker [this]
    (let [sub-walkers (mapv subschema-walker schemas)]
      ;; Both doesn't really have a clean semantics for non-identity walks, but we can
      ;; do something pretty reasonable and assume we walk in order passing the result
      ;; of each walk to the next, and failing at the first error
      (fn [x]
        (reduce
         (fn [x sub-walker]
           (if (utils/error? x)
             x
             (sub-walker x)))
         x
         sub-walkers))))
  (explain [this] (cons 'both (map explain schemas))))

(defn both
  "A value that must satisfy every schema in schemas."
  [& schemas]
  (Both. schemas))


;;; conditional (choice of schema, based on predicates on the value)

(defrecord ConditionalSchema [preds-and-schemas]
  Schema
  (walker [this]
    (let [preds-and-walkers (mapv (fn [[pred schema]] [pred (subschema-walker schema)])
                                  preds-and-schemas)]
      (fn [x]
        (if-let [[_ match] (first (filter (fn [[pred]] (pred x)) preds-and-walkers))]
          (match x)
          (macros/validation-error this x (list 'matches-some-condition? (utils/value-name x)))))))
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
  (macros/assert! (and (seq preds-and-schemas) (even? (count preds-and-schemas)))
                  "Expected even, nonzero number of args; got %s" (count preds-and-schemas))
  (ConditionalSchema. (for [[pred schema] (partition 2 preds-and-schemas)]
                        [(if (= pred :else) (constantly true) pred) schema])))

(clojure.core/defn if
  "if the predicate returns truthy, use the if-schema, otherwise use the else-schema"
  [pred if-schema else-schema]
  (conditional pred if-schema (constantly true) else-schema))


;;; Recursive schemas (Clojure only)
;; Supports recursively defined schemas by using the level of indirection offered by by
;; Clojure (but not ClojureScript) vars.

#+clj
(do
  (defn var-name [v]
    (let [{:keys [ns name]} (meta v)]
      (symbol (str (ns-name ns) "/" name))))

  (defrecord Recursive [schema-var]
    Schema
    (walker [this]
      (let [a (atom nil)]
        (reset! a (start-walker
                   (let [old subschema-walker]
                     (fn [s] (if (= s this) #(@a %) (old s))))
                   @schema-var))))
    (explain [this]
      (list 'recursive (list 'var (var-name schema-var)))))

  (defn recursive
    "Support for (mutually) recursive schemas by passing a var that points to a schema,
       e.g (recursive #'ExampleRecursiveSchema)."
    [schema-var]
    (when-not (var? schema-var)
      (macros/error! (utils/format* "Not a var: %s" schema-var)))
    (Recursive. schema-var)))

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


;;; Definitions for required and optional keys, and single entry validators

(def +missing+
  "A sentinel value representing missing portions of the input data."
  ::missing)

(defrecord RequiredKey [k])

(defn required-key
  "A required key in a map"
  [k]
  (if (keyword? k)
    k
    (RequiredKey. k)))

(defn required-key? [ks]
  (or (keyword? ks)
      (instance? RequiredKey ks)))

(defrecord OptionalKey [k])

(defn optional-key
  "An optional key in a map"
  [k]
  (OptionalKey. k))

(defn optional-key? [ks]
  (instance? OptionalKey ks))


(defn explicit-schema-key [ks]
  (cond (keyword? ks) ks
        (instance? RequiredKey ks) (.-k ^RequiredKey ks)
        (optional-key? ks) (.-k ^OptionalKey ks)
        :else (macros/error! (utils/format* "Bad explicit key: %s" ks))))

(defn specific-key? [ks]
  (or (required-key? ks)
      (optional-key? ks)))

(defn- explain-kspec [kspec]
  (if (specific-key? kspec)
    (if (keyword? kspec)
      kspec
      (list (cond (required-key? kspec) 'required-key
                  (optional-key? kspec) 'optional-key)
            (explicit-schema-key kspec)))
    (explain kspec)))

;; A schema for a single map entry.  kspec is either a keyword, required or optional key,
;; or key schema.  val-schema is a value schema.
(defrecord MapEntry [kspec val-schema]
  Schema
  (walker [this]
    (let [val-walker (subschema-walker val-schema)]
      (if (specific-key? kspec)
        (let [optional? (optional-key? kspec)
              k (explicit-schema-key kspec)]
          (fn [x]
            (cond (identical? +missing+ x)
                  (when-not optional?
                    (utils/error [k 'missing-required-key]))

                  (not (= 2 (count x)))
                  (macros/validation-error this x (list = 2 (list 'count (utils/value-name x))))

                  :else
                  (let [[xk xv] x]
                    (assert (= xk k))
                    (let [vres (val-walker xv)]
                      (if-let [ve (utils/error-val vres)]
                        (utils/error [xk ve])
                        [xk vres]))))))
        (let [key-walker (subschema-walker kspec)]
          (fn [x]
            (if-not (= 2 (count x))
              (macros/validation-error this x (list = 2 (list 'count (utils/value-name x))))
              (let [out-k (key-walker (key x))
                    out-ke (utils/error-val out-k)
                    out-v (val-walker (val x))
                    out-ve (utils/error-val out-v)]
                (if (or out-ke out-ve)
                  (utils/error [(or out-ke (key x)) (or out-ve 'invalid-key)])
                  [out-k out-v]))))))))
  (explain [this]
    (list
     'map-entry
     (explain-kspec kspec)
     (explain val-schema))))

(defn map-entry [kspec val-schema]
  (MapEntry. kspec val-schema))


;;; Implementation helper functions

(defn- find-extra-keys-schema [map-schema]
  (let [key-schemata (remove specific-key? (keys map-schema))]
    (macros/assert! (< (count key-schemata) 2)
                    "More than one non-optional/required key schemata: %s"
                    (vec key-schemata))
    (first key-schemata)))

(defn- map-walker [map-schema]
  (let [extra-keys-schema (find-extra-keys-schema map-schema)
        extra-walker (when extra-keys-schema
                       (subschema-walker (apply map-entry (find map-schema extra-keys-schema))))
        explicit-schema (dissoc map-schema extra-keys-schema)
        explicit-walkers (into {} (for [[k v] explicit-schema]
                                    [(explicit-schema-key k)
                                     (subschema-walker (map-entry k v))]))
        err-conj (utils/result-builder (constantly {}))]
    (when-not (= (count explicit-schema) (count explicit-walkers))
      (macros/error! (utils/format* "Schema has multiple variants of the same explicit key: %s"
                                    (->> (keys explicit-schema)
                                         (group-by explicit-schema-key)
                                         vals
                                         (filter #(> (count %) 1))
                                         (apply concat)
                                         (mapv explain-kspec)))))
    (fn [x]
      (if-not (map? x)
        (macros/validation-error map-schema x (list 'map? (utils/value-name x)))
        (loop [x x explicit-walkers (seq explicit-walkers) out {}]
          (if-not explicit-walkers
            (reduce
             (if extra-walker
               (fn [out e]
                 (err-conj out (extra-walker e)))
               (fn [out [k _]]
                 (err-conj out (utils/error [k 'disallowed-key]))))
             out
             x)
            (let [[wk wv] (first explicit-walkers)]
              (recur (dissoc x wk)
                     (next explicit-walkers)
                     (err-conj out (wv (or (find x wk) +missing+)))))))))))

(defn- map-explain [this]
  (into {} (for [[k v] this] (vec (next (explain (map-entry k v)))))))

(extend-protocol Schema
  #+clj clojure.lang.APersistentMap
  #+cljs cljs.core.PersistentArrayMap
  (walker [this] (map-walker this))
  (explain [this] (map-explain this))
  #+cljs cljs.core.PersistentHashMap
  #+cljs (walker [this] (map-walker this))
  #+cljs (explain [this] (map-explain this)))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Set schemas

;; A set schema is a Clojure set with a single element, a schema that all values must satisfy

(extend-protocol Schema
  #+clj clojure.lang.APersistentSet
  #+cljs cljs.core.PersistentHashSet
  (walker [this]
    (macros/assert! (= (count this) 1) "Set schema must have exactly one element")
    (let [sub-walker (subschema-walker (first this))]
      (fn [x]
        (or (when-not (set? x)
              (macros/validation-error this x (list 'set? (utils/value-name x))))
            (let [[good bad] ((juxt remove keep) utils/error-val (map sub-walker x))]
              (if (seq bad)
                (utils/error (set bad))
                (set good)))))))
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
    (macros/assert!
     (and (<= (count more) 1) (every? #(not (instance? One %)) more))
     "Sequence schema %s does not match [one* optional* rest-schema?]" s)
    [(concat required optional) (first more)]))

(extend-protocol Schema
  #+clj clojure.lang.APersistentVector
  #+cljs cljs.core.PersistentVector
  (walker [this]
    (let [[singles multi] (parse-sequence-schema this)
          single-walkers (vec (for [^One s singles]
                                [s (subschema-walker (.-schema s))]))
          multi-walker (when multi (subschema-walker multi))
          err-conj (utils/result-builder (fn [m] (vec (repeat (count m) nil))))]
      (fn [x]
        (or (when-not (or (nil? x) (sequential? x))
              (macros/validation-error this x (list 'sequential? (utils/value-name x))))
            (loop [single-walkers single-walkers x x out []]
              (if-let [[^One first-single single-walker] (first single-walkers)]
                (if (empty? x)
                  (if (.-optional? first-single)
                    out
                    (err-conj out
                              (macros/validation-error
                               (vec (map first single-walkers))
                               nil
                               (list* 'present?
                                      (for [[^One single] single-walkers
                                            :while (not (.-optional? single))]
                                        (.-name single))))))
                  (recur (next single-walkers)
                         (rest x)
                         (err-conj out
                                   (utils/wrap-error-name
                                    (.-name first-single)
                                    (single-walker (first x))))))
                (cond multi
                      (reduce err-conj out (map multi-walker x))

                      (seq x)
                      (err-conj out (macros/validation-error nil x (list 'has-extra-elts? (count x))))
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
  (walker [this]
    (let [map-checker (subschema-walker schema)
          pred-checker (when-let [evf (:extra-validator-fn this)]
                         (subschema-walker (pred evf)))]
      (fn [r]
        (or (when-not (instance? klass r)
              (macros/validation-error this r (list 'instance? klass (utils/value-name r))))
            (let [res (map-checker r)]
              (if (utils/error? res)
                res
                (let [pred-res (when pred-checker (pred-checker r))]
                  (if (utils/error? pred-res)
                    pred-res
                    (merge r res)))))))))
  (explain [this]
    (list 'record #+clj (symbol (.getName ^Class klass)) #+cljs (symbol (pr-str klass)) (explain schema))))

(defn record
  "A Record instance of type klass, whose elements match map schema 'schema'."
  [klass schema]
  #+clj (macros/assert! (class? klass) "Expected record class, got %s" (utils/type-of klass))
  (macros/assert! (map? schema) "Expected map, got %s" (utils/type-of schema))
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
  (walker [this]
    (fn [x]
      (if (fn? x)
        x
        (macros/validation-error this x (list 'fn? (utils/value-name x))))))
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
  (macros/assert! (seq input-schemas) "Function must have at least one input schema")
  (macros/assert! (every? vector? input-schemas) "Each arity must be a vector.")
  (macros/assert! (apply distinct? (map arity input-schemas)) "Arities must be distinct")
  (FnSchema. output-schema (sort-by arity input-schemas)))


;; => and =>* are convenience macros for making function schemas.
;; Clojurescript users must use them from schema.macros, but Clojure users can get them here.
#+clj (potemkin/import-vars macros/=> macros/=>*)


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized defrecord and (de,let)fn macros

;; In Clojure, we can suck the defrecord/fn/defn/let macros into this namespace
;; In ClojureScript, you have to use them from clj schema.macros
#+clj
(do
  (doseq [s ['fn 'defn 'letfn 'defrecord]] (ns-unmap *ns* s))
  (potemkin/import-vars
   macros/defrecord
   macros/fn
   macros/defn
   macros/letfn
   macros/with-fn-validation)
  (reset! macros/*use-potemkin* true) ;; Use potemkin for s/defrecord by default.
  (set! *warn-on-reflection* false))

(defn fn-validation?
  "Get the current global schema validation setting."
  []
  (.get_cell utils/use-fn-validation))

(defn set-fn-validation!
  "Globally turn on schema validation for all s/fn and s/defn instances."
  [on?]
  (.set_cell utils/use-fn-validation on?))

(clojure.core/defn schematize-fn
  "Attach the schema to fn f at runtime, extractable by fn-schema."
  [f schema]
  (vary-meta f assoc :schema schema))

(clojure.core/defn ^FnSchema fn-schema
  "Produce the schema for a function defined with s/fn or s/defn."
  [f]
  (macros/assert! (fn? f) "Non-function %s" (utils/type-of f))
  (or (utils/class-schema (utils/fn-schema-bearer f))
      (macros/safe-get (meta f) :schema)))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Helpers for defining schemas (used in in-progress work, explanation coming soon)

(clojure.core/defn schema-with-name [schema name]
  "Records name in schema's metadata."
  (with-meta schema {:name name}))

(clojure.core/defn schema-name [schema]
  "Returns the name of a schema attached via schema-with-name (or defschema)."
  (-> schema meta :name))

#+clj (potemkin/import-vars macros/defschema)
