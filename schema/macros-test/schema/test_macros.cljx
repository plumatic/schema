(ns schema.test-macros
  #+clj
  (:use clojure.test))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Schema validation


(defmacro valid! [s x]
  `(is (do (schema.core/validate ~s ~x) true)))

(defmacro invalid! [s x]
  `(is (~'thrown? #+clj Exception #+cljs js/Error (schema.core/validate ~s ~x))))
