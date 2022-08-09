(ns schema.fn-schema
  "Helpers for s/=>. Alias as `=>`.
  
  See also:
  - `schema.generators.fn-schema` for related generators"
  (:refer-clojure :exclude [fn partial])
  (:require [clojure.core :as cc]
            [schema.core :as s])
  (:import [schema.core FnSchema NamedSchema One]))

(defn fn-schema? [v]
  (instance? FnSchema v))

(defn- split-arities
  "Internal"
  [=>-schema]
  {:pre [(fn-schema? =>-schema)]}
  (let [;; sorted by arity size
        input-schemas (vec (:input-schemas =>-schema))
        _ (assert (seq input-schemas) (pr-str =>-schema))
        has-varargs? (not (instance? One (-> input-schemas peek peek)))]
    {:fixed-input-schemas (cond-> input-schemas
                            has-varargs? pop)
     :variable-input-schema (when has-varargs?
                              (peek input-schemas))}))

;; FIXME printing
;; TODO extend Schema and s/validate as ifn?
(defrecord ForAllSchema [decl schema-form inst->schema]
  Object
  (toString [s]
    (pr-str (list 'all decl schema-form))))

(comment
  (str (all [a] (s/=> a a)))
  (pr-str (all [a] (s/=> a a)))
  (pr-str (s/=> s/Int s/Int))
  )

(defn for-all-schema? [v]
  (instance? ForAllSchema v))

(defmacro all
  "Create a polymorphic function schema.
 
  Type variables are unbounded, except if tagged with
  :nat metadata, which accept natural numbers or :any-nat.

  ;;TODO
  s/validates with ifn?, like s/=>.

  =>/coerce instantiates with s/Any before wrapping.

  Generates values by varying the schemas to instantate
  with, shrinks towards schema that accept less values."
  [decl schema]
  {:pre [(vector? decl)
         (every? simple-symbol? decl)]}
  `(->ForAllSchema
     '~decl
     '~schema
     (cc/fn ~decl ~schema)))

;; TODO rename
(defn dcoll-of
  "Returns a collection schema of length n and type a.
  Returns [a] if n is :any-nat."
  [n a]
  {:pre [(nat-int? n)
         (satisfies? s/Schema a)]
   :post [(satisfies? s/Schema %)]}
  (case n
    :any-nat [a]
    (vec (repeat n (s/one a)))))

(comment
  ;;dcoll sketch
#_ ;; FIXME `& (=>/dcoll-of n a)` is invalid :(
  (=>/all [a b c ^:nat n]
          (s/=> (s/=> c & (=>/dcoll-of n a))
                (s/named (s/=> c & (=>/dcoll-of n b)) 'f)
                (s/named (s/=> b a) 'inner-fn)))
  )

(defn inst
  "Instantiate ForAllSchema with schemas, returning a s/=> schema."
  [for-all-schema & schemas]
  {:pre [(instance? ForAllSchema for-all-schema)]
   :post [(fn-schema? %)]}
  (apply (:inst->schema for-all-schema) schemas))

(defn- most-general-insts [=>-schema]
  {:pre [(instance? ForAllSchema =>-schema)]}
  (mapv (cc/fn [a]
          {:pre [(simple-symbol? a)]}
          (if (-> a meta :nat)
            :any-nat
            s/Any))
        (:decl =>-schema)))

(defn- maybe-inst-any [=>-schema]
  (if (instance? ForAllSchema =>-schema)
    (apply inst =>-schema (most-general-insts =>-schema))
    =>-schema))

;; TODO convert (s/one (s/named .. b) a) to (s/one .. a) to work around
;; s/=> gensymming.
;;  
;;  ((gen/generate
;;     (generator (s/=> s/Int (s/named s/Int 'something))))
;;   :foo)
;;  ;=> Value does not match schema: [(named (named (not (integer? :foo)) something) arg0)]
(defn args-schema
  "Returns the schema of the arguments to the => schema, or =>/all
  instantiated with s/Any."
  [=>-schema]
  {:post [(satisfies? s/Schema %)]}
  (let [=>-schema (maybe-inst-any =>-schema)
        _ (assert (fn-schema? =>-schema) (pr-str =>-schema))
        {:keys [fixed-input-schemas variable-input-schema]} 
        (split-arities =>-schema)]
    (apply s/conditional
           (concat
             (mapcat (cc/fn [fixed-input-schema]
                       (let [arity (count fixed-input-schema)]
                         [(every-pred vector? #(= arity (count %)))
                          fixed-input-schema]))
                     fixed-input-schemas)
             (some->> variable-input-schema
                      (vector :else))))))

(defn return-schema
  "Returns the schema of the return value of the => schema,
  or =>/all instantiated with s/Any."
  [=>-schema]
  {:post [(satisfies? s/Schema %)]}
  (let [=>-schema (maybe-inst-any =>-schema)
        _ (assert (fn-schema? =>-schema))]
    (:output-schema =>-schema)))

#_;;TODO unit test if useful
(defn select-arities
  "Returns a FnSchema with only the specified arities.
  Fixed arities are identified by their arity (a natural number)
  and variable arity is identified by :variable."
  [=>-schema keep-arities]
  {:pre [(fn-schema? =>-schema)
         (set? keep-arities)]
   :post [(instance? FnSchema %)]}
  (let [{:keys [fixed-input-schemas variable-input-schema]} (split-arities =>-schema)
        input-schemas (concat
                        (filter (comp keep-arities count) fixed-input-schemas)
                        (when (:variable keep-arities)
                          variable-input-schema))]
    (assert (= (count keep-arities)
               (count input-schemas)))
    (assoc =>-schema :input-schemas input-schemas)))

;; goes last

(defmacro fn
  "Idiom: use as =>/fn.
  
  Like s/fn except also takes a FnSchema (eg., s/=> or s/=>*) to check the function with.
  
  fn name goes after :=> schema to signify it is not checked on recur or self call.

  Note: :=> only wraps initial args and final return (ie., its public interface).
  
   (=>/fn :=> (s/=> Foo Bar) ~@sfn-tail)
   =>
   (fn [& args]
     (s/validate
       (return-schema (s/=> Foo Bar))
       (apply (s/fn ~@sfn-tail)
              (s/validate
                (args-schema (s/=> Foo Bar))
                (vec args)))))"
  [kw-=> =>-schema & sfn-tail]
  (assert (= :=> kw-=>) kw-=>)
  `(let [f# (s/fn ~@sfn-tail)
         =>-schema# ~=>-schema
         args-schema# (args-schema =>-schema#)
         return-schema# (return-schema =>-schema#)]
     (cc/fn [& args#]
       (if (s/fn-validation?)
         (let [args# (vec args#)]
           (s/validate
             return-schema#
             (apply f# (s/validate
                         args-schema#
                         args#))))
         (apply f# args#)))))

(defn coerce
  "Idiom: use as =>/coerce.
  
  Returns a fn of `=>-schema` via `=>/fn` that forwards invocations to `v`."
  [=>-schema v]
  (s/validate (s/pred ifn?) v)
  (schema.fn-schema/fn :=> =>-schema
    [& args] (apply v args)))

(defn partial
  "Remove leading named parameters from schema.
  
  (s/defn foo [a :- Foo, b :- Bar])

  (=>/partial (s/fn-schema foo) 'a)
  ;=> (s/=> s/Any Bar)"
  [=>-schema & arg-names]
  (let [arg-names (vec arg-names)
        {:keys [fixed-input-schemas variable-input-schema]} (split-arities =>-schema)
        partial-fixed-input-schema (cc/fn [fixed-input-schema]
                                     {:pre [(vector? fixed-input-schema)
                                            (every? #(instance? One %) fixed-input-schema)]
                                      :post [(vector? %)]}
                                     (let [find-names (cc/fn [s]
                                                        {:pre [(instance? One s)]}
                                                        (let [find-names
                                                              (cc/fn find-names [s]
                                                                (if (or (instance? One s)
                                                                        (instance? NamedSchema s))
                                                                  (conj (find-names (:schema s))
                                                                        (:name s))
                                                                  #{}))]
                                                          (find-names
                                                            (cond-> s
                                                              ;; remove automatic s/=> naming
                                                              (re-matches #"arg\d+" (name (:name s)))
                                                              :schema))))
                                           input-names (map find-names fixed-input-schema)
                                           ;; check that it's safe to remove leading args
                                           _ (dorun
                                               (map (cc/fn [i names remove-arg-name]
                                                      (assert (names remove-arg-name)
                                                              (str "Expected argument " i " to be named "
                                                                   remove-arg-name " but actually " names
                                                                   " in " (pr-str =>-schema))))
                                                    (next (range))
                                                    input-names
                                                    arg-names))
                                           _ (assert (<= (count arg-names)
                                                         (count fixed-input-schema))
                                                     (str "An arity has less than "
                                                          (count arg-names) " fixed argument/s: "
                                                          (pr-str =>-schema)))]
                                       (subvec fixed-input-schema (count arg-names))))
        input-schemas (into
                        (mapv partial-fixed-input-schema fixed-input-schemas)
                        (some-> variable-input-schema
                                pop
                                partial-fixed-input-schema
                                (conj (peek variable-input-schema))
                                list))]
    (assoc =>-schema :input-schemas input-schemas)))
