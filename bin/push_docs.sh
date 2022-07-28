#!/bin/bash
set -e

# Script to generate docs and push to github pages.
# https://github.com/weavejester/codox/wiki/Deploying-to-GitHub-Pages
cd `dirname $0`

git fetch --tags
latestTag=$(git describe --tags `git rev-list --tags --max-count=1`)
git checkout $latestTag

lein doc
git checkout gh-pages # To be sure you're on the right branch
# gh-pages is currently deployed from root (not `doc` folder)
rm *.html
rm -fr js css doc
mv target/doc/* .
git add .
git commit --allow-empty -am "new documentation push."
git push -u origin gh-pages
git checkout -
