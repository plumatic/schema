(ns schema.test
  "Utilities for testing with schemas"
  (:require [schema.core :as s :include-macros true]
            #+clj clojure.test))

(defn validate-schemas
  "A fixture for tests: put
   (use-fixtures :once schema.test/validate-schemas)
   in your test file to turn on schema validation globally during all test executions."
  [fn-test]
  (s/with-fn-validation (fn-test)))

#+clj
(defmacro deftest
  "A test with schema validation turned on globally during execution of the body."
  [name & body]
  `(clojure.test/deftest ~name
     (s/with-fn-validation
       ~@body)))
