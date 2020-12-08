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

# ensure that helix-config.yaml is update
if ! git diff --quiet master -- helix-config.yaml; then
  echo "merging changes from master..."
  git merge master -m"chore: merge changes from master"
fi

echo "deploying action"
hlx deploy --wsk-action-memory 512


