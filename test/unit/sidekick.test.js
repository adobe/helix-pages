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
  const IT_DEFAULT_TIMEOUT = 30000;
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
        req.continue();
      }
    });
  };

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
    assert.strictEqual(plugins.length, 1, 'Did not render default plugins');
    const zIndex = await page.evaluate(
      (elem) => window.getComputedStyle(elem).getPropertyValue('z-index'),
      skHandle,
    );
    assert.strictEqual(zIndex, '9999999', 'Did not apply default CSS');
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Adds plugin from config', async () => {
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    const plugins = await getPlugins(page);
    assert.ok(plugins.find((p) => p.id === 'foo'), 'Did not add plugin from config');
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Adds plugin from legacy config', async () => {
    await mockCustomPlugins(page);
    await new Promise((resolve, reject) => {
      page.on('dialog', (dialog) => {
        try {
          assert.ok(dialog.message().startsWith('Good news!'), 'Did not show update dialog');
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      page
        .goto(`${fixturesPrefix}/config-legacy.html`, { waitUntil: 'load' })
        .then(async () => {
          const plugins = await getPlugins(page);
          assert.ok(plugins.find((p) => p.id === 'foo'), 'Did not add plugin from legacy config');
        });
    });
  }).timeout(IT_DEFAULT_TIMEOUT);

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
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Adds plugins via API', async () => {
    await page.goto(`${fixturesPrefix}/add-plugins.html`, { waitUntil: 'load' });
    let plugins = await getPlugins(page);
    assert.ok(plugins.length, 6, 'Did not add plugins via API');

    await (await page.$('div.hlx-sk .ding button')).click();
    plugins = await getPlugins(page);
    assert.ok(plugins.length, 7, 'Did not execute plugin action');
  }).timeout(IT_DEFAULT_TIMEOUT);

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
  }).timeout(IT_DEFAULT_TIMEOUT);

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
  }).timeout(IT_DEFAULT_TIMEOUT);

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
  }).timeout(IT_DEFAULT_TIMEOUT);

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
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Removes plugin', async () => {
    await mockCustomPlugins(page);
    await page.goto(`${fixturesPrefix}/config-plugin.html`, { waitUntil: 'load' });
    await page.evaluate(() => window.hlx.sidekick.remove('foo'));
    const plugins = await getPlugins(page);
    assert.ok(!plugins.find((p) => p.id === 'foo'), 'Did not remove plugin');
  }).timeout(IT_DEFAULT_TIMEOUT);

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
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Loads custom CSS', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    await page.evaluate(() => {
      window.hlx.sidekick.loadCSS('custom.css');
    });
    const bgColor = await page.$eval('div.hlx-sk',
      (elem) => window.getComputedStyle(elem).getPropertyValue('background-color'));
    assert.strictEqual(bgColor, 'rgb(255, 255, 0)', 'Did not load custom CSS');
  }).timeout(IT_DEFAULT_TIMEOUT);

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
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Close button hides sidekick', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    await clickButton(page, 'close');
    assert.ok(
      await page.evaluate(() => window.document.querySelector('.hlx-sk').classList.contains('hlx-sk-hidden')),
      'Did not hide sidekick',
    );
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Share button copies sharing URL to clipboard', async () => {
    await page.goto(`${fixturesPrefix}/config-none.html`, { waitUntil: 'load' });
    await clickButton(page, 'share');
    assert.strictEqual(
      await page.evaluate(() => window.document.querySelector('.hlx-sk-overlay .modal').textContent),
      'Sharing URL copied to clipboard',
      'Did not copy sharing URL to clipboard',
    );
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Preview plugin opens a new tab with staging lookup URL from gdrive URL', async () => {
    await mockCustomPlugins(page);
    await new Promise((resolve, reject) => {
      // watch for new browser window
      browser.on('targetcreated', async (target) => {
        // check result
        try {
          assert.strictEqual(
            target.url(),
            'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=pages&ref=main&path=%2F&lookup=https%3A%2F%2Fdocs.google.com%2Fdocument%2Fd%2F2E1PNphAhTZAZrDjevM0BX7CZr7KjomuBO6xE1TUo9NU%2Fedit',
            'Staging lookup URL not opened',
          );
          resolve();
        } catch (e) {
          reject();
        }
      });
      // open test page and click preview button
      page
        .goto(`${fixturesPrefix}/preview-gdrive.html`, { waitUntil: 'load' })
        .then(() => execPlugin(page, 'preview'));
    });
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Preview plugin opens a new tab with staging lookup URL from onedrive URL', async () => {
    await mockCustomPlugins(page);
    await new Promise((resolve, reject) => {
      // watch for new browser window
      browser.on('targetcreated', async (target) => {
        // check result
        try {
          assert.strictEqual(
            target.url(),
            'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=theblog&ref=main&path=%2F&lookup=https%3A%2F%2Fadobe.sharepoint.com%2F%3Aw%3A%2Fr%2Fsites%2FTheBlog%2F_layouts%2F15%2FDoc.aspx%3Fsourcedoc%3D%257BE8EC80CB-24C3-4B95-B082-C51FD8BC8760%257D%26file%3Dcafebabe.docx%26action%3Ddefault%26mobileredirect%3Dtrue',
            'Staging lookup URL not opened',
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      // open test page and click preview button
      page
        .goto(`${fixturesPrefix}/preview-onedrive.html`, { waitUntil: 'load' })
        .then(() => execPlugin(page, 'preview'));
    });
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Preview plugin opens a new tab with staging URL from production URL', async () => {
    await mockCustomPlugins(page);
    await new Promise((resolve, reject) => {
      // watch for new browser window
      browser.on('targetcreated', async (target) => {
        // check result
        try {
          assert.strictEqual(
            target.url(),
            'https://theblog--adobe.hlx.page/en/topics/bla.html',
            'Staging URL not opened',
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      // open test page and click preview button
      page
        .goto(`${fixturesPrefix}/edit-production.html`, { waitUntil: 'load' })
        .then(() => execPlugin(page, 'preview'));
    });
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Edit plugin opens a new tab with editor lookup URL from staging URL', async () => {
    await mockCustomPlugins(page);
    await new Promise((resolve, reject) => {
      // watch for new browser window
      browser.on('targetcreated', async (target) => {
        // check result
        try {
          assert.strictEqual(
            target.url(),
            'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=theblog&ref=master&path=%2F&edit=https%3A%2F%2Ftheblog--adobe.hlx.page%2Fen%2Ftopics%2Fbla.html',
            'Editor lookup URL not opened',
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      // open test page and click preview button
      page
        .goto(`${fixturesPrefix}/edit-staging.html`, { waitUntil: 'load' })
        .then(() => execPlugin(page, 'edit'));
    });
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Edit plugin opens a new tab with editor lookup URL from production URL', async () => {
    await mockCustomPlugins(page);
    await new Promise((resolve, reject) => {
      // watch for new browser window
      browser.on('targetcreated', async (target) => {
        // check result
        try {
          assert.strictEqual(
            target.url(),
            'https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2?owner=adobe&repo=theblog&ref=master&path=%2F&edit=https%3A%2F%2Fblog.adobe.com%2Fen%2Ftopics%2Fbla.html',
            'Editor lookup URL not opened',
          );
          resolve();
        } catch (e) {
          reject(e);
        }
      });
      // open test page and click preview button
      page
        .goto(`${fixturesPrefix}/edit-production.html`, { waitUntil: 'load' })
        .then(() => execPlugin(page, 'edit'));
    });
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Publish plugin sends purge request from staging URL and redirects to production URL', async () => {
    const actionHost = 'https://adobeioruntime.net';
    const purgePath = '/en/topics/bla.html';
    let purged = false;
    let redirected = false;
    await mockCustomPlugins(page);
    await new Promise((resolve, reject) => {
      page.on('request', async (req) => {
        if (req.url().startsWith(actionHost)) {
          // intercept purge request
          const params = new URL(req.url()).searchParams;
          purged = params.get('path') === purgePath
            && params.get('xfh').split(',').length === 3;
          req.respond({
            status: 200,
            body: JSON.stringify([{ status: 'ok' }]),
          });
        } else if (req.url().startsWith('https://blog.adobe.com/')) {
          redirected = true;
          req.respond({ status: 200, body: '' });
        } else {
          req.continue();
        }
        if (purged && redirected) resolve();
      });
      // open test page and click publish button
      page
        .goto(`${fixturesPrefix}/publish-staging.html`, { waitUntil: 'load' })
        .then(() => execPlugin(page, 'publish'));
      // reject promise before IT time is up
      setTimeout(() => reject(new Error('timed out')), IT_DEFAULT_TIMEOUT - 2000);
    });
    // check result
    assert.ok(purged, 'Purge request not sent');
    assert.ok(redirected, 'Redirect not sent');
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Publish thoroughly purges directories', async () => {
    const actionHost = 'https://adobeioruntime.net';
    const toPurge = ['/de/', '/de/index.html'];
    const allPurged = [];
    // open test page and click publish button
    await page.goto(`${fixturesPrefix}/publish-staging.html`, { waitUntil: 'load' });
    page.on('request', (req) => {
      if (req.url().startsWith(actionHost)) {
        // intercept purge requests
        allPurged.push(new URL(req.url()).searchParams.get('path'));
        req.respond({
          status: 200,
          body: JSON.stringify([{ status: 'ok' }]),
        });
      } else if (req.url().startsWith('https://blog.adobe.com/')) {
        // intercept redirect
        req.respond({ status: 200, body: '' });
      } else {
        req.continue();
      }
    });

    await Promise.all(toPurge.map(async (purgePath) => {
      // modify path to purge
      await page.evaluate((path) => {
        window.hlx.sidekick.location.pathname = path;
      }, purgePath);
      // click publish button
      await execPlugin(page, 'publish');
    }));
    // check result
    assert.deepStrictEqual(allPurged, toPurge.concat(toPurge).reverse(), 'Purge request not sent');
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Publish plugin also purges dependencies', async () => {
    const actionHost = 'https://adobeioruntime.net';
    const purgePath = '/en/topics/foo.html';
    let purged = false;
    await new Promise((resolve, reject) => {
      page.on('request', async (req) => {
        // intercept purge request
        if (req.url().startsWith(actionHost)) {
          const params = new URL(req.url()).searchParams;
          // check result
          purged = params.get('path') === purgePath;
          req.respond({
            status: 200,
            body: JSON.stringify([{ status: 'ok' }]),
          });
        } else if (req.url().startsWith('https://blog.adobe.com/')) {
          req.respond({ status: 200, body: '' });
        } else {
          req.continue();
        }
        if (purged) resolve();
      });
      // open test page and click publish button
      page
        .goto(`${fixturesPrefix}/publish-staging.html`, { waitUntil: 'load' })
        .then(async () => {
          // add dependency
          await page.evaluate((dPath) => {
            window.hlx.dependencies = [dPath];
          }, purgePath);
        })
        .then(() => execPlugin(page, 'publish'));
      // reject promise before IT time is up
      setTimeout(() => reject(new Error('timed out')), IT_DEFAULT_TIMEOUT - 2000);
    });
    assert.ok(purged, 'Purge request not sent');
  }).timeout(IT_DEFAULT_TIMEOUT);

  it('Publish plugin purges inner host only', async () => {
    const actionHost = 'https://adobeioruntime.net';
    const innerHost = 'theblog--adobe.hlx.page';
    await mockCustomPlugins(page);
    await new Promise((resolve, reject) => {
      page.on('request', async (req) => {
        // intercept purge request
        if (req.url().startsWith(actionHost)) {
          const params = new URL(req.url()).searchParams;
          // check result
          try {
            assert.strictEqual(params.get('xfh'), innerHost, 'Did not purge inner host only');
            resolve();
          } catch (e) {
            reject(e);
          } finally {
            req.respond({
              status: 200,
              body: JSON.stringify([{ status: 'ok' }]),
            });
          }
        } else {
          req.continue();
        }
      });
      // open test page and click publish button
      page
        .goto(`${fixturesPrefix}/publish-staging.html`, { waitUntil: 'load' })
        .then(async () => {
          // add dependencies
          await page.evaluate(() => {
            // remove production host from config
            delete window.hlx.sidekick.config.host;
          });
        })
        .then(() => execPlugin(page, 'publish'));
    });
  }).timeout(IT_DEFAULT_TIMEOUT);
});

describe('makeHostHelixCompliant', () => {
  // TODO: move to proper unit test in order to use original funtion
  // this is a copy of function in sidekick/app.js
  const makeHostHelixCompliant = (ahost) => {
    if (ahost.match(/^.*?--.*?--.*?\./gm)) {
      return ahost;
    }
    return ahost
      .replace(/^([^-.]+)-([^-.]+)-([^-.]+)\./gm, '$1-$2--$3.')
      .replace(/^([^-.]+)-([^-.]+)\./gm, '$1--$2.');
  };

  it('Test makeHostHelixCompliant', () => {
    assert.strictEqual(makeHostHelixCompliant('repo-owner.hlx.page'), 'repo--owner.hlx.page');
    assert.strictEqual(makeHostHelixCompliant('repo-owner.hlx-1.page'), 'repo--owner.hlx-1.page');

    assert.strictEqual(makeHostHelixCompliant('branch--repo--owner.hlx.page'), 'branch--repo--owner.hlx.page');
    assert.strictEqual(makeHostHelixCompliant('branch--repo--owner.hlx-1.page'), 'branch--repo--owner.hlx-1.page');

    assert.strictEqual(makeHostHelixCompliant('branch-dash--repo--owner.hlx.page'), 'branch-dash--repo--owner.hlx.page');
    assert.strictEqual(makeHostHelixCompliant('branch-dash--repo--owner.hlx-1.page'), 'branch-dash--repo--owner.hlx-1.page');

    assert.strictEqual(makeHostHelixCompliant('repo-dash--owner.hlx.page'), 'repo-dash--owner.hlx.page');
    assert.strictEqual(makeHostHelixCompliant('repo-dash--owner.hlx-1.page'), 'repo-dash--owner.hlx-1.page');

    assert.strictEqual(makeHostHelixCompliant('repo-dash-owner.hlx.page'), 'repo-dash--owner.hlx.page');
    assert.strictEqual(makeHostHelixCompliant('repo-dash-owner.hlx-1.page'), 'repo-dash--owner.hlx-1.page');

    assert.strictEqual(makeHostHelixCompliant('branch--repo-dash--owner.hlx.page'), 'branch--repo-dash--owner.hlx.page');
    assert.strictEqual(makeHostHelixCompliant('branch--repo-dash--owner.hlx-1.page'), 'branch--repo-dash--owner.hlx-1.page');

    assert.strictEqual(makeHostHelixCompliant('branch-dash--repo-dash--owner.hlx.page'), 'branch-dash--repo-dash--owner.hlx.page');
    assert.strictEqual(makeHostHelixCompliant('branch-dash--repo-dash--owner.hlx-1.page'), 'branch-dash--repo-dash--owner.hlx-1.page');
  });
});
