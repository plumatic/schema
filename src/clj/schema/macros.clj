(ns schema.macros
  "Macros and macro helpers used in schema.core."
  (:refer-clojure :exclude [simple-symbol?])
  (:require
   [clojure.string :as str]
   [schema.utils :as utils]))

;; can remove this once we drop Clojure 1.8 support
(defn- simple-symbol? [x]
  (and (symbol? x)
       (not (namespace x))))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Helpers used in schema.core.

(defn cljs-env?
  "Take the &env from a macro, and tell whether we are expanding into cljs."
  [env]
  (boolean (:ns env)))

(defmacro if-cljs
  "Return then if we are generating cljs code and else for Clojure code.
   https://groups.google.com/d/msg/clojurescript/iBY5HaQda4A/w1lAQi9_AwsJ"
  [then else]
  (if (cljs-env? &env) then else))

(def bb? (boolean (System/getProperty "babashka.version")))

(defmacro if-bb
  [then else]
  (if bb? then else))

(defmacro try-catchall
  "A cross-platform variant of try-catch that catches all* exceptions.
   Does not (yet) support finally, and does not need or want an exception class.

   *On the JVM certain fatal exceptions are not caught."
  [& body]
  (let [try-body (butlast body)
        [catch sym & catch-body :as catch-form] (last body)]
    (assert (= catch 'catch))
    (assert (symbol? sym))
    `(if-cljs
      (try ~@try-body (~'catch js/Object ~sym ~@catch-body))
      (try
        ~@try-body
        ;; this whitelist is shamelessly copied from scala
        ;; https://github.com/scala/scala/blob/2.13.x/src/library/scala/util/control/NonFatal.scala#L42
        (~'catch VirtualMachineError  e# (throw e#))
        (~'catch ThreadDeath          e# (throw e#))
        (~'catch InterruptedException e# (throw e#))
        (~'catch LinkageError         e# (throw e#))
        (~'catch Throwable ~sym ~@catch-body)))))

(defmacro error!
  "Generate a cross-platform exception appropriate to the macroexpansion context"
  ([s]
     `(if-cljs
       (throw (js/Error. ~s))
       (throw (RuntimeException. ~(with-meta s `{:tag java.lang.String})))))
  ([s m]
     (let [m (merge {:type :schema.core/error} m)]
       `(if-cljs
         (throw (ex-info ~s ~m))
         (throw (clojure.lang.ExceptionInfo. ~(with-meta s `{:tag java.lang.String}) ~m))))))

(defmacro safe-get
  "Like get but throw an exception if not found. A macro for historical reasons (to
   work around cljx function placement restrictions)."
  [m k]
  `(let [m# ~m k# ~k]
     (if-let [pair# (find m# k#)]
       (val pair#)
       (error! (utils/format* "Key %s not found in %s" k# m#)))))

(defmacro assert!
  "Like assert, but throws a RuntimeException (in Clojure) and takes args to format."
  [form & format-args]
  `(when-not ~form
     (error! (utils/format* ~@format-args))))

(defmacro validation-error [schema value expectation & [fail-explanation]]
  `(schema.utils/error
    (utils/make-ValidationError ~schema ~value (delay ~expectation) ~fail-explanation)))

(defmacro defrecord-schema
  "Like defrecord for schema primitives, and also registers cross-platform print methods."
  [n & args]
  `(do (clojure.core/defrecord ~n ~@args)
       (if-cljs (extend-protocol cljs.core/IPrintWithWriter
                  ~n
                  (~'-pr-writer [s# w# _#]
                    (cljs.core/-write w# (schema.core/explain s#))))
                ;; bb doesn't support multimethods extended via protocols yet
                (if-bb (schema.core/register-schema-print-as-explain ~n)
                       ;; relies on (register-schema-print-as-explain schema.core.Schema)
                       nil))
       ~n))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Helpers for processing and normalizing element/argument schemas in s/defrecord and s/(de)fn

(defn maybe-split-first [pred s]
  (if (pred (first s))
    [(first s) (next s)]
    [nil s]))

(def primitive-sym? '#{float double boolean byte char short int long
                       floats doubles booleans bytes chars shorts ints longs objects})

(defn resolve-tag
  "Given a Symbol, attempt to return a valid Clojure tag else nil.

  Symbols not contained in `primitive-sym?` will be resolved. Symbols
  resolved to Vars have their values checked in an attempt to provide
  type hints when possible.

  A valid tag is a primitive, Class, or Var containing a Class."
  [env tag]
  (when (symbol? tag)
    (let [resolved (delay (resolve env tag))]
      (cond
        (or (primitive-sym? tag) (class? @resolved))
        tag

        (var? @resolved)
        (let [v (var-get @resolved)]
          (when (class? v)
            (symbol (.getName ^Class v))))))))

(defn normalized-metadata
  "Take an object with optional metadata, which may include a :tag,
   plus an optional explicit schema, and normalize the
   object to have a valid Clojure :tag plus a :schema field."
  [env imeta explicit-schema]
  (let [{:keys [tag s s? schema]} (meta imeta)]
    (assert! (not (or s s?)) "^{:s schema} style schemas are no longer supported.")
    (assert! (< (count (remove nil? [schema explicit-schema])) 2)
             "Expected single schema, got meta %s, explicit %s" (meta imeta) explicit-schema)
    (let [schema (or explicit-schema schema tag `schema.core/Any)]
      (with-meta imeta
        (-> (or (meta imeta) {})
            (dissoc :tag)
            (utils/assoc-when :schema schema
                              :tag (resolve-tag env (or tag schema))))))))

(defn extract-schema-form
  "Pull out the schema stored on a thing.  Public only because of its use in a public macro."
  [symbol]
  (let [s (:schema (meta symbol))]
    (assert! s "%s is missing a schema" symbol)
    s))

(defn extract-arrow-schematized-element
  "Take a nonempty seq, which may start like [a ...] or [a :- schema ...], and return
   a list of [first-element-with-schema-attached rest-elements]"
  [env s]
  (assert (seq s))
  (let [[f & more] s]
    (if (= :- (first more))
      [(normalized-metadata env f (second more)) (drop 2 more)]
      [(normalized-metadata env f nil) more])))

(defn process-arrow-schematized-args
  "Take an arg vector, in which each argument is followed by an optional :- schema,
   and transform into an ordinary arg vector where the schemas are metadata on the args."
  [env args]
  (loop [in args out []]
    (if (empty? in)
      out
      (let [[arg more] (extract-arrow-schematized-element env in)]
        (recur more (conj out arg))))))


;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Helpers for schematized fn/defn

(defn split-rest-arg [env bind]
  (let [[pre-& [_ rest-arg :as post-&]] (split-with #(not= % '&) bind)]
    (if (seq post-&)
      (do (assert! (= (count post-&) 2) "& must be followed by a single binding" (vec post-&))
          (assert! (or (symbol? rest-arg)
                       (and (vector? rest-arg)
                            (not-any? #{'&} rest-arg)))
                   "Bad & binding form: currently only bare symbols and vectors supported" (vec post-&))

          [(vec pre-&)
           (if (vector? rest-arg)
             (with-meta (process-arrow-schematized-args env rest-arg) (meta rest-arg))
             rest-arg)])
      [bind nil])))

(defn single-arg-schema-form [rest? [index arg]]
  `(~(if rest? `schema.core/optional `schema.core/one)
    ~(extract-schema-form arg)
    ~(if (symbol? arg)
       `'~arg
       `'~(symbol (str (if rest? "rest" "arg") index)))))

(defn simple-arglist-schema-form [rest? regular-args]
  (mapv (partial single-arg-schema-form rest?) (map-indexed vector regular-args)))

(defn rest-arg-schema-form [arg]
  (let [s (extract-schema-form arg)]
    (if (= s `schema.core/Any)
      (if (vector? arg)
        (simple-arglist-schema-form true arg)
        [`schema.core/Any])
      (do (assert! (vector? s) "Expected seq schema for rest args, got %s" s)
          s))))

(defn input-schema-form [regular-args rest-arg]
  (let [base (simple-arglist-schema-form false regular-args)]
    (if rest-arg
      (vec (concat base (rest-arg-schema-form rest-arg)))
      base)))

(defn apply-prepost-conditions
  "Replicate pre/postcondition logic from clojure.core/fn."
  [body]
  (let [[conds body] (maybe-split-first #(and (map? %) (next body)) body)]
    (concat (map (fn [c] `(assert ~c)) (:pre conds))
            (if-let [post (:post conds)]
              `((let [~'% (do ~@body)]
                  ~@(map (fn [c] `(assert ~c)) post)
                  ~'%))
              body))))

(def ^:dynamic *compile-fn-validation* (atom true))

(defn compile-fn-validation?
  "Returns true if validation should be included at compile time, otherwise false.
   Validation is elided for any of the following cases:
   *   function has :never-validate metadata
   *   *compile-fn-validation* is false
   *   *assert* is false AND function is not :always-validate"
  [env fn-name]
  (let [fn-meta (meta fn-name)]
    (and
     @*compile-fn-validation*
     (not (:never-validate fn-meta))
     (or (:always-validate fn-meta)
         *assert*))))

(defn process-fn-arity
  "Process a single (bind & body) form, producing an output tag, schema-form,
   and arity-form which has asserts for validation purposes added that are
   executed when turned on, and have very low overhead otherwise.
   tag? is a prospective tag for the fn symbol based on the output schema.
   schema-bindings are bindings to lift eval outwards, so we don't build the schema
   every time we do the validation.

  :ufv-sym should name a local binding bound to `schema.utils/use-fn-validation`.

  5-args arity is deprecated."
  ([env fn-name output-schema-sym bind-meta arity-form]
   (process-fn-arity {:env env :fn-name fn-name :output-schema-sym output-schema-sym
                      :bind-meta bind-meta :arity-form arity-form :ufv-sym 'ufv__}))
  ([{[bind & body] :arity-form :keys [env fn-name output-schema-sym bind-meta ufv-sym]}]
   (assert! (vector? bind) "Got non-vector binding form %s" bind)
   (when-let [bad-meta (seq (filter (or (meta bind) {}) [:tag :s? :s :schema]))]
     (throw (RuntimeException. (str "Meta not supported on bindings, put on fn name" (vec bad-meta)))))
   (let [original-arglist bind
         bind (with-meta (process-arrow-schematized-args env bind) bind-meta)
         [regular-args rest-arg] (split-rest-arg env bind)
         input-schema-sym (gensym "input-schema")
         input-checker-sym (gensym "input-checker")
         output-checker-sym (gensym "output-checker")
         compile-validation (compile-fn-validation? env fn-name)]
     {:schema-binding [input-schema-sym (input-schema-form regular-args rest-arg)]
      :more-bindings (when compile-validation
                       [input-checker-sym `(delay (schema.core/checker ~input-schema-sym))
                        output-checker-sym `(delay (schema.core/checker ~output-schema-sym))])
      :arglist bind
      :raw-arglist original-arglist
      :arity-form (if compile-validation
                    (let [bind-syms (vec (repeatedly (count regular-args) gensym))
                          rest-sym (when rest-arg (gensym "rest"))
                          metad-bind-syms (with-meta (mapv #(with-meta %1 (meta %2)) bind-syms bind) bind-meta)]
                      (list
                        (if rest-arg
                          (into metad-bind-syms ['& rest-sym])
                          metad-bind-syms)
                        `(let [validate# ~(if (:always-validate (meta fn-name))
                                            `true
                                            `(if-cljs (deref ~ufv-sym)
                                                      (if-bb (deref ~ufv-sym) (.get ~ufv-sym))))]
                           (when validate#
                             (let [args# ~(if rest-arg
                                            `(list* ~@bind-syms ~rest-sym)
                                            bind-syms)]
                               (if schema.core/fn-validator
                                 (schema.core/fn-validator :input
                                                           '~fn-name
                                                           ~input-schema-sym
                                                           @~input-checker-sym
                                                           args#)
                                 (when-let [error# (@~input-checker-sym args#)]
                                   (error! (utils/format* "Input to %s does not match schema: \n\n\t \033[0;33m  %s \033[0m \n\n"
                                                          '~fn-name (pr-str error#))
                                           {:schema ~input-schema-sym :value args# :error error#})))))
                           (let [o# (loop ~(into (vec (interleave (map #(with-meta % {}) bind) bind-syms))
                                                 (when rest-arg [rest-arg rest-sym]))
                                      ~@(apply-prepost-conditions body))]
                             (when validate#
                               (if schema.core/fn-validator
                                 (schema.core/fn-validator :output
                                                           '~fn-name
                                                           ~output-schema-sym
                                                           @~output-checker-sym
                                                           o#)
                                 (when-let [error# (@~output-checker-sym o#)]
                                   (error! (utils/format* "Output of %s does not match schema: \n\n\t \033[0;33m  %s \033[0m \n\n"
                                                          '~fn-name (pr-str error#))
                                           {:schema ~output-schema-sym :value o# :error error#}))))
                             o#))))
                    (cons (into regular-args (when rest-arg ['& rest-arg]))
                          body))})))

(defn process-fn-
  "Process the fn args into a final tag proposal, schema form, schema bindings, and fn form"
  [env name fn-body]
  (let [compile-validation (compile-fn-validation? env name)
        output-schema (extract-schema-form name)
        output-schema-sym (gensym "output-schema")
        bind-meta (or (when-let [t (:tag (meta name))]
                        (when (primitive-sym? t)
                          {:tag t}))
                      {})
        ufv-sym (gensym "ufv")
        processed-arities (map #(process-fn-arity {:env env :fn-name name :output-schema-sym output-schema-sym
                                                   :bind-meta bind-meta :arity-form % :ufv-sym ufv-sym})
                               (if (vector? (first fn-body))
                                 [fn-body]
                                 fn-body))
        schema-bindings (map :schema-binding processed-arities)
        fn-forms (map :arity-form processed-arities)]
    {:outer-bindings (vec (concat
                           (when compile-validation
                             `[~(with-meta ufv-sym {:tag 'java.util.concurrent.atomic.AtomicReference}) schema.utils/use-fn-validation])
                           [output-schema-sym output-schema]
                           (apply concat schema-bindings)
                           (mapcat :more-bindings processed-arities)))
     :arglists (map :arglist processed-arities)
     :raw-arglists (map :raw-arglist processed-arities)
     :schema-form (if (= 1 (count processed-arities))
                    `(schema.core/->FnSchema ~output-schema-sym ~[(ffirst schema-bindings)])
                    `(schema.core/make-fn-schema ~output-schema-sym ~(mapv first schema-bindings)))
     :fn-body fn-forms}))

(defn parse-arity-spec
  "Helper for schema.core/=>*."
  [spec]
  (assert! (vector? spec) "An arity spec must be a vector")
  (let [[init more] ((juxt take-while drop-while) #(not= '& %) spec)
        fixed (mapv (fn [i s] `(schema.core/one ~s '~(symbol (str "arg" i)))) (range) init)]
    (if (empty? more)
      fixed
      (do (assert! (and (= (count more) 2) (vector? (second more)))
                   "An arity with & must be followed by a single sequence schema")
          (into fixed (second more))))))

(defn emit-defrecord
  [defrecord-constructor-sym env name field-schema & more-args]
  (let [[extra-key-schema? more-args] (maybe-split-first map? more-args)
        [extra-validator-fn? more-args] (maybe-split-first (complement symbol?) more-args)
        field-schema (process-arrow-schematized-args env field-schema)]
    `(do
       (let [bad-keys# (seq (filter #(schema.core/required-key? %)
                                    (keys ~extra-key-schema?)))]
         (assert! (not bad-keys#) "extra-key-schema? can not contain required keys: %s"
                  (vec bad-keys#)))
       ~(when extra-validator-fn?
          `(assert! (fn? ~extra-validator-fn?) "Extra-validator-fn? not a fn: %s"
                    (type ~extra-validator-fn?)))
       (~defrecord-constructor-sym ~name ~field-schema ~@more-args)
       (utils/declare-class-schema!
        ~name
        (utils/assoc-when
         (schema.core/record
          ~name
          (merge ~(into {}
                        (for [k field-schema]
                          [(keyword (clojure.core/name k))
                           (do (assert! (symbol? k)
                                        "Non-symbol in record binding form: %s" k)
                               (extract-schema-form k))]))
                 ~extra-key-schema?)
          ~(symbol (str 'map-> name)))
         :extra-validator-fn ~extra-validator-fn?))
       ~(let [map-sym (gensym "m")]
          `(if-cljs
            nil
            (defn ~(symbol (str 'map-> name))
              ~(str "Factory function for class " name ", taking a map of keywords to field values, but not much\n"
                    " slower than ->x like the clojure.core version.\n"
                    " (performance is fixed in Clojure 1.7, so this should eventually be removed.)")
              [~map-sym]
              (let [base# (new ~(symbol (str name))
                               ~@(map (fn [s] `(get ~map-sym ~(keyword s))) field-schema))
                    remaining# (dissoc ~map-sym ~@(map keyword field-schema))]
                (if (seq remaining#)
                  (merge base# remaining#)
                  base#)))))
       ~(let [map-sym (gensym "m")]
          `(defn ~(symbol (str 'strict-map-> name))
             ~(str "Factory function for class " name ", taking a map of keywords to field values.  All"
                   " keys are required, and no extra keys are allowed.  Even faster than map->")
             [~map-sym & [drop-extra-keys?#]]
             (when-not (or drop-extra-keys?# (= (count ~map-sym) ~(count field-schema)))
               (error! (utils/format* "Wrong number of keys: expected %s, got %s"
                                      (sort ~(mapv keyword field-schema)) (sort (keys ~map-sym)))))
             (new ~(symbol (str name))
                  ~@(map (fn [s] `(safe-get ~map-sym ~(keyword s))) field-schema)))))))

(if-bb nil
(defn -instrument-protocol-method
  "Given a protocol Var pvar, its method method-var and instrument-method,
  instrument the protocol method."
  [pvar ;:- Var
   method-var ;:- (Var InnerMth)
   instrument-method #_:- #_(s/=>* OuterMth
                                   [InnerMth
                                    (named (=> Any OuterMth InnerMth)
                                           'sync!)])]
  (let [;; propagate method cache to inner method.
        ;; explanation: all functions in Clojure have special support for protocol methods
        ;; via the __methodImplCache field: https://github.com/clojure/clojure/search?q=methodimplcache&type=.
        ;; this mutable field is used inside each protocol method's implementation via (fn this [..] (.__methodImplCache this))
        ;; and also mutated from the "outside" via (set! .__methodImplCache protocol-method).
        ;; since we wrap protocol methods, we need to preserve these two features (settable from outside, readable from inside).
        sync! (fn [^clojure.lang.AFunction outer-mth
                   ^clojure.lang.AFunction inner-mth]
                (when-not (identical? (.__methodImplCache outer-mth)
                                      (.__methodImplCache inner-mth))
                  ;; lock to prevent outdated outer caches from overwriting newer inner caches
                  (locking inner-mth
                    (set! (.__methodImplCache inner-mth)
                          ;; vv WARNING: must be calculated within protected area
                          (.__methodImplCache outer-mth)
                          ;; ^^ WARNING: must be calculated within protected area
                          ))))
        ^clojure.lang.AFunction inner-mth @method-var
        ^clojure.lang.AFunction outer-mth (instrument-method inner-mth sync!)
        ;; populate outer cache so we can use outer-mth as the protocol method without needing
        ;; to call -reset-methods.
        _ (set! (.__methodImplCache outer-mth)
                (.__methodImplCache inner-mth))
        method-builder (fn [cache]
                         (set! (.__methodImplCache outer-mth) cache)
                         (sync! outer-mth inner-mth)
                         ;; preempt future fix for CLJ-1796--have a canonical method
                         ;; representation for the duration of the protocol, matching
                         ;; CLJS semantics.
                         outer-mth)
        this-nsym (ns-name *ns*)]
    ;; instrument method builder
    (alter-var-root pvar assoc-in [:method-builders method-var] method-builder)
    ;; defeat Compiler.java inlining capabilities so we can always enforce schemas
    (alter-meta! method-var assoc :inline (fn [& args]
                                            `((do ~(symbol (name this-nsym) (str (.sym ^clojure.lang.Var method-var))))
                                              ~@args)))
    ;; instrument the actual method
    (alter-var-root method-var (fn [_] outer-mth)))))

(defn parse-defprotocol-sig [env pname name+sig+doc]
  (let [[doc name+sig] (let [lst (last name+sig+doc)]
                         (if (string? lst)
                           [lst (butlast name+sig+doc)]
                           [nil name+sig+doc]))
        [method-name sig] (maybe-split-first simple-symbol? name+sig)
        _ (assert! (simple-symbol? method-name) "Missing method name %s" (pr-str method-name))
        [output-schema sig] (let [fst (first sig)]
                              (if (= :- fst)
                                (let [nxt (next sig)]
                                  (assert! nxt "Missing schema after :- in %s" method-name)
                                  [(first nxt) (next nxt)])
                                [`schema.core/Any sig]))
        _ (assert (seq sig))
        binds (mapv #(process-arrow-schematized-args env %)
                    sig)
        cljs? (cljs-env? env)]
    {:sig (->> (concat (cons method-name binds) (when doc [doc]))
               ;; work around https://clojure.atlassian.net/browse/CLJS-3211
               (apply list))
     :method-name method-name
     :schema-form `(schema.core/=>* ~output-schema ~@(map #(mapv (comp :schema meta) %) binds))
     :instrument-method (let [outer-mth-meta (-> (or (meta method-name) {})
                                                 (dissoc :always-validate :never-validate)
                                                 (into 
                                                   (cond
                                                     (-> method-name meta :never-validate) {:never-validate true}
                                                     (-> method-name meta :always-validate) {:always-validate true}
                                                     (-> pname meta :never-validate) {:never-validate true}
                                                     (-> pname meta :always-validate) {:always-validate true}))
                                                 not-empty)
                              inner-mth (gensym)
                              gen-binder (fn [gs bind]
                                           (vec (mapcat #(list %1 :- (-> %2 meta :schema)) gs bind)))
                              gen-bind-syms (fn [bind]
                                              (mapv (fn [s]
                                                      (if (symbol? s)
                                                        (gensym (str (name s) "__"))
                                                        (gensym)))
                                                    bind))]
                          (cond
                            ;; instrumentation not possible babashka yet
                            bb? nil

                            cljs?
                            (let [cljs-nsym (-> env :ns :name)
                                  ->arity-sym #(symbol (str cljs-nsym "." method-name ".cljs$core$IFn$_invoke$arity$" %))
                                  arities (into {}
                                                (map (fn [bind]
                                                       [(count bind) (gensym)])
                                                     binds))]
                              `(let ~(vec (mapcat (fn [[i g]]
                                                    [g (if (= 1 (count arities))
                                                         ;; just one arity, wrap method-name
                                                         method-name
                                                         ;; multiple arites, wrap each arity individually. don't save/call old method-name
                                                         ;; as it will dispatch right back to the wrapper's arities in an infinite loop.
                                                         (->arity-sym i))])
                                                  arities))
                                 ;; use defn instead of set! to completely hide the $arity$ methods of the underlying protocol
                                 ;; in case the cljs compiler attempts inlining.
                                 (schema.core/defn ~(with-meta method-name
                                                               (assoc outer-mth-meta
                                                                      :protocol (symbol (name cljs-nsym) (name pname))
                                                                      :doc doc))
                                   :- ~output-schema
                                   ~@(map (fn [bind]
                                            (let [arity (count bind)
                                                  gs (gen-bind-syms bind)
                                                  inner-mth (get arities arity)
                                                  _ (assert inner-mth)]
                                              (list (gen-binder gs bind)
                                                    (cons inner-mth gs))))
                                          binds))))
                            :else
                            (let [outer-mth (gensym (str method-name "__"))
                                  sync! (gensym)]
                              `(-instrument-protocol-method
                                 (var ~pname)
                                 (var ~method-name)
                                 ;; a function that wraps a protocol method in a schema check with a
                                 ;; cache synchronization point
                                 (fn [~inner-mth ~sync!]
                                   (schema.core/fn ~(with-meta outer-mth outer-mth-meta)
                                     :- ~output-schema
                                     ~@(map (fn [bind]
                                              (let [gs (gen-bind-syms bind)]
                                                (list (gen-binder gs bind)
                                                      (list sync! outer-mth inner-mth)
                                                      (cons inner-mth gs))))
                                            binds)))))))}))

(defn process-defprotocol [env name+opts+sigs]
  (let [[pname opts+sigs] (maybe-split-first simple-symbol? name+opts+sigs)
        _ (assert! (simple-symbol? pname) "Missing protocol name: %s" (pr-str pname))
        [doc opts+sigs] (maybe-split-first string? opts+sigs)
        [opts sigs] (loop [preamble []
                           [fst :as opts+sigs] opts+sigs]
                      (if (keyword? fst)
                        (let [nxt (next opts+sigs)]
                          (assert! nxt "Uneven args to defprotocol %s" pname)
                          (recur (conj preamble fst (first nxt))
                                 (next nxt)))
                        [preamble opts+sigs]))]
    {:pname pname
     :opts opts
     :doc doc
     :parsed-sigs (mapv (partial parse-defprotocol-sig env pname) sigs)}))

;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;
;;; Public: helpers for schematized functions

(defn normalized-defn-args
  "Helper for defining defn-like macros with schemas.  Env is &env
   from the macro body.  Reads optional docstring, return type and
   attribute-map and normalizes them into the metadata of the name,
   returning the normalized arglist.  Based on
   clojure.tools.macro/name-with-attributes."
  [env macro-args]
  (let [[name macro-args] (extract-arrow-schematized-element env macro-args)
        [maybe-docstring macro-args] (maybe-split-first string? macro-args)
        [maybe-attr-map macro-args] (maybe-split-first map? macro-args)]
    (cons (vary-meta name merge
                     (or maybe-attr-map {})
                     (when maybe-docstring {:doc maybe-docstring}))
          macro-args)))

(defn set-compile-fn-validation!
  "Globally turn on or off function validation from being compiled into s/fn and s/defn.
   Enabled by default.
   See (doc compile-fn-validation?) for all conditions which control fn validation compilation"
  [on?]
  (reset! *compile-fn-validation* on?))
