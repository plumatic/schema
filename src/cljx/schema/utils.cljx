(ns schema.utils
  (:refer-clojure :exclude [defrecord defprotocol])
  #+clj (:require potemkin))

;; TODO(ah) copied from plumbing. explain why

(defn assoc-when
  "Like assoc but only assocs when value is truthy"
  [m & kvs]
  (assert (even? (count kvs)))
  (into (or m {})
        (for [[k v] (partition 2 kvs)
              :when v]
          [k v])))

(clojure.core/defn type-of [x]
  #+clj (class x)
  #+cljs (js* "typeof ~{}" x))

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


(defn error! [& format-args]
  #+clj  (throw (RuntimeException. (apply format format-args)))
  #+cljs (throw (js/Error (apply format format-args))))

(defn value-name
  "Provide a descriptive short name for a value."
  [value]
  (let [t (type-of value)]
    (if (< (count (str value)) 20)
      value
      (symbol (str "a-" #+clj (.getName ^Class t) #+cljs t)))))

(def defrecord
  #+clj 'potemkin/defrecord+
  #+cljs 'clojure.core/defrecord)

#+clj
(definterface PSimpleCell
  (get_cell ^boolean [])
  (set_cell [^boolean x]))

#+cljs
(clojure.core/defprotocol PSimpleCell
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
