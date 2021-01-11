/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

'use strict';

const algoliasearch = require('algoliasearch');

module.exports = {
  match: (target) => !target,
  create: (index, params, env) => {
    const {
      ALGOLIA_API_KEY, ALGOLIA_APP_ID,
    } = env;

    if (!ALGOLIA_API_KEY) {
      throw new Error('ALGOLIA_API_KEY parameter missing.');
    }
    if (!ALGOLIA_APP_ID) {
      throw new Error('ALGOLIA_APP_ID parameter missing.');
    }

    const { owner, repo } = params;
    return algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY).initIndex(`${owner}--${repo}--${index.name}`);
  },
};
