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
const { getUrls, getRandom } = require('../utils');
const _ = require('lodash/fp');
const assert = require('assert');
const DEFAULT_STRAIN = 'default';
const token = process.env.HLX_FASTLY_AUTH;
const service = process.env.HLX_FASTLY_NAMESPACE;

const devices = ['MotorolaMotoG4',
'iPhone5',
'iPhone6',
'iPhone6Plus',
'iPhone7',
'iPhone8',
'Nexus5X',
'Nexus6P',
'GalaxyS5',
'iPad',
'iPadPro'];

const connections = ['regular2G',
'good2G',
'slow3G',
'regular3G',
'good3G',
'emergingMarkets',
'regular4G',
'LTE',
'dsl',
'wifi',
'cable'];

const locations = ['NorthVirginia',
'Frankfurt',
'Sydney',
'Ohio',
'California',
'Oregon',
'Canada',
'Ireland',
'Tokyo',
'Seoul',
'Singapore',
'Mumbai',
'SaoPaulo',
'London'];

//tests will take urls of most visited pages
//check performance of base site
//check performance of branch site
//compare the metrics returned from helix-perf. 
//repeat this for distinct points of triples (location, device, strain) projected onto a x,y space as the strains must match in terms of conditions etc. 
async function sendPerfRequests() {
    const urls = await getUrls();
    const perfUrl = 'https://adobeioruntime.net/api/v1/web/helix/helix-services/perf@v1';
    const tests = urls.reduce((prev, curr) => {
        const location = locations[getRandom(0, 13)], device = devices[getRandom(0, 10)], connection = connections[getRandom(0, 10)];
        prev.push({
        url: curr.base,
        location,
        device,
        connection,
        strain: 'page_test',
        });
        prev.push({
        url: curr.branch,
        location,
        device,
        connection,
        strain: 'page_test',
        });
        return prev;
    }, []); 
    const method = 'POST';
    const json = {
        service,
        token,
        tests: _.flatten(tests)
    };
    const res = await fetch(perfUrl, { method, json });
    if (!res.ok){
        const {status, statusText} = res;
        const text = await res.text();
        throw new Error(`failed with error code: ${status} and message: ${statusText}`);
    }
    return res.json();
}
/**
 * runs performance tests and compares metrics
 * 
 */
async function runPerfTests(res) {
    describe('performance testing', () => {
        res.forEach((test, idx) => {
        console.log(test);
        /*
        it(`testing body node of hlx page: ${req_url}`, () => {
            dumpDOM(orig_dom.body, new_dom.body);
            assertEquivalentNode(orig_dom.body, new_dom.body);
        }).timeout(50000);
    
        it.skip(`testing head node of hlx page: ${req_url}`, () => {
            dumpDOM(orig_dom.head, new_dom.head);
            assertEquivalentNode(orig_dom.head, new_dom.head);
        }).timeout(20000);
        */
        });
    });
    run();
}

sendPerfRequests().then((res) => {
    runPerfTests(res);
});


