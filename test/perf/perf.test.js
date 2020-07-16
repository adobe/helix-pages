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
const { getUrls, parseTiming } = require('../utils');

const service = process.env.HLX_FASTLY_NAMESPACE;

/**
 * executes tests for equality
 *
 * @param {*} timeObj1 object of pipeline step times and desc
 * @param {*} timeObj2 object of pipeline step times and desc
 */
function testTiming(timeObj1, timeObj2) {
  const actual = Object.keys(timeObj2).reduce((prev, curr) => {
    if (curr in timeObj1) {
      const baseTime = timeObj1[curr];
      const branchTime = timeObj2[curr];
      // eslint-disable-next-line no-param-reassign
      prev += `commit will ${baseTime < branchTime ? 'INCREASE' : 'DECREASE'} time of step: ${curr} by ${Number(branchTime - baseTime).toFixed(4)}\n`;
    } else {
      // eslint-disable-next-line no-param-reassign
      prev += `commit adds step ${curr}: ${branchTime}ms\n`;
    }
    return prev;
  }, '\n');

  const expected = Object.keys(timeObj1).reduce((prev, curr) => {
    if (curr in timeObj2) {
      const baseTime = timeObj1[curr];
      // eslint-disable-next-line no-param-reassign
      prev += `commit removes step ${curr}: ${baseTime}ms\n`;
    }
    return prev;
  }, actual);

  return { actual, expected };
}

async function sendPerfRequests() {
  const urls = await getUrls();
  const headers = {
    'X-DEBUG': service,
    'cache-control': 'no-cache',
  };
  const visits = urls.reduce((prev, curr) => {
    prev.push(fetch(`${curr.base}`, { headers }).then((res) => {
      // consume response
      res.text();
      return res;
    }));
    prev.push(fetch(`${curr.branch}`, { headers }).then((res) => {
      // consume response
      res.text();
      return res;
    }));
    return prev;
  }, []);

  return Promise.all(visits);
}
/**
 * runs performance tests and compares metrics
 *
 */
async function runPerfTests(res) {
  describe('pipeline rendering time', () => {
    for (let idx = 0; idx < res.length; idx += 2) {
      const { url } = res[idx];
      const baseTime = res[idx].headers.get('server-timing');
      const branchTime = res[idx + 1].headers.get('server-timing');
      if (baseTime && branchTime) {
        const baseTimeObj = parseTiming(baseTime);
        const branchTimeObj = parseTiming(branchTime);
        it(`testing pipeline rendering time for ${url}`, () => {
          try {
            assert.deepEqual(baseTimeObj, branchTimeObj);
          } catch {
            const { actual, expected } = testTiming(baseTimeObj, branchTimeObj);
            throw new assert.AssertionError({
              message: actual,
              actual,
              expected,
              stackStartFn: runPerfTests,
            });
          }
        });
      }
    }
  });
  run();
}

sendPerfRequests().then((res) => {
  runPerfTests(res);
});
