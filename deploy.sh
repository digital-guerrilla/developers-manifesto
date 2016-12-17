#!/bin/bash

set -o errexit -o nounset

if [ "$TRAVIS_BRANCH" != "website" ]
then
  echo "This commit was made against the $TRAVIS_BRANCH and not the master! No deploy!"
  exit 0
fi

rev=$(git rev-parse --short HEAD)

cd dist

git init
git config user.name "Travis CI"
git config user.email "$COMMIT_AUTHOR_EMAIL"

git remote add upstream "https://$GH_TOKEN@github.com/digital-guerrilla/developers-manifesto.git"
git fetch upstream
git reset upstream/gh-pages

touch .

git add -A .
git commit -m "rebuild pages at ${rev}"
git push -q upstream HEAD:gh-pages