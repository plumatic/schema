(ns schema.spec.core
  "Protocol and preliminaries for Schema 'specs', which are a common language
   for schemas to use to express their structure."
  (:require
   #+clj [schema.macros :as macros]
   [schema.utils :as utils])
  #+cljs (:require-macros [schema.macros :as macros]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Core spec protocol

(defprotocol CoreSpec
  "Specs are a common language for Schemas to express their structure.
   These two use-cases aren't priveledged, just the two that are considered core
   to being a Spec."
  (subschemas [this]
    "List all subschemas")
  (checker [this params]
    "Create a function that takes [data], and either returns a walked version of data
     (by default, usually just data), or a utils/ErrorContainer containing value that looks
     like the 'bad' parts of data with ValidationErrors at the leaves describing the failures.

     params are: subschema-checker, return-walked?, and cache.

     params is a map specifying:
      - subschema-checker - a function for checking subschemas
      - returned-walked? - a boolean specifying whether to return a walked version of the data
        (otherwise, nil is returned which increases performance)
      - cache - a map structure from schema to checker, which speeds up checker creation
        when the same subschema appears multiple times, and also facilitates handling
        recursive schemas."))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Preconditions

;; A Precondition is a function of a value that returns a
;; ValidationError if the value does not satisfy the precondition,
;; and otherwise returns nil.
;; e.g., (s/defschema Precondition (s/=> (s/maybe schema.utils.ValidationError) s/Any))
;; as such, a precondition is essentially a very simple checker.

(def +no-precondition+ (fn [_] nil))

(defn precondition
  "Helper for making preconditions.
   Takes a schema, predicate p, and error function err-f.
   If the datum passes the predicate, returns nil.
   Otherwise, returns a validation error with description (err-f datum-description),
   where datum-description is a (short) printable standin for the datum."
  [s p err-f]
  (fn [x]
    (when-let [reason (macros/try-catchall (when-not (p x) 'not) (catch e# 'throws?))]
      (macros/validation-error s x (err-f (utils/value-name x)) reason))))

(defmacro simple-precondition
  "A simple precondition where f-sym names a predicate (e.g. (simple-precondition s map?))"
  [s f-sym]
  `(precondition ~s ~f-sym #(list (quote ~f-sym) %)))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Helpers

(defn run-checker
  "A helper to start a checking run, by setting the appropriate params.
   For examples, see schema.core/checker or schema.coerce/coercer."
  [f return-walked? s]
  (f
   s
   {:subschema-checker f
    :return-walked? return-walked?
    :cache #+clj (java.util.IdentityHashMap.) #+cljs (atom {})}))

(defn with-cache [cache cache-key wrap-recursive-delay result-fn]
  (if-let [w #+clj (.get ^java.util.Map cache cache-key) #+cljs (@cache cache-key)]
    (if (= ::in-progress w) ;; recursive
      (wrap-recursive-delay (delay #+clj (.get ^java.util.Map cache cache-key) #+cljs (@cache cache-key)))
      w)
    (do #+clj (.put ^java.util.Map cache cache-key ::in-progress) #+cljs (swap! cache assoc cache-key ::in-progress)
        (let [res (result-fn)]
          #+clj (.put ^java.util.Map cache cache-key res) #+cljs (swap! cache assoc cache-key res)
          res))))

(defn sub-checker
  "Should be called recursively on each subschema in the 'checker' method of a spec.
   Handles caching and error wrapping behavior."
  [{:keys [schema error-wrap]}
   {:keys [subschema-checker cache] :as params}]
  (let [sub (with-cache cache schema
              (fn [d] (fn [x] (@d x)))
              (fn [] (subschema-checker schema params)))]
    (if error-wrap
      (fn [x]
        (let [res (sub x)]
          (if-let [e (utils/error-val res)]
            (utils/error (error-wrap res))
            res)))
      sub)))
