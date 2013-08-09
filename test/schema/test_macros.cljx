(ns schema.test-macros
  (:use clojure.test)
  (:require [schema.core :as s]
            [schema.utils :as utils]))

(defmacro valid! [s x]
  `(is (do (s/validate ~s ~x) true)))

(defmacro invalid! [s x]
  `(is (utils/thrown? #(s/validate ~s ~x))))
