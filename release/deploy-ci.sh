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

hlx clean
hlx build --universal
hedy -v --target=wsk,aws --deploy --entry-file=.hlx/build/src/html.js       --pkgVersion=ci$CIRCLE_BUILD_NUM --property.scriptName=html \
      --fastly-service-id 3F0xJzfyehcX3g3DQGubj9 \
      --checkpath /_status_check/healthcheck.json  # hardcoded health check path
echo "Gateway Updated."
hedy -v --target=wsk,aws --deploy --entry-file=.hlx/build/src/embed_html.js --pkgVersion=ci$CIRCLE_BUILD_NUM --property.scriptName=embed_html
hedy -v --target=wsk,aws --deploy --entry-file=.hlx/build/src/idx_json.js   --pkgVersion=ci$CIRCLE_BUILD_NUM --property.scriptName=idx_json
hedy -v --target=wsk,aws --deploy --entry-file=.hlx/build/src/plain_html.js --pkgVersion=ci$CIRCLE_BUILD_NUM --property.scriptName=plain_html
hedy -v --target=wsk,aws --deploy --entry-file=./cgi-bin/feed.js            --pkgVersion=ci$CIRCLE_BUILD_NUM --property.scriptName=cgi-bin-feed    --test='?src=/en/query-index.json%3Flimit=1&id=path&title=title&updated=date&originalHost=blog.adobe.com'
hedy -v --target=wsk,aws --deploy --entry-file=./cgi-bin/sitemap.js         --pkgVersion=ci$CIRCLE_BUILD_NUM --property.scriptName=cgi-bin-sitemap --test='?__hlx_owner=adobe&__hlx_repo=pages&__hlx_ref=master'

# update package secrets
if [[ -f ".pages-package.env" ]]; then
  hedy -v --no-build --no-hints --update-package --no-test --pkgVersion=ci$CIRCLE_BUILD_NUM
fi

# update helix-config.yaml
node ./release/update-config.js --pkgVersion ci$CIRCLE_BUILD_NUM --strain default --strain universal
