(ns jx.reporter.karma
  (:require [cljs.test]
            [clojure.data]
            [fipp.clojure])
  (:require-macros [jx.reporter.karma :as karma]))

(def karma (volatile! nil))

(defn karma? [] (not (nil? @karma)))

(defn- karma-info! [m]
  (when (karma?)
    (.info @karma (clj->js m))))

(defn- karma-result! [m]
  (when (karma?)
    (.result @karma (clj->js m))))

(defn- coverage-result []
  #js {"coverage" (aget js/window "__coverage__")})

(defn- karma-complete! []
  (when (karma?)
    (.complete @karma (coverage-result))))

(defn- now []
  (.getTime (js/Date.)))

(defn- indent [n s]
  (let [indentation (reduce str "" (repeat n " "))]
    (clojure.string/replace s #"\n" (str "\n" indentation))))

(defn- remove-last-new-line [s]
  (subs s 0 (dec (count s))))

(defn- format-fn [indentation [c & q]]
  (let [e (->> q
               (map #(with-out-str (fipp.clojure/pprint %)))
               (apply str)
               (str "\n"))]
    (str "(" c (indent (+ indentation 2) (remove-last-new-line e)) ")")))

(defn- format-diff [indentation assert [c a b & q]]
  (when (and (= c '=) (= (count assert) 3) (nil? q))
    (let [format (fn [sign value]
                   (str sign " "
                        (if value
                          (indent (+ indentation 2)
                                  (-> value
                                      (fipp.clojure/pprint)
                                      (with-out-str)
                                      (remove-last-new-line)))
                          "\n")))
          [removed added] (clojure.data/diff a b)]
      (str (format "-" removed)
           (format (str "\n" (apply str (repeat indentation " ")) "+") added)))))

(defn- format-log [{:keys [expected actual message] :as result}]
  (let [indentation (count "expected: ")]
    (str
      "FAIL in   " (cljs.test/testing-vars-str result) "\n"
      (if (and (seq? expected)
               (seq? actual))
        (str
          "expected: " (format-fn indentation expected) "\n"
          "  actual: " (format-fn indentation (second actual)) "\n"
          (when-let [diff (format-diff indentation expected (second actual))]
            (str "    diff: " diff "\n")))
        (str
          expected " failed with " actual "\n"))
      (when message
        (str " message: " (indent indentation message) "\n")))))

(def test-var-result (volatile! []))

(def test-var-time-start (volatile! (now)))

(defmethod cljs.test/report :karma [_])

(defmethod cljs.test/report [::karma :begin-test-var] [_]
  (vreset! test-var-time-start (now))
  (vreset! test-var-result []))

(defmethod cljs.test/report [::karma :end-test-var] [m]
  (let [var-meta (meta (:var m))
        result   {"suite"       [(:ns var-meta)]
                  "description" (:name var-meta)
                  "success"     (zero? (count @test-var-result))
                  "skipped"     nil
                  "time"        (- (now) @test-var-time-start)
                  "log"         (map format-log @test-var-result)}]
    (karma-result! result)))

(defmethod cljs.test/report [::karma :fail] [m]
  (cljs.test/inc-report-counter! :fail)
  (vswap! test-var-result conj m))

(defmethod cljs.test/report [::karma :error] [m]
  (cljs.test/inc-report-counter! :error)
  (vswap! test-var-result conj m))

(defmethod cljs.test/report [::karma :end-run-tests] [_]
  (karma-complete!))

(defn start [tc total-count]
  (vreset! karma tc)
  (karma-info! {:total total-count}))
