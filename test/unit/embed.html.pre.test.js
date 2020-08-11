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

const { pre } = require('../../src/embed_html.pre.js');

describe('Testing pre requirements for main function', () => {
  it('Exports pre', () => {
    assert.ok(pre);
  });

  it('pre is a function', () => {
    assert.equal('function', typeof pre);
  });
});

describe('Testing pre.js', () => {
  it('Basename stays cool', () => {
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

    pre(context);
    assert.equal(context.content.meta.basename, 'foo');
  });

  it('Basename stays cool even with special chars', () => {
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

    pre(context);
    assert.equal(context.content.meta.basename, 'foo');
  });

  it('Dirname gets extracted, too', () => {
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

    pre(context);
    assert.equal(context.content.meta.basename, 'xyz');
    assert.equal(context.content.meta.dirname, 'promotions');
  });

  it('Null test', () => {
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

    pre(context);
    assert.equal(context.content.meta.basename, '');
    assert.equal(context.content.meta.dirname, '');
  });
});
