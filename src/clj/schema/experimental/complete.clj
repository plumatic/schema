(ns schema.experimental.complete
  "(Extremely) experimental support for 'completing' partial datums to match
   a schema. To use it, you must provide your own test.check dependency."
  (:require
   [clojure.test.check.generators :as check-generators]
   [schema.spec.core :as spec]
   schema.spec.collection
   schema.spec.leaf
   schema.spec.variant
   [schema.coerce :as coerce]
   [schema.core :as s]
   [schema.macros :as macros]
   [schema.utils :as utils]
   [schema.experimental.generators :as generators]))

(def +missing+ ::missing)

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Private helpers

(defprotocol Completer
  (completer* [spec s sub-checker generator-opts]
    "A function applied to a datum as part of coercion to complete missing fields."))

(defn sample [g]
  (check-generators/generate g 10))

(extend-protocol Completer
  schema.spec.variant.VariantSpec
  (completer* [spec s sub-checker generator-opts]
    (let [g (apply generators/generator s generator-opts)]
      (if (and (class? s) (isa? s clojure.lang.IRecord) (utils/class-schema s))
        (fn record-completer [x]
          (sub-checker (into (sample g) x)))
        (fn variant-completer [x]
          (if (= +missing+ x)
            (sample g)
            (sub-checker x))))))

  schema.spec.collection.CollectionSpec
  (completer* [spec s sub-checker generator-opts]
    (if (instance? clojure.lang.APersistentMap s) ;; todo: pluggable
      (let [g (apply generators/generator s generator-opts)]
        (fn map-completer [x]
          (if (= +missing+ x)
            (sample g)
            ;; for now, just do required keys when user provides input.
            (let [ks (distinct (concat (keys x)
                                       (->> s
                                            keys
                                            (filter s/required-key?)
                                            (map s/explicit-schema-key))))]
              (sub-checker
               (into {} (for [k ks] [k (get x k +missing+)])))))))
      (let [g (apply generators/generator s generator-opts)]
        (fn coll-completer [x]
          (if (= +missing+ x)
            (sample g)
            (sub-checker x))))))

  schema.spec.leaf.LeafSpec
  (completer* [spec s sub-checker generator-opts]
    (let [g (apply generators/generator s generator-opts)]
      (fn leaf-completer [x]
        (if (= +missing+ x)
          (sample g)
          x)))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Public

(s/defn completer
  "Produce a function that simultaneously coerces, completes, and validates a datum."
  ([schema] (completer schema {}))
  ([schema coercion-matcher] (completer schema coercion-matcher {}))
  ([schema coercion-matcher leaf-generators]
     (completer schema coercion-matcher leaf-generators {}))
  ([schema
    coercion-matcher :- coerce/CoercionMatcher
    leaf-generators :- generators/LeafGenerators
    wrappers :- generators/GeneratorWrappers]
     (spec/run-checker
      (fn [s params]
        (let [c (spec/checker (s/spec s) params)
              coercer (or (coercion-matcher s) identity)
              completr (completer* (s/spec s) s c [leaf-generators wrappers])]
          (fn [x]
            (macros/try-catchall
             (let [v (coercer x)]
               (if (utils/error? v)
                 v
                 (completr v)))
             (catch t (macros/validation-error s x t))))))
      true
      schema)))

(defn complete
  "Fill in partial-datum to make it validate schema."
  [partial-datum & completer-args]
  ((apply completer completer-args) partial-datum))
