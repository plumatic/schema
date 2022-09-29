(ns fipp.engine
  "See: Oleg Kiselyov, Simon Peyton-Jones, and Amr Sabry
  Lazy v. Yield: Incremental, Linear Pretty-printing"
  (:require [clojure.string :as s]
            [fipp.deque :as deque]))


;;; Serialize document into a stream

(defmulti serialize-node first)

(defn serialize [doc]
  (cond
    (nil? doc) nil
    (seq? doc) (mapcat serialize doc)
    (string? doc) [{:op :text, :text doc}]
    (keyword? doc) (serialize-node [doc])
    (vector? doc) (serialize-node doc)
    :else (throw (ex-info "Unexpected class for doc node" {:node doc}))))

;; Primitives
;; See doc/primitives.md for details.

(defmethod serialize-node :text [[_ & text]]
  [{:op :text, :text (apply str text)}])

(defmethod serialize-node :pass [[_ & text]]
  [{:op :pass, :text (apply str text)}])

(defmethod serialize-node :escaped [[_ text]]
  (assert (string? text))
  [{:op :escaped, :text text}])

(defmethod serialize-node :span [[_ & children]]
  (serialize children))

(defmethod serialize-node :line [[_ inline terminate]]
  (let [inline (or inline " ")
        terminate (or terminate "")]
    (assert (string? inline))
    (assert (string? terminate))
    [{:op :line, :inline inline, :terminate terminate}]))

(defmethod serialize-node :break [& _]
  [{:op :break}])

(defmethod serialize-node :group [[_ & children]]
  (concat [{:op :begin}] (serialize children) [{:op :end}]))

(defmethod serialize-node :nest [[_ & args]]
  (let [[offset & children] (if (number? (first args))
                              args
                              (cons 2 args))]
    (concat [{:op :nest, :offset offset}]
            (serialize children)
            [{:op :outdent}])))

(defmethod serialize-node :align [[_ & args]]
  (let [[offset & children] (if (number? (first args))
                             args
                             (cons 0 args))]
    (concat [{:op :align, :offset offset}]
            (serialize children)
            [{:op :outdent}])))



(defn annotate-rights
  "A transducer which annotates the right-side of nodes assuming a
  hypothetical single-line formatting of the document. Groups and indentation
  directives are temporarily assumed to be zero-width. These values are used
  by subsequent passes to produce the final layout."
  [rf]
  (let [pos (volatile! 0)]
    (fn
      ([] (rf))
      ([res] (rf res))
      ([res node]
       (let [delta (case (:op node)
                     :text (count (:text node))
                     :line (count (:inline node))
                     :escaped 1
                     0)
             p (vswap! pos + delta)]
         (rf res (assoc node :right p)))))))



(defn update-right [deque f & args]
  (deque/conjr (pop deque) (apply f (peek deque) args)))

(defn annotate-begins
  "Given printing options, returns a transducer which annotate the right-side
  of groups on their :begin nodes.  This includes the pruning algorithm which
  will annotate some :begin nodes as being :too-far to the right without
  calculating their exact sizes."
  [{:keys [width] :as options}]
  (fn [rf]
    (let [pos (volatile! 0)
          bufs (volatile! deque/empty)]
      (fn
        ([] (rf))
        ([res] (rf res))
        ([res {:keys [op right] :as node}]
         (let [buffers @bufs]
           (if (empty? buffers)
             (if (= op :begin)
               ;; Buffer groups
               (let [position* (+ right width)
                     buffer {:position position* :nodes deque/empty}]
                 (vreset! pos position*)
                 (vreset! bufs (deque/create buffer))
                 res)
               ;; Emit unbuffered
               (rf res node))
             (if (= op :end)
               ;; Pop buffer
               (let [buffer (peek buffers)
                     buffers* (pop buffers)
                     begin {:op :begin :right right}
                     nodes (deque/conjlr begin (:nodes buffer) node)]
                 (if (empty? buffers*)
                   (do
                     (vreset! pos 0)
                     (vreset! bufs deque/empty)
                     (reduce rf res nodes))
                   (do
                     (assert (vector? buffers*))
                     (assert (vector? nodes))
                     (vreset! bufs (update-right buffers* update-in [:nodes]
                                                 deque/concat nodes))
                     res)))
               ;; Pruning lookahead
               (loop [buffers* (if (= op :begin)
                                 (deque/conjr buffers
                                              {:position (+ right width)
                                               :nodes deque/empty})
                                 (update-right buffers update-in [:nodes]
                                               deque/conjr node))
                      res res]
                 (if (and (<= right @pos) (<= (count buffers*) width))
                   ;; Not too far
                   (do (vreset! bufs buffers*)
                       res)
                   ;; Too far
                   (let [buffer (first buffers*)
                         buffers** (deque/popl buffers*)
                         begin {:op :begin, :right :too-far}
                         res* (rf res begin)
                         res* (reduce rf res* (:nodes buffer))]
                     (if (empty? buffers**)
                       ;; Root buffered group
                       (do
                         (vreset! pos 0)
                         (vreset! bufs deque/empty)
                         res*)
                       ;; Interior group
                       (do
                         (vreset! pos (:position (first buffers**)))
                         (recur buffers** res*))))))
            ))))))))


(defn format-nodes
  "Given printing options, returns a transducer which produces the fully
  laid-out strings."
  [{:keys [width] :as options}]
  (fn [rf]
    (let [fits (volatile! 0)
          length (volatile! width)
          tab-stops (volatile! '(0)) ; Technically, an unbounded stack...
          column (volatile! 0)]
      (fn
        ([] (rf))
        ([res] (rf res))
        ([res {:keys [op right] :as node}]
         (let [indent (peek @tab-stops)]
           (case op
             :text
               (let [text (:text node)
                     res* (if (zero? @column)
                            (do (vswap! column + indent)
                                (rf res (apply str (repeat indent \space))))
                            res)]
                 (vswap! column + (count text))
                 (rf res* text))
             :escaped
               (let [text (:text node)
                     res* (if (zero? @column)
                            (do (vswap! column + indent)
                                (rf res (apply str (repeat indent \space))))
                            res)]
                 (vswap! column inc)
                 (rf res* text))
             :pass
               (rf res (:text node))
             :line
               (if (zero? @fits)
                 (do
                   (vreset! length (- (+ right width) indent))
                   (vreset! column 0)
                   (rf res (str (:terminate node) "\n")))
                 (let [inline (:inline node)]
                   (vswap! column + (count inline))
                   (rf res inline)))
             :break
               (do
                 (vreset! length (- (+ right width) indent))
                 (vreset! column 0)
                 (rf res "\n"))
             :nest
               (do (vswap! tab-stops conj (+ indent (:offset node)))
                   res)
             :align
               (do (vswap! tab-stops conj (+ @column (:offset node)))
                   res)
             :outdent
               (do (vswap! tab-stops pop)
                   res)
             :begin
               (do (vreset! fits (cond
                                   (pos? @fits) (inc @fits)
                                   (= right :too-far) 0
                                   (<= right @length) 1
                                   :else 0))
                   res)
             :end
               (do (vreset! fits (max 0 (dec @fits)))
                   res)
             (throw (ex-info "Unexpected node op" {:node node}))))
         )))))


(defn pprint-document [document options]
  (let [options (merge {:width 70} options)]
    (->> (serialize document)
         (eduction
           annotate-rights
           (annotate-begins options)
           (format-nodes options))
         (run! print)))
  (println))


(comment

  (defn dbg [x]
    (println "DBG:")
    (clojure.pprint/pprint x)
    (println "----")
    x)

  (serialize "apple")
  (serialize [:text "apple" "ball"])
  (serialize [:span "apple" [:group "ball" :line "cat"]])
  (serialize [:span "apple" [:line ","] "ball"])

  (def doc1 [:group "A" :line [:group "B" :line "C"]])
  (def doc2 [:group "A" :line [:nest 2 "B" :line "C"] :line "D"])
  (def doc3 [:group "A" :line
             [:nest 2 "B-XYZ" [:align -3 :line "C"]] :line "D"])

  (serialize doc1)

  (let [options {:width 3}]
    (->> doc3
         serialize
         (into [] (comp
                    annotate-rights
                    (annotate-begins options)
                    (format-nodes options)
                    ))
         ;(run! print)
         clojure.pprint/pprint
         )
    ;nil
    )

  ;; test of :pass op
  (do
    (pprint-document
      [:group "AB" :line "B" :line "C"]
      {:width 6}) 
    (println "--")
    (pprint-document
      [:group "<AB>" :line "B" :line "C"]
      {:width 6}) 
    (println "--")
    (pprint-document
      [:group [:pass "<"] "AB" [:pass ">"] :line "B" :line "C"]
      {:width 6}))

  (def ex1
    [:group "["
        [:nest 2
            [:line ""] "0,"
            :line "1,"
            :line "2,"
            :line "3"
            [:line ""]]
        "]"])

  (pprint-document ex1 {:width 20})
  (pprint-document ex1 {:width 6})

  (def ex2
    [:span "["
        [:align
            [:group [:line ""]] "0,"
            [:group :line] "1,"
            [:group :line] "2,"
            [:group :line] "3"]
        "]"])

  (pprint-document ex2 {:width 20})
  (pprint-document ex2 {:width 6})

)
