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
const createParams = () => ({
  __hlx_owner: 'me',
  __hlx_repo: 'repo',
  __hlx_ref: 'master',
  ALGOLIA_APP_ID: 'foo',
  ALGOLIA_API_KEY: 'bar',
  __ow_headers: {
    'x-forwarded-proto': 'https',
    'hlx-forwarded-host': 'myhost.com',
  },
});

describe('Sitemap Tests', () => {
  describe('Argument checking', () => {
    // Invoke our action with missing combinations of parameters
    const requiredParamNames = [
      '__hlx_owner', '__hlx_repo', '__hlx_ref', 'ALGOLIA_API_KEY', 'ALGOLIA_APP_ID',
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
    });

    it('Sitemap returns URLs without prefixes', async () => {
      const response = await proxyaction().main(createParams());
      assert.equal(response.statusCode, 200);
      assert.equal(response.body, await fse.readFile(
        resolve(__dirname, 'sitemap', 'sitemap-fstab.txt'), 'utf-8',
      ));
    });
  });
});
