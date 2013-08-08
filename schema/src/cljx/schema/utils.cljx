(ns schema.utils)

(clojure.core/defn type-of [x]
  #+clj (class x)
  #+cljs (js* "typeof ~{}" x))

(defn error! [& format-args]
  #+clj  (throw (RuntimeException. (apply format format-args)))
  #+cljs (throw (js/Error (apply format format-args))))

(defn thrown? [f]
  (let [ex-atom (atom false)]
    (try
      (f)
      (catch #+clj Throwable #+cljs js/Error e
             (reset! ex-atom true)))
    @ex-atom))

(defn value-name
  "Provide a descriptive short name for a value."
  [value]
  (let [t (type-of value)]
    (if (< (count (str value)) 20)
      value
      (symbol (str "a-" #+clj (.getName ^Class t) #+cljs t)))))
