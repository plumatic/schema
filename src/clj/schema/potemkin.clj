(ns schema.potemkin
  "Features that require an explicit potemkin dependency to be provided by the consumer."
  (:require [schema.macros :as macros]
            [potemkin]))

(defmacro defrecord+
  "Like defrecord, but emits a record using potemkin/defrecord+.  You must provide
   your own dependency on potemkin to use this."
  {:arglists '([name field-schema extra-key-schema? extra-validator-fn? & opts+specs])}
  [name field-schema & more-args]
  (apply macros/emit-defrecord 'potemkin/defrecord+ &env name field-schema more-args))
