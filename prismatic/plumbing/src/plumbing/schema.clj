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
   [clojure.string :as str]))

(set! *warn-on-reflection* true)

;; TODO: #{} notation for sets #{schema} and maybe vec.
;; TODO: schemas for names in namespace?

;; TODO: schema intersection
;; TODO: reduce uses of both so that we can better intersect?
;; TODO: schema satisfaction
;; TODO: schema diff
;;  (diff plus union can solve everything?)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema protocol

(defn- context-str
  "Produce a human-readable representation of the current validation context"
  [context]
  (str/join   
   ","
   (for [c context]
     (let [s (pr-str c)]       
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

(def ^java.util.Map +class-schemata+
  (java.util.Collections/synchronizedMap (java.util.WeakHashMap.)))

;; Can we do this in a way that respects hierarchy?
;; can do it with defmethods,
(clojure.core/defn declare-class-schema! 
  "Globally set the schema for a class (above and beyond a simple instance? check).
   Use with care, i.e., only on classes that you control.  Also note that this
   schema only applies to instances of the concrete type passed, i.e., 
   (= (class x) klass), not (instance? klass x)."
  [klass schema]
  (assert (class? klass))
  (.put +class-schemata+ klass schema))

(clojure.core/defn class-schema
  "The last schema for a class set by declare-class-schema!, or nil."
  [klass]
  (get +class-schemata+ klass))

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
  (assert (:on p))
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
    (validate* schema x (conj c (format "<%s>" name))))
  (explain [this] (list 'named name (explain schema))))

(clojure.core/defn named 
  "Provide an explicit name for this schema element, useful for seqs."
  [schema name]
  (NamedSchema. name schema))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Map schemata

(clojure.core/defrecord RequiredKey [k])

(clojure.core/defn required-key
  "An optional key in a map"
  [k]
  (RequiredKey. k))

(clojure.core/defrecord OptionalKey [k])

(clojure.core/defn optional-key
  "An optional key in a map"
  [k]
  (OptionalKey. k))

(defn- specific-key? [ks]
  (or (instance? RequiredKey ks) (instance? OptionalKey ks)))

(defn- find-more-keys [ks]
  (let [key-schemata (remove specific-key? ks)]
    (assert (< (count key-schemata) 2))
    (first key-schemata)))

(defn- validate-key 
  "Validate a single schema key and dissoc the value from m"
  [context m [schema-k schema-v]]
  (let [optional? (instance? OptionalKey schema-k)
        k (if optional? (.k ^OptionalKey schema-k) (.k ^RequiredKey schema-k))]
    (when-not optional? (check (contains? m k) "Map is missing key %s" k))
    (when-not (and optional? (not (contains? m k))) 
      (validate* schema-v (get m k) (conj context k)))
    (dissoc m k)))

(extend-protocol Schema
  clojure.lang.APersistentMap
  (validate* [this x c]
    (check (instance? clojure.lang.APersistentMap x) "Expected a map, got a %s" (class x))
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
        (list (cond (instance? RequiredKey k) 'required-key 
                    (instance? OptionalKey k) 'optional-key) 
              (safe-get k :k))
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
    (check (not (instance? java.util.Map x)) "Expected a seq, got a map %s" (class x))
    (check (do (seq x) true) "Expected a seq, got non-seqable %s" (class x))
    (let [[singles multi] (split-singles this)]
      (loop [i 0 singles singles x x]
        (if-let [[^One first-single & more-singles] (seq singles)]
          (do (check (seq x) c "Seq too short: missing (at least) %s elements"
                     (count singles))
              (validate* (.schema first-single) (first x) 
                         (conj c (format "%d <%s>" i (.name first-single))))
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
;;; Record schemata

(clojure.core/defrecord Record [klass schema]
  Schema
  (validate* [this r c]
    (check (instance? klass r) "Expected record %s, got class %s" klass (class r))
    (validate* schema (into {} r) c)
    (when-let [f (:extra-validator-fn this)]
      (check (f r) c "Record %s did not satisfy extra validation fn." klass)))
  (explain [this]
    (list (symbol (.getName ^Class klass)) (explain schema))))

(clojure.core/defn record 
  "A schema for record with class klass and map schema schema"
  [klass schema]
  (assert (class? klass))
  (assert (map? schema))
  (Record. klass schema))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized defrecord

(def primitive-sym? '#{float double boolean byte character short int long})

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
  "Allow type hints on symbols to include symbols that reference protocols
   or schemas, as well as literal tags. In such cases, the schema
   must be moved from :tag to :schema so that Clojure doesn't get upset, since
   it's not a literal primitive or Class."
  [env symbol]
  (if-let [tag (:tag (meta symbol))]
    (if (or (primitive-sym? tag) (class? (resolve env tag)))
      symbol
      (with-meta symbol
        (-> (meta symbol)
            (dissoc :tag)
            (assoc :schema (fix-protocol-tag env tag)))))
    symbol))

(clojure.core/defn extract-schema-form 
  "Extract the schema metadata from a symbol.  Schema can be a primitive/class
   hint in :tag, any schema in :schema or :s, or a 'maybe' schema in :s?.
   If both a tag and an explicit schema are present, the explicit schema wins.
   Public only because of its use in a public macro."
  [symbol]
  (let [{:keys [tag s s? schema]} (meta symbol)]
    (assert (< (count (remove nil? [s s? schema])) 2))
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
       (when-let [bad-keys# (seq (filter #(instance? RequiredKey %) (keys ~extra-key-schema?)))]
         (throw (RuntimeException. (str "extra-key-schema? can not contain required keys: " (vec bad-keys#)))))
       (when ~extra-validator-fn?
         (assert (fn? ~extra-validator-fn?)))
       (clojure.core/defrecord ~name ~field-schema ~@more-args)
       (declare-class-schema! 
        ~name
        (assoc-when (record ~name (merge ~(for-map [k field-schema]
                                            (required-key (keyword (clojure.core/name k)))
                                            (do (assert (symbol? k))
                                                (extract-schema-form k)))
                                         ~extra-key-schema?)) 
                    :extra-validator-fn ~extra-validator-fn?)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized functions

;; Metadata syntax is the same as for schema/defrecord.

;; Currently, there is zero overhead with compile-fn-validation off,
;; since we're sneaky and apply the schema metadata to the fn class 
;; rather than using metadata (which seems to yield wrapping in a 
;; non-primitive AFn wrapper of some sort, giving 2x slowdown).

;; For fns we're stuck with this 2x slowdown for now, and 
;; no primitives, unless we can figure out how to pull a similar trick

;; When compile-fn-validation is on, checking *use-fn-validation* 
;; has about the same cost as the fn call itself.  On top of that,
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

;; TODO: handle & properly, for now it's broken.
(defn- bind->input-schema-form [bind]
  (mapv (clojure.core/fn [[i s]]
          `(let [schema# ~(extract-schema-form s)]
             (one
              schema#
              ~(if (symbol? s)
                 (name s)
                 (name (gensym (str "arg" i)))))))
        (indexed bind)))


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
  (assert (fn? f))
  (or (class-schema (class f))
      (safe-get (meta f) :schema)))

(clojure.core/defn input-schema 
  "Convenience method for fns with single arity"
  [f]
  (let [arities (.arities (fn-schema f))]
    (assert (= 1 (count arities)))
    (.input-schema ^Arity (first arities))))

(clojure.core/defn output-schema 
  "Convenience method for fns with single arity"
  [f]
  (let [arities (.arities (fn-schema f))]
    (assert (= 1 (count arities)))
    (.output-schema ^Arity (first arities))))


(def compile-fn-validation
  "At compile-time, should we generate code for fns and defns that allows schema
   validation to be turned on at run-time?"
  (atom true))

(def ^:dynamic *use-fn-validation* 
  "Turn on run-time function validation for functions compiled when
   *copmile-function-validation* was true -- has no effect for functions compiled
   when it is false."
  true)

;; TODO: make sure we're doing something sane for destructuring, and we document it.
(defn- process-fn-arity
  "Process a single (bind & body) form, producing an output tag, schema-form,
   and arity-form which may have asserts for validation purposes added if 
   compile-fn-validation is true. tag? is a prospective tag for the fn symbol
   based on the output schema."
  [env [bind & body]]
  (assert (vector? bind))
  (let [bind (with-meta (mapv #(fixup-tag-metadata env %) bind) (meta bind))
        input-schema (bind->input-schema-form bind)
        output-schema (extract-schema-form bind)]
    {:tag? (when (and (symbol? output-schema) (class? (resolve env output-schema)))
             output-schema)
     :schema-form `(->Arity ~input-schema ~output-schema)
     :arity-form (if @compile-fn-validation
                   ;; TODO: would be much more efficient to let the schemata outside with a big
                   ;;  gensym nonsense for each arity, but for now we are lazy, and expect
                   ;;  that validation will only be turned on during tests anyway...                   
                   (let [bind-syms (vec (repeatedly (count bind) gensym))]
                     (list
                      ;; TODO: yet another Clojure bug prevents us from primitive type hints
                      ;; since with-meta ruins them.
                      bind-syms #_  (mapv #(with-meta %1 (meta %2)) bind-syms bind)
                      `(let ~(vec (interleave bind bind-syms))
                            (let [validate# *use-fn-validation*]
                              (when validate#
                                (validate ~input-schema ~bind-syms))
                              (let [o# (do ~@body)]
                                (when validate# (validate ~output-schema o#))
                                o#)))))
                   (cons bind body))}))

(defn- process-fn-
  "Process the fn args into a final tag proposal, schema form, and fn form"
  [env name? fn-body]
  (let [processed-arities (map (partial process-fn-arity env)
                               (if (vector? (first fn-body))
                                 [fn-body]
                                 fn-body))
        [tags schema-forms fn-forms] (map #(map % processed-arities) 
                                          [:tag? :schema-form :arity-form])]
    {:tag? (when (and (seq tags) (apply = tags))
             (first tags))
     :schema-form `(make-fn-schema ~(vec schema-forms))
     :fn-form `(clojure.core/fn ~@(when name? [name?])
                 ~@fn-forms)}))

(defmacro fn
  "Like clojure.core/fn, except that schema-style typehints can be given on the argument
   symbols and on the arguemnt vector (for the return value), and (for now) 
   schema metadata is only processed at the top-level.  i.e., you can use destructuring,
   but you must put schema metadata on the top level arguments and not on the destructured
   shit.

   This produces a :io-schemata key in metadata on the outputted fn, which is a sequence
   of pairs of [input-schema output-schema] pairs, one for each provided fn arity.

   When compile-fn-validation is true (at compile-time), also automatically 
   generates pre- and post-conditions on each arity that validate the input and output 
   schemata whenever *use-fn-validation* is true (at run-time)."
  [& fn-args]
  (let [[name? more-fn-args] (maybe-split-first symbol? fn-args)
        {:keys [schema-form fn-form]} (process-fn- &env name? more-fn-args)]
    `(with-meta ~fn-form ~{:schema schema-form})))

(defn- infer-defn-symbol-tag 
  "If a tag for the defn symbol can be inferred from the schema, return it."
  [env schema-form]
  #_(let [out-schemata (map second io-schemata)]
    (when (and (seq out-schemata) (apply = out-schemata))
      (let [out (first out-schemata)]
        (when (and (symbol? out) (class? (resolve &env out)))
          out)))))

(defmacro defn
  "defn : clojure.core/defn :: fn : clojure.core/fn.
   Unlike clojure.core/defn, we don't support a final attr-map on multi-arity functions
   (not sure why this exists anyway...) i.e., owe only support optional doc-string and attr-map
   initially.  Output metadata goes on argument vector; if the same class hint is passed 
   on each arg vector, it is auto-propagated to the fn name."
  [name & more-defn-args]
  (let [[doc-string? more-defn-args] (maybe-split-first string? more-defn-args)
        [attr-map? more-defn-args] (maybe-split-first map? more-defn-args)
        {:keys [tag? schema-form fn-form]} (process-fn- &env name more-defn-args)]
    `(do 
       (def ~(with-meta name 
              (assoc-when (or attr-map? {}) 
                          :doc doc-string? 
                          :schema schema-form
                          :tag (or (:tag (meta name))
                                   tag?)))
        ~fn-form)
       (declare-class-schema! (class ~name) ~schema-form))))




(set! *warn-on-reflection* false)