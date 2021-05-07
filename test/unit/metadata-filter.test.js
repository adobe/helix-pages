/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-env mocha */
const assert = require('assert');
const fs = require('fs-extra');
const path = require('path');
const { filter } = require('../../src/extract-metadata.js');

function delta(t0, t1) {
  const s = t1[0] - t0[0];
  const ns = t1[1] - t0[1];
  return s * 1000 + (ns / 1000000);
}

function bench(testData, json) {
  let totalParse = 0;
  let totalFilter = 0;
  const numIter = 10;
  for (let i = 0; i < numIter; i += 1) {
    const t0 = process.hrtime();
    const data = JSON.parse(json);
    const t1 = process.hrtime();
    filter(data, '/adobe/announcement/graduation');
    const t2 = process.hrtime();
    totalParse += delta(t0, t1);
    totalFilter += delta(t1, t2);
  }
  console.log('json size: ', json.length);
  console.log('data size: ', testData.length);
  console.log('parse: ', totalParse / numIter);
  console.log('filter: ', totalFilter / numIter);
}

describe('Metadata', () => {
  it('filters large metadata no glob', async () => {
    const testData = [];
    for (let i = 0; i < 10000; i += 1) {
      testData.push({
        URL: `/url${i}`.repeat(10),
        title: `Title Nr. ${i}`,
        category: `Category Nr. ${i}`,
        Description: `Description Nr. ${i}`,
      });
    }
    const json = JSON.stringify(testData);
    bench(testData, json);
  });

  it('filters large metadata all glob', async () => {
    const testData = [];
    for (let i = 0; i < 10000; i += 1) {
      testData.push({
        URL: `${`/url${i}`.repeat(4)}/*`,
        title: `Title Nr. ${i}`,
        category: `Category Nr. ${i}`,
        Description: `Description Nr. ${i}`,
      });
    }
    const json = JSON.stringify(testData);
    bench(testData, json);
  });

  it('filters large metadata all match', async () => {
    const testData = [];
    for (let i = 0; i < 10000; i += 1) {
      testData.push({
        URL: '/adobe/announcement/graduation',
        title: `Title Nr. ${i}`,
        category: `Category Nr. ${i}`,
        Description: `Description Nr. ${i}`,
      });
    }
    const json = JSON.stringify(testData);
    bench(testData, json);
  });

  it('it matches sub-pages metadata', async () => {
    const { data } = await fs.readJson(path.resolve(__dirname, 'fixtures', 'metadata.json'));
    const actual = filter(data, '/page-whatever.html');
    assert.deepEqual(actual, {
      category: 'rendering-test',
    });
  });

  it('it combines metadata', async () => {
    const { data } = await fs.readJson(path.resolve(__dirname, 'fixtures', 'metadata.json'));
    const actual = filter(data, '/page-metadata-json.html');
    assert.deepEqual(actual, {
      'og:publisher': 'Adobe',
      category: 'rendering-test',
      image: '/media_cf867e391c0b433ec3d416c979aafa1f8e4aae9c.png',
      keywords: 'Baz, Bar, Foo',
    });
  });

  it('it matches exactly', async () => {
    const { data } = await fs.readJson(path.resolve(__dirname, 'fixtures', 'metadata.json'));
    const actual = filter(data, '/exact-match.html');
    assert.deepEqual(actual, {
      'og:publisher': 'Adobe',
      keywords: 'Exactomento',
    });
  });

  it('it matches nothing', async () => {
    const { data } = await fs.readJson(path.resolve(__dirname, 'fixtures', 'metadata.json'));
    const actual = filter(data, '/nope');
    assert.deepEqual(actual, {});
  });
});
