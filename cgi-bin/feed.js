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
const fetchAPI = require('@adobe/helix-fetch');
const escape = require('xml-escape');

process.env.HELIX_FETCH_FORCE_HTTP1 = true;

function createFetchContext() {
  /* istanbul ignore next */
  if (process.env.HELIX_FETCH_FORCE_HTTP1) {
    return fetchAPI.context({ httpProtocol: 'http1', httpsProtocols: ['http1'] });
  }
  /* istanbul ignore next */
  return fetchAPI.context({});
}
const fetchContext = createFetchContext();
const { fetch } = fetchContext;

const { logger } = require('@adobe/openwhisk-action-logger');
const { wrap } = require('@adobe/openwhisk-action-utils');
const { getOriginalHost } = require('../src/utils');

/**
 * Return the location element containing the absolute path to a hit in the index.
 *
 * @param {string} host host (including http/s:) to prefix
 * @param {object} hit index hit, containing at least a path
 * @param {object} roots set of mountpoint roots (e.g. 'ms', 'g' )
 */
function loc(host, hit) {
  return `  <entry>
    <id>${host}/${hit.id}</id>
    <title>${escape(hit.title)}</title>
    <updated>${hit.updated.toISOString()}</updated>
    <content><![CDATA[
      <esi:include src="/${hit.id.replace(/\.html$/, '.embed.html')}"></esi:include>
   ]]></content>
  </entry>
`;
}

async function run(req, context) {
  const { log } = context;
  const { searchParams } = new URL(req.url);
  const params = Array.from(searchParams.entries()).reduce((p, [key, value]) => {
    // eslint-disable-next-line no-param-reassign
    p[key] = value;
    return p;
  }, {});
  const {
    src,
    id,
    title,
    updated,
  } = params;

  // Runtime currently overwrites the initial contents of the X-Forwarded-Host header,
  // (see https://jira.corp.adobe.com/browse/RUNNER-3006), so we allow specifying a host
  // header in the action itself
  let { originalHost } = params;
  if (!originalHost) {
    originalHost = getOriginalHost(req.headers);
  }

  try {
    const url = `https://${originalHost}${src}`;
    log.info(`requesting: ${url}`);
    const res = await fetch(url);
    const json = await res.json();

    const results = Array.isArray(json) ? json : json.data;
    let mostRecent = new Date(0);
    const hits = results.map((result) => {
      let upd = new Date(0);
      try {
        upd = Number.isInteger(result[updated])
          ? new Date(result[updated] * 1000)
          : new Date(result[updated]);
      } catch {
        // ignore errors
      }
      if (upd.getTime() > mostRecent.getTime()) {
        mostRecent = upd;
      }
      return {
        id: result[id],
        title: result[title],
        updated: upd,
      };
    });
    const body = `  <updated>${mostRecent.toISOString()}</updated>
${hits.map(
    (hit) => loc(`https://${originalHost}`, hit),
  ).join('\n')}`;

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  } catch (e) {
    log.error(e);
    return new Response('', {
      status: 500,
    });
  }
}

module.exports.main = wrap(run)
  .with(logger);
