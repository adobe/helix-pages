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
const crypto = require('crypto');
const action = require('../../.hlx/build/src/html.bundle');

require('dotenv').config();

async function run() {
  const txId = crypto.randomBytes(16).toString('hex');

  Object.assign(process.env, {
    __OW_ACTION_NAME: '/helix-pages//github-com--adobe--helix-pages--v1-8-14-dirty/html',
    __OW_ACTION_VERSION: '0.0.3',
    __OW_ACTIVATION_ID: crypto.randomBytes(16).toString('hex'),
    __OW_API_HOST: 'https://adobeioruntime.net',
    __OW_TRANSACTION_ID: txId,
    __OW_NAMESPACE: process.env.WSK_NAMESPACE,
    __OW_API_KEY: process.env.WSK_AUTH,
  });

  const ret = await action.main({
    owner: 'adobe',
    repo: 'theblog',
    path: '/en/archive/2020/introducing-public-beta.md',
    ref: 'master',
    __ow_headers: {
      'x-request-id': txId
    },
    EPSAGON_TOKEN: process.env.EPSAGON_TOKEN,
  });
  console.log(ret);
}

run().catch(console.error);
