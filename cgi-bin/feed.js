/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const algoliasearch = require('algoliasearch');
const { logger } = require('@adobe/openwhisk-action-logger');
const { wrap } = require('@adobe/openwhisk-action-utils');
const Downloader = require('@adobe/helix-pipeline/src/utils/Downloader.js');
const { MountConfig, IndexConfig } = require('@adobe/helix-shared');
const { getOriginalHost } = require('../src/utils');

/**
 * Return the location element containing the absolute path to a hit in the index.
 *
 * @param {string} host host (including http/s:) to prefix
 * @param {object} hit index hit, containing at least a path
 * @param {object} roots set of mountpoint roots (e.g. 'ms', 'g' )
 */
function loc(host, hit, roots) {
  let path = hit['external-path'] || hit.path;

  const sep = path.indexOf('/');
  if (sep !== -1 && roots.has(path.substr(0, sep + 1))) {
    path = path.substr(sep + 1);
  }
  return `  <entry>
    <esi:include src="/${path}.entry.html"></esi:include>
  </entry>
`;
}

async function run(params) {
  const {
    __hlx_owner: owner,
    __hlx_repo: repo,
    __hlx_ref: ref,
    page = 0,
    hitsPerPage = 10,
    ALGOLIA_API_KEY,
    ALGOLIA_APP_ID,
    __ow_headers: headers,
    __ow_logger: log,
  } = params;

  if (!owner) {
    throw new Error('__hlx_owner parameter missing.');
  }
  if (!repo) {
    throw new Error('__hlx_repo parameter missing.');
  }
  if (!ref) {
    throw new Error('__hlx_ref parameter missing.');
  }
  if (!ALGOLIA_API_KEY) {
    throw new Error('ALGOLIA_API_KEY parameter missing.');
  }
  if (!ALGOLIA_APP_ID) {
    throw new Error('ALGOLIA_APP_ID parameter missing.');
  }
  const coords = { owner, repo, ref };
  const action = {
    request: { params: coords },
    secrets: {
      REPO_RAW_ROOT: 'https://raw.githubusercontent.com/',
      HTTP_TIMEOUT: 1000,
    },
    logger: log,
  };

  const downloader = new Downloader({}, action, {
    forceHttp1: ALGOLIA_APP_ID === 'foo', // use http1 for tests
  });
  let files;

  try {
    files = await Promise.all([
      downloader.fetchGithub({ ...coords, path: '/helix-query.yaml' }),
      downloader.fetchGithub({ ...coords, path: '/fstab.yaml' }),
    ]);
  } catch (e) {
    log.error(e.message);
    return {
      statusCode: 500,
      body: e.message,
      headers: {
        'Content-Type': 'text/plain',
      },
    };
  } finally {
    downloader.destroy();
  }

  const [queryYAML, fstabYAML] = files;
  if (queryYAML.status !== 200) {
    const logout = (queryYAML.status === 404 ? log.info : log.error).bind(log);
    logout(`unable to fetch helix-query.yaml: ${queryYAML.status}`);
    return {
      statusCode: 200,
      body: '',
      headers: {
        'Content-Type': 'application/xml',
      },
    };
  }
  const config = (await new IndexConfig()
    .withSource(queryYAML.body)
    .init()).toJSON();

  const roots = new Set();
  if (fstabYAML.status === 200) {
    const fstab = await new MountConfig()
      .withSource(fstabYAML.body)
      .init();
    fstab.mountpoints.forEach((entry) => {
      roots.add(entry.path.substr(1));
    });
  } else {
    log.warn(`unable to fetch fstab.yaml: ${fstabYAML.status}`);
  }

  // TODO: when there are multiple indices, find the one appropriate for sitemap generation
  const algolia = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);
  const indexname = `${owner}--${repo}--${Object.keys(config.indices)[0]}`;
  const index = algolia.initIndex(indexname);
  const result = await index.search('', {
    hitsPerPage,
    page,
    attributesToRetrieve: ['path', 'external-path'],
  });

  const scheme = headers['x-forwarded-proto'] || 'http';
  // Runtime currently overwrites the initial contents of the X-Forwarded-Host header,
  // (see https://jira.corp.adobe.com/browse/RUNNER-3006), so we allow specifying a host
  // header in the action itself
  let { originalHost } = params;
  if (!originalHost) {
    originalHost = getOriginalHost(headers);
  }

  const body = `  <updated>${new Date().toISOString()}</updated>\n${result.hits.map(
    (hit) => loc(`${scheme}://${originalHost}`, hit, roots),
  ).join('\n')}`;

  return {
    statusCode: 200,
    body,
    headers: {
      'Content-Type': 'application/xml',
    },
  };
}

module.exports.main = wrap(run)
  .with(logger);
