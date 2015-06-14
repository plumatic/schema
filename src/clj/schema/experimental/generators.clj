(ns schema.experimental.generators
  "(Very) experimental support for compiling schemas to test.check generators.
   TODO: support for more types, extensible leaf generators, constraints, etc.
   Not currently cljx only because was running into issues with test.check."
  (:require
   [clojure.test.check.generators :as generators]
   [schema.spec.core :as spec]
   schema.spec.collection
   schema.spec.leaf
   schema.spec.variant
   [schema.core :as s]
   [schema.macros :as macros]))

(defn g-by [f & args]
  (generators/fmap
   (partial apply f)
   (apply generators/tuple args)))

(defn g-apply-by [f args]
  (generators/fmap f (apply generators/tuple args)))

(defn- sub-generator
  [{:keys [schema]}
   {:keys [subschema-generator ^java.util.Map cache] :as params}]
  (spec/with-cache cache schema
    (fn [d] (generators/make-gen (fn [r s] (generators/call-gen @d r s))))
    (fn [] (subschema-generator schema params))))

(defprotocol LeafGeneratable
  (leaf-generator [s] "return a generator for s"))

(extend-type nil
  LeafGeneratable
  (leaf-generator [x]
    (cond
     (= x s/Int) generators/int
     (= x s/Str) generators/string-ascii
     (= x s/Keyword) generators/keyword
     :else (generators/return x))))

(extend-type schema.core.EqSchema
  LeafGeneratable
  (leaf-generator [x]
    (generators/return (:v x))))

(defprotocol Generator
  (generator [s params]))

;; TODO: do stuff with guards and preconditions?
(extend-protocol Generator
  schema.spec.variant.VariantSpec
  (generator [s params]
    (generators/one-of
     (for [o (macros/safe-get s :options)]
       (sub-generator o params))))

  schema.spec.collection.CollectionSpec
  (generator [s params]
    (generators/fmap
     (comp (:constructor s) (partial apply concat))
     (apply
      generators/tuple
      (for [{:keys [cardinality] :as e} (:elements s)]
        (let [g (sub-generator e params)]
          (case cardinality
            :exactly-one (generators/fmap vector g)
            :at-most-one (generators/one-of [(generators/return nil) (generators/fmap vector g)])
            :zero-or-more (generators/vector g))))))))

(defn schema-generator [s params]
  (let [sp (s/spec s)]
    (if (instance? schema.spec.leaf.LeafSpec sp)
      (leaf-generator s)
      (generator sp params))))

(defn generate [s]
  (generators/sample
   (schema-generator
    s
    {:subschema-generator schema-generator
     :cache (java.util.IdentityHashMap.)}) 10))
