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
const { number } = require('yargs');

const testDomain = process.env.TEST_DOMAIN;

/**
 * gets a list of urls from by sending a request to helix-run-query
 * 
 * return list of objects i.e. {base: 'blog.adobe.com', branch: 'blog.adobe.hlx.page'}
 */
async function getUrls(){
    const json = {
        limit: 20,
        threshold: 100,
      };
      const method = 'post';
      const res = await fetch('https://adobeioruntime.net/api/v1/web/helix/helix-services/run-query@v2/most-visited', { method, json });
      if (!res.ok) {
        await res.text();
        assert.fail('test setup failed to gather test urls');
      }
      const urls = (await res.json()).results;

      return urls.map((obj) => {
        // eslint-disable-next-line camelcase
        const base = obj.req_url.replace('.project-helix.page', '.hlx.page');
        const { pathname } = new URL(base);
        const thirdLvl = base.split('.')[0];
        const branch = [thirdLvl, testDomain].join('.') + pathname;

        return {base, branch};
      });
}

/**
 * random number generator
 * 
 * @param {number} max maximum positional value in range of options
 * @param {number} min minimum positional value in range of options
 * 
 * returns a random number generated between [min, max]
 */
function getRandom(min, max){
    if (max <= min){
        throw new Error(`max ${max} is smaller or equal to min ${min}`);
    }
    return Math.round(Math.random() * (max - min) + min);
}

module.exports = {
    getUrls,
    getRandom,
}