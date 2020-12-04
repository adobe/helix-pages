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
/* global window document */

'use strict';

const assert = require('assert');
const puppeteer = require('puppeteer');

describe('Test sidekick bookmarklet', () => {
  const fixturesPrefix = `file://${__dirname}/sidekick`;

  const getPlugins = async (p) => p.evaluate(
    () => Array.from(document.querySelectorAll('.hlx-sk > div'))
      .map((plugin) => ({
        id: plugin.className,
        text: plugin.textContent,
      })),
  );

  const execPlugin = async (p, id) => p.evaluate((pluginId) => {
    const click = (el) => {
      const evt = document.createEvent('Events');
      evt.initEvent('click', true, false);
      el.dispatchEvent(evt);
    };
    click(document.querySelector(`.hlx-sk .${pluginId} button`));
  }, id);

  const clickButton = async (p, id) => p.evaluate((buttonId) => {
    const click = (el) => {
      const evt = window.document.createEvent('Events');
      evt.initEvent('click', true, false);
      el.dispatchEvent(evt);
    };
    click(window.document.querySelector(`.hlx-sk button.${buttonId}`));
  }, id);

  const mockCustomPlugins = async (p, js, check = () => true) => {
    await p.setRequestInterception(true);
    p.on('request', async (req) => {
      if (req.url().endsWith('/tools/sidekick/plugins.js')
        && check(req)) {
        await req.respond({
          status: 200,
          body: js || '',
        });
      } else {
        await req.continue();
      }
    });
  };

  const assertLater = async (delay = 5000) => new Promise((resolve) => {
    setTimeout(async () => {
      resolve(assert);
    }, delay);
  });

  let browser;
  let page;

  beforeEach(async () => {
    browser = await puppeteer.launch({
      headless: true,
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
    const plugins = await getPlugins(page);
    assert.strictEqual(plugins.length, 2, 'Did not render default plugins');
    const zIndex = await page.evaluate(
      (elem) => window.getComputedStyle(elem).getPropertyValue('z-index'),
      skHandle,
    );
    assert.strictEqual(zIndex, '1000', 'Did not apply default CSS');
  }).timeout(10000);

  it('Adds plugin from config', async () => {
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    const plugins = await getPlugins(page);
    assert.ok(plugins.find((p) => p.id === 'foo'), 'Did not add plugin from config');
  }).timeout(10000);

  it('Adds plugin from legacy config', async () => {
    let dialogMsg = '';
    await mockCustomPlugins(page);
    page.on('dialog', (dialog) => {
      dialogMsg = dialog.message();
    });
    await page.goto(`${fixturesPrefix}/config-legacy.html`, { waitUntil: 'load' });
    const plugins = await getPlugins(page);
    assert.ok(plugins.find((p) => p.id === 'foo'), 'Did not add plugin from legacy config');
    (await assertLater()).ok(dialogMsg.startsWith('Good news!'), 'Did not show update dialog');
  }).timeout(10000);

  it('Detects innerHost and outerHost from config', async () => {
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    const config = await page.evaluate(() => window.hlx.sidekick.config);
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
    let plugins = await getPlugins(page);
    assert.ok(plugins.length, 6, 'Did not add plugins via API');

    await (await page.$('div.hlx-sk .ding button')).click();
    plugins = await getPlugins(page);
    assert.ok(plugins.length, 7, 'Did not execute plugin action');
  }).timeout(10000);

  it('Adds plugins from project', async () => {
    await mockCustomPlugins(page, `
      window.hlx.sidekick.add({
        id: 'bar',
        button: {
          text: 'Bar',
        },
      });
    `);
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    assert.ok((await getPlugins(page)).find((p) => p.id === 'bar'), 'Did not add plugins from project');
  }).timeout(10000);

  it('Adds plugins from fixed host', async () => {
    await mockCustomPlugins(
      page,
      `window.hlx.sidekick.add({
        id: 'bar',
        button: {
          text: 'Bar',
        },
      });`,
      (req) => req.url().startsWith('https://plugins.foo.bar'),
    );
    await page.goto(`${fixturesPrefix}/config-plugin-host.html`, { waitUntil: 'load' });
    assert.ok((await getPlugins(page)).find((p) => p.id === 'bar'), 'Did not add plugins from fixed host');
  }).timeout(10000);

  it('Replaces plugin', async () => {
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      window.hlx.sidekick.add({
        id: 'foo',
        override: true,
        button: {
          text: 'ReplaceFoo',
        },
      });
    });
    const plugins = await getPlugins(page);
    assert.ok(plugins.find((p) => p.id === 'foo' && p.text === 'ReplaceFoo'), 'Did not replace plugin');
  }).timeout(10000);

  it('Extends plugin', async () => {
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      window.hlx.sidekick.add({
        id: 'foo',
        button: {
          text: 'ExtendFoo',
        },
      });
    });
    const plugins = await getPlugins(page);
    assert.ok(plugins.find((p) => p.id === 'foo' && p.text === 'ExtendFoo'), 'Did not extend plugin');
  }).timeout(10000);

  it('Removes plugin', async () => {
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    await page.evaluate(() => window.hlx.sidekick.remove('foo'));
    const plugins = await getPlugins(page);
    assert.ok(!plugins.find((p) => p.id === 'foo'), 'Did not remove plugin');
  }).timeout(10000);

  it('Adds HTML element in plugin', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    const text = await page.evaluate(() => {
      window.hlx.sidekick.add({
        id: 'foo',
        elements: [
          {
            tag: 'span',
            text: 'Lorem ipsum',
          },
        ],
      });
      return document.querySelector('.hlx-sk .foo').textContent;
    });
    assert.strictEqual(text, 'Lorem ipsum', 'Did not add HTML element in plugin');
  }).timeout(10000);

  it('Loads custom CSS', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      window.hlx.sidekick.loadCSS('custom.css');
    });
    const bgColor = await page.$eval('div.hlx-sk',
      (elem) => window.getComputedStyle(elem).getPropertyValue('background-color'));
    assert.strictEqual(bgColor, 'rgb(255, 255, 0)', 'Did not load custom CSS');
  }).timeout(10000);

  it('Shows and hides notifications', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });

    // shows notification
    assert.strictEqual(await page.evaluate(() => {
      window.hlx.sidekick.notify('Lorem ipsum');
      return document.querySelector('.hlx-sk-overlay .modal').textContent;
    }), 'Lorem ipsum', 'Did show notification');

    // shows sticky modal
    assert.strictEqual(await page.evaluate(() => {
      window.hlx.sidekick.showModal('Sticky', true);
      return document.querySelector('.hlx-sk-overlay .modal.wait').textContent;
    }), 'Sticky', 'Did show sticky modal');

    // hides sticky modal
    assert.strictEqual(await page.evaluate(() => {
      window.hlx.sidekick.hideModal();
      return document.querySelector('.hlx-sk-overlay').classList.contains('hlx-sk-hidden');
    }), true, 'Did not hide sticky modal');

    // shows multi-line notification
    assert.strictEqual(await page.evaluate(() => {
      window.hlx.sidekick.notify(['Lorem ipsum', 'sit amet']);
      return document.querySelector('.hlx-sk-overlay .modal').innerHTML;
    }), '<p>Lorem ipsum</p><p>sit amet</p>', 'Did not show multi-line notification');

    // hides sticky modal on overlay click
    assert.ok(await page.evaluate(() => {
      window.hlx.sidekick.showModal('Sticky');
      const overlay = document.querySelector('.hlx-sk-overlay');
      const click = (el) => {
        const evt = document.createEvent('Events');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
      };
      click(overlay);
      return overlay.classList.contains('hlx-sk-hidden');
    }), 'Did not hide sticky modal on overlay click');
  }).timeout(10000);

  it('Close button hides sidekick', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    await clickButton(page, 'close');
    assert.ok(
      await page.evaluate(() => window.document.querySelector('.hlx-sk').classList.contains('hlx-sk-hidden')),
      'Did not hide sidekick',
    );
  }).timeout(10000);

  it('Share button copies sharing URL to clipboard', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    await clickButton(page, 'share');
    assert.strictEqual(
      await page.evaluate(() => window.document.querySelector('.hlx-sk-overlay .modal').textContent),
      'Sharing URL copied to clipboard',
      'Did not copy sharing URL to clipboard',
    );
  }).timeout(10000);

  it('Preview plugin opens a new tab with staging lookup URL from gdrive URL', async () => {
    // watch for new browser window
    let lookupUrl;
    browser.on('targetcreated', async (target) => {
      lookupUrl = target.url();
    });
    // open test page and click preview button
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/preview-gdrive.html`, { waitUntil: 'load' });
    await execPlugin(page, 'preview');
    // check result
    (await assertLater()).strictEqual(
      lookupUrl,
      'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=pages&ref=main&path=%2F&lookup=https%3A%2F%2Fdocs.google.com%2Fdocument%2Fd%2F2E1PNphAhTZAZrDjevM0BX7CZr7KjomuBO6xE1TUo9NU%2Fedit',
      'Staging lookup URL not opened',
    );
  }).timeout(10000);

  it('Preview plugin opens a new tab with staging lookup URL from onedrive URL', async () => {
    // watch for new browser window
    let lookupUrl;
    browser.on('targetcreated', async (target) => {
      lookupUrl = target.url();
    });
    // open test page and click preview button
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/preview-onedrive.html`, { waitUntil: 'load' });
    await execPlugin(page, 'preview');
    // check result
    (await assertLater()).strictEqual(
      lookupUrl,
      'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=theblog&ref=main&path=%2F&lookup=https%3A%2F%2Fadobe.sharepoint.com%2F%3Aw%3A%2Fr%2Fsites%2FTheBlog%2F_layouts%2F15%2FDoc.aspx%3Fsourcedoc%3D%257BE8EC80CB-24C3-4B95-B082-C51FD8BC8760%257D%26file%3Dcafebabe.docx%26action%3Ddefault%26mobileredirect%3Dtrue',
      'Staging lookup URL not opened',
    );
  }).timeout(10000);

  it('Edit plugin opens a new tab with editor lookup URL from staging URL', async () => {
    // watch for new browser window
    let editUrl;
    page.on('popup', async (popup) => {
      editUrl = popup.url();
    });
    // open test page and click preview button
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/edit-staging.html`, { waitUntil: 'load' });
    await execPlugin(page, 'edit');
    // check result
    (await assertLater()).strictEqual(
      editUrl,
      'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=theblog&ref=master&path=%2F&edit=https%3A%2F%2Ftheblog--adobe.hlx.page%2Fen%2Ftopics%2Fbla.html',
      'Editor lookup URL not opened',
    );
  }).timeout(10000);

  it('Edit plugin opens a new tab with editor lookup URL from production URL', async () => {
    // watch for new browser window
    let editUrl;
    page.on('popup', async (popup) => {
      editUrl = popup.url();
    });
    // open test page and click preview button
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/edit-production.html`, { waitUntil: 'load' });
    await execPlugin(page, 'edit');
    // check result
    (await assertLater(10000)).strictEqual(
      editUrl,
      'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=theblog&ref=master&path=%2F&edit=https%3A%2F%2Fblog.adobe.com%2Fen%2Ftopics%2Fbla.html',
      'Editor lookup URL not opened',
    );
  }).timeout(15000);

  it('Preview plugin opens a new tab with staging URL from production URL', async () => {
    // watch for new browser window
    let stagingUrl;
    page.on('popup', async (popup) => {
      stagingUrl = popup.url();
    });
    // open test page and click preview button
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/edit-production.html`, { waitUntil: 'load' });
    await execPlugin(page, 'preview');
    // check result
    (await assertLater(15000)).strictEqual(
      stagingUrl,
      'https://theblog--adobe.hlx.page/en/topics/bla.html',
      'Staging URL not opened',
    );
  }).timeout(20000);

  it('Publish plugin sends purge request from staging URL', async () => {
    const actionHost = 'https://adobeioruntime.net';
    const purgePath = '/en/topics/bla.html';
    // watch for purge request
    let purged = false;
    page.on('request', async (req) => {
      if (req.url().startsWith(actionHost)) {
        const params = new URL(req.url()).searchParams;
        purged = params.get('path') === purgePath
          && params.get('xfh').split(',').length === 3;
      }
    });
    // open test page and click publish button
    await page.goto(`${fixturesPrefix}/publish-staging.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const click = (el) => {
        const evt = document.createEvent('Events');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
      };
      click(document.querySelector('.hlx-sk .publish button'));
    });
    // check result
    (await assertLater()).ok(purged, 'Purge request not sent');
  }).timeout(10000);

  it.only('Publish plugin works with inner CDN only', async () => {
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
    // open test page and click publish button
    await page.goto(`${fixturesPrefix}/publish-no-host.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      const click = (el) => {
        const evt = document.createEvent('Events');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
      };
      click(document.querySelector('.hlx-sk .publish button'));
    });
    // check result
    (await assertLater()).ok(purged, 'Purge request not sent');
  }).timeout(10000);

  it('Publish plugin purges dependencies', async () => {
    const actionHost = 'https://adobeioruntime.net';
    const purgePath = '/en/topics/foo.html';
    // watch for purge request
    let purged = false;
    page.on('request', async (req) => {
      if (req.url().startsWith(actionHost)) {
        const params = new URL(req.url()).searchParams;
        purged = params.get('path') === purgePath;
      }
    });
    // open test page and click publish button
    await page.goto(`${fixturesPrefix}/publish-staging.html`, { waitUntil: 'load' });
    // add dependencies
    await page.evaluate((dPath) => {
      window.hlx.dependencies = [dPath];
    }, purgePath);
    await page.evaluate(() => {
      const click = (el) => {
        const evt = document.createEvent('Events');
        evt.initEvent('click', true, false);
        el.dispatchEvent(evt);
      };
      click(document.querySelector('.hlx-sk .publish button'));
    });
    // check result
    (await assertLater()).ok(purged, 'Purge request not sent');
  }).timeout(10000);
});
