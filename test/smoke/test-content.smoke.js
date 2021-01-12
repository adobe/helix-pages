/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/* eslint-disable no-console */
/* eslint-env mocha */
/* eslint-disable no-unused-expressions */

const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);

const TEST_CONTENT_OWNER = 'adobe';
const TEST_CONTENT_REPO = 'helix-pages-test-content';

const coerce = (v) => (v.trim() ? v.trim() : undefined);

const argv = require('yargs') // eslint-disable-line
  .option('domain', {
    type: 'string',
    description: 'Domain name to run the smoke test against',
    coerce,
  })
  .option('serviceid', {
    type: 'string',
    description: 'optional fastly service id for debugging',
  })
  .demandOption(['domain']).argv;

describe('test-content smoke tests - test content and expected results', () => {
  async function testPageContains(host, path, text) {
    // purge first
    await chai.request(host).purge(path);

    let retries = 3;
    let res;

    // try three times in case we get an on/off 504 error
    while (retries > 0) {
      retries -= 1;
      // eslint-disable-next-line no-await-in-loop
      res = await chai.request(host)
        .get(path)
        .set('X-Debug', argv.serviceid || false);
      try {
        expect(res).to.have.status(200);
        break;
      } catch (e) {
        if (retries <= 0) {
          throw e;
        }
      }
    }

    if (typeof text === 'string') {
      expect(res.text).to.contain(text);
    } else {
      text.forEach((t) => {
        expect(res.text).to.contain(t);
      });
    }
  }

  [{
    title: 'static head is overriden - GitHub - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/head.html',
    text: 'github-master-/head.html',
  }, {
    title: 'static head is overriden - GitHub - main branch',
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/head.html',
    text: 'github-main-/head.html',
  }, {
    title: 'static head is overriden - GitHub - a branch',
    host: `https://abranch--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/head.html',
    text: 'github-abranch-/head.html',
  }, {
    title: 'master is the default - GitHub - default branch',
    // TODO: swap main and master test once helix-pages is able to find default branch
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/',
    text: 'github-master-/index.html',
  }, {
    title: 'GH static HTML has priority on MD and Sharepoint files (and no head.html include) - GitHub / Sharepoint- main branch',
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/',
    text: 'github-main-/index.html',
  }, {
    title: 'GH static HTML has priority on MD and Google Drive files (and no head.html include) - GitHub / Google Drive - main branch',
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/',
    text: 'github-main-/g/index.html',
  }, {
    title: 'index can be retrieved - GitHub - a branch',
    host: `https://abranch--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/',
    text: 'github-abranch-/index.html',
  }, {
    title: 'styles.css override - GitHub - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/styles.css',
    // TODO: swap main and master test once helix-pages is able to find default branch
    text: 'github-master-/styles.css',
  }, {
    title: 'no styles.css override - GitHub - main branch',
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/styles.css',
    // TODO: swap main and master test once helix-pages is able to find default branch
    text: 'body {',
  }, {
    title: 'no styles.css override - GitHub - a branch',
    host: `https://abranch--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/styles.css',
    text: 'body {',
  }, {
    title: 'docx has priority on md - Sharepoint - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/sponly.html',
    text: [
      'github-master-/head.html',
      'sharepoint-/main/sponly.docx',
    ],
  }, {
    title: 'gdoc has priority on md - Google Drive - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/gonly.html',
    text: [
      'github-master-/head.html',
      'gdrive-/main/gonly.gdoc',
    ],
  }, {
    title: 'md files can be rendered - Sharepoint - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/mdonly.html',
    text: [
      'github-master-/head.html',
      'sharepoint-/main/mdonly.md',
    ],
  }, {
    title: 'md files can be rendered - Google Drive - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/mdonly.html',
    text: [
      'github-master-/head.html',
      'gdrive-/main/mdonly.md',
    ],
  }, {
    title: 'docx only contains the head - Sharepoint - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/spdoconly.html',
    text: [
      'github-master-/head.html',
      'sharepoint-/main/spdoconly.docx',
    ],
  }, {
    title: 'gdoc only contains the head - Google Drive - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/gdoconly.html',
    text: [
      'github-master-/head.html',
      'gdrive-/main/gdoconly.gdoc',
    ],
  }, {
    title: 'docx has priority over MD in GitHub - Sharepoint - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/test.html',
    text: [
      'github-master-/head.html',
      'sharepoint-/main/test.docx',
    ],
  }, {
    title: 'gdoc has priority over MD in GitHub - Google Drive - default branch',
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/test.html',
    text: [
      'github-master-/head.html',
      'gdrive-/main/test.gdoc',
    ],
  }, {
    title: '"docx only" contains the head - Sharepoint - main branch',
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/spdoconly.html',
    text: [
      'github-main-/head.html',
      'sharepoint-/main/spdoconly.docx',
    ],
  }, {
    title: '"gdoc only" contains the head - Google Drive - main branch',
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/gdoconly.html',
    text: [
      'github-main-/head.html',
      'gdrive-/main/gdoconly.gdoc',
    ],
  }, {
    title: 'docx has priority over MD in GitHub - Sharepoint - main branch',
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/test.html',
    text: [
      'github-main-/head.html',
      'sharepoint-/main/test.docx',
    ],
  }, {
    title: 'gdoc has priority over MD in GitHub - Google Drive - main branch',
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/test.html',
    text: [
      'github-main-/head.html',
      'gdrive-/main/test.gdoc',
    ],
  }, {
    title: '"docx only" contains the head - Sharepoint - a branch',
    host: `https://abranch--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/spdoconly.html',
    text: [
      'github-abranch-/head.html',
      'sharepoint-/abranch/spdoconly.docx',
    ],
  }, {
    title: '"gdoc only" contains the head - Google Drive - a branch',
    host: `https://abranch--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/gdoconly.html',
    text: [
      'github-abranch-/head.html',
      'gdrive-/abranch/gdoconly.gdoc',
    ],
  }, {
    title: 'docx has priority over MD in GitHub - Sharepoint - a branch',
    host: `https://abranch--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/test.html',
    text: [
      'github-abranch-/head.html',
      'sharepoint-/abranch/test.docx',
    ],
  }, {
    title: 'gdoc has priority over MD in GitHub - Google Drive - a branch',
    host: `https://abranch--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/test.html',
    text: [
      'github-abranch-/head.html',
      'gdrive-/abranch/test.gdoc',
    ],
  }, {
    title: 'json request finds spreadsheet - Sharepoint - default branch',
    // TODO: swap main and master test once helix-pages is able to find default branch
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/spreadsheet.json',
    text: 'sharepoint-/main/spreadsheet.xlsx',
  }, {
    title: 'json request finds spreadsheet - Sharepoint - main branch',
    // TODO: swap main and master test once helix-pages is able to find default branch
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/spreadsheet.json',
    text: 'sharepoint-/main/spreadsheet.xlsx',
  }, {
    title: 'json request finds spreadsheet - Sharepoint - a branch',
    host: `https://abranch--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/spreadsheet.json',
    text: 'sharepoint-/abranch/spreadsheet.xlsx',
  }, {
    title: 'json request finds spreadsheet - Google Drive - default branch',
    // TODO: swap main and master test once helix-pages is able to find default branch
    host: `https://${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/spreadsheet.json',
    text: 'gdrive-/main/spreadsheet.gsheet',
  }, {
    title: 'json request finds spreadsheet - Google Drive - main branch',
    // TODO: swap main and master test once helix-pages is able to find default branch
    host: `https://main--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/spreadsheet.json',
    text: 'gdrive-/main/spreadsheet.gsheet',
  }, {
    title: 'json request finds spreadsheet - Google Drive - a branch',
    host: `https://abranch--${TEST_CONTENT_REPO}--${TEST_CONTENT_OWNER}.${argv.domain}`,
    path: '/g/spreadsheet.json',
    text: 'gdrive-/abranch/spreadsheet.gsheet',
  }].forEach((test) => {
    it(`${test.title}: ${test.host}${test.path}`, async () => {
      await testPageContains(test.host, test.path, test.text);
    });
  });
});
