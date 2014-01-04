(ns schema.test-macros
  "Macros to help cross-language testing of schemas."
  (:require clojure.test))

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
  `(~'is (~'thrown? Throwable (~f ~@args))))

;;; cljs only

(defmacro thrown?
  ([_ form]
     `(try
        ~form false
        (catch js/Error e# true))))

(defmacro testing [label & form]
  `(do ~@form))
