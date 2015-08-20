(ns schema.experimental.complete
  "Experimental support for 'completing' partial values to match a target schema,
   e.g. for tests where only part of an object is important."
  (:require
   [clojure.test.check.generators :as check-generators]
   [schema.core :as s]
   [schema.spec.core :as spec]
   [schema.experimental.generators :as generators]
   schema.spec.collection
   schema.spec.leaf
   schema.spec.variant))

(defprotocol Completer
  (completer [s]))

(def +missing+ ::missing)

(extend-protocol Completer
  schema.spec.leaf.LeafSpec
  (completer [s]
    (let [g (generators/leaf-generator s)]
      (fn [x] (if (= x +missing+) (last (check-generators/sample g 5)) x))))

  schema.spec.variant.VariantSpec
  (completer [s] (s/checker s))

  schema.spec.collection.CollectionSpec
  (completer [s]
    (let [c (s/checker s)
          g (generators/generator s {:subschema-generator generators/schema-generator})]
      (fn [x]
        (if-not (= +missing+ x)
          (if (instance? clojure.lang.APersistentMap s) ;; todo: pluggable
            (c (merge (last (check-generators/sample g 5)) x))
            (c x))
          (last (check-generators/sample g 5)))))))

(defn schema-completer [s]
  (completer (s/spec s)))

(defn sample-datum [s x]
  ((spec/run-checker schema-completer true s) x))
