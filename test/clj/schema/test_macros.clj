(ns schema.test-macros
  (:require [schema.core :as s]
            clojure.test
            [schema.utils :as utils]))

(defmacro valid! [s x]
  `(clojure.test/is (do (s/validate ~s ~x) true)))

(defmacro invalid! [s x]
  `(clojure.test/is (utils/thrown? #(s/validate ~s ~x))))

;; Only for cljs
(defmacro testing [label & form]
  `(do ~@form))
