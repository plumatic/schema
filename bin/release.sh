#!/bin/bash
set -e

# Script to push a release with lein-release and then push docs.
cd `dirname $0`
lein release
./push_docs.sh
