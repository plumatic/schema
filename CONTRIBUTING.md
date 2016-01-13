# Contributing

Contributions to Schema are very welcome.  

Please file bug reports on [GitHub](https://github.com/plumatic/schema/issues).

For questions, feature requests, or discussion, please post on the Plumbing [mailing list](https://groups.google.com/forum/#!forum/prismatic-plumbing) for now.

Contributions are preferred as GitHub pull requests on topic branches.  If you want to discuss a potential change before coding it up, please post on the mailing list.

Schema uses the excellent [cljx](https://github.com/lynaghk/cljx) project to share source between Clojure and ClojureScript.  For any in-depth changes to Schema, you will probably want to be familiar with its feature expressions (`#clj` and `#cljx`), and the inherent differences between Clojure and ClojureScript.  In particular, if you're wondering why the code is divided the way it is, this is probably the answer.  If you develop with Emacs, the included `:nrepl-middleware` should allow you to work at the REPL as you're used to.

Schema is relatively well-tested, on both Clojure and ClojureScript.  Before submitting a pull request, we ask that you:

 * please try to follow the conventions in the existing code, including standard Emacs indentation, no trailing whitespace, and a max width of 95 columns  
 * rebase your feature branch on the latest master branch
 * ensure any new code is well-tested, and if possible, any issue fixed is covered by one or more new tests
 * check that all of the tests pass **in both Clojure and ClojureScript**
 
To run the Clojure and ClojureScript tests, first run `lein cljx`, then run `lein test`.  You must have phantomjs installed for the ClojureScript tests to run.

