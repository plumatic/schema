(ns schema.spec.collection
  "A collection spec represents a collection of elements,
   each of which is itself schematized."
  (:require
   [schema.utils :as utils]
   [schema.spec.core :as spec]))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Collection Specs

(defn- element-transformer [e params then]
  (let [parser (:parser e)
        c (spec/sub-checker e params)]
    #+clj (fn [^java.util.List res x]
            (then res (parser (fn [t] (.add res (if (utils/error? t) t (c t)))) x)))
    #+cljs (fn [res x]
             (then res (parser (fn [t] (swap! res conj (if (utils/error? t) t (c t)))) x)))))

#+clj ;; for performance
(defn- has-error? [^java.util.List l]
  (let [it (.iterator l)]
    (loop []
      (if (.hasNext it)
        (if (utils/error? (.next it))
          true
          (recur))
        false))))

#+cljs
(defn- has-error? [l]
  (some utils/error? l))

(defrecord CollectionSpec [pre constructor elements on-error]
  spec/CoreSpec
  (subschemas [this] (map :schema elements))
  (checker [this params]
    (let [constructor (if (:return-walked? params) constructor (fn [_] nil))
          t (reduce
             (fn [f e]
               (element-transformer e params f))
             (fn [_ x] x)
             (reverse elements))]
      (fn [x]
        (or (pre x)
            (let [res #+clj (java.util.ArrayList.) #+cljs (atom [])
                  remaining (t res x)
                  res #+clj res #+cljs @res]
              (if (or (seq remaining) (has-error? res))
                (utils/error (on-error x res remaining))
                (constructor res))))))))

(defn collection-spec
  "A collection represents a collection of elements, each of which is itself
   schematized.  At the top level, the collection has a precondition
   (presumably on the overall type), a constructor for the collection from a
   sequence of items, an element spec, and a function that constructs a
   descriptive error on failure.

   The element spec is a sequence of maps, each of which provides an element
   schema, cardinality, parser (allowing for efficient processing of
   structured collections), and optional error wrapper."
  [pre ;- spec/Precondition
   constructor ;- (s/=> s/Any [(s/named s/Any 'checked-value)])
   elements ;- [{:schema (s/protocol Schema)
   ;;            :cardinality (s/enum :exactly-one :at-most-one :zero-or-more)
   ;;            :parser (s/=> s/Any (s/=> s/Any s/Any) s/Any) ; takes [item-fn coll], calls item-fn on matching items, returns remaining.
   ;;            (s/optional-key :error-wrap) (s/pred fn?)}]
   on-error ;- (=> s/Any (s/named s/Any 'value) [(s/named s/Any 'checked-element)] [(s/named s/Any 'unmatched-element)])
   ]
  (->CollectionSpec pre constructor elements on-error))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Helpers for creating 'elements'

(defn all-elements [schema]
  {:schema schema
   :cardinality :zero-or-more
   :parser (fn [item-fn coll] (doseq [x coll] (item-fn x)) nil)})

(defn one-element [required? schema parser]
  {:schema schema
   :cardinality (if required? :exactly-one :at-most-one)
   :parser parser})
