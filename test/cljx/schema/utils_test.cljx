(ns schema.utils-test
  #+clj (:use clojure.test)
  #+cljs (:use-macros
          [cljs.test :only [are deftest]])
  (:require
   [schema.utils :as utils]))

(defn ^:private a-defn-function-with-a-normal-name [a b c d])

(deftest fn-name-test
  (are [in pattern] (re-matches pattern (utils/fn-name in))

    (fn a-fn-function-with-a-normal-name [x])
    #+clj #".*/a-fn-function-with-a-normal-name.*"
    #+cljs #"a-fn-function-with-a-normal-name"

    a-defn-function-with-a-normal-name
    #+clj #".*/a-defn-function-with-a-normal-name"
    #+cljs #"a-defn-function-with-a-normal-name"

    ;; regression for issue #416
    (fn foo$$ [x])
    #+clj #"schema.utils.*foo.*"
    #+cljs #"foo"


    #(+ 1 2)
    #+clj #"schema\.utils-test.*"
    #+cljs #"function"))
