(ns schema.coerce
  "Experimental extension of schema for input coercion (coercing an input to match a schema)"
  (:require
   #+cljs [cljs.reader :as reader]
   #+clj [clojure.edn :as edn]
   #+clj [schema.macros :as macros]
   [schema.core :as s]
   [schema.utils :as utils])
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
  ((fn rec [s]
     (let [walker (s/walker s rec)]
       (if-let [coercer (coercion-matcher s)]
         (fn [x]
           (macros/try-catchall
            (let [v (coercer x)]
              (if (utils/error? v)
                v
                (walker v)))
            (catch t (macros/validation-error s x t))))
         walker)))
   schema))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Coercion helpers

(macros/defn first-matcher :- CoercionMatcher
  "A matcher that takes the first match from matchers."
  [matchers :- [CoercionMatcher]]
  (fn [schema] (first (keep #(% schema) matchers))))

(defn string->keyword [s]
  (if (string? s) (keyword s) s))

(defn keyword-enum-matcher [schema]
  (when (and (instance? #+clj schema.core.EnumSchema #+cljs s/EnumSchema schema)
             (every? keyword? (.-vs ^schema.core.EnumSchema schema)))
    string->keyword))

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

(let [coercions (merge {s/Keyword string->keyword}
                       #+clj {clojure.lang.Keyword string->keyword
                              s/Int safe-long-cast
                              Long safe-long-cast
                              Double double})]
  (defn json-coercion-matcher
    "A matcher that coerces keywords and keyword enums from strings, and longs and doubles
     from numbers on the JVM (without losing precision)"
    [schema]
    (or (coercions schema)
        (keyword-enum-matcher schema))))

(def edn-read-string #+clj edn/read-string #+cljs reader/read-string)

(let [coercions (merge {s/Keyword string->keyword
                        s/Num (safe edn-read-string)
                        s/Int (safe edn-read-string)}
                       #+clj {clojure.lang.Keyword string->keyword
                              s/Int (safe #(safe-long-cast (edn-read-string %)))
                              Long (safe #(safe-long-cast (edn-read-string %)))
                              Double (safe #(Double/parseDouble %))})]
  (defn string-coercion-matcher
    "A matcher that coerces keywords, keyword enums, s/Num and s/Int,
     and long and doubles (JVM only) from strings."
    [schema]
    (or (coercions schema)
        (keyword-enum-matcher schema))))
