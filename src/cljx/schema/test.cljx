(ns schema.test
  "Utilities for validating and testing with schemas"
  #+clj (:require [schema.core :as s])
  #+cljs (:require-macros [schema.macros :as s]))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schematized testing

(defn validate-schema
  "A fixture for tests"
  [fn-test]
  (s/with-fn-validation (fn-test)))
