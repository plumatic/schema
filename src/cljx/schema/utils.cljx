(ns schema.utils
  "Private utilities used in schema implementation.")

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

#+clj (defmacro error! [s]
        `(throw (RuntimeException. ~(with-meta s `{:tag java.lang.String}))))

#+cljs (defn error! [s]
         (throw (js/Error s)))

(defn safe-get
  "Like get but throw an exception if not found"
  [m k]
  (if-let [pair (find m k)]
    (val pair)
    (error! (format "Key %s not found in %s" k m))))

(defn value-name
  "Provide a descriptive short name for a value."
  [value]
  (let [t (type-of value)]
    (if (< (count (str value)) 20)
      value
      (symbol (str "a-" #+clj (.getName ^Class t) #+cljs t)))))


;; A leaf schema validation error, describing the schema and value and why it failed to
;; match the schema.  In Clojure, prints like a form describing the failure that would
;; return true.
(deftype ValidationError [schema value expectation-delay fail-explanation])

(defn ->ValidationError
  "for cljs sake (easier than normalizing imports in macros.clj)"
  [schema value expectation-delay fail-explanation]
  (ValidationError. schema value expectation-delay fail-explanation))

#+clj ;; Validation errors print like forms that would return false
(defmethod print-method ValidationError [^ValidationError err writer]
  (print-method (list (or (.fail-explanation err) 'not) @(.expectation-delay err)) writer))

;; Attach a name to an error from a named schema.
(deftype NamedError [name error])

(defn ->NamedError [name error] (NamedError. name error))

#+clj ;; Validation errors print like forms that would return false
(defmethod print-method NamedError [^NamedError err writer]
  (print-method (list 'named (.error err) (.name err)) writer))


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
            (format "Cannot declare class schema for non-class %s" (class klass)))
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
  (aset use-fn-validation "get_cell" (partial get_cell use-fn-validation))
  (aset use-fn-validation "set_cell" (partial set_cell use-fn-validation)))
