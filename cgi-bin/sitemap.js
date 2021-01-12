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
const { Response } = require('node-fetch');
const pick = require('lodash.pick');
const pickBy = require('lodash.pickby');
const { logger } = require('@adobe/openwhisk-action-logger');
const { wrap } = require('@adobe/openwhisk-action-utils');
const Downloader = require('@adobe/helix-pipeline/src/utils/Downloader.js');
const { MountConfig, IndexConfig } = require('@adobe/helix-shared');
const { getOriginalHost } = require('../src/utils');

const algolia = require('../src/providers/algolia.js');
const azure = require('../src/providers/azure.js');

/**
 * List of known index providers.
 */
const providers = [
  algolia, azure,
];

/**
 * Create the search provider that will return all paths for the sitemap.
 *
 * @param {object} index index configuration
 * @param {object} params parameters relevant for the provider
 * @returns provider instance
 */
function createSearchProvider(index, params, env) {
  const { owner, repo, downloader } = params;

  const { sitemap, target } = index;
  if (sitemap) {
    return {
      search: async (query, {
        hitsPerPage,
        page,
        attributesToRetrieve,
      }) => {
        const uri = new URL(index.fetch.replace(/\{owner\}/g, owner).replace(/\{repo\}/g, repo).replace(/\{path\}/g, sitemap));
        uri.searchParams.append('limit', hitsPerPage);
        uri.searchParams.append('offset', page * hitsPerPage);
        const res = await downloader.fetch({ uri: uri.toString() });
        if (res.status !== 200) {
          return {};
        }
        const json = JSON.parse(res.body);
        const hits = json.data && Array.isArray(json.data) ? json.data : json;
        return {
          hits: hits.map((hit) => pick(hit, attributesToRetrieve)),
        };
      },
    };
  }

  const candidate = providers.find((c) => c.match(target));
  if (!candidate) {
    throw new Error(`No search provider match for target: ${target}`);
  }
  return candidate.create(index, params, env);
}

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

async function run(req, context) {
  const { log, env } = context;
  const { searchParams } = new URL(req.url);
  const params = Array.from(searchParams.entries()).reduce((p, [key, value]) => {
    // eslint-disable-next-line no-param-reassign
    p[key] = value;
    return p;
  }, {});
  const {
    __hlx_owner: owner,
    __hlx_repo: repo,
    __hlx_ref: ref,
    page = 0,
    hitsPerPage = 100,
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
  const coords = { owner, repo, ref };
  const action = {
    request: { params: coords },
    secrets: {
      REPO_RAW_ROOT: 'https://raw.githubusercontent.com/',
      HTTP_TIMEOUT: 10000,
    },
    logger: log,
  };

  const downloader = new Downloader({}, action, {
    forceHttp1: owner === 'me', // use http1 for tests
  });
  let files;

  try {
    files = await Promise.all([
      downloader.fetchGithub({ ...coords, path: '/helix-query.yaml' }),
      downloader.fetchGithub({ ...coords, path: '/fstab.yaml' }),
    ]);
  } catch (e) {
    log.error(e.message);
    return new Response(e.message, {
      status: 500,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } finally {
    downloader.destroy();
  }

  const [queryYAML, fstabYAML] = files;
  if (queryYAML.status !== 200) {
    const logout = (queryYAML.status === 404 ? log.info : log.error).bind(log);
    logout(`unable to fetch helix-query.yaml: ${queryYAML.status}`);
    return new Response('', {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
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
  const firstIndexName = Object.keys(config.indices)[0];
  let provider;

  try {
    provider = createSearchProvider(config.indices[firstIndexName], {
      owner,
      repo,
      ref,
      downloader,
      ...pickBy(params, (value, key) => /^[A-Z_]+$/.test(key)),
    }, env);
  } catch (e) {
    log.error('Unable to create search provider', e);
    return new Response(e.message, {
      status: 500,
    });
  }

  const result = await provider.search('', {
    hitsPerPage,
    page,
    attributesToRetrieve: ['path', 'external-path'],
  });

  const scheme = req.headers.get('x-forwarded-proto') || 'http';
  // Runtime currently overwrites the initial contents of the X-Forwarded-Host header,
  // (see https://jira.corp.adobe.com/browse/RUNNER-3006), so we allow specifying a host
  // header in the action itself
  let { originalHost } = params;
  if (!originalHost) {
    originalHost = getOriginalHost(req.headers);
  }

  const body = result.hits.map(
    (hit) => loc(`${scheme}://${originalHost}`, hit, roots),
  ).join('');
  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
    },
  });
}

module.exports.main = wrap(run)
  .with(logger);
