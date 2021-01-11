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

/* eslint-env mocha */

'use strict';

const querystring = require('querystring');
const assert = require('assert');
const fse = require('fs-extra');
const nock = require('nock');
const { resolve } = require('path');
const proxyquire = require('proxyquire');

const AlgoliaIndex = require('./sitemap/algolia/AlgoliaIndex.js');

/**
 * Algolia provider proxy.
 */
const algolia = proxyquire('../../src/providers/algolia.js', {
  algoliasearch: () => ({
    initIndex: (name) => new AlgoliaIndex(name),
  }),
});

/**
 * Proxy our real OW action and its requirements.
 *
 * @param {Function} invoke OW action to invoke
 */
const action = proxyquire('../../cgi-bin/sitemap.js', {
  '../src/providers/algolia.js': algolia,
});

const createRequest = (params) => ({
  url: `https://pages.com/sitemap?${querystring.encode({
    __hlx_owner: 'me',
    __hlx_repo: 'repo',
    __hlx_ref: 'master',
    ...params,
  })}`,
  headers: new Map(Object.entries({
    'x-forwarded-proto': 'https',
    'hlx-forwarded-host': 'myhost.com, myrepo-myorg.hlx.page',
  })),
});

describe('Sitemap Tests', () => {
  describe('Argument checking', () => {
    // Invoke our action with missing combinations of parameters
    const requiredParamNames = [
      '__hlx_owner', '__hlx_repo', '__hlx_ref',
    ];
    for (let i = 0; i <= requiredParamNames.length - 1; i += 1) {
      const params = requiredParamNames.reduce((acc, name, idx) => {
        acc[`${name}`] = i === idx ? '' : 'bogus';
        return acc;
      }, {});
      it(`index function bails if argument ${requiredParamNames[i]} is missing`, async () => {
        await assert.rejects(() => action.main(createRequest(params), { log: console }), /\w+ parameter missing/);
      });
    }
  });

  describe('Missing index', () => {
    before(() => {
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/helix-query.yaml')
        .reply(404, 'Not found');
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/fstab.yaml')
        .reply(404, 'Not found');
    });
    it('missing index returns 200 and empty body', async () => {
      const response = await action.main(createRequest(), { log: console });
      assert.equal(response.status, 200);
      assert.equal((await response.text()), '');
    });
  });

  describe('Other failure reading index', () => {
    before(() => {
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/helix-query.yaml')
        .reply(500, 'Something went wrong');
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/fstab.yaml')
        .reply(404, 'Not found');
    });
    it('failing to read index should report error', async () => {
      const response = await action.main(createRequest(), { log: console });
      assert.equal(response.status, 500);
    });
  });

  describe('Index available, no fstab', () => {
    beforeEach(() => {
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/helix-query.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'helix-query.yaml'));
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/fstab.yaml')
        .reply(404, 'Not found');
      nock('https://repo-me.project-helix.page')
        .get('/en/query-index.json')
        .query(true)
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'query-index.json'));
    });

    it('Sitemap returns URLs with prefixes', async () => {
      const response = await action.main(createRequest(), { log: console });
      assert.equal(response.status, 200);
      assert.equal((await response.text()), await fse.readFile(
        resolve(__dirname, 'sitemap', 'sitemap-no-fstab.txt'), 'utf-8',
      ));
    });
  });

  describe('Index and fstab available', () => {
    beforeEach(() => {
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/helix-query.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'helix-query.yaml'));
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/fstab.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'fstab.yaml'));
      nock('https://repo-me.project-helix.page')
        .get('/en/query-index.json')
        .query(true)
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'query-index.json'));
    });

    it('Sitemap returns URLs without prefixes', async () => {
      const response = await action.main(createRequest(), { log: console });
      assert.equal(response.status, 200);
      assert.equal((await response.text()), await fse.readFile(
        resolve(__dirname, 'sitemap', 'sitemap-fstab.txt'), 'utf-8',
      ));
    });
  });

  describe('Index and fstab available (new data format)', () => {
    beforeEach(() => {
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/helix-query.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'helix-query.yaml'));
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/fstab.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'fstab.yaml'));
      nock('https://repo-me.project-helix.page')
        .get('/en/query-index.json')
        .query(true)
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'query-index-v2.json'));
    });

    it('Sitemap returns URLs without prefixes', async () => {
      const response = await action.main(createRequest(), { log: console });
      assert.equal(response.status, 200);
      assert.equal((await response.text()), await fse.readFile(
        resolve(__dirname, 'sitemap', 'sitemap-fstab.txt'), 'utf-8',
      ));
    });
  });

  describe('Algolia provider test', () => {
    beforeEach(() => {
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/helix-query.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'algolia', 'helix-query.yaml'));
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/fstab.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'fstab.yaml'));
    });
    it('Algolia provider returns sitemap', async () => {
      const response = await action.main(createRequest(), {
        log: console,
        env: {
          ALGOLIA_API_KEY: 'foo',
          ALGOLIA_APP_ID: 'bar',
        },
      });
      assert.equal(response.status, 200);
      assert.equal((await response.text()), await fse.readFile(
        resolve(__dirname, 'sitemap', 'sitemap-fstab.txt'), 'utf-8',
      ));
    });
  });

  describe.skip('Azure provider test', () => {
    before(() => {
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/helix-query.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'azure', 'helix-query.yaml'));
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/fstab.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'fstab.yaml'));
      nock('https://theblog2.search.windows.net')
        .get('/indexes/me--repo--blog-posts/docs')
        .query(true)
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'azure', 'searchresult.json'));
    });
    it('Azure provider returns sitemap', async () => {
      const response = await action.main(createRequest(), {
        log: console,
        env: {
          ALGOLIA_API_KEY: 'foo',
          ALGOLIA_APP_ID: 'theblog2',
        },
      });
      assert.equal(response.status, 200);
      assert.equal((await response.text()), await fse.readFile(
        resolve(__dirname, 'sitemap', 'sitemap-fstab.txt'), 'utf-8',
      ));
    });
  });

  describe('sends correct limit and offset', () => {
    beforeEach(() => {
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/helix-query.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'helix-query.yaml'));
      nock('https://raw.githubusercontent.com')
        .get('/me/repo/master/fstab.yaml')
        .replyWithFile(200, resolve(__dirname, 'sitemap', 'fstab.yaml'));
      nock('https://repo-me.project-helix.page')
        .get('/en/query-index.json')
        .query(true)
        .reply((uri) => {
          const qs = querystring.parse(uri.substring(uri.indexOf('?') + 1));
          // eslint-disable-next-line no-console
          console.log(qs);
          const body = [];
          const limit = Number.parseInt(qs.limit, 10);
          const offset = Number.parseInt(qs.offset, 10);
          for (let i = 1; i <= limit; i += 1) {
            body.push({ path: `/${i + offset}.html` });
          }
          return [200, JSON.stringify(body)];
        });
    });

    it('retrieves first page by default', async () => {
      const response = await action.main(createRequest(), { log: console });
      const expected = [];
      for (let i = 1; i <= 100; i += 1) {
        expected.push('  <url>');
        expected.push(`    <loc>https://myhost.com//${i}.html</loc>`);
        expected.push('  </url>');
      }
      assert.equal(response.status, 200);
      assert.equal((await response.text()).trim(), expected.join('\n').trim());
    });

    it('can set page size', async () => {
      const response = await action.main(createRequest({
        hitsPerPage: 4,
      }), { log: console });
      const expected = [];
      for (let i = 1; i <= 4; i += 1) {
        expected.push('  <url>');
        expected.push(`    <loc>https://myhost.com//${i}.html</loc>`);
        expected.push('  </url>');
      }
      assert.equal(response.status, 200);
      assert.equal((await response.text()).trim(), expected.join('\n').trim());
    });

    it('can select different page', async () => {
      const response = await action.main(createRequest({
        hitsPerPage: 4,
        page: 2,
      }), { log: console });
      const expected = [];
      for (let i = 9; i <= 12; i += 1) {
        expected.push('  <url>');
        expected.push(`    <loc>https://myhost.com//${i}.html</loc>`);
        expected.push('  </url>');
      }
      assert.equal(response.status, 200);
      assert.equal((await response.text()).trim(), expected.join('\n').trim());
    });
  });
});
