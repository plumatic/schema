(ns schema.utils
  "Private utilities used in schema implementation."
  #+cljs (:require goog.string.format [goog.string :as gstring]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Miscellaneous helpers

(defn assoc-when
  "Like assoc but only assocs when value is truthy.  Copied from plumbing.core so that
   schema need not depend on plumbing."
  [m & kvs]
  (assert (even? (count kvs)))
  (into (or m {})
        (for [[k v] (partition 2 kvs)
              :when v]
          [k v])))

(defn type-of [x]
  #+clj (class x)
  #+cljs (js* "typeof ~{}" x))

(defn fn-schema-bearer
  "What class can we associate the fn schema with? In Clojure use the class of the fn; in
   cljs just use the fn itself."
  [f]
  #+clj (class f)
  #+cljs f)

(defn format* [fmt & args]
  (apply #+clj format #+cljs gstring/format fmt args))

(defn value-name
  "Provide a descriptive short name for a value."
  [value]
  (let [t (type-of value)]
    (if (< (count (str value)) 20)
      value
      (symbol (str "a-" #+clj (.getName ^Class t) #+cljs t)))))

(defn memoize-id
  "Identity version of memoize, because many schemas are records, and records
   don't cache their hash codes (at least in Clojure 1.5.1).
   Not thread safe, and doesn't cache falsey values."
  [f]
  #+clj (let [m (java.util.IdentityHashMap.)]
          (fn [x]
            (or (.get m x)
                (let [res (f x)]
                  (.put m x res)
                  res))))
  #+cljs (memoize f))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Error descriptions

;; A leaf schema validation error, describing the schema and value and why it failed to
;; match the schema.  In Clojure, prints like a form describing the failure that would
;; return true.

(declare validation-error-explain)

(deftype ValidationError [schema value expectation-delay fail-explanation]
  #+cljs IPrintWithWriter
  #+cljs (-pr-writer [this writer opts]
           (-pr-writer (validation-error-explain this) writer opts)))

(defn validation-error-explain [^ValidationError err]
  (list (or (.-fail-explanation err) 'not) @(.-expectation-delay err)))

#+clj ;; Validation errors print like forms that would return false
(defmethod print-method ValidationError [err writer]
  (print-method (validation-error-explain err) writer))

(defn ->ValidationError
  "for cljs sake (easier than normalizing imports in macros.clj)"
  [schema value expectation-delay fail-explanation]
  (ValidationError. schema value expectation-delay fail-explanation))


;; Attach a name to an error from a named schema.
(declare named-error-explain)

(deftype NamedError [name error]
  #+cljs IPrintWithWriter
  #+cljs (-pr-writer [this writer opts]
           (-pr-writer (named-error-explain this) writer opts)))

(defn named-error-explain [^NamedError err]
  (list 'named (.-error err) (.-name err)))

#+clj ;; Validation errors print like forms that would return false
(defmethod print-method NamedError [err writer]
  (print-method (named-error-explain err) writer))

(defn ->NamedError
  "for cljs sake (easier than normalizing imports in macros.clj)"
  [name error]
  (NamedError. name error))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Monoidish error containers, which wrap errors (to distinguish from success values).

(defrecord ErrorContainer [error])

(defn error
  "Distinguish a value (must be non-nil) as an error."
  [x] (assert x) (->ErrorContainer x))

(defn error? [x]
  (instance? ErrorContainer x))

(defn error-val [x]
  (when (error? x)
    (.-error ^ErrorContainer x)))

(defn wrap-error-name
  "If maybe-error is an error, wrap the inner value in a NamedError; otherwise, return as-is"
  [name maybe-error]
  (if-let [e (error-val maybe-error)]
    (error (->NamedError name e))
    maybe-error))

(defn result-builder
  "Build up a result by conjing values, producing an error if at least one
   sub-value returns an error."
  [lift-to-error]
  (fn conjer [m e]
    (if-let [err (error-val e)]
      (error (conj (or (error-val m) (lift-to-error m)) err))
      (if-let [merr (error-val m)]
        (error (conj merr nil))
        (conj m e)))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Registry for attaching schemas to classes, used for defn and defrecord

#+clj
(let [^java.util.Map +class-schemata+ (java.util.concurrent.ConcurrentHashMap.)]
  ;; TODO(jw): unfortunately (java.util.Collections/synchronizedMap (java.util.WeakHashMap.))
  ;; is too slow in practice, so for now we leak classes.  Figure out a concurrent, fast,
  ;; weak alternative.
  (defn declare-class-schema! [klass schema]
    "Globally set the schema for a class (above and beyond a simple instance? check).
   Use with care, i.e., only on classes that you control.  Also note that this
   schema only applies to instances of the concrete type passed, i.e.,
   (= (class x) klass), not (instance? klass x)."
    (assert (class? klass)
            (format* "Cannot declare class schema for non-class %s" (class klass)))
    (.put +class-schemata+ klass schema))

  (defn class-schema [klass]
    "The last schema for a class set by declare-class-schema!, or nil."
    (.get +class-schemata+ klass)))

#+cljs
(do
  (defn declare-class-schema! [klass schema]
    (aset klass "schema$utils$schema" schema))

  (defn class-schema [klass]
    (aget klass "schema$utils$schema")))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Utilities for fast-as-possible reference to use to turn fn schema validation on/off

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

(def ^schema.utils.PSimpleCell use-fn-validation
  "Turn on run-time function validation for functions compiled when
   *compile-function-validation* was true -- has no effect for functions compiled
   when it is false."
  (SimpleVCell. false))

#+cljs
(do
  (set! (.-get_cell use-fn-validation) (partial get_cell use-fn-validation))
  (set! (.-set_cell use-fn-validation) (partial set_cell use-fn-validation)))
