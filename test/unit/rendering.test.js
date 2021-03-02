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
const { assertEquivalentNode } = require('@adobe/helix-shared').dom;

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
    scope1 = nock('https://super-test--helix-pages--adobe.hlx.page')
      .get(/.*/)
      .reply(async (uri, body, cb) => {
        const file = path.resolve(__dirname, 'fixtures', uri.substring(1));
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
        host: 'helix-pages.com',
      },
    });
    const res = await action.main(req, {
      resolver,
      env: {},
    });
    assert.strictEqual(res.status, 200);
    return res.text();
  }

  async function testRender(spec, selector = 'main') {
    const actHtml = await render(`/${spec}.md`);
    // console.log(actHtml);
    const expHtml = await fs.readFile(path.resolve(__dirname, 'fixtures', `${spec}.html`), 'utf-8');
    const $actMain = new JSDOM(actHtml).window.document.querySelector(selector);
    const $expMain = new JSDOM(expHtml).window.document.querySelector(selector);
    assertEquivalentNode($actMain, $expMain);
  }

  describe('Section DIVS', () => {
    it('renders document with 1 section correctly', async () => {
      await testRender('one-section');
    });

    it('renders document with 3 sections correctly', async () => {
      await testRender('simple');
    });
  });

  describe('Images', () => {
    it('renders images.md correctly', async () => {
      const html = await render('/images.md');
      const dom = new JSDOM(html);
      const pics = Array.from(dom.window.document.querySelectorAll('picture'));
      const imgs = pics.map((pic) => pic.querySelector('img'));
      assert.strictEqual(pics.length, 3, 'document has 3 pictures');
      assert.strictEqual(imgs.length, 3, 'document has 3 images');
      assert.ok(pics.every((pic) => pic.querySelector('source').getAttribute('srcset').endsWith('?width=750&format=webply&optimize=medium')), 'pictures have source sets with correct parameters');
      assert.ok(imgs.every((img) => img.getAttribute('src').endsWith('?width=2000&format=webply&optimize=medium')), 'images have source with correct parameters');
      assert.ok(imgs.shift().getAttribute('loading') === 'eager', 'first image has loading set to eager');
      assert.ok(imgs.every((img) => img.getAttribute('loading') === 'lazy'), 'all other images have loading set to lazy');
    });
  });

  describe('Page Tables', () => {
    it('renders document with singe column page block', async () => {
      await testRender('page-block-1-col');
    });

    it('renders document with double column page block', async () => {
      await testRender('page-block-2-col');
    });
  });

  describe('Metadata Block', () => {
    it('renders meta tags from metadata block', async () => {
      await testRender('page-metadata-block', 'head');
    });
  });
});
