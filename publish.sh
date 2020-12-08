#!/bin/sh

BRANCH="$(git branch --show-current)"

if [ "$BRANCH" == "master" ]; then
  echo "publish.sh only needed on feature branch"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "directory not clean."
  exit 1
fi

echo "publish new version for $BRANCH"
hlx publish --custom-vcl='vcl/extensions.vcl' --only="$BRANCH" --api-publish=https://adobeioruntime.net/api/v1/web/helix/helix-services/publish@8.0.3-test

# ensure that helix-config.yaml is update
if ! git diff --quiet master -- helix-config.yaml; then
  echo "merging changes from master..."
  git merge master -m"chore: merge changes from master [skip ci]"
fi

# merge changes back to master
git checkout master
git merge --ff-only $BRANCH
git push master $BRANCH
