;; another attempt of schema.fn-schema (without s/all)
;; concentrates on ops to manipulate s/=> schemas
(ns schema.fn-schema2
  "Helpers for s/=>. Alias as `=>`."
  (:refer-clojure :exclude [;; provided by this ns
                            defn
                            ;; candidates for future names
                            fn partial])
  (:require [clojure.core :as cc]
            [schema.core :as s]
            [schema.macros :as macros]))

(cc/defn return-schema
  "Return the return schema of a fn schema.
  
  (return-schema (s/=> Foo Bar)) => Foo"
  [schema]
  {:pre [(instance? schema.core.FnSchema schema)]
   :post [(satisfies? s/Schema %)]}
  (:output-schema schema))

;; TODO use :name metadata added by schema to improve error msg
(defn- fixed-arity-nth-arg*
  "Internal"
  [op schema arity-kind fixed-arg-count arg]
  {:pre [(#{:nth-arg-schema :nth-arg-name} op)
         (instance? schema.core.FnSchema schema)
         (#{:fixed :rest} arity-kind)
         (nat-int? fixed-arg-count)
         (or (nat-int? arg)
             (= :rest arg))]}
  (let [rest-arity? (= :rest arity-kind)
        rest-arg? (= :rest arg)
        _ (assert (if rest-arg? rest-arity? true)
                  "Can only select :rest arg on :rest arity.")
        arg (if rest-arg?
              fixed-arg-count
              arg)
        [required rst :as arity]
        (some (cc/fn [input-schema]
                (let [[required rst] (split-with #(instance? schema.core.One %) input-schema)]
                  (when (and (= (count required)
                                fixed-arg-count)
                             (or (not rest-arity?)
                                 (< (count required)
                                    (count input-schema))))
                    [required rst])))
              (:input-schemas schema))
        _ (assert arity (format "%s missing %s arity with %s fixed args"
                                (pr-str schema) (name arity-kind) fixed-arg-count ))
        s (if rest-arg?
            (vec rst)
            (nth arity arg))]
    (case op
      :nth-arg-schema (cond-> s
                        ;;unwrap s/one
                        (not rest-arg?) :schema)
      :nth-arg-name (do (assert (not rest-arg?)
                                "Cannot get name of rest arg")
                        (let [{:keys [schema] :as one} s]
                          (:name
                            (if (instance? schema.core.NamedSchema schema)
                              ;; for s/=>
                              schema
                              ;; for s/fn
                              one)))))))

;; TODO test rest argument and rest arity semantics
(cc/defn nth-arg-schema
  "Returns the schema of the arg'th fixed argument of
  arity with fixed-arg-count fixed arguments. If arity-kind
  is :rest, selects the arity that also has rest argument.
  If arg is :rest, returns the rest argument schema of the
  selected arity.
  
  eg., (nth-arg-schema (s/=> Foo Bar Baz) 2 0)
       ;=> Bar
       (nth-arg-schema (s/=> Foo Bar Baz) 2 1)
       ;=> Baz
       (nth-arg-schema (s/=> Foo Bar Baz & [Rest]) 2 0)
       ;error
       (nth-arg-schema (s/=> Foo Bar Baz & [Rest]) :rest 2 0)
       ;=> Bar
       (nth-arg-schema (s/=> Foo Bar Baz & [Rest]) :rest 2 :rest)
       ;=> [Rest]"
  ([schema fixed-arg-count arg]
   (nth-arg-schema schema :fixed fixed-arg-count arg))
  ([schema arity-kind fixed-arg-count arg]
   {:pre [(instance? schema.core.FnSchema schema)
          (#{:fixed :rest} arity-kind)
          (nat-int? fixed-arg-count)
          (or (nat-int? arg)
              (= :rest arg))]
    :post [(satisfies? s/Schema %)]}
   (fixed-arity-nth-arg* :nth-arg-schema schema arity-kind fixed-arg-count arg)))

;; TODO test rest argument and rest arity semantics
(cc/defn nth-arg-name
  "Returns the name of the arg'th fixed argument of
  arity with fixed-arg-count fixed arguments. If arity-kind
  is :rest, selects the arity that also has rest argument.

  For s/defn schemas via s/fn-schema, returns the arg name. For s/=>, returns
  the s/named name if provided, otherwise the default name.

  Cannot get name of :rest arg, as it is not stored by s/=>.

  eg., (s/defn foo [bar :- Bar, baz :- Baz])

  (nth-arg-name (s/=> Foo Bar Baz) 2 0)
  ;=> 'arg0
  (nth-arg-name (s/=> Foo (s/named Bar 'bar) Baz) 2 0)
  ;=> 'bar
  (nth-arg-name (s/fn-schema foo) 2 0)
  ;=> 'bar
  (nth-arg-name (s/fn-schema foo) 2 1)
  ;=> 'baz"
  ([schema arity-count arg]
   (nth-arg-name schema :fixed arity-count arg))
  ([schema arity-kind arity-count arg]
   {:pre [(instance? schema.core.FnSchema schema)
          (#{:fixed :rest} arity-kind)
          (nat-int? arity-count)
          (or (nat-int? arg)
              (= :rest arg))]
    :post [(simple-symbol? %)]}
   (fixed-arity-nth-arg* :nth-arg-name schema arity-kind arity-count arg)))

;; keep-fn takes an input-schema and returns nil if it
;; should be dropped, otherwise return the new input-schema.
(cc/defn- shrink-args
  "Internal."
  [schema keep-fn]
  {:pre [(instance? schema.core.FnSchema schema)]
   :post [(instance? schema.core.FnSchema %)]}
  (let [new-args (keep keep-fn (:input-schemas schema))]
    (assert (seq new-args) "Dropped too many args")
    (assert (every? vector? new-args))
    (assoc schema :input-schemas new-args)))

(cc/defn drop-leading-args
  "Return fn schema without the first n args.
  
  eg., (drop-leading-args (s/=> s/Str Foo Bar Baz) 1)
       ;=> (s/=> s/Str Bar Baz)
       (drop-leading-args (s/=> s/Str Foo Bar Baz) 2)
       ;=> (s/=> s/Str Baz)
       (drop-leading-args (s/=> s/Str Foo Bar Baz) 3)
       ;=> (s/=> s/Str)"
  [schema n]
  {:pre [(instance? schema.core.FnSchema schema)
         (nat-int? n)]
   :post [(instance? schema.core.FnSchema %)]}
  (shrink-args schema
               (cc/fn [input-schema]
                 (when (<= n (count input-schema))
                   (into [] (drop n) input-schema)))))

(cc/defn drop-trailing-args
  "Return fn schema without the last n args.

  eg., (drop-trailing-args (s/=> s/Str Foo Bar Baz) 1)
       ;=> (s/=> s/Str Foo Bar)
       (drop-trailing-args (s/=> s/Str Foo Bar Baz) 2)
       ;=> (s/=> s/Str Foo)
       (drop-trailing-args (s/=> s/Str Foo Bar Baz) 3)
       ;=> (s/=> s/Str)"
  [schema n]
  {:pre [(instance? schema.core.FnSchema schema)
         (nat-int? n)]
   :post [(instance? schema.core.FnSchema %)]}
  (shrink-args schema
               (cc/fn [input-schema]
                 (when (<= n (count input-schema))
                   (vec (drop-last n input-schema))))))

;; combine-fn takes input-schema and args and returns a new input-schema.
(cc/defn- extend-args
  "Internal."
  [schema args combine-fn]
  (assert (every? #(and (instance? schema.core.One %)
                        (not (:optional? %)))
                  args)
          "args must be wrapped in s/one with unique names")
  (update schema :input-schemas
          (cc/fn [input-schemas]
            (map (cc/fn [input-schema]
                   {:pre [(vector? input-schema)]
                    :post [(vector? %)]}
                   (let [new-args (combine-fn input-schema args)
                         names (map :name new-args)
                         _ (assert (every? simple-symbol? names) (pr-str names))]
                     (assert (apply distinct? names)
                             (str "Name clash: " (pr-str names)))
                     new-args))
                 input-schemas))))

(cc/defn add-leading-args
  "Add arguments to the front of the fn schema. Each arg
  must be wrapped in s/one with a unique name.

  eg., (add-leading-args (s/=> s/Bool s/Int) (s/one ServiceCtx 'ctx) (s/one Foo 'foo))
       ;=> (s/=> s/Bool ServiceCtx Foo s/Int)"
  [schema & args]
  (extend-args schema args (cc/fn [input-schema args]
                             (into (vec args) input-schema))))
(cc/defn add-trailing-args
  "Add arguments to the end of the fn schema. Each arg
  must be wrapped in s/one with a unique name.
  
  eg., (add-trailing-args (s/=> s/Bool s/Int) (s/one Foo 'foo) (s/one ServiceCtx 'ctx))
       ;=> (s/=> s/Bool s/Int Foo ServiceCtx)"
  [schema & args]
  (extend-args schema args (cc/fn [input-schema args]
                             {:pre [(vector? input-schema)]}
                             (into input-schema args))))

;; goes last

(defmacro defn
  "Like clojure.core/defn except takes a FnSchema. No :- annotations allowed.
  Rest arguments not supported. Arities must be fully specified by FnSchema
  (but not all FnSchema arities must be implemented).
 
  Expands into a s/defn like so:

  (=>/defn :=> (update-args FooSchema #(cons ServiceContext %))
    foo
    [a]
    ...)
  =>
  (s/defn foo
    :- (return-schema FooSchema)
    [a :- (nth-arg-schema FooSchema 1 0)]
    ...)"
  [arrow fn-schema & defn-args]
  (assert (= :=> arrow))
  (assert (not-any? #{:-} (take-while (complement vector?) defn-args))
          "No :- annotations allowed in =>/defn")
  (let [[nme & more-defn-args] (macros/normalized-defn-args &env defn-args)
        ;; will miss `:- s/Any` return annotations, but above assertion should cover it.
        _ (assert (= (:schema (meta nme)) `s/Any)
                  (str "No :- annotations allowed in =>/defn, found :- "
                       (:schema (meta nme))
                       " return annotation"))
        {:keys [arglists raw-arglists]} (macros/process-fn- &env nme more-defn-args)
        _ (assert (= arglists raw-arglists) "No :- annotations allowed in =>/defn.")
        methods (cond-> more-defn-args
                  (-> more-defn-args first vector?)
                  list)
        _ (assert (every? (comp vector? first) methods) "Only clojure.core/defn syntax allowed after :=>.")
        gfn-schema (gensym 'fn-schema)
        methods (map (cc/fn [[argv & body]]
                       (let [arity (count argv)]
                         (assert (not-any? #{'&} argv) "Rest arguments not yet supported in =>/defn.")
                         (list* (into []
                                      (comp (map-indexed
                                              (cc/fn [i arg]
                                                [arg :- (list `nth-arg-schema
                                                              gfn-schema
                                                              arity
                                                              i)]))
                                            (mapcat identity))
                                      argv)
                                body)))
                     methods)]
    `(let [~gfn-schema ~fn-schema]
       (s/defn ~(vary-meta nme dissoc :schema)
         :- (return-schema ~gfn-schema)
         ~@methods))))
