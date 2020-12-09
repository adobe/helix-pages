#!/bin/sh

BRANCH="$(git branch --show-current)"

if [ -n "$(git status --porcelain)" ]; then
  echo "directory not clean."
  exit 1
fi

# ensure latest version
git fetch

echo "publish new version for $BRANCH"
hlx publish --custom-vcl='vcl/extensions.vcl' --only="$BRANCH" --api-publish=https://adobeioruntime.net/api/v1/web/helix/helix-services/publish@8.0.3-test

if [ "$BRANCH" == "master" ]; then
  # if on master, we'all done
  exit 0
fi

# ensure that helix-config.yaml is update
if ! git diff --quiet master -- helix-config.yaml; then
  echo "merging changes from master..."
  git merge master -m"chore: merge changes from master [skip ci]"
fi

# merge changes back to master
git checkout master
git merge --ff-only $BRANCH -- helix-config.yaml
git push master $BRANCH
