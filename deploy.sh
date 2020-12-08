#!/bin/sh

if [ "$(git branch --show-current)" == "master" ]; then
  echo "deploy.sh only needed on branch"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "directory not clean."
  exit 1
fi

# ensure that helix-config.yaml is update
if ! git diff --quiet master -- helix-config.yaml; then
  git merge master
fi

