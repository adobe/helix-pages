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
const assert = require('assert');
const http = require('http');
// const https = require('https');
// const path = require('path');
const express = require('express');

// const fs = require('fs');
// const key = fs.readFileSync(path.resolve(__dirname, 'selfsigned.key'));
// const cert = fs.readFileSync(path.resolve(__dirname, 'selfsigned.crt'));

const app = express();
app.get('/api/v1/web/helix/helix-services/content-proxy@v1', (req, res) => {
  // console.log('proxy', req.query);
  try {
    const params = {
      ...req.query,
    };
    delete params.REPO_RAW_ROOT;
    assert.deepEqual(params, {
      repo: 'theblog',
      owner: 'adobe',
      path: '/en/topics/robohelp.md',
      ref: '73776e581e4e2f80c2b95ab02ca514ed8b7481f5',
    });
    // res.sendStatus(429);
    res.send('### Welcome\n');
  } catch (e) {
    res.sendStatus(404);
  }
});
app.get('*', (req, res) => {
  console.log(req.url);
  res.sendStatus(404);
});
app.post('*', (req, res) => {
  console.log('post', req.url);
  res.send('{}');
});

const server = http.createServer({
  // key: key,
  // cert: cert
}, app);
server.listen(3000, () => console.log('server listening on port 3000!'));
