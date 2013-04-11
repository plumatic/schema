(ns plumbing.schema
  "A library for data structure schema definition and validation.

   For example, 

   (validate {:foo long :bar [double]} {:foo 1 :bar [1.0 2.0 3.0]})

   returns true but 

   (validate {:foo long :bar [double]} {:bar [1.0 2.0 3.0]})
   (validate {:foo long :bar [double]} {:foo \"1\" :bar [1.0 2.0 3.0]})
   (validate {:foo long :bar [double]} {:foo 1 :bar [1.0 2.0 3.0] :baz 1})

   all throw exceptions."
  (:refer-clojure :exclude [defrecord or and])
  (:use plumbing.core)
  (:require 
   [clojure.string :as str]))

;; TODO: make (vec-of ), array-of
;; TODO: propagate type hint into defn name.
;; TODO: allow bare keywords to be required-key by default ?
;; TODO: custom array types

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema protocol

(def ^:dynamic *validation-context*  
  "A path through the current data structure being validated, used to generate
   a helpful error message about the context of a validation fail." 
  [])

(defmacro with-context 
  "Execute 'body' in with 'context' pushed onto the end of the validation context stack"
  [context & body]
  `(binding [*validation-context* (conj *validation-context* ~context)]
     ~@body))

(defn context-str
  "Produce a human-readable representation of the current validation context"
  []
  (str/join   
   ","
   (for [c *validation-context*]
     (let [s (pr-str c)]       
       (if (< (count s) 20)
         s
         (subs s 0 20))))))

(defn check-throw 
  "Throw an exception for a failed validation"
  [& format-args]
  (throw (ex-info 
          (str (when (seq *validation-context*)
                 (format "In context %s: " (context-str)))
               (apply format format-args))
          {:type ::schema-mismatch})))

(defmacro check 
  "Check that condition is true; if not (or it thows an exception), throw an
   exception describing the failure (via format-args) as well as the current 
   validation context."
  [condition & format-args]
  `(try (when-not ~condition
          (check-throw ~@format-args))
        (catch Throwable t#
          (if (= (:type (ex-data t#)) ::schema-mismatch)
            (throw t#)
           (check-throw "Condition %s threw exception %s" '~condition t#)))))

(defprotocol Schema
  (validate [this x]    
    "Validate that x satisfies this schema by calling 'check', using 'with-context'
     to provide context about the path taken through the object"))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Leaf values

(extend-protocol Schema
  Class
  (validate [this x] (check (instance? this x) "Wanted instance of %s, got %s" this (class x)))

  ;; prevent coersion, so you have to be exactly the given type.
  clojure.core$float
  (validate [this x]
    (check (instance? Float x) "Wanted float, got %s" (class x)))
  
  clojure.core$double
  (validate [this x]
    (check (instance? Double x) "Wanted double, got %s" (class x)))
  
  clojure.core$boolean
  (validate [this x]
    (check (instance? Boolean x) "Wanted boolean, got %s" (class x)))
  
  clojure.core$byte
  (validate [this x]
    (check (instance? Byte x) "Wanted byte, got %s" (class x)))
  
  clojure.core$char
  (validate [this x]
    (check (instance? Character x) "Wanted char, got %s" (class x)))
  
  clojure.core$short
  (validate [this x]
    (check (instance? Short x) "Wanted short, got %s" (class x)))
  
  clojure.core$int
  (validate [this x]
    (check (instance? Integer x) "Wanted int, got %s" (class x)))
  
  clojure.core$long
  (validate [this x]
    (check (instance? Long x) "Wanted long, got %s" (class x)))

  clojure.lang.AFn 
  (validate [this x] 
    (check (this x) "Value did not satisfy %s" this)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Simple helpers / wrappers

;; _ is to work around bug in Clojure where eval-ing defrecord with no fields 
;; loses type info, which makes this unusable in schema-fn.
;; http://dev.clojure.org/jira/browse/CLJ-1196
(clojure.core/defrecord Anything [_]
  Schema
  (validate [this x]))

(def +anything+ (Anything. nil))

(clojure.core/defrecord Either [schemas]
  Schema
  (validate [this x]
    (let [fails (map #(try (validate % x) nil (catch Exception e e)) schemas)]
      (check (some not fails) "Did not match any schema: %s" (vec fails)))))

(defn either
  "The disjunction of multiple schemas."
  [& schemas]
  (Either. schemas))

(def or either)

(clojure.core/defrecord Both [schemas]
  Schema
  (validate [this x]
    (doseq [schema schemas]
      (validate schema x))))

(defn both
  "The intersection of multiple schemas.  Useful, e.g., to combine a special-
   purpose function validator with a normal map schema."
  [& schemas]
  (Both. schemas))

(def and both)

(clojure.core/defrecord Maybe [schema]
  Schema
  (validate [this x]
    (when-not (nil? x)
      (validate schema x))))

(defn maybe
  "Value can be nil or must satisfy schema"
  [schema]
  (Maybe. schema))

(def ? maybe)


(clojure.core/defrecord NamedSchema [name schema]
  Schema
  (validate [this x]
    (with-context (format "<%s>" name)
      (validate schema x))))

(defn named 
  "Provide an explicit name for this schema element, useful for seqs."
  [name schema]
  (NamedSchema. name schema))



(clojure.core/defrecord EnumSchema [vs]
  Schema
  (validate [this x]
    (check (contains? vs x) "Got an invalid enum element")))

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
  (clojure.core/or (instance? RequiredKey ks) (instance? OptionalKey ks))
  )

(defn- find-more-keys [ks]
  (let [key-schemata (remove specific-key? ks)]
    (assert (< (count key-schemata) 2))
    (first key-schemata)))

(defn- validate-key 
  "Validate a single schema key and dissoc the value from m"
  [m [schema-k schema-v]]
  (let [optional? (instance? OptionalKey schema-k)
        k (if optional? (.k ^OptionalKey schema-k) (.k ^RequiredKey schema-k))]
    (when-not optional? (check (contains? m k) "Map is missing key %s" k))
    (when-not (clojure.core/and optional? (not (contains? m k))) 
      (with-context k
        (validate schema-v (get m k))))
    (dissoc m k)))

(extend-protocol Schema
  clojure.lang.APersistentMap
  (validate [this x]
    (check (instance? clojure.lang.APersistentMap x) "Expected a map, got a %s" (class x))
    (let [more-keys (find-more-keys (keys this))]
      (let [remaining (reduce validate-key x (dissoc this more-keys))]
        (if more-keys
          (let [value-schema (safe-get this more-keys)]
           (doseq [[k v] remaining]
             (validate more-keys k)
             (with-context k (validate value-schema v))))
          (check (empty? remaining) "Got extra map keys %s" (vec (keys remaining))))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Sequence schemata

;; default for seqs is repeated schema.
;; to do destructuring style, can use any number of 'single' elements
;; followed by an optional (implicit) repeated.

(clojure.core/defrecord Single [schema])

(defn single
  "A single element of a sequence (not repeated, the implicit default)"
  [schema & [name]]
  (Single. (if name (named name schema)
               schema)))

(defn- extract-multi 
  "Return a pair [single-schemas repeated-schema-or-nil]"
  [seq-schema]
  (let [[singles multi] (if (instance? Single (last seq-schema))
                          [seq-schema nil]
                          [(butlast seq-schema) (last seq-schema)])]
    [(map #(.schema ^Single %) singles) multi]))

(extend-protocol Schema
  clojure.lang.APersistentVector
  (validate [this x]
    (check (not (instance? java.util.Map x)) "Expected a seq, got a map %s" (class x))
    (check (do (seq x) true) "Expected a seq, got non-seqable %s" (class x))
    (let [[singles multi] (extract-multi this)]
      (loop [i 0 singles (seq singles) x (seq x)]
        (if-not singles
          (if multi
            (doseq [[offset item] (indexed x)]
              (with-context (+ offset i) (validate multi item)))
            (check (not x) "Seq too long: extra elements with classes %s"
                   (mapv class x)))
          (do (check x "Seq too short: missing (at least) %s elements"
                     (count singles))
              (with-context i (validate (first singles) (first x)))
              (recur (inc i) (next singles) (next x))))))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Record schemata

(clojure.core/defrecord Record [klass schema]
  Schema
  (validate [this r]
    (check (instance? klass r) "Expected record %s, got class %s" klass (class r))
    (validate schema (into {} r))
    (when-let [f (:extra-validator-fn this)]
      (check (f r) "Record %s did not satisfy extra validation fn." klass))))

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

(defn extract-schema [symbol]
  (let [{:keys [tag s schema]} (meta symbol)]
    (if-let [schema (clojure.core/or s schema tag)]
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

