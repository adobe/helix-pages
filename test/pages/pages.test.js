/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
const { fetch } = require('@adobe/helix-fetch');
const assert = require('assert');
const { JSDOM } = require('jsdom');
const { dumpDOM, assertEquivalentNode } = require('@adobe/helix-shared').dom;

const testDomain = process.env.TEST_DOMAIN;

let bases = [];
let changes = [];
let base_urls = [];

async function getText(data) {
  if (!data.ok) {
    assert.fail(`Unable to load ${data.url} (${data.status})
${await data.text()}`);
  }
  return data.text();
}

function newURL(obj) {
  const req_url = obj.req_url.replace('.project-helix.page', '.hlx.page');
  const { pathname } = new URL(req_url);
  const thirdLvl = req_url.split('.')[0];
  const changed = [thirdLvl, testDomain].join('.') + pathname;
  return { req_url, changed };
}

/**
 * function that turns most-visited pages into doms
 */
async function getDoms() {
  const json = {
    limit: 20,
    threshold: 100,
  };
  const method = 'post';
  const res = await fetch('https://adobeioruntime.net/api/v1/web/helix/helix-services/run-query@v2/most-visited', { method, json });
  if (!res.ok) {
    await res.text();
    assert.fail('test setup failed to gather test urls');
  }
  base_urls = (await res.json()).results;
  // construct array of promises from fetch
  changes = base_urls.map((obj) => {
    // eslint-disable-next-line camelcase
    const { req_url, changed } = newURL(obj);

    // fetch page before change and page after change; and construct DOM
    bases.push(fetch(req_url).then(getText));
    return fetch(changed).then(getText);
  });
  bases = await Promise.all(bases);
  changes = await Promise.all(changes);
}

describe('document equivalence', async () => {
  try {
    await getDoms();

    bases.forEach((base, idx) => {
      const orig_dom = new JSDOM(base).window.document;
      const new_dom = new JSDOM(changes[idx]).window.document;
      const { req_url, changed } = newURL(base_urls[idx]);

      describe(`Comparing ${req_url} against ${changed}`, () => {
        it('testing body node', () => {
          dumpDOM(orig_dom.body, new_dom.body);
          assertEquivalentNode(orig_dom.body, new_dom.body);
        }).timeout(50000);

        it.skip('testing head node', () => {
          dumpDOM(orig_dom.head, new_dom.head);
          assertEquivalentNode(orig_dom.head, new_dom.head);
        }).timeout(20000);
      });
    });
  } catch (error) {
    // catch any error
    // eslint-disable-next-line no-console
    console.error(`Cannot construct the tests: ${error.message}`, error);
    // radical exit to make the failure visible in the ci
    process.exit(1);
  }
  run();
});
