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
hedy -v --target=wsk,aws --deploy --aws-create-routes --entry-file=.hlx/build/src/html.js       --property.scriptName=html
hedy -v --target=wsk,aws --deploy --aws-create-routes --entry-file=.hlx/build/src/embed_html.js --property.scriptName=embed_html
hedy -v --target=wsk,aws --deploy --aws-create-routes --entry-file=.hlx/build/src/idx_json.js   --property.scriptName=idx_json
hedy -v --target=wsk,aws --deploy --aws-create-routes --entry-file=.hlx/build/src/plain_html.js --property.scriptName=plain_html
hedy -v --target=wsk,aws --deploy --aws-create-routes --entry-file=./cgi-bin/feed.js            --property.scriptName=cgi-bin-feed    --test='?src=/en/query-index.json%3Flimit=1&id=path&title=title&updated=date&originalHost=blog.adobe.com'
hedy -v --target=wsk,aws --deploy --aws-create-routes --entry-file=./cgi-bin/sitemap.js         --property.scriptName=cgi-bin-sitemap --test='?__hlx_owner=adobe&__hlx_repo=pages&__hlx_ref=master'

# update package secrets
if [[ -f ".pages-package.env" ]]; then
  hedy -v --no-build --no-hints --update-package --no-test
fi

# update helix-config.yaml
node ./release/update-config.js
