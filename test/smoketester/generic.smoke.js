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
/* eslint-disable no-undef */

const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');
const jquery = require('jquery');
const { JSDOM } = require('jsdom');

chai.use(chaiHttp);

const coerce = (v) => (v.trim() ? v.trim() : undefined);

const argv = require('yargs') // eslint-disable-line
  .option('domain', {
    type: 'string',
    description: 'Domain name to run the smoke test against',
    coerce,
  })
  .option('owner', {
    type: 'string',
    description: 'Git owner',
    coerce,
  })
  .option('repo', {
    type: 'string',
    description: 'Git repo',
    coerce,
  })
  .option('branch', {
    type: 'string',
    default: 'master',
    description: 'Git branch',
    coerce,
  })
  .option('index', {
    type: 'string',
    default: 'index.html',
    description: 'Site homepage',
    coerce,
  })
  .demandOption(['domain', 'owner', 'repo']).argv;

describe('Generic smoke test runner - subdomain extraction and homepage content', () => {
  function testHomePageContent(content) {
    const $ = jquery(new JSDOM(content).window);

    // generic test would expect a head and a body...
    expect($('head').length).to.be.equal(1);
    expect($('body').length).to.be.equal(1);
  }

  function testHomePage(url, done) {
    chai.request(url)
      .get(`/${argv.index}`)
      .then((res) => {
        expect(res).to.have.status(200);

        testHomePageContent(res.text);

        done();
      })
      .catch((err) => {
        done(err);
      });
  }

  it(`${argv.branch}--${argv.repo}--${argv.owner}.${argv.domain} test`, (done) => {
    testHomePage(`${argv.branch}--${argv.repo}--${argv.owner}.${argv.domain}`, done);
  });
});
