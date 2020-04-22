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
/* eslint-disable no-console, camelcase */

const assert = require('assert');

function backendCheck(alerts) {
  const TIME_THRESHOLD = 60 * 1000 * 1000;
  return alerts.sort((alert1, alert2) => {
    if (alert1.time_start_usec < alert2.time_start_usec) {
      return -1;
    } else if (alert1.time_start_usec > alert2.time_start_usec) {
      return 1;
    } else {
      return 0;
    }
  })
    .filter((alert) => (alert.time_start_usec
      <= (parseInt(alerts[0].time_start_usec, 10) + TIME_THRESHOLD).toString()));
}

function pagesMonitor(err, response, body) {
  assert.equal(response.statusCode, 200, 'Expected a 200 OK response');
  /* Get response and check for error clusters */
  const ACTUAL_500 = [];
  const EXPECTED = [];
  const ACTUAL_50N = [];
  const THRESHOLD = 3;

  body.results.forEach((curr) => {
    const {
      service_config, status_code, req_url, time_end_usec,
    } = curr;
    if (status_code === '502' || status_code === '503' || status_code === '504') {
      ACTUAL_50N.push(curr);
    } else if (status_code === '500') {
      ACTUAL_500.push(curr);
    }
    console.error(
      `Request to ${req_url} failed at ${new Date(parseInt(time_end_usec, 10) / 1000).toTimeString()} with Status Code: ${status_code} service config is: ${service_config}`,
    );
    console.log('CDN Log entry:', curr);
  });

  const sorted = backendCheck(ACTUAL_50N);

  if (sorted.length >= THRESHOLD) {
    assert.fail(`There were ${sorted.length} BACKEND ERRORS reported in 1 minute`);
  }
  assert.deepEqual(ACTUAL_500, EXPECTED, 'Request to helix-pages site(s) failed: see Script Log for more information');
}

/* global $http */
$http.post('$$$URL$$$',
  // Post data
  {
    json: {
      fromMins: 2,
      toMins: 0,
    },
  },
  // Callback
  pagesMonitor);
module.exports = pagesMonitor;
