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

/**
 * Azure search index provider.
 */
class AzureIndex {
  constructor(apiKey, serviceName, name, downloader) {
    this._apiKey = apiKey;
    this._serviceName = serviceName;
    this._name = name;
    this._downloader = downloader;
  }

  async search(query, { hitsPerPage, page, attributesToRetrieve }) {
    const url = new URL(`https://${this._serviceName}.search.windows.net/indexes/${this._name}/docs`);
    url.searchParams.append('api-version', '2019-05-06');
    url.searchParams.append('$top', hitsPerPage);
    url.searchParams.append('$skip', page * hitsPerPage);
    url.searchParams.append('$select', attributesToRetrieve.map((k) => k.replace(/-/g, '_')).join(','));

    const headers = {
      'api-key': this._apiKey,
    };

    const res = await this._downloader.fetch({ uri: url.toString(), options: { headers } });
    if (res.status !== 200) {
      return {};
    }
    const result = JSON.parse(res.body);
    return {
      hits: result.value
        .map((hit) => Object.entries(hit)
          .reduce((acc, [k, v]) => {
            if (!/^@/.test(k)) {
              acc[k.replace(/_/g, '-')] = v;
            }
            return acc;
          }, {})),
    };
  }
}

module.exports = {
  match: (target) => target.startsWith('azure:'),
  create: (index, params, env) => {
    const {
      AZURE_SEARCH_API_KEY, AZURE_SEARCH_SERVICE_NAME,
    } = env;

    if (!AZURE_SEARCH_API_KEY) {
      throw new Error('AZURE_SEARCH_API_KEY parameter missing.');
    }
    if (!AZURE_SEARCH_SERVICE_NAME) {
      throw new Error('AZURE_SEARCH_SERVICE_NAME parameter missing.');
    }

    const { owner, repo, downloader } = params;
    return new AzureIndex(
      AZURE_SEARCH_API_KEY,
      AZURE_SEARCH_SERVICE_NAME,
      `${owner}--${repo}--${index.name}`,
      downloader,
    );
  },
};
