(ns fipp.ednize
  (:require [clojure.string :as s]))

(defprotocol IEdn
  "Perform a shallow conversion to an Edn data structure."
  (-edn [x]))

;;TODO Automated test cases for all of these!
;;XXX Usages of type/pr-str seem wrong...

(defn edn [x]
  (cond

    (object? x)
    (tagged-literal 'js
      (into {} (for [k (js-keys x)]
                 [(keyword k) (aget x k)])))

    (array? x)
    (tagged-literal 'js (vec x))

    (satisfies? IDeref x)
    (let [pending? (and (satisfies? IPending x)
                        (not (realized? x)))
          ;; Can this throw and yield status :failed like in JVM Clojure?
          val (when-not pending?
                @x)
          status (if pending?
                   :pending
                   :ready)]
      (tagged-literal 'object
        [(-> x type pr-str symbol)
         {:status status :val val}]))

    (instance? js/Date x)
    (tagged-literal 'inst
      (let [normalize (fn [n len]
                        (loop [ns (str n)]
                          (if (< (count ns) len)
                            (recur (str "0" ns))
                            ns)))]
        (str (.getUTCFullYear x)                   "-"
             (normalize (inc (.getUTCMonth x)) 2)  "-"
             (normalize (.getUTCDate x) 2)         "T"
             (normalize (.getUTCHours x) 2)        ":"
             (normalize (.getUTCMinutes x) 2)      ":"
             (normalize (.getUTCSeconds x) 2)      "."
             (normalize (.getUTCMilliseconds x) 3) "-"
             "00:00")))

    (satisfies? IEdn x)
    (-edn x)

    :else
    ;;TODO Something better.
    (tagged-literal 'object [(-> x type pr-str symbol)])

    ))

(extend-protocol IEdn

  UUID
  (-edn [x]
    (tagged-literal 'uuid (str x)))

  ExceptionInfo
  (-edn [x]
    (tagged-literal 'ExceptionInfo
      (merge {:message (ex-message x)
              :data (ex-data x)}
             (when-let [cause (ex-cause x)]
               {:cause cause}))))

  )

(defn record->tagged [x]
  (tagged-literal (s/split (-> x type pr-str) #"/" 2)
                  (into {} x)))
