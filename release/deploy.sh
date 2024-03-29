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

if [ -n "$(git status --porcelain)" ]; then
  echo "directory not clean."
  exit 1
fi

# ensure latest version
git fetch

BRANCH="$(git rev-parse --abbrev-ref HEAD)"
PKG_VERSION="$(jq -r .version package.json | sed -e 's/\./_/g')"
ARG_VERSION="--pkgVersion $PKG_VERSION"
ARG_STRAIN="--strain default --strain universal --strain universal-ci --strain universal-prod --strain gcf --strain gcf-ci"
if [[ "$BRANCH" =~ ^breaking-.* ]]; then
  # use special version for deploying on breaking branch
  # google does not like dots in action names and semver
  # does not like underscores, so replace them with dashes
  PKG_VERSION="$(jq -r .version package.json | sed -e 's/\./-/g')-$BRANCH"
  ARG_VERSION="--pkgVersion $PKG_VERSION"
  ARG_STRAIN="--strain $BRANCH"
  echo "using package version: $PKG_VERSION"
fi

hlx clean
hlx build --universal
hedy -v --target=wsk,aws,google --deploy --entry-file=.hlx/build/src/html.js       $ARG_VERSION --property.scriptName=html \
      --fastly-service-id 0trc7KZPj73TyFfFhsUyWu \
      --checkpath /_status_check/healthcheck.json  # hardcoded health check path
echo "Gateway Updated."
hedy -v --target=wsk,aws,google --deploy --entry-file=.hlx/build/src/embed_html.js $ARG_VERSION --property.scriptName=embed_html --cleanup-ci=24h --cleanup-patch=7d --cleanup-minor=1m --cleanup-major=1y
hedy -v --target=wsk,aws,google --deploy --entry-file=.hlx/build/src/plain_html.js $ARG_VERSION --property.scriptName=plain_html --cleanup-ci=24h --cleanup-patch=7d --cleanup-minor=1m --cleanup-major=1y
hedy -v --target=wsk,aws,google --deploy --entry-file=./cgi-bin/feed.js            $ARG_VERSION --property.scriptName=cgi-bin-feed    --test='?src=/en/query-index.json%3Flimit=1&id=path&title=title&updated=date&originalHost=blog.adobe.com' --cleanup-ci=24h --cleanup-patch=7d --cleanup-minor=1m --cleanup-major=1y

# update package secrets
if [[ -f ".pages-package.env" ]]; then
  hedy -v --no-build --no-hints --update-package --aws-parameter-manager=system --no-test
fi

# update helix-config.yaml
node ./release/update-config.js $ARG_VERSION $ARG_STRAIN
