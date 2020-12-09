#!/bin/sh

BRANCH="$(git branch --show-current)"

if [ "$BRANCH" == "master" ]; then
  echo "deploy.sh only needed on feature branch"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "directory not clean."
  exit 1
fi

# ensure latest version
git fetch

echo "deploying action"
hlx deploy --wsk-action-memory 512

echo "saving helix-config.yaml"
git add helix-config.yaml
git commit -m"chore: recording new helix-config from $BRANCH [skip ci]"
