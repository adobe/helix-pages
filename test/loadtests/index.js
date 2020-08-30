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
/* eslint-disable no-console,no-await-in-loop */
process.env.EPSAGON_COLLECTOR_URL = 'http://localhost:3000';
process.env.EPSAGON_SSL = 'FALSE';
// process.env.EPSAGON_DEBUG = 'TRUE';
// eslint-disable-next-line no-underscore-dangle

const crypto = require('crypto');
const heapdump = require('heapdump');
const cls = require('cls-hooked');
const { main } = require('./dist/html.js');

const wskVars = cls.createNamespace('activation variables');

function setVar(k, v) {
  const key = `__OW_${k}`;
  wskVars.set(key, v);
  if (!(key in process.env)) {
    Object.defineProperty(process.env, key, {
      get: () => wskVars.active[key],
      enumerable: true,
    });
  }
}

const useNock = false;

let scope1 = { done: async () => true };
let scope2 = { done: async () => true };
if (useNock) {
  // eslint-disable-next-line global-require
  const nock = require('nock');
  scope1 = nock('https://raw.githubusercontent.com')
    .persist()
    .get(/.*/)
    .reply(404);
  scope2 = nock('https://adobeioruntime.net')
    .persist()
    // .get(/.*/)
    // .reply(404);
    .get('/api/v1/web/helix/helix-services/content-proxy@v1?owner=adobe&repo=theblog&path=%2Fen%2Ftopics%2Frobohelp.md&ref=73776e581e4e2f80c2b95ab02ca514ed8b7481f5')
    .reply(200, '# Welcome');
}

async function task() {
  return wskVars.runAndReturn(async () => {
    setVar('ACTIVATION_ID', crypto.randomBytes(32).toString('hex'));
    // eslint-disable-next-line no-unused-vars
    const ret = await main({
      repo: 'theblog',
      owner: 'adobe',
      path: '/en/topics/robohelp.md',
      params: '',
      ref: '73776e581e4e2f80c2b95ab02ca514ed8b7481f5',
      package: '6c8161919bbbff8cece81532d286de9f2ddf9542',
      branch: 'master',
      rootPath: '',
      // LOG_LEVEL: 'debug',
      LOG_LEVEL: 'info',
      HTTP_TIMEOUT: 10000,
      REPO_RAW_ROOT: 'http://localhost:3000/',
      CONTENT_PROXY_URL: 'http://localhost:3000/api/v1/web/helix/helix-services/content-proxy@v1',
      EPSAGON_TOKEN: '99999999-8888-7777-6666-555555555555',
      CORALOGIX_API_KEY: 'fake',
    });
    // console.log(ret);
  });
}

let numTotal = 0;
let numInvocations = 0;

async function request() {
  // eslint-disable-next-line no-constant-condition
  while (numInvocations < 500) {
    numInvocations += 1;
    numTotal += 1;
    console.error(numTotal, process.memoryUsage().rss);
    await task();
  }
}

async function run() {
  for (let c = 0; c < 1000; c += 1) {
    numInvocations = 0;
    const tasks = [];
    for (let i = 0; i < 20; i += 1) {
      tasks.push(request());
    }
    await Promise.all(tasks);
    await scope1.done();
    await scope2.done();
    global.gc();
    const filename = `${Date.now()}-${numTotal}.heapsnapshot`;
    heapdump.writeSnapshot(filename);
    console.log(`wrote snapshot ${filename}`);
  }
}

run().catch(console.error);
// task().catch(console.error);
