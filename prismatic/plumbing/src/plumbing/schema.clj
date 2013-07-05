(ns plumbing.schema
  "A library for data structure schema definition and validation.

   For example,

   (validate {:foo long :bar [double]} {:foo 1 :bar [1.0 2.0 3.0]})

   returns true but

   (validate {:foo long :bar [double]} {:bar [1.0 2.0 3.0]})

   (validate {:foo long :bar [double]} {:foo \"1\" :bar [1.0 2.0 3.0]})

   (validate {:foo long :bar [double]} {:foo 1 :bar [1.0 2.0 3.0] :baz 1})

   all throw exceptions.

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
   and ^AProtocol where AProtocol is a protocol (for realz),
   but these hints are not backwards compatible with ordinary
   defrecord/ defn/etc."

  (:refer-clojure :exclude [defrecord defn])
  (:use plumbing.core)
  (:require
   [clojure.data :as data]
   [clojure.string :as str]
   potemkin))

(set! *warn-on-reflection* true)

;; TODO: #{} notation for sets #{schema} and maybe vec?
;; TODO: schemas for names in namespace?

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema protocol

(defmacro assert-iae
  "Like assert, but throws an IllegalArgumentException not an Error (and also takes args to format)"
  [form & format-args]
  `(when-not ~form (throw (IllegalArgumentException. (format ~@format-args)))))

(defn- context-str
  "Produce a human-readable representation of the current validation context"
  [context]
  (str/join
   ","
   (for [c context]
     (let [c (if (fn? c) (c) c) ;; allow laziness
           s (pr-str c)]
       (if (< (count s) 20)
         s
         (subs s 0 20))))))

(clojure.core/defn check-throw
  "Throw an exception for a failed validation.  Public only so check
   can be called from other namespaces, due to macroexpansion rules."
  [context & format-args]
  (throw (ex-info
          (str (when (seq context)
                 (format "In context %s: " (context-str context)))
               (apply format format-args))
          {:type ::schema-mismatch})))

(defmacro check
  "Check that condition is true; if not (or it thows an exception), throw an
   exception describing the failure (via format-args) as well as the current
   validation context."
  [condition context & format-args]
  `(try (when-not ~condition
          (check-throw ~context ~@format-args))
        (catch Throwable t#
          (if (= (:type (ex-data t#)) ::schema-mismatch)
            (throw t#)
            (check-throw ~context "Condition %s threw exception %s" '~condition t#)))))

(defprotocol Schema
  (validate* [this x context]
    "Validate that x satisfies this schema by calling 'check'.  Context is a vec
     of the path to x from the root object being validated, used to present
     useful error messages.")
  (explain [this]
    "Expand this schema to a human-readable format suitable for pprinting,
     also expanding classes schematas at the leaves"))

(clojure.core/defn validate [this x]
  (validate* this x []))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Leaf values

;; TODO(jw): unfortunately (java.util.Collections/synchronizedMap (java.util.WeakHashMap.))
;; is too slow in practice, so for now we leak classes.  Figure out a concurrent, fast,
;; weak alternative.
(def ^java.util.Map +class-schemata+
  (java.util.concurrent.ConcurrentHashMap.))

;; Can we do this in a way that respects hierarchy?
;; can do it with defmethods,
(clojure.core/defn declare-class-schema!
  "Globally set the schema for a class (above and beyond a simple instance? check).
   Use with care, i.e., only on classes that you control.  Also note that this
   schema only applies to instances of the concrete type passed, i.e.,
   (= (class x) klass), not (instance? klass x)."
  [klass schema]
  (assert-iae (class? klass) "Cannot declare class schema for non-class %s" (class klass))
  (.put +class-schemata+ klass schema))

(clojure.core/defn class-schema
  "The last schema for a class set by declare-class-schema!, or nil."
  [klass]
  (.get +class-schemata+ klass))

(extend-protocol Schema
  Class
  (validate* [this x c]
    (check (instance? this x) c "Wanted instance of %s, got %s" this (class x))
    (when-let [more-schema (class-schema this)]
      (validate* more-schema x c)))
  (explain [this]
    (if-let [more-schema (class-schema this)]
      (explain more-schema)
      (symbol (.getName ^Class this))))

  String
  (validate* [this x c]
    (check (= this (.getName (class x))) c "Wanted instance of %s, got %s" this (class x)))
  (explain [this] this)

  ;; prevent coersion, so you have to be exactly the given type.
  clojure.core$float
  (validate* [this x c]
    (check (instance? Float x) c "Wanted float, got %s" (class x)))
  (explain [this] 'float)

  clojure.core$double
  (validate* [this x c]
    (check (instance? Double x) c "Wanted double, got %s" (class x)))
  (explain [this] 'double)

  clojure.core$boolean
  (validate* [this x c]
    (check (instance? Boolean x) c "Wanted boolean, got %s" (class x)))
  (explain [this] 'boolean)

  clojure.core$byte
  (validate* [this x c]
    (check (instance? Byte x) c "Wanted byte, got %s" (class x)))
  (explain [this] 'byte)

  clojure.core$char
  (validate* [this x c]
    (check (instance? Character x) c "Wanted char, got %s" (class x)))
  (explain [this] 'char)

  clojure.core$short
  (validate* [this x c]
    (check (instance? Short x) c "Wanted short, got %s" (class x)))
  (explain [this] 'short)

  clojure.core$int
  (validate* [this x c]
    (check (instance? Integer x) c "Wanted int, got %s" (class x)))
  (explain [this] 'int)

  clojure.core$long
  (validate* [this x c]
    (check (instance? Long x) c "Wanted long, got %s" (class x)))
  (explain [this] 'long)

  clojure.lang.AFn
  (validate* [this x c]
    (check (this x) c "Value did not satisfy %s" this))
  (explain [this] this))


(clojure.core/defrecord EqSchema [v]
  Schema
  (validate* [this x c]
             (check (= v x) c "Got unexpected item"))
  (explain [this] (cons '= v)))

(clojure.core/defn eq
  "A value that must be = to one element of v."
  [v]
  (EqSchema. v))

;; enum

(clojure.core/defrecord EnumSchema [vs]
  Schema
  (validate* [this x c]
             (check (contains? vs x) c "Got an invalid enum element"))
  (explain [this] (cons 'enum vs)))

(clojure.core/defn enum
  "A value that must be = to one element of vs."
  [& vs]
  (EnumSchema. (set vs)))

;; protocol

(clojure.core/defrecord Protocol [p]
  Schema
  (validate* [this x c]
             (check (satisfies? p x) c "Element does not satisfy protocol %s" (safe-get p :var)))
  (explain [this] (cons 'protocol (safe-get p :var))))

(clojure.core/defn protocol [p]
  (assert-iae (:on p) "Cannot make protocol schema for non-protocol %s" p)
  (Protocol. p))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Simple helpers / wrappers

;; anything

;; _ is to work around bug in Clojure where eval-ing defrecord with no fields
;; loses type info, which makes this unusable in schema-fn.
;; http://dev.clojure.org/jira/browse/CLJ-1196
(clojure.core/defrecord Anything [_]
  Schema
  (validate* [this x c])
  (explain [this] 'anything))

(def +anything+ (Anything. nil))
(def Top "in case you like type theory" +anything+)

;; either

(clojure.core/defrecord Either [schemas]
  Schema
  (validate* [this x c]
             (let [fails (map #(try (validate* % x c) nil (catch Exception e e)) schemas)]
               (check (some not fails) c "Did not match any schema: %s" (vec fails))))
  (explain [this] (cons 'either (map explain schemas))))

(clojure.core/defn either
  "The disjunction of multiple schemas."
  [& schemas]
  (Either. schemas))

;; both

(clojure.core/defrecord Both [schemas]
  Schema
  (validate* [this x c]
             (doseq [schema schemas]
               (validate* schema x c)))
  (explain [this] (cons 'both (map explain schemas))))

(clojure.core/defn both
  "The intersection of multiple schemas.  Useful, e.g., to combine a special-
   purpose function validator with a normal map schema."
  [& schemas]
  (Both. schemas))

;; maybe

(clojure.core/defrecord Maybe [schema]
  Schema
  (validate* [this x c]
             (when-not (nil? x)
               (validate* schema x c)))
  (explain [this] (list 'maybe (explain schema))))

(clojure.core/defn maybe
  "Value can be nil or must satisfy schema"
  [schema]
  (Maybe. schema))

(def ? maybe)

;; named

(clojure.core/defrecord NamedSchema [name schema]
  Schema
  (validate* [this x c]
             (validate* schema x (conj c #(format "<%s>" name))))
  (explain [this] (list 'named name (explain schema))))

(clojure.core/defn named
  "Provide an explicit name for this schema element, useful for seqs."
  [schema name]
  (NamedSchema. name schema))

;; subtyped

(clojure.core/defrecord UnionSchema [extract-tag type-schemata]
  Schema
  (validate* [this x c]
             (let [tag (extract-tag x)]
               (check (contains? type-schemata tag) c "Unknown union tag: %s" tag)
               (validate* (type-schemata tag) x c)))
  (explain [this] (list 'union extract-tag (map-vals explain type-schemata))))

(clojure.core/defn union
  "Define a schema for a union type.
   extract-tag extracts the tag, and type-schemata is a map from tags to schemas."
  [extract-tag type-schemata]
  (UnionSchema. extract-tag type-schemata))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Map schemata

(clojure.core/defrecord RequiredKey [k])

(clojure.core/defn required-key
  "A required key in a map"
  [k]
  (RequiredKey. k))

(clojure.core/defn required-key? [ks]
  (or (keyword? ks)
      (instance? RequiredKey ks)))

(defn- required-key-value [ks]
  (cond (keyword? ks) ks
        (instance? RequiredKey ks) (.k ^RequiredKey ks)
        :else (throw (RuntimeException. (format "Bad required key: %s" ks)))))

(clojure.core/defrecord OptionalKey [k])

(clojure.core/defn optional-key
  "An optional key in a map"
  [k]
  (OptionalKey. k))

(defn- specific-key? [ks]
  (or (required-key? ks)
      (instance? OptionalKey ks)))

(defn- find-more-keys [ks]
  (let [key-schemata (remove specific-key? ks)]
    (assert-iae (< (count key-schemata) 2)
                "More than one non-optional/required key schemata: %s"
                (vec key-schemata))
    (first key-schemata)))

(defn- validate-key
  "Validate a single schema key and dissoc the value from m"
  [context m [schema-k schema-v]]
  (let [optional? (instance? OptionalKey schema-k)
        k (if optional? (.k ^OptionalKey schema-k) (required-key-value schema-k))]
    (when-not optional? (check (contains? m k) context "Map is missing key %s" k))
    (when-not (and optional? (not (contains? m k)))
      (validate* schema-v (get m k) (conj context k)))
    (dissoc m k)))

(extend-protocol Schema
  clojure.lang.APersistentMap
  (validate* [this x c]
    (check (instance? clojure.lang.APersistentMap x) c "Expected a map, got a %s" (class x))
    (let [more-keys (find-more-keys (keys this))]
      (let [remaining (reduce (partial validate-key c) x (dissoc this more-keys))]
        (if more-keys
          (let [value-schema (safe-get this more-keys)]
            (doseq [[k v] remaining]
              (validate* more-keys k c)
              (validate* value-schema v (conj c k))))
          (check (empty? remaining) c "Got extra map keys %s" (vec (keys remaining)))))))
  (explain [this]
    (for-map [[k v] this]
      (if (specific-key? k)
        (if (keyword? k)
          k
          (list (cond (instance? RequiredKey k) 'required-key
                      (instance? OptionalKey k) 'optional-key)
                (safe-get k :k)))
        (explain k))
      (explain v))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Sequence schemata

;; default for seqs is repeated schema.
;; to do destructuring style, can use any number of 'single' elements
;; followed by an optional (implicit) repeated.

(clojure.core/defrecord One [schema name])
(clojure.core/defn one
  "A single element of a sequence (not repeated, the implicit default)"
  [schema name]
  (One. schema name))

(defn- split-singles [this]
  (if (instance? One (last this))
    [this nil]
    [(butlast this) (last this)]))

(extend-protocol Schema
  clojure.lang.APersistentVector
  (validate* [this x c]
    (check (not (instance? java.util.Map x)) c "Expected a seq, got a map %s" (class x))
    (check (do (seq x) true) c "Expected a seq, got non-seqable %s" (class x))
    (let [[singles multi] (split-singles this)]
      (loop [i 0 singles singles x x]
        (if-let [[^One first-single & more-singles] (seq singles)]
          (do (check (seq x) c "Seq too short: missing (at least) %s elements"
                     (count singles))
              (validate* (.schema first-single) (first x)
                         (conj c #(format "%d <%s>" i (.name first-single))))
              (recur (inc i) more-singles (rest x)))
          (if multi
            (doseq [[offset item] (indexed x)]
              (validate* multi item (conj c (+ offset i))))
            (check (empty? x) c "Seq too long: extra elements with classes %s"
                   (mapv class x)))))))
  (explain [this]
    (let [[singles multi] (split-singles this)]
      (vec
       (concat
        (for [^One s singles]
          (list (.name s) (explain (.schema s))))
        (when multi
          ['& (explain multi)]))))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Set schemas

;; Set schemas should look like the key half of map schemas
;; with the exception that required entires don't really make sense
;; as a result, they can have at most *one* schema for elements
;; which roughly corresponds to the 'more-keys' part of map schemas

(extend-protocol Schema
  clojure.lang.APersistentSet
  (validate* [this x context]
    ;; x must be a set
    (check (instance? clojure.lang.IPersistentSet x) context
           "Expected a set, got a %s instead." (class x))
    (check (<= (count this) 1) context "This set schema attempts to provide multiple elem-schemas : %s" (pr-str this))
    (let [entry-schema (first this)] ;; if no elem-schema provided, will die on any value
      ;; when there's a generic entry schema, all entries must validate it
      (doseq [elem x]
        (validate* entry-schema elem context))))

  (explain [this]
    (set (map explain this))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Record schemata

(clojure.core/defrecord Record [klass schema]
  Schema
  (validate* [this r c]
             (check (instance? klass r) c "Expected record %s, got class %s" klass (class r))
             (validate* schema (into {} r) c)
             (when-let [f (:extra-validator-fn this)]
               (check (f r) c "Record %s did not satisfy extra validation fn." klass)))
  (explain [this]
           (list (symbol (.getName ^Class klass)) (explain schema))))

(clojure.core/defn record
  "A schema for record with class klass and map schema schema"
  [klass schema]
  (assert-iae (class? klass) "Expected record class, got %s" (class klass))
  (assert-iae (map? schema) "Expected map, got %s" (class schema))
  (Record. klass schema))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized defrecord

(def primitive-sym? '#{float double boolean byte char short int long
                       floats doubles booleans bytes chars shorts ints longs objects})

(defn- looks-like-a-protocol-var?
  "There is no 'protocol?'in Clojure, so here's a half-assed attempt."
  [v]
  (and (var? v)
       (map? @v)
       (= (:var @v) v)
       (:on @v)))

(defn- fix-protocol-tag [env tag]
  (or (when (symbol? tag)
        (when-let [v (resolve env tag)]
          (when (looks-like-a-protocol-var? v)
            `(protocol (deref ~v)))))
      tag))

(defn- fixup-tag-metadata
  "Allow type hints on symbols/arglists to include symbols that reference protocols
   or schemas, as well as literal tags. In such cases, the schema
   must be moved from :tag to :schema so that Clojure doesn't get upset, since
   it's not a literal primitive or Class."
  [env imeta]
  (if-let [tag (:tag (meta imeta))]
    (if (or (primitive-sym? tag) (class? (resolve env tag)))
      imeta
      (with-meta imeta
        (-> (meta imeta)
            (dissoc :tag)
            (assoc :schema (fix-protocol-tag env tag)))))
    imeta))

(clojure.core/defn extract-schema-form
  "Extract the schema metadata from a symbol.  Schema can be a primitive/class
   hint in :tag, any schema in :schema or :s, or a 'maybe' schema in :s?.
   If both a tag and an explicit schema are present, the explicit schema wins.
   Public only because of its use in a public macro."
  [symbol]
  (let [{:keys [tag s s? schema]} (meta symbol)]
    (assert-iae (< (count (remove nil? [s s? schema])) 2)
                "Expected single schema, got meta %s" (meta symbol))
    (if-let [schema (or s schema (when s? `(maybe ~s?)) tag)]
      schema
      +anything+)))

(defn- maybe-split-first [pred s]
  (if (pred (first s))
    [(first s) (next s)]
    [nil s]))


(defmacro defrecord
  "Define a defrecord 'name' using a modified map schema format.

   field-schema looks just like an ordinary defrecord field binding, except that you
   can use ^{:s/:schema +schema+} forms to give non-primitive, non-class schema hints
   to fields.
   e.g., [^long foo  ^{:schema {:a double}} bar]
   defines a record with two base keys foo and bar.
   You can also use ^{:s? schema} as shorthand for {:s (maybe schema)},
   or ^+schema+ to refer to a var/local defining a schema (note that this form
   is not legal on an ordinary defrecord, however, unlike all the others).

   extra-key-schema? is an optional map schema that defines additional optional
   keys (and/or a key-schemas) -- without it, the schema specifies that extra
   keys are not allowed in the record.

   extra-validator-fn? is an optional additional function that validates the record
   value.

   and opts+specs is passed through to defrecord, i.e., protocol/interface
   definitions, etc."
  {:arglists '([name field-schema extra-key-schema? extra-validator-fn? & opts+specs])}
  [name field-schema & more-args]
  (let [[extra-key-schema? more-args] (maybe-split-first map? more-args)
        [extra-validator-fn? more-args] (maybe-split-first (complement symbol?) more-args)
        field-schema (mapv (partial fixup-tag-metadata &env) field-schema)]
    `(do
       (when-let [bad-keys# (seq (filter #(required-key? %)
                                         (keys ~extra-key-schema?)))]
         (throw (RuntimeException. (str "extra-key-schema? can not contain required keys: "
                                        (vec bad-keys#)))))
       (when ~extra-validator-fn?
         (assert-iae (fn? ~extra-validator-fn?) "Extra-validator-fn? not a fn: %s"
                     (class ~extra-validator-fn?)))
       (potemkin/defrecord+ ~name ~field-schema ~@more-args)
       (declare-class-schema!
        ~name
        (assoc-when
         (record ~name (merge ~(for-map [k field-schema]
                                 (keyword (clojure.core/name k))
                                 (do (assert-iae (symbol? k)
                                                 "Non-symbol in record binding form: %s" k)
                                     (extract-schema-form k)))
                              ~extra-key-schema?))
         :extra-validator-fn ~extra-validator-fn?))
       ~(let [map-sym (gensym "m")]
          `(clojure.core/defn ~(symbol (str 'map-> name))
             ~(str "Factory function for class " name ", taking a map of keywords to field values, but not 400x"
                   " slower than ->x like the clojure.core version")
             [~map-sym]
             (let [base# (new ~(symbol (str name))
                              ~@(map (fn [s] `(get ~map-sym ~(keyword s))) field-schema))
                   remaining# (dissoc ~map-sym ~@(map keyword field-schema))]
               (if (seq remaining#)
                 (merge base# remaining#)
                 base#))))
       ~(let [map-sym (gensym "m")]
          `(clojure.core/defn ~(symbol (str 'strict-map-> name))
             ~(str "Factory function for class " name ", taking a map of keywords to field values.  All"
                   " keys are required, and no extra keys are allowed.  Even faster than map->")
             [~map-sym]
             (when-not (= (count ~map-sym) ~(count field-schema))
               (throw (RuntimeException. (format "Record has wrong set of keys: %s"
                                                 (data/diff (set (keys ~map-sym))
                                                            ~(set (map keyword field-schema)))))))
             (new ~(symbol (str name))
                  ~@(map (fn [s] `(safe-get ~map-sym ~(keyword s))) field-schema)))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
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
(ns-unmap *ns* 'fn)

;;These are deliberately schematized records -- why not, now that we've bootstrapped?

(defrecord Arity [^Schema input-schema ^Schema output-schema]
  Schema
  (validate* [this x c]
    :TODO)
  (explain [this]
    (list (explain input-schema) (explain output-schema))))

(def +infinite-arity+ Long/MAX_VALUE)

(clojure.core/defn arity [^Arity fas]
  (if-let [input-schema (seq (.input-schema fas))]
    (if (instance? One (last input-schema))
      (count input-schema)
      +infinite-arity+)
    0))

(defrecord Fn [^{:s [Arity]} arities] ;; sorted by arity
  Schema
  (validate* [this x c]
    :TODO)
  (explain [this]
    (list 'fn (list* (map explain arities)))))

(clojure.core/defn make-fn-schema
  "Can't follow naming convention here, since we already have a fn and fn-schema..."
  [arities]
  (Fn. (vec (sort-by arity arities))))

(clojure.core/defn ^Fn fn-schema
  "Produce the schema for a fn.  Since storing metadata on fns currently
   destroys their primitive-ness, and also adds an extra layer of fn call
   overhead, we store the schema on the class when we can (for defns)
   and on metadata otherwise (for fns)."
  [f]
  (assert-iae (fn? f) "Non-function %s" (class f))
  (or (class-schema (class f))
      (safe-get (meta f) :schema)))

(clojure.core/defn input-schema
  "Convenience method for fns with single arity"
  [f]
  (let [arities (.arities (fn-schema f))]
    (assert-iae (= 1 (count arities)) "Expected single arity fn, got %s" (count arities))
    (.input-schema ^Arity (first arities))))

(clojure.core/defn output-schema
  "Convenience method for fns with single arity"
  [f]
  (let [arities (.arities (fn-schema f))]
    (assert-iae (= 1 (count arities)) "Expected single arity fn, got %s" (count arities))
    (.output-schema ^Arity (first arities))))

(definterface PSimpleCell
  (get_cell ^boolean [])
  (set_cell [^boolean x]))

;; adds ~5% overhead compared to no check
(deftype SimpleVCell [^:volatile-mutable ^boolean q]
  PSimpleCell
  (get-cell [this] q)
  (set-cell [this x] (set! q x)))

(def ^plumbing.schema.PSimpleCell use-fn-validation
  "Turn on run-time function validation for functions compiled when
   *compile-function-validation* was true -- has no effect for functions compiled
   when it is false."
  (SimpleVCell. false))

(defmacro with-fn-validation [& body]
  `(do (.set_cell use-fn-validation true)
       ~@body
       (.set_cell use-fn-validation false)))

;; Helpers for the macro magic

(defn- single-arg-schema-form [[index arg]]
  `(one
    ~(extract-schema-form arg)
    ~(if (symbol? arg)
       (name arg)
       (name (gensym (str "arg" index))))))

(defn- rest-arg-schema-form [arg]
  (let [s (extract-schema-form arg)]
    (if (= s Top)
      [Top]
      (do (assert-iae (vector? s) "Expected seq schema for rest args, got %s" s)
          s))))

(defn- input-schema-form [regular-args rest-arg]
  (let [base (mapv single-arg-schema-form (indexed regular-args))]
    (if rest-arg
      (vec (concat base (rest-arg-schema-form rest-arg)))
      base)))

(defn- split-rest-arg [bind]
  (let [[pre-& post-&] (split-with #(not= % '&) bind)]
    (if (seq post-&)
      (do (assert-iae (= (count post-&) 2) "Got more than 1 symbol after &: %s" (vec post-&))
          (assert-iae (symbol? (second post-&)) "Got non-symbol after & (currently unsupported): %s" (vec post-&))
          [(vec pre-&) (last post-&)])
      [bind nil])))

(defn- process-fn-arity
  "Process a single (bind & body) form, producing an output tag, schema-form,
   and arity-form which has asserts for validation purposes added that are
   executed when turned on, and have very low overhead otherwise.
   tag? is a prospective tag for the fn symbol based on the output schema.
   schema-bindings are bindings to lift eval outwards, so we don't build the schema
   every time we do the validation."
  [env [bind & body]]
  (assert-iae (vector? bind) "Got non-vector binding form %s" bind)
  (let [bind (fixup-tag-metadata env bind)
        bind-meta (meta bind)
        bind (with-meta (mapv #(fixup-tag-metadata env %) bind) bind-meta)
        [regular-args rest-arg] (split-rest-arg bind)
        input-schema (input-schema-form regular-args rest-arg)
        output-schema (extract-schema-form bind)
        input-schema-sym (gensym "input-schema")
        output-schema-sym (gensym "output-schema")]
    {:tag? (when (and (symbol? output-schema) (class? (resolve env output-schema)))
             output-schema)
     :schema-bindings [input-schema-sym input-schema
                       output-schema-sym output-schema]
     :schema-form `(->Arity ~input-schema-sym ~output-schema-sym)
     :arity-form (if true
                   (let [bind-syms (vec (repeatedly (count regular-args) gensym))
                         metad-bind-syms (with-meta (mapv #(with-meta %1 (meta %2)) bind-syms bind) bind-meta)]
                     (list
                      (if rest-arg
                        (-> metad-bind-syms (conj '&) (conj rest-arg))
                        metad-bind-syms)
                      `(let ~(vec (interleave (map #(with-meta % {}) bind) bind-syms))
                         (let [validate# (.get_cell ~'ufv)]
                           (when validate#
                             (validate
                              ~input-schema-sym
                              ~(if rest-arg
                                 `(list* ~@bind-syms ~rest-arg)
                                 bind-syms)))
                           (let [o# (do ~@body)]
                             (when validate# (validate ~output-schema-sym o#))
                             o#)))))
                   (cons bind body))}))

(defn- process-fn-
  "Process the fn args into a final tag proposal, schema form, schema bindings, and fn form"
  [env name? fn-body]
  (let [processed-arities (map (partial process-fn-arity env)
                               (if (vector? (first fn-body))
                                 [fn-body]
                                 fn-body))
        [tags schema-bindings schema-forms fn-forms]
        (map #(map % processed-arities) [:tag? :schema-bindings :schema-form :arity-form])]
    (when name?
      (when-let [bad-meta (seq (filter (or (meta name?) {}) [:tag :s? :s :schema]))]
        (throw (RuntimeException. (str "Meta not supported on name, use arglist meta: " (vec bad-meta))))))
    {:tag? (when (and (seq tags) (apply = tags))
             (first tags))
     :schema-bindings (vec (apply concat schema-bindings))
     :schema-form `(make-fn-schema ~(vec schema-forms))
     :fn-form `(let [^plumbing.schema.PSimpleCell ~'ufv use-fn-validation]
                 (clojure.core/fn ~@(when name? [name?])
                   ~@fn-forms))}))

;; Finally we get to the prize

(defmacro fn
  "Like clojure.core/fn, except that schema-style typehints can be given on the argument
   symbols and on the arguemnt vector (for the return value), and (for now)
   schema metadata is only processed at the top-level.  i.e., you can use destructuring,
   but you must put schema metadata on the top level arguments and not on the destructured
   shit.  The only unsupported form is the '& {}' map destructuring.

   This produces a fn that you can call fn-schema on to get a schema back.
   This is currently done using metadata for fns, which currently causes
   clojure to wrap the fn in an outer non-primitive layer, so you may pay double
   function call cost and lose the benefits of primitive type hints.

   When compile-fn-validation is true (at compile-time), also automatically
   generates pre- and post-conditions on each arity that validate the input and output
   schemata whenever *use-fn-validation* is true (at run-time)."
  [& fn-args]
  (let [[name? more-fn-args] (maybe-split-first symbol? fn-args)
        {:keys [schema-bindings schema-form fn-form]} (process-fn- &env name? more-fn-args)]
    `(let ~schema-bindings
       (with-meta ~fn-form ~{:schema schema-form}))))

(defmacro defn
  "defn : clojure.core/defn :: fn : clojure.core/fn.

   Things of note:
    - Unlike clojure.core/defn, we don't support a final attr-map on multi-arity functions
    - The '& {}' map destructing form is not supported
    - fn-schema works on the class of the fn, so primitive hints are supported and there
      is no overhead, unlike with 'fn' above
    - Output metadata always goes on the argument vector.  If you use the same bare
      class on every arity, this will automatically propagate to the tag on the name."
  [name & more-defn-args]
  (let [[doc-string? more-defn-args] (maybe-split-first string? more-defn-args)
        [attr-map? more-defn-args] (maybe-split-first map? more-defn-args)
        {:keys [tag? schema-bindings schema-form fn-form]} (process-fn- &env name more-defn-args)]
    `(let ~schema-bindings
       (def ~(with-meta name
               (assoc-when (or attr-map? {})
                           :doc doc-string?
                           :schema schema-form
                           :tag (or (:tag (meta name))
                                    tag?)))
         ~fn-form)
       (declare-class-schema! (class ~name) ~schema-form))))




(set! *warn-on-reflection* false)
