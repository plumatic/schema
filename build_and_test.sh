#!/bin/sh

lein cljx && \
    cp target/generated/clj/src/schema/core.clj src/schema/. && \
    cp target/generated/clj/test/schema/core_test.clj test/schema/. && \
    lein test
