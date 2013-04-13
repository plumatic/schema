(ns plumbing.schema
  "A library for data structure schema definition and validation.

   For example, 

   (validate {:foo long :bar [double]} {:foo 1 :bar [1.0 2.0 3.0]})

   returns true but 

   (validate {:foo long :bar [double]} {:bar [1.0 2.0 3.0]})
   (validate {:foo long :bar [double]} {:foo \"1\" :bar [1.0 2.0 3.0]})
   (validate {:foo long :bar [double]} {:foo 1 :bar [1.0 2.0 3.0] :baz 1})

   all throw exceptions."
  (:refer-clojure :exclude [defrecord])
  (:use plumbing.core)
  (:require 
   [clojure.string :as str]))

;; TODO: extensible handling for Classes (declare-schema, get-schema), they no
;;      longer directly need to auto-expand.  Records just use this.
;; TODO: expand-schema method that expands Class schemata and checks methods.

;; TODO: propagate type hint into defn name.
;; TODO: #{} notation for sets #{schema} and maybe vec.
;; TODO: schemas for names in namespace?
;; TODO: redo existing schemas to look like class names.
;; TODO: test s/defn so we can use new syntax.

;; TODO: schema intersection
;; TODO: reduce uses of both so that we can better intersect?
;; TODO: schema satisfaction
;; TODO: schema diff
;;  (diff plus union can solve everything?)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema protocol

(defn context-str
  "Produce a human-readable representation of the current validation context"
  [context]
  (str/join   
   ","
   (for [c context]
     (let [s (pr-str c)]       
       (if (< (count s) 20)
         s
         (subs s 0 20))))))

(defn check-throw 
  "Throw an exception for a failed validation"
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
          (check-throw ~@format-args))
        (catch Throwable t#
          (if (= (:type (ex-data t#)) ::schema-mismatch)
            (throw t#)
           (check-throw "Condition %s threw exception %s" '~condition t#)))))

(defprotocol Schema
  (validate* [this x context]    
    "Validate that x satisfies this schema by calling 'check'.  Context is a vec
     of the path to x from the root object being validated, used to present
     useful error messages."))

(defn validate [this x]
  (validate* this x []))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Leaf values

(extend-protocol Schema
  Class
  (validate* [this x c] 
    (check (instance? this x) c "Wanted instance of %s, got %s" this (class x)))
  
  String 
  (validate* [this x c]
    (check (= this (.getName (class x))) c "Wanted instance of %s, got %s" this (class x)))


  ;; prevent coersion, so you have to be exactly the given type.
  clojure.core$float
  (validate* [this x c]
    (check (instance? Float x) c "Wanted float, got %s" (class x)))
  
  clojure.core$double
  (validate* [this x c]
    (check (instance? Double x) c "Wanted double, got %s" (class x)))
  
  clojure.core$boolean
  (validate* [this x c]
    (check (instance? Boolean x) c "Wanted boolean, got %s" (class x)))
  
  clojure.core$byte
  (validate* [this x c]
    (check (instance? Byte x) c "Wanted byte, got %s" (class x)))
  
  clojure.core$char
  (validate* [this x c]
    (check (instance? Character x) c "Wanted char, got %s" (class x)))
  
  clojure.core$short
  (validate* [this x c]
    (check (instance? Short x) c "Wanted short, got %s" (class x)))
  
  clojure.core$int
  (validate* [this x c]
    (check (instance? Integer x) c "Wanted int, got %s" (class x)))
  
  clojure.core$long
  (validate* [this x c]
    (check (instance? Long x) c "Wanted long, got %s" (class x)))
  
  clojure.lang.AFn 
  (validate* [this x c] 
    (check (this x) c "Value did not satisfy %s" this)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Simple helpers / wrappers

;; _ is to work around bug in Clojure where eval-ing defrecord with no fields 
;; loses type info, which makes this unusable in schema-fn.
;; http://dev.clojure.org/jira/browse/CLJ-1196
(clojure.core/defrecord Anything [_]
  Schema
  (validate* [this x c]))

(def +anything+ (Anything. nil))

(clojure.core/defrecord Either [schemas]
  Schema
  (validate* [this x c]
    (let [fails (map #(try (validate* % x c) nil (catch Exception e e)) schemas)]
      (check (some not fails) c "Did not match any schema: %s" (vec fails)))))

(defn either
  "The disjunction of multiple schemas."
  [& schemas]
  (Either. schemas))

(clojure.core/defrecord Both [schemas]
  Schema
  (validate* [this x c]
    (doseq [schema schemas]
      (validate* schema x c))))

(defn both
  "The intersection of multiple schemas.  Useful, e.g., to combine a special-
   purpose function validator with a normal map schema."
  [& schemas]
  (Both. schemas))

(clojure.core/defrecord Maybe [schema]
  Schema
  (validate* [this x c]
    (when-not (nil? x)
      (validate* schema x c))))

(defn maybe
  "Value can be nil or must satisfy schema"
  [schema]
  (Maybe. schema))

(def ? maybe)


(clojure.core/defrecord NamedSchema [name schema]
  Schema
  (validate* [this x c]
    (validate* schema x (conj c (format "<%s>" name)))))

(defn named 
  "Provide an explicit name for this schema element, useful for seqs."
  [schema name]
  (NamedSchema. name schema))



(clojure.core/defrecord EnumSchema [vs]
  Schema
  (validate* [this x c]
    (check (contains? vs x) c "Got an invalid enum element")))

(defn enum
  "A value that must be = to one element of vs."
  [& vs]
  (EnumSchema. (set vs)))

(def integral-number (either long int))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Map schemata

(clojure.core/defrecord RequiredKey [k])

(defn required-key
  "An optional key in a map"
  [k]
  (RequiredKey. k))

(clojure.core/defrecord OptionalKey [k])

(defn optional-key
  "An optional key in a map"
  [k]
  (OptionalKey. k))

(defn- specific-key? [ks]
  (or (instance? RequiredKey ks) (instance? OptionalKey ks))
  )

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
          (check (empty? remaining) c "Got extra map keys %s" (vec (keys remaining))))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Sequence schemata

;; default for seqs is repeated schema.
;; to do destructuring style, can use any number of 'single' elements
;; followed by an optional (implicit) repeated.

(clojure.core/defrecord One [schema name])

(defn one
  "A single element of a sequence (not repeated, the implicit default)"
  [schema name]
  (One. schema name))

(extend-protocol Schema
  clojure.lang.APersistentVector
  (validate* [this x c]
    (check (not (instance? java.util.Map x)) "Expected a seq, got a map %s" (class x))
    (check (do (seq x) true) "Expected a seq, got non-seqable %s" (class x))
    (let [[singles multi] (if (instance? One (last this))
                            [this nil]
                            [(butlast this) (last this)])]
      (loop [i 0 singles singles x x]
        (if-let [[^One first-single & more-singles] (seq singles)]
          (do (check (seq x) c "Seq too short: missing (at least) %s elements"
                     (count singles))
              (validate* (.schema first-single) (first x) (conj c (.name first-single)))
              (recur (inc i) more-singles (rest x)))
          (if multi
            (doseq [[offset item] (indexed x)]
              (validate* multi item (conj c (+ offset i))))
            (check (empty? x) c "Seq too long: extra elements with classes %s"
                   (mapv class x))))))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Record schemata

(clojure.core/defrecord Record [klass schema]
  Schema
  (validate* [this r c]
    (check (instance? klass r) "Expected record %s, got class %s" klass (class r))
    (validate* schema (into {} r) c)
    (when-let [f (:extra-validator-fn this)]
      (check (f r) c "Record %s did not satisfy extra validation fn." klass))))

(defn record 
  "A schema for record with class klass and map schema schema"
  [klass schema]
  (assert (class? klass))
  (assert (map? schema))
  (Record. klass schema))


(def ^java.util.Map +record-schema-map+ (java.util.Collections/synchronizedMap (java.util.WeakHashMap.)))

(defn ^Record record-schema
  "The schema for a defrecord class defined with schema/defrecord"
  [klass]
  (let [s (.get +record-schema-map+ klass)]
    (when-not s
      (throw (RuntimeException. (str "No schema known for record class " klass))))
    s))

;; TODO: we can use 'resolve' here with &env to check if we got a class.
;; TODO: 'Record' check doesn't work since we haven't resolved class, probably
;;   - fix and add test.
;; TODO: allow 'canonical' schemas for arguments in a ns?
(defn extract-schema [symbol]
  (let [{:keys [tag s schema]} (meta symbol)]
    (if-let [schema (or s schema tag)]
      (if (instance? clojure.lang.IRecord schema)
        (get +record-schema-map+ schema schema)
        schema)
      +anything+)))

(defn maybe-split-first [pred s]
  (if (pred (first s))
    [(first s) (next s)]
    [nil s]))


(defmacro defrecord
  "Define a defrecord 'name' using a modified map schema format.

   field-schema looks just like an ordinary defrecord field binding, except that you 
   can use ^{:s/:schema +schema+} forms to give non-primitive, non-class schema hints 
   to fields, and classes naming sub-records are magically auto-expanded into their 
   record-schemata. 
   e.g., [^long foo  ^{:schema {:a double}} bar]
   defines a record with two base keys foo and bar.

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
        [extra-validator-fn? more-args] (maybe-split-first (complement symbol?) more-args)]
    `(do 
       (when-let [bad-keys# (seq (filter #(instance? RequiredKey %) (keys ~extra-key-schema?)))]
         (throw (RuntimeException. (str "extra-key-schema? can not contain required keys: " (vec bad-keys#)))))
       (when ~extra-validator-fn?
         (assert (fn? ~extra-validator-fn?)))
       (clojure.core/defrecord ~name ~field-schema ~@more-args)
       (.put +record-schema-map+ ~name
             (assoc-when (record ~name (merge ~(for-map [k field-schema]
                                                 (required-key (keyword (clojure.core/name k)))
                                                 (do (assert (symbol? k))
                                                     (extract-schema k)))
                                              ~extra-key-schema?)) 
                         :extra-validator-fn ~extra-validator-fn?)))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized functions

(defn validated-call [f & args]
  (letk [[input-schema output-schema] (meta f)]
    (validate input-schema args)
    (let [o (apply f args)]
      (validate output-schema o)
      o)))

