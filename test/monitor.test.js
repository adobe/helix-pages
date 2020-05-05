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

const assert = require('assert');
const pagesMonitor = require('../monitoring/error500.js

describe('pages monitor tests', () => {
  it('multiple backend failures under threshold reported', () => {
    const resp = { statusCode: 200 };
    const body = {
      results: [
        {
          client_as_name: 'cloudflare inc.',
          req_url: 'pass',
          service_config: 'blah',
          status_code: '502',
          time_end_usec: '1586775330668499',
          time_start_usec: '1586768309539558',
        },
        {
          client_as_name: 'cloudflare inc.',
          req_url: 'pass',
          service_config: 'blah',
          status_code: '502',
          time_end_usec: '1586775330649544',
          time_start_usec: '1586860309539558',
        },
        {
          client_as_name: 'cloudflare inc.',
          req_url: 'pass',
          service_config: 'blah',
          status_code: '502',
          time_end_usec: '1586775330668440',
          time_start_usec: '1588760309539558',
        },
        {
          client_as_name: 'cloudflare inc.',
          req_url: 'backendErr',
          service_config: 'blah',
          status_code: '502',
          time_end_usec: '1586775330579275',
          time_start_usec: '1586760309539558',
        },
        {
          client_as_name: 'fastly',
          req_url: 'backendErr',
          service_config: 'blah',
          status_code: '503',
          time_end_usec: '1586768406585812',
          time_start_usec: '1586760309539558',
        },
        {
          client_as_name: 'fastly',
          req_url: 'backendErr',
          service_config: 'blah',
          status_code: '503',
          time_end_usec: '1586760310542752',
          time_start_usec: '1586760309539558',
        },
      ],
    };

    try {
      pagesMonitor([], resp, body);
      assert.fail('pageMonitor should have failed');
    } catch (e) {
      assert.equal(e.message, 'There were 3 BACKEND ERRORS reported in 1 minute');
    }
  });

  it('pagesMonitor does nothing with < 3 errs with status code > 500', () => {
    const resp = { statusCode: 200 };
    const body = {
      results: [
        {
          client_as_name: 'cloudflare inc.',
          req_url: 'pass',
          service_config: 'blah',
          status_code: '502',
          time_end_usec: '1586775330668499',
          time_start_usec: '1586768309539558',
        },
      ],
    };

    pagesMonitor([], resp, body);
  });

  it('pageMonitor reports 1+ 500s', () => {
    const resp = { statusCode: 200 };
    const body = {
      results: [
        {
          client_as_name: 'cloudflare inc.',
          req_url: 'pass',
          service_config: 'blah',
          status_code: '500',
          time_end_usec: '1586775330668499',
          time_start_usec: '1586768309539558',
        },
      ],
    };

    try {
      pagesMonitor([], resp, body);
      assert.fail('Monitor should have failed');
    } catch (e) {
      assert.equal(e.message, 'Request to helix-pages site(s) failed: see Script Log for more information');
    }
  });
});
