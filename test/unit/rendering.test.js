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
  const actions = { };

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
    actions.html = require(path.resolve(buildDir, 'src', 'html.js'));
    // eslint-disable-next-line global-require,import/no-dynamic-require
    actions.plain_html = require(path.resolve(buildDir, 'src', 'plain_html.js'));

    scope0 = nock('https://raw.githubusercontent.com')
      .get(/.*/)
      .reply(404)
      .persist();
    scope1 = nock('https://super-test--helix-pages--adobe.hlx.page')
      .get(/.*/)
      .reply(async (uri, body, cb) => {
        const file = path.resolve(__dirname, 'fixtures', uri.split('/').pop());
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

  async function render(url, script = 'html') {
    url.searchParams.append('owner', 'adobe');
    url.searchParams.append('repo', 'helix-pages');
    url.searchParams.append('ref', 'super-test');
    url.searchParams.append('path', `${url.pathname}.md`);
    const req = new Request(url.href, {
      headers: {
        host: url.hostname,
      },
    });
    const res = await actions[script].main(req, {
      resolver,
      env: {},
    });
    assert.strictEqual(res.status, 200);
    return res.text();
  }

  async function testRender(url, selector = 'main') {
    if (!(url instanceof URL)) {
      // eslint-disable-next-line no-param-reassign
      url = new URL(`https://helix-pages.com/${url}`);
    }
    const spec = url.pathname.split('/').pop();
    const actHtml = await render(url, 'html', url);
    // console.log(actHtml);
    const expHtml = await fs.readFile(path.resolve(__dirname, 'fixtures', `${spec}.html`), 'utf-8');
    const $actMain = new JSDOM(actHtml).window.document.querySelector(selector);
    const $expMain = new JSDOM(expHtml).window.document.querySelector(selector);
    assertEquivalentNode($actMain, $expMain);
  }

  async function testRenderPlain(url) {
    if (!(url instanceof URL)) {
      // eslint-disable-next-line no-param-reassign
      url = new URL(`https://helix-pages.com/${url}`);
    }
    const spec = url.pathname.split('/').pop();
    const actHtml = await render(url, 'plain_html');
    const expHtml = await fs.readFile(path.resolve(__dirname, 'fixtures', `${spec}.plain.html`), 'utf-8');
    const $actMain = new JSDOM(actHtml).window.document.querySelector('body');
    const $expMain = new JSDOM(expHtml).window.document.querySelector('body');
    assertEquivalentNode($actMain, $expMain);
  }

  describe('Section DIVS', () => {
    it('renders document with 1 section correctly', async () => {
      await testRender('one-section');
    });

    it('renders document with 1 section correctly (plain)', async () => {
      await testRenderPlain('one-section');
    });

    it('renders document with 3 sections correctly', async () => {
      await testRender('simple');
    });

    it('renders document with 3 sections correctly (plain)', async () => {
      await testRenderPlain('simple');
    });
  });

  describe('Images', () => {
    it('renders images.md correctly', async () => {
      const html = await render(new URL('https://helix-pages.com/images'));
      const dom = new JSDOM(html);
      const pics = Array.from(dom.window.document.querySelectorAll('picture'));
      const imgs = pics.map((pic) => pic.querySelector('img'));
      assert.strictEqual(pics.length, 3, 'document has 3 pictures');
      assert.strictEqual(imgs.length, 3, 'document has 3 images');
      assert.ok(pics.every((pic) => pic.querySelector('source').getAttribute('srcset').endsWith('?width=750&auto=webp&format=pjpg&optimize=medium')), 'pictures have source sets with correct parameters');
      assert.ok(imgs.every((img) => img.getAttribute('src').endsWith('?width=2000&auto=webp&format=pjpg&optimize=medium')), 'images have source with correct parameters');
      assert.ok(imgs.shift().getAttribute('loading') === 'eager', 'first image has loading set to eager');
      assert.ok(imgs.every((img) => img.getAttribute('loading') === 'lazy'), 'all other images have loading set to lazy');
    });

    it('renders images.md correctly (plain)', async () => {
      const html = await render(new URL('https://helix-pages.com/images'), 'plain_html');
      const dom = new JSDOM(html);
      const pics = Array.from(dom.window.document.querySelectorAll('picture'));
      const imgs = pics.map((pic) => pic.querySelector('img'));
      assert.strictEqual(pics.length, 3, 'document has 3 pictures');
      assert.strictEqual(imgs.length, 3, 'document has 3 images');
      assert.ok(pics.every((pic) => pic.querySelector('source').getAttribute('srcset').endsWith('?width=750&auto=webp&format=pjpg&optimize=medium')), 'pictures have source sets with correct parameters');
      assert.ok(imgs.every((img) => img.getAttribute('src').endsWith('?width=2000&auto=webp&format=pjpg&optimize=medium')), 'images have source with correct parameters');
      assert.ok(imgs.shift().getAttribute('loading') === 'eager', 'first image has loading set to eager');
      assert.ok(imgs.every((img) => img.getAttribute('loading') === 'lazy'), 'all other images have loading set to lazy');
    });
  });

  describe('Page Block', () => {
    it('renders document with singe column page block', async () => {
      await testRender('page-block-1-col');
    });

    it('renders document with singe column page block (plain)', async () => {
      await testRenderPlain('page-block-1-col');
    });

    it('renders document with double column page block', async () => {
      await testRender('page-block-2-col');
    });

    it('renders document with double column page block (plain)', async () => {
      await testRenderPlain('page-block-2-col');
    });

    it('renders document with formatting in header', async () => {
      await testRender('page-block-strong');
    });

    it('renders document with empty header', async () => {
      await testRender('page-block-no-title');
    });

    it('renders document with some empty header', async () => {
      await testRender('page-block-empty-cols');
    });
  });

  describe('Metadata Block', () => {
    it('renders meta tags from metadata block', async () => {
      await testRender('page-metadata-block', 'head');
    });

    it('renders multi value meta tags from metadata block', async () => {
      await testRender('page-metadata-block-multi-p', 'head');
      await testRender('page-metadata-block-multi-ul', 'head');
      await testRender('page-metadata-block-multi-ol', 'head');
    });

    it('uses correct hero image', async () => {
      await testRender(new URL('https://super-test--helix-pages--adobe.hlx.page/marketing/page-metadata-block-hero'), 'head');
    });
  });

  describe('Miscellaneous', () => {
    it('renders the fedpub header correctly', async () => {
      await testRenderPlain('fedpub-header');
    });
  });
});
