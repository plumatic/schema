(ns schema.test-runner
  (:require [doo.runner :refer-macros [doo-tests]]
            [schema.coerce-test]
            [schema.core-test]
            [schema.experimental.abstract-map-test]
            [schema.other-namespace]
            [schema.test-test]))

(doo-tests
 'schema.coerce-test
 'schema.core-test
 'schema.experimental.abstract-map-test
 'schema.other-namespace
 'schema.test-test)
