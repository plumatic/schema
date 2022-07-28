#!/bin/bash
set -e

# Script to generate docs and push to github pages.
# https://github.com/weavejester/codox/wiki/Deploying-to-GitHub-Pages
lein doc
git checkout gh-pages # To be sure you're on the right branch
git reset --hard origin/gh-pages
git pull origin gh-pages
# gh-pages is currently deployed from root (not `doc` folder)
rm *.html
rm -fr js css doc
mv target/doc/* .
git add .
git commit --allow-empty -am "new documentation push."
git push -u origin gh-pages
git checkout -
