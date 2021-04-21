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
/* global describe, it */
const assert = require('assert');
const { JSDOM } = require('jsdom');
const { logging } = require('@adobe/helix-testutils');

const { pre } = require('../../src/embed_html.pre.js');

const action = {
  request: {
    owner: 'test',
    repo: 'test',
    ref: 'main',
  },
  downloader: {
    fetchGithub: async () => ({ status: 200 }),
    fetch: async () => {},
    getTaskById: async () => ({ status: 404 }),
  },
  logger: logging.createTestLogger({ level: 'debug' }),
};

describe('Testing pre requirements for main function', () => {
  it('Exports pre', () => {
    assert.ok(pre);
  });

  it('pre is a function', () => {
    assert.equal('function', typeof pre);
  });
});

describe('Testing pre.js', () => {
  it('Basename stays cool', async () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request: {
        headers: {
          host: 'foo.bar',
          'hlx-forwarded-host': 'www.foo.bar, foo-baz.hlx.page',
        },
        url: '/baz.html',
        pathInfo: '/components/foo.bar.html',
      },
    };

    await pre(context, action);
    assert.equal(context.content.meta.basename, 'foo');
    assert.equal(context.content.meta.dirname, 'components');
  });

  it('Basename stays cool even with special chars', async () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request: {
        headers: {
          host: 'foo.bar',
          'hlx-forwarded-host': 'www.foo.bar, foo-baz.hlx.page',
        },
        url: '/baz.html',
        pathInfo: '/components/FOO<>.bar.html',
      },
    };

    await pre(context, action);
    assert.equal(context.content.meta.basename, 'foo');
    assert.equal(context.content.meta.dirname, 'components');
  });

  it('Dirname gets extracted, too', async () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request: {
        headers: {
          host: 'foo.bar',
          'hlx-forwarded-host': 'www.foo.bar, foo-baz.hlx.page',
        },
        url: '/baz.html',
        pathInfo: '/en/promotions/xyz.html',
      },
    };

    await pre(context, action);
    assert.equal(context.content.meta.basename, 'xyz');
    assert.equal(context.content.meta.dirname, 'promotions');
  });

  it('Null test', async () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request: {
        headers: {
          host: 'foo.bar',
          'hlx-forwarded-host': 'www.foo.bar, foo-baz.hlx.page',
        },
        url: '/baz.html',
        pathInfo: '',
      },
    };

    await pre(context, action);
    assert.equal(context.content.meta.basename, '');
    assert.equal(context.content.meta.dirname, '');
  });
});
