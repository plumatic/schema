(ns schema.utils
  (:refer-clojure :exclude [defrecord defprotocol])
  #+clj (:require potemkin))

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
(let [+class-schemata+ (js-obj)]
  (defn declare-class-schema! [klass schema]
    (aset +class-schemata+ klass schema))

  (defn class-schema [klass]
    (aget +class-schemata+ klass)))


(clojure.core/defn type-of [x]
  #+clj (class x)
  #+cljs (js* "typeof ~{}" x))

(defn error! [& format-args]
  #+clj  (throw (RuntimeException. (apply format format-args)))
  #+cljs (throw (js/Error (apply format format-args))))

(defn thrown? [f]
  (let [ex-atom (atom false)]
    (try
      (f)
      (catch #+clj Throwable #+cljs js/Error e
             (reset! ex-atom true)))
    @ex-atom))

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
