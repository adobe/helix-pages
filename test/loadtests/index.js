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
/* eslint-disable no-console */

const nock = require('nock');
const { main } = require('./dist/html.js');

nock('https://raw.githubusercontent.com')
  .persist()
  .get(/.*/)
  .reply(404);
nock('https://adobeioruntime.net')
  .persist()
  .get(/.*/)
  .reply(404);

async function task() {
  await main({
    repo: 'theblog',
    owner: 'adobe',
    path: '/en/topics/robohelp.md',
    params: '',
    ref: '73776e581e4e2f80c2b95ab02ca514ed8b7481f5',
    package: '6c8161919bbbff8cece81532d286de9f2ddf9542',
    branch: 'master',
    rootPath: '',
    LOG_LEVEL: 'error',
  });
  // console.log(ret);
}

let numInvocations = 0;

async function request() {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    numInvocations += 1;
    console.error(numInvocations, process.memoryUsage().rss);
    // eslint-disable-next-line no-await-in-loop
    await task();
  }
}

async function run() {
  const tasks = [];
  for (let i = 0; i < 20; i += 1) {
    tasks.push(request());
  }
  await Promise.all(tasks);
}

run().catch(console.error);
