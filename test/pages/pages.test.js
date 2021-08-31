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
const path = require('path');
const fs = require('fs-extra');
const sanitize = require('sanitize-filename');
const fetchAPI = require('@adobe/helix-fetch');
const { JSDOM } = require('jsdom');
const { dumpDOM: assertEquivalentDOM, assertEquivalentNode } = require('@adobe/helix-shared-dom');
const { Base } = require('mocha').reporters;

const fetchContext = fetchAPI.context({ alpnProtocols: [fetchAPI.ALPN_HTTP1_1] });
const { fetch } = fetchContext;

const testDomain = process.env.TEST_DOMAIN;
const testVersionLock = process.env.TEST_VERSION_LOCK;

const htmlDumpsFolder = path.join(process.env.PWD, process.env.TEST_FAILURE_HTML_DUMP_FOLDER || 'htmldumps');

const origOpts = {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache',
  },
};

const testOpts = {
  cache: 'no-store',
  headers: {
    'Cache-Control': 'no-cache',
  },
};

if (testVersionLock) {
  testOpts.headers['x-ow-version-lock'] = testVersionLock;
  // intersperse with '*' to avoid redacting by circleci
  console.log('using version lock header:', testVersionLock.split('').join('*'));
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
    body: {
      limit: 20,
      threshold: 100,
    },
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(`Setup failed to gather most visited urls: ${text}`);
  }
  const { results } = JSON.parse(text);
  if (!results) {
    throw Error(`Setup failed to gather most visited urls. expected a 'results' array in ${text}`);
  }
  return results;
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

    // send PURGE requests to flush the cache
    await fetch(originalURL, { method: 'PURGE' });
    await fetch(testURL, { method: 'PURGE' });

    /* eslint-disable no-await-in-loop */
    let oRetries = 3;
    while (ret.originalStatus !== 200 && oRetries > 0) {
      oRetries -= 1;
      console.log('fetching original', originalURL);
      const res = await fetch(originalURL, origOpts);
      ret.originalStatus = res.status;
      ret.originalContent = await res.text();
    }

    let tRetries = 3;
    while (ret.testStatus !== 200 && tRetries > 0) {
      tRetries -= 1;
      console.log('fetching test', testURL);
      const res = await fetch(testURL, testOpts);
      ret.testStatus = res.status;
      ret.testContent = await res.text();
    }
    /* eslint-enable no-await-in-loop */

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

async function dumpHTML(url, document) {
  let fullPath = path.join(htmlDumpsFolder, sanitize(url));
  if (fullPath.lastIndexOf('.html') !== fullPath.length - 5) {
    fullPath += '.html';
  }
  await fs.ensureDir(htmlDumpsFolder);
  await fs.writeFile(fullPath, document.documentElement.outerHTML);
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
          // skip test if original and test status are 404
          before(function before() {
            if (info.testStatus === 404 && info.originalStatus === 404) {
              console.log(`${originalURL} and test url have a status of 404. skipping.`);
              this.skip();
            }
          });

          it('testing body node', async () => {
            if (info.testStatus !== 200) {
              assert.fail(`${testURL} failed with ${info.testStatus}`);
            }
            try {
              assertEquivalentDOM(test_dom.body, orig_dom.body);
              assertEquivalentNode(test_dom.body, orig_dom.body);
            } catch (error) {
              // temp fix until https://github.com/michaelleeallen/mocha-junit-reporter/issues/139 is fixed
              console.error(`Error while comparing body of ${originalURL} against ${testURL}: ${error.message}
                Diff: ${Base.generateDiff(error.actual, error.expected)}`);
              await dumpHTML(originalURL, orig_dom);
              await dumpHTML(testURL, test_dom);
              throw error;
            }
          }).timeout(20000);

          it('testing head node', async () => {
            if (info.testStatus !== 200) {
              assert.fail(`${testURL} failed with ${info.testStatus}`);
            }
            try {
              assertEquivalentDOM(test_dom.head, orig_dom.head);
              assertEquivalentNode(test_dom.head, orig_dom.head);
            } catch (error) {
              // temp fix until https://github.com/michaelleeallen/mocha-junit-reporter/issues/139 is fixed
              console.error(`Error while comparing head of ${originalURL} against ${testURL}: ${error.message}
                Diff: ${Base.generateDiff(error.actual, error.expected)}`);
              await dumpHTML(originalURL, orig_dom);
              await dumpHTML(testURL, test_dom);
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
