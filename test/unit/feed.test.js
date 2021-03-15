/*
 * Copyright 2019 Adobe. All rights reserved.
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

'use strict';

process.env.HELIX_FETCH_FORCE_HTTP1 = true;

const querystring = require('querystring');
const assert = require('assert');
const fse = require('fs-extra');
const nock = require('nock');
const proxyquire = require('proxyquire');
const { resolve } = require('path');

/**
 * Proxy our real OW action and its requirements.
 *
 * @param {Function} invoke OW action to invoke
 */
const proxyaction = () => proxyquire('../../cgi-bin/feed.js', {
});
/*
    const resp = await fn({
      url: `https://content-proxy.com/proxy?${querystring.encode(params)}`,
      headers: new Map(Object.entries(params.__ow_headers || {})),
    }, {
      resolver,
      env,
    });

 */
/**
 * Create request object for feed action.
 */
const createRequest = () => ({
  url: `https://pages.com/feed?${querystring.encode({
    src: '/en/query-index.json?limit=10',
    id: 'path',
    title: 'title',
    updated: 'date',
  })}`,
  headers: new Map(Object.entries({
    'x-forwarded-proto': 'https',
    'hlx-forwarded-host': 'blog.adobe.com',
    'x-cdn-url': 'https://blog.adobe.com/atom.xml',
  })),
});

describe.only('Atom Feed Tests', () => {
  it('Atom Feed returns ESIs without prefixes', async () => {
    nock('https://blog.adobe.com')
      .get('/en/query-index.json?limit=10')
      .reply(200, [
        {
          author: 'The Adobe Portfolio Team',
          date: 1596412800,
          hero: '/hlx_62095f7c058e17b5ea0570390c6720be9d7fa06b.jpeg',
          path: 'en/publish/2020/08/03/adobe-portfolio-is-now-free-for-1-year-for-2020-college-grads.html',
          products: '[]',
          sourceHash: 'cfCy3Dtt5Fm02YCm',
          teaser: 'Adobe Portfolio is committed to supporting this year’s college graduates as they take their next step and plan for their',
          title: 'Adobe Portfolio is Now Free for 1 Year for 2020 College Grads',
          topics: '["Creativity"]',
        },
        {
          author: 'Andy Parsons',
          date: 1596412800,
          hero: '/hlx_1f050996b6275973dfa9b0d45a22d810b584aae9.png',
          path: 'en/publish/2020/08/03/cai-achieves-milestone-white-paper-sets-the-standard-for-content-attribution.html',
          products: '[]',
          sourceHash: 'sXHJuWkYRqJLVM+I',
          teaser: 'Today marks a significant milestone for the Content Authenticity Initiative (“CAI”) as we publish our white paper, “Setting the Standard',
          title: 'CAI Achieves Milestone: White Paper Sets the Standard for Content Attribution',
          topics: '["Art","Digital Transformation","Content Management"]',
        },
        {
          author: 'Ajay Shukla',
          date: 1596412800,
          hero: '/hlx_1437e6e655880b6685c588ddedbd10d35a17aff8.jpeg',
          path: 'en/publish/2020/08/03/midnight-gospel-on-netflix.html',
          products: '["Photoshop","Creative Cloud"]',
          sourceHash: 'Y3hsZMJnMY9VgVZb',
          teaser: 'Popular imagination typically associates animation with children. Titmouse is known for bending the rules of engagement time and again, and',
          title: 'Midnight Gospel on Netflix Animated by Titmouse',
          topics: '["Creative Inspiration & Trends"]',
        },
        {
          author: 'Niranjan Kumbi',
          date: 1596412800,
          hero: '/hlx_c186f1ed03869bb5ed54095e207e743b3b1538e8.jpeg',
          path: '/en/publish/2020/08/03/tapping-into-the-power-of-ai-to-drive-better-b2b-event-marketing.html',
          products: '["Marketo Engage"]',
          sourceHash: 'LbEqzUsGIB/r7wwh',
          teaser: 'The opportunity to network with peers, customers, and others in the industry is one of the best parts of attending',
          title: 'Tapping into the Power of AI to Drive Better B2B Event Marketing',
          topics: '["Campaign Management"]',
        },
        {
          author: 'Adobe Communications Team',
          date: 1596412800,
          hero: '/hlx_93cf170a5c51557282ba0177495621e33b5c39fc.jpeg',
          path: '/en/publish/2020/08/03/the-american-red-cross-life-saving-work-using-digital-experiences.html',
          products: '["Experience Manager","Experience Cloud"]',
          sourceHash: '4us6JfR+PR0iOC+s',
          teaser: 'Although an estimated 38 percent of the U.S. population is eligible to donate blood at any given time, less than',
          title: 'The American Red Cross: Life-saving work using digital experiences',
          topics: '["Digital Transformation","Sustainability"]',
        },
      ]);

    const response = await proxyaction().main(createRequest(), { log: console });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), await fse.readFile(
      resolve(__dirname, 'feed', 'feed-fstab.txt'), 'utf-8',
    ));
  }).timeout(10000);
});
