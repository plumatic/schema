(ns schema.bb-test-runner
  (:require [clojure.test :as t]
            [babashka.classpath :as cp]))

(def test-nsyms [;'schema.experimental.complete-test ;;deprecated
                 ;'schema.experimental.generators-test ;; deprecated
                 'schema.core-test
                 'schema.macros-test
                 'schema.coerce-test
                 'schema.experimental.abstract-map-test
                 'schema.test-test
                 'schema.utils-test])

(apply require test-nsyms)

(def test-results
  (apply t/run-tests test-nsyms))

(def failures-and-errors
  (let [{:keys [:fail :error]} test-results]
    (+ fail error)))

(System/exit failures-and-errors)
