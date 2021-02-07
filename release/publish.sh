#!/bin/sh

BRANCH="$(git branch --show-current)"

if [ -n "$(git status --porcelain)" ]; then
  echo "directory not clean."
  exit 1
fi

# ensure latest version
git fetch

echo "publish new version for $BRANCH"
hlx publish --custom-vcl='vcl/extensions.vcl' --only="$BRANCH" | cat

if [ "$BRANCH" == "master" ]; then
  # if on master, we're all done
  exit 0
fi

# ensure that helix-config.yaml is update
if ! git diff --quiet master -- helix-config.yaml; then
  echo "merging changes from master..."
  git merge master -m"chore: merge changes from master into $BRANCH [skip ci]"
fi

# merge changes back to master
git checkout master
git checkout $BRANCH -- helix-config.yaml
git commit -m"chore: update helix-config.yaml from $BRANCH [skip ci]"
git push master $BRANCH
git checkout $BRANCH
