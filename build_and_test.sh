#!/bin/sh

lein cljx && \
    cp target/generated/clj/src/schema/core.clj src/schema/. && \
    cp target/generated/clj/test/schema/core_test.clj test/schema/. && \
    cp target/generated/cljs/src/schema/core.cljs test/schema/cljs/. && \
    cp target/generated/cljs/test/schema/core_test.cljs test/schema/cljs/. && \
    lein test
