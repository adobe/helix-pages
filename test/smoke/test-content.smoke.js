/*
 * Copyright 2018 Adobe. All rights reserved.
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
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const coerce = (v) => (v.trim() ? v.trim() : undefined);

const argv = require('yargs') // eslint-disable-line
  .option('domain', {
    type: 'string',
    description: 'Domain name to run the smoke test against',
    coerce,
  })
  .option('serviceid', {
    type: 'string',
    description: 'optional fastly service id for debugging',
  })
  .demandOption(['domain']).argv;

describe('test-content smoke tests - test content and expected results', () => {
  async function testPageContains(host, path, text) {
    const res = await chai.request(host)
      .get(path)
      .set('X-Debug', argv.serviceid || false);

    expect(res).to.have.status(200);
    expect(res.text).to.contain(text);
  }

  const OWNER = 'kptdobe';
  const REPO = 'helix-pages-test-content';

  [{
    title: 'master is the default branch',
    // TODO: swap main and master test once helix-pages is able to find default branch
    host: `https://${REPO}--${OWNER}.${argv.domain}`,
    path: '/',
    text: 'github-master-/index.html',
  }, {
    title: 'HTML has priority on MD',
    host: `https://main--${REPO}--${OWNER}.${argv.domain}`,
    path: '/',
    text: 'github-main-/index.html',
  }, {
    title: 'a branch can be retrieved',
    host: `https://abranch--${REPO}--${OWNER}.${argv.domain}`,
    path: '/',
    text: 'github-abranch-/index.html',
  }, {
    title: 'static head is overriden in master branch',
    host: `https://${REPO}--${OWNER}.${argv.domain}`,
    path: '/head.html',
    text: 'github-master-/head.html',
  }, {
    title: 'static head is overriden in main branch',
    host: `https://main--${REPO}--${OWNER}.${argv.domain}`,
    path: '/head.html',
    text: 'github-main-/head.html',
  }, {
    title: 'static head is overriden in a branch',
    host: `https://abranch--${REPO}--${OWNER}.${argv.domain}`,
    path: '/head.html',
    text: 'github-abranch-/head.html',
  }, {
    title: 'only default branch has a styles.css override',
    host: `https://${REPO}--${OWNER}.${argv.domain}`,
    path: '/styles.css',
    // TODO: swap main and master test once helix-pages is able to find default branch
    text: 'github-master-/styles.css',
  }, {
    title: 'main branch does not have a styles.css override',
    host: `https://main--${REPO}--${OWNER}.${argv.domain}`,
    path: '/styles.css',
    // TODO: swap main and master test once helix-pages is able to find default branch
    text: 'body {',
  }, {
    title: 'a branch branch does not have a styles.css override',
    host: `https://abranch--${REPO}--${OWNER}.${argv.domain}`,
    path: '/styles.css',
    text: 'body {',
  }].forEach((test) => {
    it(`${test.title}: ${test.host}${test.path}`, async () => {
      await testPageContains(test.host, test.path, test.text);
    });
  });
});
