(ns schema.coerce
  "Experimental extension of schema for input coercion (coercing an input to match a schema)"
  (:require
   #+cljs [cljs.reader :as reader]
   #+clj [clojure.edn :as edn]
   #+clj [schema.macros :as macros]
   [schema.core :as s]
   [schema.utils :as utils]
   [clojure.string :as str])
  #+cljs (:require-macros [schema.macros :as macros]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Generic input coercion

(def Schema
  "A Schema for Schemas"
  #+clj (s/protocol s/Schema)
  #+cljs (macros/protocol s/Schema))

(def CoercionMatcher
  "A function from schema to coercion function, or nil if no special coercion is needed.
   The returned function is applied to the corresponding data before validation (or walking/
   coercion of its sub-schemas, if applicable)"
  (macros/=> (s/maybe (macros/=> s/Any s/Any)) Schema))

(macros/defn coercer
  "Produce a function that simultaneously coerces and validates a datum."
  [schema coercion-matcher :- CoercionMatcher]
  (s/start-walker
   (utils/memoize-id
    (fn [s]
      (let [walker (s/walker s)]
        (if-let [coercer (coercion-matcher s)]
          (fn [x]
            (macros/try-catchall
             (let [v (coercer x)]
               (if (utils/error? v)
                 v
                 (walker v)))
             (catch t (macros/validation-error s x t))))
          walker))))
   schema))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Coercion helpers

(macros/defn first-matcher :- CoercionMatcher
  "A matcher that takes the first match from matchers."
  [matchers :- [CoercionMatcher]]
  (fn [schema] (first (keep #(% schema) matchers))))

(defn string->keyword [s]
  (if (string? s) (keyword s) s))

(defn string->boolean
  "returns true for strings that are equal, ignoring case, to the string 'true'
   (following java.lang.Boolean/parseBoolean semantics)"
  [s]
  (if (string? s) (= "true" (str/lower-case s)) s))

(defn keyword-enum-matcher [schema]
  (when (and (instance? #+clj schema.core.EnumSchema #+cljs s/EnumSchema schema)
             (every? keyword? (.-vs ^schema.core.EnumSchema schema)))
    string->keyword))

(defn set-matcher [schema]
  (if (instance? #+clj clojure.lang.APersistentSet #+cljs cljs.core.PersistentHashSet schema)
    (fn [x] (if (sequential? x) (set x) x))))

(defn safe
  "Take a single-arg function f, and return a single-arg function that acts as identity
   if f throws an exception, and like f otherwise.  Useful because coercers are not explicitly
   guarded for exceptions, and failing to coerce will generally produce a more useful error
   in this case."
  [f]
  (fn [x] (macros/try-catchall (f x) (catch e x))))

#+clj (def safe-long-cast
        "Coerce x to a long if this can be done without losing precision, otherwise return x."
        (safe
         (fn [x]
           (let [l (long x)]
             (if (== l x)
               l
               x)))))

(def ^:no-doc +json-coercions+
  (merge
   {s/Keyword string->keyword
    s/Bool string->boolean}
   #+clj {clojure.lang.Keyword string->keyword
          s/Int safe-long-cast
          Long safe-long-cast
          Double (safe double)
          Boolean string->boolean}))

(defn json-coercion-matcher
  "A matcher that coerces keywords and keyword enums from strings, and longs and doubles
     from numbers on the JVM (without losing precision)"
  [schema]
  (or (+json-coercions+ schema)
      (keyword-enum-matcher schema)
      (set-matcher schema)))

(def edn-read-string
  "Reads one object from a string. Returns nil when string is nil or empty"
  #+clj edn/read-string #+cljs reader/read-string)

(def ^:no-doc +string-coercions+
  (merge
   +json-coercions+
   {s/Num (safe edn-read-string)
    s/Int (safe edn-read-string)}
   #+clj {s/Int (safe #(safe-long-cast (edn-read-string %)))
          Long (safe #(safe-long-cast (edn-read-string %)))
          Double (safe #(Double/parseDouble %))}))

(defn string-coercion-matcher
  "A matcher that coerces keywords, keyword enums, s/Num and s/Int,
     and long and doubles (JVM only) from strings."
  [schema]
  (or (+string-coercions+ schema)
      (keyword-enum-matcher schema)))
