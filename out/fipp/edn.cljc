(ns fipp.edn
  "Provides a pretty document serializer and pprint fn for Clojure/EDN forms.
  See fipp.clojure for pretty printing Clojure code."
  (:require [fipp.ednize :refer [edn record->tagged]]
            [fipp.visit :refer [visit visit*]]
            [fipp.engine :refer (pprint-document)]))

(defn pretty-coll [{:keys [print-level print-length] :as printer}
                   open xs sep close f]
  (let [printer (cond-> printer print-level (update :print-level dec))
        xform (comp (if print-length (take print-length) identity)
                    (map #(f printer %))
                    (interpose sep))
        ys (if (pos? (or print-level 1))
             (sequence xform xs)
             "#")
        ellipsis (when (and print-length (seq (drop print-length xs)))
                   [:span sep "..."])]
    [:group open [:align ys ellipsis] close]))

(defrecord EdnPrinter [symbols print-meta print-length print-level]

  fipp.visit/IVisitor


  (visit-unknown [this x]
    (visit this (edn x)))


  (visit-nil [this]
    [:text "nil"])

  (visit-boolean [this x]
    [:text (str x)])

  (visit-string [this x]
    [:text (pr-str x)])

  (visit-character [this x]
    [:text (pr-str x)])

  (visit-symbol [this x]
    [:text (str x)])

  (visit-keyword [this x]
    [:text (str x)])

  (visit-number [this x]
    [:text (pr-str x)])

  (visit-seq [this x]
    (if-let [pretty (symbols (first x))]
      (pretty this x)
      (pretty-coll this "(" x :line ")" visit)))

  (visit-vector [this x]
    (pretty-coll this "[" x :line "]" visit))

  (visit-map [this x]
    (pretty-coll this "{" x [:span "," :line] "}"
      (fn [printer [k v]]
        [:span (visit printer k) " " (visit printer v)])))

  (visit-set [this x]
    (pretty-coll this "#{" x :line "}" visit))

  (visit-tagged [this {:keys [tag form]}]
    [:group "#" (pr-str tag)
            (when (or (and print-meta (meta form))
                      (not (coll? form)))
              " ")
            (visit this form)])


  (visit-meta [this m x]
    (if print-meta
      [:align [:span "^" (visit this m)] :line (visit* this x)]
      (visit* this x)))

  (visit-var [this x]
    [:text (str x)])

  (visit-pattern [this x]
    [:text (pr-str x)])

  (visit-record [this x]
    (visit this (record->tagged x)))

  )

(defn pprint
  ([x] (pprint x {}))
  ([x options]
   (let [defaults {:symbols {}
                   :print-length *print-length*
                   :print-level *print-level*
                   :print-meta *print-meta*}
         printer (map->EdnPrinter (merge defaults options))]
     (binding [*print-meta* false]
       (pprint-document (visit printer x) options)))))
