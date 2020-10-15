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
const { JSDOM } = require('jsdom');
const { dumpDOM, assertEquivalentNode } = require('@adobe/helix-shared').dom;

const testDomain = process.env.TEST_DOMAIN;

async function getText(data) {
  if (!data.ok) {
    throw new Error(`Unable to load ${data.url} (${data.status}): ${await data.text()}`);
  }
  return data.text();
}

function getTestURLs(mostVisitedObj) {
  const original = mostVisitedObj.req_url.replace('.project-helix.page', '.hlx.page');
  const { pathname } = new URL(original);
  const thirdLvl = original.split('.')[0];
  const test = [thirdLvl, testDomain].join('.') + pathname;
  return { original, test };
}

function fixDomainInTestContent(text) {
  return text.replace(new RegExp(testDomain.replace('.', '\\.'), 'g'), 'hlx.page');
}

/**
 * Returns the list of most-visited pages
 */
async function getMostVisited() {
  const res = await fetch('https://adobeioruntime.net/api/v1/web/helix/helix-services/run-query@v2/most-visited', {
    method: 'POST',
    json: {
      limit: 20,
      threshold: 100,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Setup failed to gather most visited urls: ${text}`);
  }
  const json = await res.json();
  return json.results;
}

/**
 * function that turns most-visited pages into doms
 */
async function getTestSetup() {
  const mostVisitedUrls = await getMostVisited();
  let originalDoms = [];
  // construct array of promises from fetch
  let testDoms = mostVisitedUrls.map((mostVisitedObj) => {
    // eslint-disable-next-line camelcase
    const { original: originalURL, test: testURL } = getTestURLs(mostVisitedObj);

    // fetch page before change and page after change; and construct DOM
    originalDoms.push(fetch(originalURL).then(getText));
    return fetch(testURL).then(getText);
  });
  originalDoms = await Promise.all(originalDoms);
  testDoms = await Promise.all(testDoms);

  return {
    originalDoms,
    testDoms,
    mostVisitedUrls,
  };
}

// remove known attributes that may be different
function filterDOM(document) {
  const sourceHash = document.querySelector('meta[name="x-source-hash"]');
  if (sourceHash) {
    sourceHash.remove();
  }
}

describe('document equivalence', async () => {
  try {
    const setup = await getTestSetup();

    setup.originalDoms.forEach((base, idx) => {
      const { original: originalURL, test: testURL } = getTestURLs(setup.mostVisitedUrls[idx]);

      const orig_dom = new JSDOM(base).window.document;
      filterDOM(orig_dom);

      const test_text = fixDomainInTestContent(setup.testDoms[idx]);
      const test_dom = new JSDOM(test_text).window.document;
      filterDOM(test_dom);

      describe(`Comparing ${originalURL} against ${testURL}`, () => {
        it('testing body node', () => {
          dumpDOM(orig_dom.body, test_dom.body);
          assertEquivalentNode(orig_dom.body, test_dom.body);
        }).timeout(50000);

        it('testing head node', () => {
          dumpDOM(orig_dom.head, test_dom.head);
          assertEquivalentNode(orig_dom.head, test_dom.head);
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
