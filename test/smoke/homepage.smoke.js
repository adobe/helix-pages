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
  .option('serviceid', {
    type: 'string',
    description: 'optional fastly service id for debugging',
  })
  .demandOption(['domain']).argv;

describe('homepage smoke tests - subdomain extraction and some page content', () => {
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

  async function testHomePage(url) {
    const res = await chai.request(url)
      .get('/')
      .set('X-Debug', argv.serviceid || false);

    console.log(res.headers);
    expect(res).to.have.status(200);
    testHomePageContent(res.text);
  }

  // all tests refer to the same repository thus same content
  it(`www.${argv.domain} test`, async () => {
    await testHomePage(`https://www.${argv.domain}`);
  });

  it(`helix-pages-adobe.${argv.domain} test`, async () => {
    await testHomePage(`https://helix-pages-adobe.${argv.domain}`);
  });

  it(`helix-pages--adobe.${argv.domain} test`, async () => {
    await testHomePage(`https://helix-pages--adobe.${argv.domain}`);
  });

  it(`master--helix-pages--adobe.${argv.domain} test`, async () => {
    await testHomePage(`https://master--helix-pages--adobe.${argv.domain}`);
  });

  describe('VCL Tests', () => {
    it('README gets delivered', async () => {
      await chai
        .request(`https://master--helix-pages--adobe.${argv.domain}`)
        .get('/README.html')
        .then((response) => {
          expect(response).to.be.html;
          expect(response).to.have.status(200);
        }).catch((e) => {
          throw e;
        });
    });

    it('README gets delivered as Raw', async () => {
      await chai
        .request(`https://39430ac97ada5b011835f66e42462b94a3112957--helix-pages--adobe.${argv.domain}`)
        .get('/adobe/helix-pages/39430ac97ada5b011835f66e42462b94a3112957/README.md')
        .set('X-Backend-URL', '/adobe/helix-pages/39430ac97ada5b011835f66e42462b94a3112957/README.md')
        .set('X-Request-Type', 'Static/Redirect')
        .then((response) => {
          expect(response).to.have.status(200);
          expect(response).to.have.header('Content-Type', /^text/);
          expect(response).to.have.have('Cache-Control', 'max-age=31622400,immutable');
          console.log(response.body);
        })
        .catch((e) => {
          throw e;
        });
      console.log(chai.request, Object.keys(chai.request));
    });

    it('/etc/passwd does not get delivered', async () => {
      await chai
        .request(`https://master--helix-pages--adobe.${argv.domain}`)
        .get('//etc/passwd')
        .then((response) => {
          expect(response).to.have.status(403);
        }).catch((e) => {
          throw e;
        });
    });
  });

  describe('selectors tests', () => {
    async function get$Page(host, path) {
      const res = await chai.request(host)
        .get(path)
        .set('X-Debug', argv.serviceid || false);

      expect(res).to.have.status(200);
      return jquery(new JSDOM(res.text).window);
    }

    it(`www.${argv.domain}/index.plain.html test`, async () => {
      const $ = await get$Page(`https://www.${argv.domain}`, '/index.plain.html');

      // should contain no header, main, footer
      expect($('header').length).to.be.equal(0);
      expect($('main').length).to.be.equal(0);
      expect($('footer').length).to.be.equal(0);

      $('div').each((i, div) => {
        // in plain mode, root divs do not get decorated
        expect(div.classList.length).to.be.equal(0);
      });
    });

    it(`www.${argv.domain}/index.embed.html test`, async () => {
      const $ = await get$Page(`https://www.${argv.domain}`, '/index.embed.html');

      // should contain no header, main, footer
      expect($('header').length).to.be.equal(0);
      expect($('main').length).to.be.equal(0);
      expect($('footer').length).to.be.equal(0);

      $('div').each((i, div) => {
        // in plain mode, root divs are decorated
        // eslint-disable-next-line no-unused-expressions
        expect(div.classList.contains('default')).to.be.true;
      });
    });
  });
});
