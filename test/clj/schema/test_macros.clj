(ns schema.test-macros
  (:require clojure.test))

;; Only for cljs
(defmacro testing [label & form]
  `(do ~@form))
