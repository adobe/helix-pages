/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-env mocha */
process.env.HELIX_FETCH_FORCE_HTTP1 = true;

const assert = require('assert');
const querystring = require('querystring');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs-extra');
const nock = require('nock');
const { JSDOM } = require('jsdom');
const { Request } = require('@adobe/helix-fetch');
const BuildCommand = require('@adobe/helix-cli/src/build.cmd.js');

async function createTestRoot() {
  const dir = path.resolve(__dirname, '..', 'tmp', crypto.randomBytes(16).toString('hex'));
  await fs.ensureDir(dir);
  return dir;
}

const resolver = {
  createURL({ package, name, version }) {
    // eslint-disable-next-line no-underscore-dangle
    const namespace = process.env.__OW_NAMESPACE || 'helix';
    return new URL(`https://adobeioruntime.net/api/v1/web/${namespace}/${package}/${name}@${version}`);
  },
};

describe('Rendering', () => {
  let testRoot;
  let action;

  let scope0;
  let scope1;
  before(async () => {
    testRoot = await createTestRoot();
    const buildDir = path.resolve(testRoot, '.hlx/build');

    await new BuildCommand()
      .withFiles(['src/**/*.htl', 'src/**/*.js'])
      .withDirectory(path.resolve(__dirname, '..', '..'))
      .withTargetDir(buildDir)
      .withUniversal(true)
      .run();

    // eslint-disable-next-line global-require,import/no-dynamic-require
    action = require(path.resolve(buildDir, 'src', 'html.js'));

    scope0 = nock('https://raw.githubusercontent.com')
      .get(/.*/)
      .reply(404)
      .persist();
    scope1 = nock('https://adobeioruntime.net')
      .get('/api/v1/web/helix/helix-services/content-proxy@v2')
      .query(true)
      .reply(async (uri, body, cb) => {
        const url = new URL(`https://adobeioruntime.net${uri}`);
        const file = path.resolve(__dirname, 'fixtures', url.searchParams.get('path').substr(1));
        const data = await fs.readFile(file, 'utf-8');
        cb(null, [200, data]);
      })
      .persist();
  });

  after(async () => {
    if (testRoot) {
      await fs.remove(testRoot);
    }
    scope0.persist(false);
    scope1.persist(false);
    nock.cleanAll();
  });

  async function render(reqPath) {
    const testParams = {
      owner: 'adobe',
      repo: 'helix-pages',
      ref: 'super-test',
      path: reqPath,
    };
    const req = new Request(`https://helix-pages.com?${querystring.encode(testParams)}`, {
      headers: {
      },
    });
    const res = await action.main(req, {
      resolver,
      env: {},
    });
    assert.strictEqual(res.status, 200);
    return res.text();
  }

  it('renders simple.md correctly', async () => {
    const html = await render('/simple.md');
    const dom = new JSDOM(html);
    const div = dom.window.document.querySelectorAll('div');
    assert.strictEqual(div.length, 3, 'document has 3 sections');
  });
});
