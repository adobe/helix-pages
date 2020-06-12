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
const { dom } = require('@adobe/helix-shared');
const { HtmlDiffer } = require('html-differ');
const logger = require('html-differ/lib/logger');

const testDomain = process.env.TEST_DOMAIN;
const htmlDiffer = new HtmlDiffer({
  ignoreAttributes: [],
  compareAttributesAsJSON: [],
  ignoreWhitespaces: true,
  ignoreComments: true,
  ignoreEndTags: false,
  ignoreDuplicateAttributes: false,
});

function isEquivalent(original, newPage, orig_url) {
  const actual = dom.nodeIsEquivalent(original, newPage);
  if (actual === false) {
    const check = htmlDiffer.isEqual(original.innerHTML, newPage.innerHTML);
    if (check === false) {
      const diff = htmlDiffer.diffHtml(original.innerHTML, newPage.innerHTML);
      logger.logDiffText(diff, { charsAroundDiff: 50 });
    }
  }
  assert.equal(true, actual, `changes to markup detected for ${orig_url}`);
}

let bases = [];
let changes = [];
let base_urls = [];

async function getDoms() {
  const json = {
    limit: 2,
    threshold: 400,
  };
  const method = 'post';
  const res = await fetch('https://adobeioruntime.net/api/v1/web/helix/helix-services/run-query@v2/most-visited', { method, json });
  if (!res.ok) {
    assert.fail('test setup failed to gather test urls');
  }
  base_urls = (await res.json()).results;
  // construct array of promises from fetch
  changes = base_urls.map((obj) => {
    // eslint-disable-next-line camelcase
    const { req_url } = obj;
    const { pathname, hostname } = new URL(req_url);
    const headers = {
      host: hostname,
    };
    const thirdLvl = req_url.split('.')[0];
    const changed = [thirdLvl, testDomain].join('.') + pathname;

    // fetch page before change and page after change; and construct DOM
    bases.push(fetch(req_url, { headers }).then((data) => data.text()));
    return fetch(changed, { headers }).then((data) => data.text());
  });
  bases = await Promise.all(bases);
  changes = await Promise.all(changes);
}

function documentTests() {
  describe('document equivalence', () => {
    bases.forEach((base, idx) => {
      const orig_dom = new JSDOM(base).window.document;
      const new_dom = new JSDOM(changes[idx]).window.document;
      const { req_url } = base_urls[idx];
      it(`testing body node of hlx page: ${req_url}`, () => {
        isEquivalent(orig_dom.body, new_dom.head, req_url);
      });

      it(`testing head node of hlx page: ${req_url}`, () => {
        isEquivalent(orig_dom.head, new_dom.head, req_url);
      });
    });
  });
  run();
}

getDoms().then(documentTests);
