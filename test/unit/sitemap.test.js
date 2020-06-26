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
const proxyquire = require('proxyquire');
const { resolve } = require('path');

const action = require('../../cgi-bin/sitemap.js');
const AlgoliaIndex = require('./sitemap/AlgoliaIndex');

/**
 * Proxy our real OW action and its requirements.
 *
 * @param {Function} invoke OW action to invoke
 */
const proxyaction = () => proxyquire('../../cgi-bin/sitemap.js', {
  algoliasearch: () => ({
    initIndex: (name) => new AlgoliaIndex(name),
  }),
});

/**
 * Create params object for sitemap action.
 */
const createParams = (opts) => ({
  __hlx_owner: 'me',
  __hlx_repo: 'repo',
  __hlx_ref: 'master',
  ALGOLIA_APP_ID: 'foo',
  ALGOLIA_API_KEY: 'bar',
  __ow_headers: {
    'x-forwarded-proto': 'https',
    'hlx-forwarded-host': 'myhost.com, myrepo-myorg.hlx.page',
  },
  ...opts,
});

describe('Sitemap Tests', () => {
  describe('Argument checking', () => {
    // Invoke our action with missing combinations of parameters
    const requiredParamNames = [
      '__hlx_owner', '__hlx_repo', '__hlx_ref',
    ];
    for (let i = 0; i <= requiredParamNames.length - 1; i += 1) {
      const params = requiredParamNames.slice(0, i).reduce((acc, name) => {
        acc[`${name}`] = 'bogus';
        return acc;
      }, {});
      it(`index function bails if argument ${requiredParamNames[i]} is missing`, async () => {
        await assert.rejects(() => action.main(params), /\w+ parameter missing/);
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
      const response = await proxyaction().main(createParams());
      assert.equal(response.statusCode, 200);
      assert.equal(response.body, '');
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
      const response = await proxyaction().main(createParams());
      assert.equal(response.statusCode, 500);
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
      const response = await proxyaction().main(createParams());
      assert.equal(response.statusCode, 200);
      assert.equal(response.body, await fse.readFile(
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
      const response = await proxyaction().main(createParams());
      assert.equal(response.statusCode, 200);
      assert.equal(response.body, await fse.readFile(
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
      const response = await proxyaction().main(createParams({
      }));
      const expected = [];
      for (let i = 1; i <= 100; i += 1) {
        expected.push('  <url>');
        expected.push(`    <loc>https://myhost.com//${i}.html</loc>`);
        expected.push('  </url>');
      }
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.trim(), expected.join('\n').trim());
    });

    it('can set page size', async () => {
      const response = await proxyaction().main(createParams({
        hitsPerPage: 4,
      }));
      const expected = [];
      for (let i = 1; i <= 4; i += 1) {
        expected.push('  <url>');
        expected.push(`    <loc>https://myhost.com//${i}.html</loc>`);
        expected.push('  </url>');
      }
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.trim(), expected.join('\n').trim());
    });

    it('can select different page', async () => {
      const response = await proxyaction().main(createParams({
        hitsPerPage: 4,
        page: 2,
      }));
      const expected = [];
      for (let i = 9; i <= 12; i += 1) {
        expected.push('  <url>');
        expected.push(`    <loc>https://myhost.com//${i}.html</loc>`);
        expected.push('  </url>');
      }
      assert.equal(response.statusCode, 200);
      assert.equal(response.body.trim(), expected.join('\n').trim());
    });
  });
});
