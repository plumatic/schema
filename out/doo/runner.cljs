(ns doo.runner
  (:refer-clojure :exclude (run! set-print-fn!))
  (:require [cljs.test :refer [successful?]]
            [goog.object :as gobj]
            [jx.reporter.karma :as karma]))

;; ======================================================================
;; Printing

(enable-console-print!)

(defn ^:export set-print-fn! [f]
  (set! cljs.core.*print-fn* f))

;; ======================================================================
;; Karma Helpers

(defn karma? []
  (or (and (exists? js/window) (exists? (gobj/get js/window "__karma__")))
      (and (exists? js/global) (exists? (gobj/get js/global "__karma__")))))

(defmethod cljs.test/report [:jx.reporter.karma/karma :begin-test-ns] [m]
  (println "Testing" (name (:ns m))))

;; ======================================================================
;; Finish Testing

(def ^:dynamic *exit-fn* nil)

(defn ^:export set-exit-point!
  "Sets the fn to be called when exiting the script.
   It should take one bool argument: successful?"
  [f]
  {:pre [(fn? f)]}
  (set! *exit-fn* f))

(defn exit! [success?]
  (try
    (if-let [nodejs-exit (and (exists? js/process) (gobj/get js/process "exit"))]
      (nodejs-exit (if success? 0 1))
      (*exit-fn* success?))
    (catch :default e
      (println "WARNING: doo's exit function was not properly set")
      (println e))))

(defmethod cljs.test/report [:cljs.test/default :end-run-tests] [m]
  (exit! (successful? m)))

;; ======================================================================
;; Start Testing

;; Karma starts the runner with arguments
(defn ^:export run! [a]
  (if-not (fn? *main-cli-fn*)
    (do (println "WARNING: doo's init function was not set or is not a function")
        (exit! false))
    (try
      (*main-cli-fn* a)
      (catch :default e
        (println)
        (println "ERROR: Exception outside tests:")
        (println "ERROR:" e)
        (if (.hasOwnProperty e "stack")
          (do (println)
              (println "ERROR: Stacktrace:")
              (println "ERROR:" (.-stack e)))
          (do (println)
              (println "ERROR: No stacktrace available.")))
        (exit! false)))))

(defn set-entry-point!
  "Sets the function to be run when starting the script"
  [f]
  {:pre [(fn? f)]}
  (set! *main-cli-fn* f))
