(ns schema.utils)

(defn error! [& format-args]
  #+clj  (throw (RuntimeException. (apply format format-args)))
  #+cljs (throw js/Error (apply format format-args)))
