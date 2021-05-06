#!/bin/bash
#
# Copyright 2021 Adobe. All rights reserved.
# This file is licensed to you under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License. You may obtain a copy
# of the License at http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software distributed under
# the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
# OF ANY KIND, either express or implied. See the License for the specific language
# governing permissions and limitations under the License.
#

set -veo pipefail

BRANCH="$(git rev-parse --abbrev-ref HEAD)"

echo "publish new version for $BRANCH"

hlx publish --log-level debug --custom-vcl='vcl/extensions.vcl' --only="$BRANCH" | cat

echo "here's what changed:"
git diff | cat

if [ "$BRANCH" == "master" ]; then
  # store last known good
  git checkout master
  git pull --tags origin
  git commit -am "🚢 enshrining config post-deploy [ci skip]" --allow-empty
  git tag `date "+known-good-%Y%m%d%H%M%S"`
  git push --tags origin master

  # if on master, we're all done
  exit 0
fi

if [[ "$BRANCH" =~ ^breaking-.* ]]; then
  # also commit changs in breaking branch
  git commit -am "🚢 enshrining config post-deploy [ci skip]" --allow-empty
  git push origin "$BRANCH"
fi

# ensure that helix-config.yaml is update
if ! git diff --quiet master -- helix-config.yaml; then
  echo "merging changes from master..."
  git merge master -m"chore: merge changes from master into $BRANCH [skip ci]"
  git push origin "$BRANCH"
fi

# merge changes back to master
git checkout master
git pull
git checkout $BRANCH -- helix-config.yaml

# commit if we have changes
if [ -n "$(git status --porcelain)" ]; then
  git commit -m"chore: update helix-config.yaml from $BRANCH [skip ci]"
  git push origin master
else
  echo "no changes to master."
fi

git checkout $BRANCH
