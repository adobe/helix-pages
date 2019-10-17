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
  .demandOption(['domain']).argv;

describe('Helix Pages homepage smoke tests - subdomain extraction and some page content', () => {
  function testHomePageContent(content) {
    const $ = jquery(new JSDOM(content).window);

    expect($('title').text()).to.be.equal('Helix Pages');
    // index has no header
    expect($('header').children().length).to.be.equal(0);
    // index has a main with 2 divs
    expect($('main').length).to.be.equal(1);
    expect($('main div').length).to.be.equal(2);
    // index has no footer
    expect($('footer').children().length).to.be.equal(0);
  }

  function testHomePage(url, done) {
    chai.request(url)
      .get('/')
      .then((res) => {
        expect(res).to.have.status(200);

        testHomePageContent(res.text);

        done();
      })
      .catch((err) => {
        done(err);
      });
  }

  // all tests refer to the same repository thus same content
  it(`www.${argv.domain} test`, (done) => {
    testHomePage(`www.${argv.domain}`, done);
  });

  it(`helix-pages-adobe.${argv.domain} test`, (done) => {
    testHomePage(`helix-pages-adobe.${argv.domain}`, done);
  });

  it(`helix-pages--adobe.${argv.domain} test`, (done) => {
    testHomePage(`helix-pages--adobe.${argv.domain}`, done);
  });

  it(`master--helix-pages--adobe.${argv.domain} test`, (done) => {
    testHomePage(`master--helix-pages--adobe.${argv.domain}`, done);
  });
});
