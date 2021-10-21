(defproject prismatic/schema "1.1.13-SNAPSHOT"
  :description "Clojure(Script) library for declarative data description and validation"
  :url "http://github.com/plumatic/schema"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}

  :profiles {:dev {:dependencies [[org.clojure/clojure "1.8.0"]
                                  [org.clojure/clojurescript "1.10.520"]
                                  [org.clojure/tools.nrepl "0.2.5"]
                                  [org.clojure/test.check "0.9.0"]
                                  [potemkin "0.4.1"]]
                   :plugins [[codox "0.8.8"]
                             [lein-cljsbuild "1.1.7"]
                             [lein-release/lein-release "1.0.4"]
                             [lein-doo "0.1.10"]]}
             :1.9 {:dependencies [[org.clojure/clojure "1.9.0"] [org.clojure/clojurescript "1.10.520"]]}
             :1.10 {:dependencies [[org.clojure/clojure "1.10.0"] [org.clojure/clojurescript "1.10.520"]]}}

  :aliases {"all" ["with-profile" "dev:dev,1.9:dev,1.10"]
            "deploy" ["do" "clean," "deploy" "clojars"]
            "test" ["do" "clean," "test," "with-profile" "dev" "doo" "node" "test" "once"]}

  :jar-exclusions [#"\.swp|\.swo|\.DS_Store"]

  :lein-release {:deploy-via :shell
                 :shell ["lein" "deploy"]}

  :auto-clean false

  :source-paths ["src/clj" "src/cljc"]

  :test-paths ["test/clj" "test/cljc" "test/cljs"]

  :cljsbuild {:builds
              [{:id "dev"
                :source-paths ["src/clj" "src/cljc"]
                :compiler {:output-to "target/main.js"
                           :optimizations :whitespace
                           :pretty-print true}}
               {:id "test"
                :source-paths ["src/clj" "src/cljc"
                               "test/clj" "test/cljc" "test/cljs"]
                :compiler {:output-to "target/unit-test.js"
                           :main schema.test-runner
                           :target :nodejs
                           :pretty-print true}}
               {:id "test-no-assert"
                :source-paths ["src/clj" "src/cljc"
                               "test/clj" "test/cljc" "test/cljs"]
                :assert false
                :compiler {:output-to "target/unit-test.js"
                           :main schema.test-runner
                           :target :nodejs
                           :pretty-print true}}]}

  :codox {:src-dir-uri "http://github.com/plumatic/schema/blob/master/"
          :src-linenum-anchor-prefix "L"}

  :signing {:gpg-key "66E0BF75"})
