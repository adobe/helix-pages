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
  return `  <url>
    <loc>${host}/${path}</loc>
  </url>
`;
}

function getOriginalHost(headers) {
  if (headers['x-hlx-pages-host']) {
    return headers['x-hlx-pages-host'];
  }
  if (headers['x-forwarded-host']) {
    return headers['x-forwarded-host'].split(',')[0].trim();
  }
  return headers.host;
}

async function run(params) {
  const {
    __hlx_owner: owner,
    __hlx_repo: repo,
    __hlx_ref: ref,
    page = 0,
    hitsPerPage = 100,
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

  const [queryYAML, fstabYAML] = await Promise.all([
    downloader.fetchGithub({ ...coords, path: '/helix-query.yaml' }),
    downloader.fetchGithub({ ...coords, path: '/fstab.yaml' }),
  ]);

  if (queryYAML.status !== 200) {
    log.error(`unable to fetch helix-query.yaml: ${queryYAML.status}`);
    return {
      statusCode: 500,
      body: 'No index definition found.',
      headers: {
        'Content-Type': 'text/plain',
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
  return {
    statusCode: 200,
    body: result.hits.map(
      (hit) => loc(`${scheme}://${originalHost}`, hit, roots),
    ).join(''),
    headers: {
      'Content-Type': 'application/xml',
    },
  };
}

module.exports.main = wrap(run)
  .with(logger);
