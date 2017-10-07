(ns schema.experimental.abstract-map
  "Schemas representing abstract classes and subclasses"
  (:require
   [clojure.string :as str]
   [schema.core :as s :include-macros true]
   [schema.spec.core :as spec]
   [schema.spec.variant :as variant]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Private: helpers

(defprotocol PExtensibleSchema
  (extend-schema! [this extension schema-name dispatch-values]))

;; a "subclass"
(defrecord SchemaExtension [schema-name base-schema extended-schema explain-value]
  s/Schema
  (spec [this]
    (variant/variant-spec spec/+no-precondition+ [{:schema extended-schema}]))
  (explain [this]
    (list 'extend-schema
          schema-name
          (s/schema-name base-schema)
          (s/explain explain-value))))

;; an "abstract class"
(defrecord AbstractSchema [sub-schemas dispatch-key schema open?]
  s/Schema
  (spec [this]
    (variant/variant-spec
     spec/+no-precondition+
     (concat
      (for [[k s] @sub-schemas]
        {:guard #(= (keyword (dispatch-key %)) (keyword k))
         :schema s})
      (when open?
        [{:schema (assoc schema dispatch-key s/Keyword s/Any s/Any)}]))
     (fn [v] (list (set (keys @sub-schemas)) (list dispatch-key v)))))
  (explain [this]
    (list 'abstract-map-schema dispatch-key (s/explain schema) (set (keys @sub-schemas))))

  PExtensibleSchema
  (extend-schema! [this extension schema-name dispatch-values]
    (let [sub-schema (assoc (merge schema extension)
                       dispatch-key (apply s/enum dispatch-values))
          ext-schema (s/schema-with-name
                      (SchemaExtension. schema-name this sub-schema extension)
                      (name schema-name))]
      (swap! sub-schemas merge (into {} (for [k dispatch-values] [k ext-schema])))
      ext-schema)))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Public

(s/defn abstract-map-schema
  "A schema representing an 'abstract class' map that must match at least one concrete
   subtype (indicated by the value of dispatch-key, a keyword).  Add subtypes by calling
   `extend-schema`."
  [dispatch-key :- s/Keyword schema :- (s/pred map?)]
  (AbstractSchema. (atom {}) dispatch-key schema false))

(s/defn open-abstract-map-schema
  "Like abstract-map-schema, but allows unknown types to validate (for, e.g. forward
   compatibility)."
  [dispatch-key :- s/Keyword schema :- (s/pred map?)]
  (AbstractSchema. (atom {}) dispatch-key schema true))

(defmacro extend-schema
  [schema-name extensible-schema dispatch-values extension]
  `(def ~schema-name
     (extend-schema! ~extensible-schema ~extension '~schema-name ~dispatch-values)))

(defn sub-schemas [abstract-schema]
  @(.-sub-schemas ^AbstractSchema abstract-schema))
