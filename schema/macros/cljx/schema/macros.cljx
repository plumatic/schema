(ns schema.macros)

;;;;; Schema protcol

;; TODO: rename to be more platform agnostic

(defmacro assert-iae
  "Like assert, but throws an IllegalArgumentException and takes args to format"
  [form & format-args]
  `(when-not ~form
     #+clj (throw (IllegalArgumentException. (format ~@format-args)))
     #+cljs (throw js/Error (format ~@format-args))))

(deftype ValidationError [schema value expectation-delay])

(defmethod print-method ValidationError [^ValidationError err writer]
  (print-method (list 'not @(.expectation-delay err)) writer))

(defmacro validation-error [schema value expectation]
  `(ValidationError. ~schema ~value (delay ~expectation)))
