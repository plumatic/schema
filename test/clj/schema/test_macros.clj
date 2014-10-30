(ns schema.test-macros
  "Macros to help cross-language testing of schemas."
  (:require
   clojure.test
   [schema.core :as s :include-macros true]
   [schema.macros :as sm]))

(defmacro valid!
  "Assert that x satisfies schema s, and the walked value is equal to the original."
  [s x]
  `(let [x# ~x] (~'is (= x# ((s/start-walker s/walker ~s) x#)))))

(defmacro invalid!
  "Assert that x does not satisfy schema s, optionally checking the stringified return value"
  ([s x]
     `(~'is (s/check ~s ~x)))
  ([s x expected]
     `(do (invalid! ~s ~x)
          (when *clojure-version* ;; not in cljs
            (~'is (= ~expected (pr-str (s/check ~s ~x))))))))

(defmacro invalid-call!
  "Assert that f throws (presumably due to schema validation error) when called on args."
  [f & args]
  (when (sm/compile-fn-validation? &env f)
    `(~'is (~'thrown? ~'Throwable (~f ~@args)))))
