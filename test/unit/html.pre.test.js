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

const { pre } = require('../../src/html.pre.js');

const request = {
  headers: {
    host: 'foo.bar',
    'x-hlx-pages-host': 'www.foo.bar',
    'x-cdn-url': 'https://www.baz.bar/baz.html',
  },
  url: '/baz.html',
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
  it('Body content is wrapped in a div', () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const context = {
      content: {
        document: dom.window.document,
      },
      request,
    };
    pre(context);

    const div = dom.window.document.querySelector('div');
    assert.ok('A div must have been added', div);
    assert.equal(div.innerHTML, '<h1>Title</h1>');
    assert.ok(div.classList.contains('default'));
  });

  it('Div is wrapped with class name', () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {
          class: 'customcssclass',
        },
      },
      request,
    };
    pre(context);

    const div = dom.window.document.querySelector('div');
    assert.ok(div.classList.contains('default'));
    assert.ok(div.classList.contains('customcssclass'));
  });

  it('Div is wrapped with multiple class names', () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {
          class: 'customcssclass, customcssclass2',
        },
      },
      request,
    };
    pre(context);

    const div = dom.window.document.querySelector('div');
    assert.ok(div.classList.contains('default'));
    assert.ok(div.classList.contains('customcssclass'));
    assert.ok(div.classList.contains('customcssclass2'));
  });

  it('Meta description is extracted from first <p> with 10 or more words', () => {
    const lt10Words = 'Lorem ipsum dolor sit amet.';
    const gt10Words = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.';
    const dom = new JSDOM(`
    <html>
      <head>
        <title>Foo</title>
      </head>
      <body>
        <div><h1>Title</h1></div>
        <div><p>${lt10Words}</p></div>
        <div><p>${gt10Words}</p></div>
      </body>
    </html>`);
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    pre(context);

    assert.ok(context.content.meta.description);
    assert.equal(context.content.meta.description, gt10Words);
  });

  it('Meta description is truncated after 25 words', () => {
    const desc = 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat. Ut wisi enim ad minim veniam, quis nostrud exerci tation ullamcorper suscipit lobortis nisl ut aliquip ex ea commodo consequat.';
    const dom = new JSDOM(`
    <html>
      <head>
        <title>Foo</title>
      </head>
      <body>
        <div><p>${desc}</p></div>
      </body>
    </html>
    `);
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    pre(context);

    assert.equal(context.content.meta.description.split(' ').length, 26); // 25 words + ...
    assert.ok(context.content.meta.description.endsWith('...'));
  });

  it('Meta url uses x-hlx-pages-host if available', () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body></body></html');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    pre(context);

    assert.ok(context.content.meta.url);
    assert.equal(context.content.meta.url, `https://${context.request.headers['x-hlx-pages-host']}${context.request.url}`);
  });

  it('Meta url uses x-cdn-url header if no x-hlx-pages-host available', () => {
    const req = {
      ...request,
      headers: {
        ...request.headers,
        'x-hlx-pages-host': undefined,
      },
    };
    const dom = new JSDOM('<html><head><title>Foo</title></head><body></body></html');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request: req,
    };
    pre(context);

    assert.equal(context.content.meta.url, req.headers['x-cdn-url']);
  });

  // switched from absolute to relative URL as a workaround for https://github.com/adobe/helix-pages/issues/284
  it('Meta canonical url uses relative URL', () => {
    const req = {
      ...request,
      headers: {
        ...request.headers,
        'x-cdn-url': undefined,
        'x-hlx-pages-host': undefined,
      },
    };
    const dom = new JSDOM('<html><head><title>Foo</title></head><body></body></html');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request: req,
    };
    pre(context);

    assert.equal(context.content.meta.canonicalUrl, req.url);
  });

  it('Meta imageUrl uses content.image', () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body></body></html');
    const context = {
      content: {
        document: dom.window.document,
        image: 'https://foo.bar/baz.jpg',
        meta: {},
      },
      request,
    };
    pre(context);

    assert.equal(context.content.meta.imageUrl, context.content.image);
  });
});
