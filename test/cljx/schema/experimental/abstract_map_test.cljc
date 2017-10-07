(ns schema.experimental.abstract-map-test
  #?(:clj (:use clojure.test [schema.test-macros :only [valid! invalid! invalid-call!]])
     :cljs (:use-macros
            [cemerick.cljs.test :only [is deftest testing]]
            [schema.test-macros :only [valid! invalid! invalid-call!]]))
  (:require
   [schema.core :as s]
   [schema.coerce :as coerce]
   [schema.experimental.abstract-map :as abstract-map :include-macros true]
   #?(:cljs cemerick.cljs.test)))

(s/defschema Animal
  (abstract-map/abstract-map-schema
   :type
   {:age s/Num
    :vegan? s/Bool}))

(abstract-map/extend-schema Cat Animal [:cat] {:fav-catnip s/Str})

(deftest extend-schema-test
  (valid! Cat {:age 3 :vegan? false :fav-catnip "cosmic" :type :cat})
  (invalid! Cat {:age 3 :vegan? false :fav-catnip "cosmic" :type :cat :foobar false})

  (valid! Animal {:age 3 :vegan? false :fav-catnip "cosmic" :type :cat})
  (invalid! Animal {:age 3 :vegan? false :type :cat}
            "{:fav-catnip missing-required-key}")
  (invalid! Animal {:age 3 :vegan? false :fav-catnip "cosmic" :type :dog}))

(s/defschema TV
  (abstract-map/open-abstract-map-schema
   :make
   {:channel s/Int
    :power? s/Bool}))

(abstract-map/extend-schema HondaTV TV [:honda] {:num-wheels s/Int})

(deftest open-abstract-map-schema-test
  (valid! TV {:channel 30 :power? true :num-wheels 1 :make :honda})
  (valid! HondaTV {:channel 30 :power? true :num-wheels 1 :make :honda})
  (valid! TV {:channel 30 :power? false :missiles "short range" :make :dod})
  (invalid! TV {:channel 30 :make :unknown} "{:power? missing-required-key}"))

(deftest json-coercer-test
  (let [animal-coercer (coerce/coercer Animal coerce/json-coercion-matcher)
        cat-coercer (coerce/coercer Cat coerce/json-coercion-matcher)
        cat {:type :cat :age 12 :vegan? false :fav-catnip "cosmic"}]
    (is (= cat (animal-coercer (update-in cat [:type] name))))
    (is (= cat (cat-coercer (update-in cat [:type] name))))))
