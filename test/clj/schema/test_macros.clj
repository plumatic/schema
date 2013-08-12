(ns schema.test-macros
  (:require clojure.test))

(defmacro valid! [s x]
  `(clojure.test/is (do (schema.core/validate ~s ~x) true)))

(defmacro invalid! [s x]
  `(clojure.test/is (schema.utils/thrown? #(schema.core/validate ~s ~x))))

;; Only for cljs
(defmacro testing [label & form]
  `(do ~@form))
