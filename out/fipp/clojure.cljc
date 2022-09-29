(ns fipp.clojure
  "Provides a pretty document serializer and pprint fn for Clojure code.
  See fipp.edn for pretty printing Clojure/EDN data structures"
  (:require [clojure.walk :as walk]
            [fipp.visit :as v :refer [visit]]
            [fipp.edn :as edn]))


;;; Helper functions

(defn block [nodes]
  [:nest 2 (interpose :line nodes)])

(defn list-group [& nodes]
  [:group "(" nodes ")"])

(defn maybe-a [pred xs]
  (let [x (first xs)] (if (pred x) [x (rest xs)] [nil xs])))


;;; Format case, cond, condp

(defn pretty-cond-clause [p [test result]]
  [:group (visit p test) :line [:nest 2 (visit p result)]])

(defn pretty-case [p [head expr & more]]
  (let [clauses (partition 2 more)
        default (when (odd? (count more)) (last more))]
    (list-group
      (visit p head) " " (visit p expr) :line
      (block (concat (map #(pretty-cond-clause p %) clauses)
                     (when default [(visit p default)]))))))

(defn pretty-cond [p [head & more]]
  (let [clauses (partition 2 more)]
    (list-group
      (visit p head) :line
      (block (map #(pretty-cond-clause p %) clauses)))))

;;TODO this will get tripped up by ternary (test :>> result) clauses
(defn pretty-condp [p [head pred expr & more]]
  (let [clauses (partition 2 more)
        default (when (odd? (count more)) (last more))]
    (list-group
      (visit p head) " " (visit p pred) " " (visit p expr) :line
      (block (concat (map #(pretty-cond-clause p %) clauses)
                     (when default [(visit p default)]))))))


;;; Format arrows, def, if, and similar

(defn pretty-arrow [p [head & stmts]]
  (list-group
    (visit p head) " "
    [:align (interpose :line (map #(visit p %) stmts))]))

;;TODO we're also using this to format def – should that be separate?
(defn pretty-if [p [head test & more]]
  (list-group
    (visit p head) " " (visit p test) :line
    (block (map #(visit p %) more))))


;;; Format defn, fn, and similar

(defn pretty-method [p [params & body]]
  (list-group
    (visit p params) :line
    (block (map #(visit p %) body))))

(defn pretty-defn [p [head fn-name & more]]
  (let [[docstring more] (maybe-a string? more)
        [attr-map more]  (maybe-a map?    more)
        [params body]    (maybe-a vector? more)
        params-on-first-line?  (and params (nil? docstring) (nil? attr-map))
        params-after-attr-map? (and params (not params-on-first-line?))]
    (list-group
      (concat [(visit p head) " " (visit p fn-name)]
              (when params-on-first-line? [" " (visit p params)]))
      :line
      (block (concat (when docstring [(visit p docstring)])
                     (when attr-map  [(visit p attr-map)])
                     (when params-after-attr-map? [(visit p params)])
                     (if body (map #(visit p %) body)
                              (map #(pretty-method p %) more)))))))

(defn pretty-fn [p [head & more]]
  (let [[fn-name more] (maybe-a symbol? more)
        [params body]  (maybe-a vector? more)]
    (list-group
      (concat [(visit p head)]
              (when fn-name [" " (visit p fn-name)])
              (when params  [" " (visit p params)]))
      :line
      (block (if body (map #(visit p %) body)
                      (map #(pretty-method p %) more))))))

(defn pretty-fn* [p [_ params body :as form]]
  (if (and (vector? params) (seq? body))
    (let [[inits rests] (split-with #(not= % '&) params)
          params* (merge (if (= (count inits) 1)
                           {(first inits) '%}
                           (zipmap inits (map #(symbol (str \% (inc %))) (range))))
                         (when (seq rests) {(second rests) '%&}))
          body* (walk/prewalk-replace params* body)]
      [:group "#(" [:align 2 (interpose :line (map #(visit p %) body*))] ")"])
    (pretty-fn p form)))


;;; Format ns

(defn pretty-libspec [p [head & clauses]]
  (list-group
    (visit p head) " "
    [:align (interpose :line (map #(visit p %) clauses))]))

(defn pretty-ns [p [head ns-sym & more]]
  (let [[docstring more] (maybe-a string? more)
        [attr-map specs] (maybe-a map?    more)]
    (list-group
      (visit p head) " " (visit p ns-sym) :line
      (block (concat (when docstring [(visit p docstring)])
                     (when attr-map  [(visit p attr-map)])
                     (map #(pretty-libspec p %) specs))))))


;;; Format deref, quote, unquote, var

(defn pretty-quote [p [macro arg]]
  [:span (case (keyword (name macro))
           :deref "@", :quote "'", :unquote "~", :var "#'")
         (visit p arg)])

;;; Format let, loop, and similar

(defn pretty-bindings [p bvec]
  (let [kvps (for [[k v] (partition 2 bvec)]
               [:span (visit p k) " " [:align (visit p v)]])]
    [:group "[" [:align (interpose [:line ", "] kvps)] "]"]))

(defn pretty-let [p [head bvec & body]]
  (list-group
    (visit p head) " " (pretty-bindings p bvec) :line
    (block (map #(visit p %) body))))


;;; Types and interfaces

(defn pretty-impls [p opts+specs]
  ;;TODO parse out opts
  ;;TODO parse specs and call pretty on methods
  (block (map #(visit p %) opts+specs)))

(defn pretty-type [p [head fields & opts+specs]]
  (list-group (visit p head) " " (visit p fields) :line
              (pretty-impls p opts+specs)))

(defn pretty-reify [p [head & opts+specs]]
  (list-group (visit p head) :line
              (pretty-impls p opts+specs)))


;;; Symbol table

(defn build-symbol-map [dispatch]
  (into {} (for [[pretty-fn syms] dispatch
                 sym syms
                 sym (cons sym (when-not (special-symbol? sym)
                                 [(symbol "clojure.core" (name sym))
                                  (symbol "cljs.core" (name sym))]))]
             [sym pretty-fn])))

(def default-symbols
  (build-symbol-map
    {pretty-arrow '[. .. -> ->> and doto or some-> some->>]
     pretty-case  '[case cond-> cond->>]
     pretty-cond  '[cond]
     pretty-condp '[condp]
     pretty-defn  '[defmacro defmulti defn defn-]
     pretty-fn    '[fn]
     pretty-fn*   '[fn*]
     pretty-if    '[def defonce if if-not when when-not]
     pretty-ns    '[ns]
     pretty-let   '[binding doseq dotimes for if-let if-some let let* loop loop*
                    when-first when-let when-some with-local-vars with-open with-redefs]
     pretty-quote '[deref quote unquote var]
     pretty-type  '[deftype defrecord]
     pretty-reify '[reify]}))


(defn pprint
  ([x] (pprint x {}))
  ([x options]
   (edn/pprint x (merge {:symbols default-symbols} options))))
