(ns plumbing.schema
  "A library for data structure schemata and validation."
  (:use plumbing.core)
  (:require 
   [clojure.string :as str]))

;; TODO: custom array types
;; TODO: disjunctions?
;; TODO: our own defschematizedrecord?

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema protocol

(def ^:dynamic *validation-context* [])

(defmacro with-context [context & body]
  `(binding [*validation-context* (conj *validation-context* ~context)]
     ~@body))

(defn context-str []
  (str/join   
   ","
   (for [c *validation-context*]
     (let [s (pr-str c)]       
       (if (< (count s) 20)
         s
         (subs s 0 20))))))

(defn check-throw [& format-args]
  (throw (ex-info 
          (str (when (seq *validation-context*)
                 (format "In context %s: " (context-str)))
               (apply format format-args))
          {:type ::schema-mismatch})))

(defmacro check [condition & format-args]
  `(try (when-not ~condition
          (check-throw ~@format-args))
        (catch Throwable t#
          (if (= (:type (ex-data t#)) ::schema-mismatch)
            (throw t#)
           (check-throw "Condition %s threw exception %s" '~condition t#)))))

(defprotocol Schema
  "A schema"
  (validate [this x]    
    "Validate that x satisfies this schema by calling 'check', using 'with-context'
     to provide context about the path taken through the object"))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Leaf values

(extend-protocol Schema
  Class
  (validate [this x] (check (instance? this x) "Wanted instance of %s, got %s" this (class x)))

  ;; prevent coersion
  clojure.core$double
  (validate [this x]
    (check (instance? Double x) "Wanted double, got %s" (class x)))
  
  clojure.core$long
  (validate [this x]
    (check (instance? Long x) "Wanted long, got %s" (class x)))
  
  clojure.lang.AFn 
  (validate [this x] 
    (check (this x) "Value did not satisfy %s" this)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Simple helpers / wrappers

(def +anything+
  (reify Schema (validate [this x])))

(defrecord Nillable [schema]
  Schema
  (validate [this x]
    (when-not (nil? x)
      (validate schema x))))

(defn nillable
  "Value can be nil or must satisfy schema"
  [schema]
  (Nillable. schema))


(defrecord NamedSchema [name schema]
  Schema
  (validate [this x]
    (with-context (format "<%s>" name)
      (validate schema x))))

(defn named 
  "Provide an explicit name for this schema element, useful for seqs."
  [name schema]
  (NamedSchema. name schema))


(defrecord MultiValidator [schemas]
  Schema
  (validate [this x]
    (doseq [schema schemas]
      (validate schema x))))

(defn multi-validator 
  "The intersection of multiple schemas.  Useful for instance to combine a special-
   purpose function validator with a normal map schema."
  [& schemas]
  (MultiValidator. schemas))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Map schemata


(defrecord KeySchema [schema])

(defn key-schema 
  "A schema that allows any number of additional map entries, where keys must 
   satisfy this schema."
  [schema]
  (KeySchema. schema))

(defrecord OptionalKey [k])

(defn optional-key
  "An optional key in a map"
  [k]
  (OptionalKey. k))

(defn- find-key-schema [ks]
  (when-let [key-schemata (seq (filter #(instance? KeySchema %) ks))]
    (assert (< (count key-schemata) 2))
    (first key-schemata)))

(defn validate-key 
  "Validate a single schema key and dissoc the value from m"
  [m [schema-k schema-v]]
  (let [optional? (instance? OptionalKey schema-k)
        k (if optional? (.k ^OptionalKey schema-k) schema-k)]
    (when-not optional? (check (contains? m k) "Map is missing key %s" k))
    (when-not (and optional? (not (contains? m k))) 
      (with-context k
        (validate schema-v (get m k))))
    (dissoc m k)))

(extend-protocol Schema
  clojure.lang.APersistentMap
  (validate [this x]
    (check (instance? clojure.lang.APersistentMap x) "Expected a map, got a %s" (class x))
    (let [key-schema (find-key-schema (keys this))]
      (let [remaining (reduce validate-key x (dissoc this key-schema))]
        (if key-schema
          (let [value-schema (safe-get this key-schema)]
           (doseq [[k v] remaining]
             (validate (.schema ^KeySchema key-schema) k)
             (with-context k (validate value-schema v))))
          (check (empty? remaining) "Got extra map keys %s" (vec (keys remaining))))))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Sequence schemata

;; default for seqs is repeated schema.
;; to do destructuring style, can use any number of 'single' elements
;; followed by an optional (implicit) repeated.

(defrecord Single [schema])

(defn single
  "A single element of a sequence (not repeated, the implicit default)"
  [schema]
  (Single. schema))

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
      (if multi
        (check (>= (count x) (count singles)) "Seq too short: need at least %s elements, got %s"
               (count singles) (count x))
        (check (= (count x) (count singles)) "Seq wrong length: need exactly %s elements, got %s"
               (count singles) (count x)))
      (loop [i 0 singles (seq singles) x (seq x)]
        (if-not singles
          (when multi 
            (doseq [[offset item] (indexed x)]
              (with-context (+ offset i) (validate multi item))))
          (do (with-context i (validate (first singles) (first x)))
              (recur (inc i) (next singles) (next x))))))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Record schemata

(defrecord Record [klass schema]
  Schema
  (validate [this r]
    (check (instance? klass r) "Expected record %s, got class %s" klass (class r))
    (validate schema (into {} r))))

(defn record 
  "A schema for record with class klass and map schema schema"
  [klass schema]
  (assert (class? klass))
  (assert (map? schema))
  (Record. klass schema))



;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized functions

(defn validated-call [f & args]
  (letk [[input-schema output-schema] (meta f)]
    (validate input-schema args)
    (let [o (apply f args)]
      (validate output-schema o)
      o)))
