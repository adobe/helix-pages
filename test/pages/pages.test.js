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
/* eslint-disable no-undef,no-console,camelcase */
const assert = require('assert');
const fetchAPI = require('@adobe/helix-fetch');
const { JSDOM } = require('jsdom');
const { dumpDOM, assertEquivalentNode } = require('@adobe/helix-shared').dom;
const { Base } = require('mocha').reporters;

const fetchContext = fetchAPI.context({ httpProtocol: 'http1', httpsProtocols: ['http1'] });
const { fetch } = fetchContext;

const testDomain = process.env.TEST_DOMAIN;
const testVersionLock = process.env.TEST_VERSION_LOCK;

const origOpts = {
  cache: 'no-cache',
  headers: {
    'Cache-Control': 'no-cache',
  },
};

const testOpts = {
  cache: 'no-cache',
  headers: {
    'Cache-Control': 'no-cache',
  },
};

if (testVersionLock) {
  testOpts.headers['x-ow-version-lock'] = testVersionLock;
}

/**
 * Processes the given queue concurrently. The handler functions can add more items to the queue
 * if needed.
 *
 * @param {Array<*>} queue A list of tasks
 * @param {function} fn A handler function `fn(task:any, queue:array, results:array)`
 * @param {number} [maxConcurrent = 8] Concurrency level
 * @returns the results
 */
async function processQueue(queue, fn, maxConcurrent = 8) {
  const running = [];
  const results = [];
  while (queue.length || running.length) {
    if (running.length < maxConcurrent && queue.length) {
      const task = fn(queue.shift(), queue, results);
      running.push(task);
      task.finally(() => {
        const idx = running.indexOf(task);
        if (idx >= 0) {
          running.splice(idx, 1);
        }
      });
    } else {
      // eslint-disable-next-line no-await-in-loop
      await Promise.race(running);
    }
  }
  return results;
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
 * function that turns fetches the content of the most-visited pages
 */
async function getTestSetup() {
  const mostVisitedUrls = await getMostVisited();

  mostVisitedUrls.push({
    req_url: 'https://theblog--adobe.hlx.page/en/publish/2019/11/22/asia-pacific-insiders-share-their-inspiration-from-max-2019.html',
  });

  // construct array of promises from fetch
  return processQueue(mostVisitedUrls, async (mostVisitedObj, _, results) => {
    const { original: originalURL, test: testURL } = getTestURLs(mostVisitedObj);
    const ret = {
      originalURL,
      testURL,
    };

    {
      console.log('fetching original', originalURL);
      const res = await fetch(originalURL, origOpts);
      ret.originalStatus = res.status;
      ret.originalContent = await res.text();
    }
    {
      console.log('fetching test', testURL);
      const res = await fetch(testURL, testOpts);
      ret.testStatus = res.status;
      ret.testContent = await res.text();
    }

    results.push(ret);
  }, 4);
}

// remove known attributes that may be different
function filterDOM(document) {
  const sourceHash = document.querySelector('meta[name="x-source-hash"]');
  if (sourceHash) {
    sourceHash.remove();
  }
}

describe('document equivalence', function suite() {
  this.timeout(5 * 60000);
  before(async () => {
    try {
      const setup = await getTestSetup();
      setup.forEach((info) => {
        const {
          originalURL, originalContent, testURL, testContent,
        } = info;

        const orig_dom = new JSDOM(originalContent).window.document;
        filterDOM(orig_dom);

        const test_text = fixDomainInTestContent(testContent);
        const test_dom = new JSDOM(test_text).window.document;
        filterDOM(test_dom);

        describe(`Comparing ${originalURL} against ${testURL}`, () => {
          it('testing body node', () => {
            if (info.testStatus !== 200) {
              assert.fail(`${testURL} failed with ${info.testStatus}`);
            }
            dumpDOM(orig_dom.body, test_dom.body);
            try {
              assertEquivalentNode(orig_dom.body, test_dom.body);
            } catch (error) {
              // temp fix until https://github.com/michaelleeallen/mocha-junit-reporter/issues/139 is fixed
              console.error(`Error while comparing body of ${originalURL} against ${testURL}: ${error.message}
              Diff: ${Base.generateDiff(error.actual, error.expected)}`);
              throw error;
            }
          }).timeout(20000);

          it('testing head node', () => {
            if (info.testStatus !== 200) {
              assert.fail(`${testURL} failed with ${info.testStatus}`);
            }
            dumpDOM(orig_dom.head, test_dom.head);
            try {
              assertEquivalentNode(orig_dom.head, test_dom.head);
            } catch (error) {
              // temp fix until https://github.com/michaelleeallen/mocha-junit-reporter/issues/139 is fixed
              console.error(`Error while comparing head of ${originalURL} against ${testURL}: ${error.message}
              Diff: ${Base.generateDiff(error.actual, error.expected)}`);
              throw error;
            }
          }).timeout(20000);
        });
      });
    } catch (error) {
      // catch any error
      console.error(`Cannot construct the tests: ${error.message}`, error);
      // radical exit to make the failure visible in the ci
      process.exit(1);
    }
  });

  // This is a required placeholder to allow before() to work
  it('init', () => {
  });
});
