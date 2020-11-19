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
/* eslint-env mocha */
/* global window */

'use strict';

const assert = require('assert');
const puppeteer = require('puppeteer');

describe('Test sidekick bookmarklet', () => {
  const fixturesPrefix = `file://${__dirname}/sidekick`;
  const getSidekickText = async (p) => p.evaluate(
    () => window.document.querySelector('.hlx-sk').textContent,
  );

  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      args: [
        '--disable-popup-blocking',
        '--disable-web-security',
        '–no-sandbox',
        '–disable-setuid-sandbox',
      ],
    });
    page = await browser.newPage();
  });

  afterEach(async () => {
    await browser.close();
    browser = null;
    page = null;
  });

  it('Renders default plugins', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    const skHandle = await page.$('div.hlx-sk');
    assert.ok(skHandle, 'Did not render without config');
    assert.strictEqual(
      await getSidekickText(page),
      'PreviewPublish',
      'Did not remove plugin',
    );
    const zIndex = await page.evaluate(
      (elem) => window.getComputedStyle(elem).getPropertyValue('z-index'),
      skHandle,
    );
    assert.strictEqual(zIndex, '1000', 'Did not apply default CSS');
  }).timeout(10000);

  it('Adds plugin from config', async () => {
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    assert.ok(
      (await getSidekickText(page)).includes('Foo'),
      'Did not add plugin from config',
    );
  }).timeout(10000);

  it('Constructs innerHost and outerHost from config', async () => {
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    const config = await page.evaluate(() => window.hlxSidekick.config);
    assert.strictEqual(
      config.innerHost,
      'foo--theblog--adobe.hlx.page',
    );
    assert.strictEqual(
      config.outerHost,
      'theblog--adobe.hlx.live',
    );
  }).timeout(10000);

  it('Adds plugins via API', async () => {
    await page.goto(`${fixturesPrefix}/add-plugins.html`, { waitUntil: 'load' });
    assert.ok(
      (await getSidekickText(page)).includes('FooBarZapfDing'),
      'Did not add plugins via API',
    );

    await (await page.$('div.hlx-sk .ding button')).click();
    assert.ok(
      (await getSidekickText(page)).includes('FooBarZapfDingBaz'),
      'Did not execute plugin action',
    );
  }).timeout(10000);

  it('Adds plugins from project', async () => {
    await page.setRequestInterception(true);
    page.on('request', async (req) => {
      if (req.url().endsWith('/tools/sidekick/plugins.js')) {
        await req.respond({
          status: 200,
          contentType: 'text/javascript',
          body: `
            window.hlxSidekick.add({
              id: 'bar',
              button: {
                text: 'Bar',
              },
            });
          `,
        });
      } else {
        await req.continue();
      }
    });
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    assert.strictEqual(
      await getSidekickText(page),
      'PreviewPublishFooBar',
      'Did not add plugins from project',
    );
  }).timeout(10000);

  it('Replaces plugin', async () => {
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      window.hlxSidekick.add({
        id: 'foo',
        override: true,
        button: {
          text: 'CustomFoo',
        },
      });
    });
    assert.ok(
      (await getSidekickText(page)).includes('CustomFoo'),
      'Did not replace plugin',
    );
  }).timeout(10000);

  it('Removes plugin', async () => {
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    await page.evaluate(() => window.hlxSidekick.remove('foo'));
    assert.strictEqual(
      await getSidekickText(page),
      'PreviewPublish',
      'Did not remove plugin',
    );
  }).timeout(10000);

  it('Adds HTML element in plugin', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    await page.evaluate(() => window.hlxSidekick.add({
      id: 'foo',
      elements: [
        {
          tag: 'span',
          text: 'Lorem ipsum',
        },
      ],
    }));
    assert.ok(
      (await getSidekickText(page)).includes('Lorem ipsum'),
      'Did not add HTML element in plugin',
    );
  }).timeout(10000);

  it('Loads custom CSS', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      window.hlxSidekick.loadCSS('custom.css');
    });
    const bgColor = await page.$eval('div.hlx-sk',
      (elem) => window.getComputedStyle(elem).getPropertyValue('background-color'));
    assert.strictEqual(bgColor, 'rgb(255, 255, 0)', 'Did not load custom CSS');
  }).timeout(10000);

  it('Shows and hides notifications', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    assert.strictEqual(await page.evaluate(() => {
      window.hlxSidekick.notify('Lorem ipsum');
      return window.document.querySelector('.hlx-sk-overlay .modal').textContent;
    }), 'Lorem ipsum', 'Did show notification');

    assert.strictEqual(await page.evaluate(() => {
      window.hlxSidekick.showModal('Sticky', true);
      return window.document.querySelector('.hlx-sk-overlay .modal.wait').textContent;
    }), 'Sticky', 'Did show sticky modal');

    assert.strictEqual(await page.evaluate(() => {
      window.hlxSidekick.hideModal();
      return window.document.querySelector('.hlx-sk-overlay').classList.contains('hlx-sk-hidden');
    }), true, 'Did not hide sticky modal');

    assert.strictEqual(await page.evaluate(() => {
      window.hlxSidekick.notify(['Lorem ipsum', 'sit amet']);
      return window.document.querySelector('.hlx-sk-overlay .modal').innerHTML;
    }), '<p>Lorem ipsum</p><p>sit amet</p>', 'Did not show multi-line notification');
  }).timeout(10000);

  it('Preview opens a new tab with staging lookup URL from gdrive URL', async () => {
    // watch for new browser window
    let lookupUrl;
    browser.on('targetcreated', async (target) => {
      lookupUrl = target.url();
    });
    // open test page and click preview button
    await page.goto(`${fixturesPrefix}/preview-gdrive.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const click = (el) => {
        const evt = window.document.createEvent('Events');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
      };
      click(window.document.querySelector('.hlx-sk .preview button'));
    });
    // check result
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          assert.strictEqual(
            lookupUrl,
            'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=pages&ref=master&path=%2F&lookup=https%3A%2F%2Fdocs.google.com%2Fdocument%2Fd%2F2E1PNphAhTZAZrDjevM0BX7CZr7KjomuBO6xE1TUo9NU%2Fedit',
            `Staging lookup URL not opened, lookup URL: ${lookupUrl}`,
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      }, 5000);
    });
  }).timeout(10000);

  it('Preview plugin opens a new tab with staging lookup URL from onedrive URL', async () => {
    // watch for new browser window
    let lookupUrl;
    browser.on('targetcreated', async (target) => {
      lookupUrl = target.url();
    });
    // open test page and click preview button
    await page.goto(`${fixturesPrefix}/preview-onedrive.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const click = (el) => {
        const evt = window.document.createEvent('Events');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
      };
      click(window.document.querySelector('.hlx-sk .preview button'));
    });
    // check result
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          assert.strictEqual(
            lookupUrl,
            'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=theblog&ref=master&path=%2F&lookup=https%3A%2F%2Fadobe.sharepoint.com%2F%3Aw%3A%2Fr%2Fsites%2FTheBlog%2F_layouts%2F15%2FDoc.aspx%3Fsourcedoc%3D%257BE8EC80CB-24C3-4B95-B082-C51FD8BC8760%257D%26file%3Dcafebabe.docx%26action%3Ddefault%26mobileredirect%3Dtrue',
            `Staging lookup URL not opened, lookup URL: ${lookupUrl}`,
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      }, 5000);
    });
  }).timeout(10000);

  it('Preview plugin switches from staging to production URL', async () => {
    const targetUrl = 'https://blog.adobe.com/en/topics/news.html';
    // watch for location change
    let newUrl = '';
    browser.on('targetchanged', async (target) => {
      newUrl = target.url();
    });
    // open test page and click preview button
    await page.goto(`${fixturesPrefix}/preview-staging.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const click = (el) => {
        const evt = window.document.createEvent('Events');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
      };
      click(window.document.querySelector('.hlx-sk .preview button'));
    });
    // check result
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          assert.strictEqual(newUrl, targetUrl, `Production URL not opened, new URL: ${newUrl}`);
          resolve();
        } catch (e) {
          reject(e);
        }
      }, 5000);
    });
  }).timeout(10000);

  it('Preview plugin switches from production to staging URL', async () => {
    const targetUrl = 'https://theblog--adobe.hlx.page/en/topics/news.html';
    let newUrl = '';
    browser.on('targetchanged', async (target) => {
      newUrl = target.url();
    });
    // open test page and click preview button
    await page.goto(`${fixturesPrefix}/preview-production.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const click = (el) => {
        const evt = window.document.createEvent('Events');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
      };
      click(window.document.querySelector('.hlx-sk .preview button'));
    });
    // check result
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          assert.strictEqual(newUrl, targetUrl, `Staging URL not opened, new URL: ${newUrl}`);
          resolve();
        } catch (e) {
          reject(e);
        }
      }, 5000);
    });
  }).timeout(10000);

  it('Publish plugin sends purge request from staging URL', async () => {
    const actionHost = 'https://adobeioruntime.net';
    const purgePath = '/en/topics/bla.html';
    // watch for purge request
    let purged = false;
    page.on('request', async (req) => {
      if (req.url().startsWith(actionHost)) {
        const params = new URL(req.url()).searchParams;
        purged = params.get('path') === purgePath
          && params.get('xfh').split(',').length === 2;
      }
    });
    // open test page and click preview button
    await page.goto(`${fixturesPrefix}/publish-staging.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const click = (el) => {
        const evt = window.document.createEvent('Events');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
      };
      click(window.document.querySelector('.hlx-sk .publish button'));
    });
    // check result
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          assert.strictEqual(purged, true, 'Purge request not sent');
          resolve();
        } catch (e) {
          reject(e);
        }
      }, 5000);
    });
  }).timeout(10000);
});
