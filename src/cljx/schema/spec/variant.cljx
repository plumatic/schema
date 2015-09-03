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
               (fn [x]
                 (let [guard-result (macros/try-catchall
                                     (g x)
                                     (catch e# ::exception))]
                   (cond (= ::exception guard-result)
                         (macros/validation-error
                          (:schema o)
                          x
                          (list (symbol (utils/fn-name g)) (utils/value-name x))
                          'throws?)

                         guard-result
                         (c x)

                         :else
                         (else x))))
               c)]
    (if-let [wrap-error (:wrap-error o)]
      (fn [x]
        (let [res (step x)]
          (if-let [e (utils/error-val res)]
            (utils/error (wrap-error e))
            res)))
      step)))

(defrecord VariantSpec [pre options err-f]
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
   subschemas, e.g., a tagged union. It has an overall precondition,
   set of options, and error function.

   The semantics of `options` is that the options are processed in
   order. During checking, the datum must match the schema for the
   first option for which `guard` passes. During generation, any datum
   generated from an option will pass the corresponding `guard`.

   err-f is a function to produce an error message if none
   of the guards match (and must be passed unless the last option has no
   guard)."
  ([pre options]
     (variant-spec pre options nil))
  ([pre ;- spec/Precondition
    options ;- [{:schema (s/protocol Schema)
    ;;           (s/optional-key :guard) (s/pred fn?)
    ;;           (s/optional-key :error-wrap) (s/pred fn?)}]
    err-f ;- (s/pred fn?)
    ]
     (macros/assert! (or err-f (nil? (:guard (last options))))
                     "when last option has a guard, err-f must be provided")
     (->VariantSpec pre options err-f)))
