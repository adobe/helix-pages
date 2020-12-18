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
/* eslint-disable no-plusplus,no-await-in-loop */
const fetch = require('node-fetch');
const https = require('https');

const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1500,
  maxSockets: 70,
});

function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return `${bytes} B`;
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    // eslint-disable-next-line no-param-reassign
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return `${bytes.toFixed(dp)} ${units[u]}`;
}

async function fetchIndexSegment(offset) {
  const url = `https://theblog--adobe.99productrules.com/en/query-index.json?limit=256&offset=${offset}`;
  console.log(`fetching index ${url}`);
  const resp = await fetch(`${url}`);
  let json = await resp.json();
  if (json.data) json = json.data;
  return (json);
}

async function walkIndex(shield) {
  let offset = 0;
  let counter = 1;
  let segment = [];
  do {
    segment = await fetchIndexSegment(offset);
    for (let i = 0; i < segment.length; i++) {
      const row = segment[i];
      if ((typeof row.path === 'string') && (row.path.startsWith('en/'))) {
        const path = row.path.toLowerCase().replace(/[^a-z\d_/.]/g, '-');
        const url = `https://theblog--adobe.99productrules.com/${path}`;
        try {
          const shieldurl = `https://151.101.250.122/${url.substr(23)}`;
          const start = new Date();
          const resp = await fetch(shield ? shieldurl : url, {
            headers: { 'Fastly-Debug': '1', Host: 'theblog--adobe.99productrules.com' },
            agent,
            compress: true,

          });
          const text = await resp.text();
          const end = new Date();
          const brackets = resp.headers.get('Fastly-Debug-TTL').match(/\(.*?\)/g);
          brackets.pop();
          const hitmiss = brackets.map((e) => `${e.substr(0, 2)}:${e.split(' ')[4]}`.padStart(10, ' ')).join('->');
          console.log(`${(`${counter}`).padStart(5, ' ')} | ${(`${end - start}`).padStart(5, ' ')}ms | ${resp.status} | ${hitmiss} |${humanFileSize(text.length, true).padStart(8, ' ')} | ${url}`);
          if (resp.status === '404' || resp.status === '504' || resp.status === '403' || resp.status === '503') {
            console.log(`Purging ${url}`);
            const respPurge = await fetch(url, { method: 'HLXPURGE' });
            const purgeJson = await respPurge.json();
            console.log(`Purge response: ${JSON.stringify(purgeJson)}`);
            const respRecheck = await fetch(shield ? shieldurl : url, {
              headers: { 'Fastly-Debug': '1', Host: 'blog.adobe.com' },
              agent,
              compress: true,

            });
            const recheckText = await respRecheck.text();
            console.log(`Rechecked response: ${respRecheck.status}`);
          }
        } catch (e) {
          console.log(`Error for ${url} : ${e.message} `);
        }
      } else {
        console.log(`Path not found: ${row.path}`);
      }
      counter++;
    }
    offset += 256;
  } while (segment.length === 256);
}

const shield = process.argv[2] === 'shield';
walkIndex(shield);

