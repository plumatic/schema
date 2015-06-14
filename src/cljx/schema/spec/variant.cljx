(ns schema.spec.variant
  (:require
   #+clj [schema.macros :as macros]
   [schema.utils :as utils]
   [schema.spec.core :as spec])
  #+cljs (:require-macros [schema.macros :as macros]))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Variant Specs

(defn- option-step [o params else]
  (let [g (:guard o)
        c (spec/sub-checker o params)
        step (if g
               (fn [x] (if (g x) (c x) (else x)))
               c)]
    (if-let [wrap-error (:wrap-error o)]
      (fn [x]
        (let [res (step x)]
          (if-let [e (utils/error-val res)]
            (utils/error (wrap-error e))
            res)))
      step)))

(defrecord VariantSpec
    [pre ;- spec/Precondition
     options ;- [{:schema (s/protocol Schema)
     ;;           (s/optional-key :guard) (s/pred fn?)
     ;;           (s/optional-key :error-wrap) (s/pred fn?)}]
     err-f
     ]
  spec/CoreSpec
  (subschemas [this] (map :schema options))
  (checker [this params]
    (let [t (reduce
             (fn [f o]
               (option-step o params f))
             (fn [x] (macros/validation-error this x (err-f (utils/value-name x))))
             (reverse options))]
      (fn [x]
        (or (pre x)
            (t x))))))

(defn variant-spec
  "A variant spec represents a choice between a set of alternative
   subschemas, e.g., a tagged union. TODO: more."
  ([pre options]
     (variant-spec pre options nil))
  ([pre options err-f]
     (macros/assert! (or err-f (nil? (:guard (last options))))
                     "when last option has a guard, err-f must be provided")
     (->VariantSpec pre options err-f)))
