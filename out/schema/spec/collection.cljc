(ns schema.spec.collection
  "A collection spec represents a collection of elements,
   each of which is itself schematized."
  (:require
   #?(:clj [schema.macros :as macros])
   [schema.utils :as utils]
   [schema.spec.core :as spec])
  #?(:cljs (:require-macros [schema.macros :as macros])))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Collection Specs

(declare sequence-transformer)

(defn- element-transformer [e params then]
  (if (vector? e)
    (case (first e)
      ::optional
      (sequence-transformer (next e) params then)

      ::remaining
      (let [_ (macros/assert! (= 2 (count e)) "remaining can have only one schema.")
            c (spec/sub-checker (second e) params)]
        #?(:clj (fn [^java.util.List res x]
                  (doseq [i x]
                    (.add res (c i)))
                  (then res nil))
           :cljs (fn [res x]
                   (swap! res into (map c x))
                   (then res nil)))))

    (let [parser (:parser e)
          c (spec/sub-checker e params)]
      #?(:clj (fn [^java.util.List res x]
                (then res (parser (fn [t] (.add res (if (utils/error? t) t (c t)))) x)))
         :cljs (fn [res x]
                 (then res (parser (fn [t] (swap! res conj (if (utils/error? t) t (c t)))) x)))))))

(defn- sequence-transformer [elts params then]
  (macros/assert! (not-any? #(and (vector? %) (= (first %) ::remaining)) (butlast elts))
                  "Remaining schemas must be in tail position.")
  (reduce
   (fn [f e]
     (element-transformer e params f))
   then
   (reverse elts)))

#?(:clj ;; for performance
(defn- has-error? [^java.util.List l]
  (let [it (.iterator l)]
    (loop []
      (if (.hasNext it)
        (if (utils/error? (.next it))
          true
          (recur))
        false))))

:cljs
(defn- has-error? [l]
  (some utils/error? l)))

(defn subschemas [elt]
  (if (map? elt)
    [(:schema elt)]
    (do (assert (vector? elt))
        (assert (#{::remaining ::optional} (first elt)))
        (mapcat subschemas (next elt)))))

(defrecord CollectionSpec [pre konstructor elements on-error]
  spec/CoreSpec
  (subschemas [this] (mapcat subschemas elements))
  (checker [this params]
    (let [konstructor (if (:return-walked? params) konstructor (fn [_] nil))
          t (sequence-transformer elements params (fn [_ x] x))]
      (fn [x]
        (or (pre x)
            (let [res #?(:clj (java.util.ArrayList.) :cljs (atom []))
                  remaining (t res x)
                  res #?(:clj res :cljs @res)]
              (if (or (seq remaining) (has-error? res))
                (utils/error (on-error x res remaining))
                (konstructor res))))))))


(defn collection-spec
  "A collection represents a collection of elements, each of which is itself
   schematized.  At the top level, the collection has a precondition
   (presumably on the overall type), a constructor for the collection from a
   sequence of items, an element spec, and a function that constructs a
   descriptive error on failure.

   The element spec is a nested list structure, in which the leaf elements each
   provide an element schema, parser (allowing for efficient processing of structured
   collections), and optional error wrapper.  Each item in the list can be a leaf
   element or an `optional` nested element spec (see below).  In addition, the final
   element can be a `remaining` schema (see below).

   Note that the `optional` carries no semantics with respect to validation;
   the user must ensure that the parser enforces the desired semantics, which
   should match the structure of the spec for proper generation."
  [pre ;- spec/Precondition
   konstructor ;- (s/=> s/Any [(s/named s/Any 'checked-value)])
   elements ;- [(s/cond-pre
   ;;            {:schema (s/protocol Schema)
   ;;             :parser (s/=> s/Any (s/=> s/Any s/Any) s/Any) ; takes [item-fn coll], calls item-fn on matching items, returns remaining.
   ;;             (s/optional-key :error-wrap) (s/pred fn?)}
   ;;            [(s/one ::optional) (s/recursive Elements)]]
   ;;          where the last element can optionally be a [::remaining schema]
   on-error ;- (=> s/Any (s/named s/Any 'value) [(s/named s/Any 'checked-element)] [(s/named s/Any 'unmatched-element)])
   ]
  (->CollectionSpec pre konstructor elements on-error))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Helpers for creating 'elements'

(defn remaining
  "All remaining elements must match schema s"
  [s]
  [::remaining s])

(defn optional
  "If any more elements are present, they must match the elements in 'ss'"
  [& ss]
  (vec (cons ::optional ss)))

(defn all-elements [schema]
  (remaining
   {:schema schema
    :parser (fn [coll] (macros/error! (str "should never be not called")))}))

(defn one-element [required? schema parser]
  (let [base {:schema schema :parser parser}]
    (if required?
      base
      (optional base))))

(defn optional-tail [schema parser more]
  (into (optional {:schema schema :parser parser}) more))
