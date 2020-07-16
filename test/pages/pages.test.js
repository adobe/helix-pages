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
const { dumpDOM, assertEquivalentNode } = require('@adobe/helix-shared').dom;
const { fetch } = require('@adobe/helix-fetch');
const { JSDOM } = require('jsdom');
const { getUrls } = require('../utils.js');

let urls;
let bases = [];
let changes = [];

async function getDoms() {
  urls = await getUrls();
  changes = urls.map((obj) => {
    const { base, branch } = obj;
    // fetch page before change and page after change; and construct DOM
    bases.push(fetch(base).then((data) => data.text()));
    return fetch(branch).then((data) => data.text());
  });
  bases = await Promise.all(bases);
  changes = await Promise.all(changes);
}

function documentTests() {
  describe('document equivalence', () => {
    bases.forEach((base, idx) => {
      const orig_dom = new JSDOM(base).window.document;
      const new_dom = new JSDOM(changes[idx]).window.document;
      const { req_url } = urls[idx];
      it(`testing body node of hlx page: ${req_url}`, () => {
        dumpDOM(orig_dom.body, new_dom.body);
        assertEquivalentNode(orig_dom.body, new_dom.body);
      }).timeout(50000);

      it.skip(`testing head node of hlx page: ${req_url}`, () => {
        dumpDOM(orig_dom.head, new_dom.head);
        assertEquivalentNode(orig_dom.head, new_dom.head);
      }).timeout(20000);
    });
  });
  run();
}

getDoms().then(documentTests);
