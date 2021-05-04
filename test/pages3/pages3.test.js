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
const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

chai.use(chaiHttp);
const domain = process.env.HLX3_HOST || 'hlx3.page';

console.log(`Using ${domain}`);

describe('Helix Pages 3 Test Harness: Repository Resolution', () => {
  it('Missing owner and repo returns 404', async () => {
    const response = await chai.request(`https://none.${domain}`)
      .get('/');
    expect(response).to.have.status(404);
    expect(response).to.have.header('x-error');
  });

  it('Invalid ref for valid owner and repo returns 404', async () => {
    const response = await chai.request(`https://invalid-ref--helix-demo--trieloff.${domain}`)
      .get('/');
    expect(response).to.have.status(404);
    expect(response).to.have.header('x-error');
  });

  it.skip('Valid ref for valid owner and repo returns 404 (if mountpoint not found)', async () => {
    const response = await chai.request(`https://helix-demo--trieloff.${domain}`)
      .get('/');
    expect(response).to.have.status(404);
    expect(response).to.have.header('x-error', 'mountpoint not found');
  });
});

describe('Helix Pages 3 Test Harness: Content Resolution', () => {
  it('Delivers Markdown from Content Repo', async () => {
    const response = await chai.request(`https://spark-website--adobe.${domain}`)
      .get('/express/create/advertisement/cyber-monday.md');
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', 'text/markdown');
  });

  it('Delivers 404 if Content Repo does not have the content', async () => {
    const response = await chai.request(`https://spark-website--adobe.${domain}`)
      .get('/ms/missing.md');
    expect(response).to.have.status(404);
    expect(response).to.have.header('x-error', 'No matching handler found for this URL pattern');
  });
});

describe('Media Bus', () => {
  it('Delivers Images from Media Bus', async () => {
    const response = await chai.request(`https://spark-website--adobe.${domain}`)
      .get('/ms/media_14b5aa8a1e70779587d4ea68cadff8bad1bd49099.png');
    expect(response).to.have.status(200);
    expect(response).to.have.header('content-type', 'image/png');
  });

  it('Does not deliver missing Images from Media Bus', async () => {
    const response = await chai.request(`https://spark-website--adobe.${domain}`)
      .get('/ms/media_0000aaaa1e70779587d4ea68cadff8bad1bd49099.png');
    expect(response).to.have.status(404);
    expect(response).to.have.header('x-error', 'No matching handler found for this URL pattern');
  });
});
