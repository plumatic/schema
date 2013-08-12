(defproject prismatic/schema "0.0.1-SNAPSHOT"
  :description "TBD"

  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}

  :jar-exclusions [#"\.cljx|\.swp|\.swo|\.DS_Store"]

  :plugins [[lein-cljsbuild "0.3.2"] [com.keminglabs/cljx "0.3.0"]]

  :dependencies [[org.clojure/clojure "1.5.1"]
                 [prismatic/cljs-test "0.0.6"]
                 [potemkin "0.3.2"]]

  :source-paths ["target/generated/src/clj" "src/clj"]
  :test-paths ["target/generated/test/clj" "test/clj"]

  :cljx {:builds [{:source-paths ["src/cljx"]
                   :output-path "target/generated/src/clj"
                   :rules :clj}

                  {:source-paths ["src/cljx"]
                   :output-path "target/generated/src/cljs"
                   :rules :cljs}

                  {:source-paths ["test/cljx"]
                   :output-path "target/generated/test/clj"
                   :rules :clj}

                  {:source-paths ["test/cljx"]
                   :output-path "target/generated/test/cljs"
                   :rules :cljs}]}

  ;; :hooks [leiningen.cljsbuild]

  :cljsbuild {:builds
              {:dev {:source-paths ["src/clj" "target/generated/src/cljs"]
                     :compiler {:output-to "target/main.js"
                                :optimizations :whitespace
                                :pretty-print true}}
               :test {:source-paths [ "src/clj" "test/clj"
                                      "target/generated/src/cljs" "target/generated/test/cljs"]
                      :compiler {:output-to "target/unit-test.js"
                                 :optimizations :whitespace
                                 :pretty-print true}}}}

  :prep-tasks ["cljx" "javac" "compile"]

  :profiles {:dev {:dependencies [[com.keminglabs/cljx "0.3.0"]]
                   :repl-options {:nrepl-middleware [cemerick.piggieback/wrap-cljs-repl
                                                     cljx.repl-middleware/wrap-cljx]}}})
