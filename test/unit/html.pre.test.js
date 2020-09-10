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
    'hlx-forwarded-host': 'www.foo.bar, foo-baz.hlx.page',
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
    assert.ok(div, 'A div must have been added');
    assert.equal(div.innerHTML, '<h1>Title</h1>');
  });

  it('Mutliline and text node body content is wrapped in a div', () => {
    const dom = new JSDOM(`<html><head><title>Foo</title></head><body>
      <h1>Title</h1>
      This is a text.
    </body></html>`);
    const context = {
      content: {
        document: dom.window.document,
      },
      request,
    };
    pre(context);

    const div = dom.window.document.querySelector('div');
    assert.ok(div !== null, 'A div must have been added');
    assert.equal(dom.window.document.body.childNodes.length, 1, 'Body must have only one child');
    assert.equal(div.innerHTML, `
      <h1>Title</h1>
      This is a text.
    `);
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
    assert.ok(div.classList.contains('customcssclass'));
    assert.ok(div.classList.contains('customcssclass2'));
  });

  it('Section divs are left alone', () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><div class="customcssclass"><h1>Title</h1></div></body></html>');
    const context = {
      content: {
        document: dom.window.document,
      },
      request,
    };
    pre(context);

    const div = dom.window.document.querySelector('div');
    assert.ok(div.classList.contains('customcssclass'));
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

  it('Meta url uses hlx-forwarded-host header if available', () => {
    const dom = new JSDOM('<html></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    pre(context);

    assert.equal(context.content.meta.url, `https://${request.headers['hlx-forwarded-host'].split(',')[0].trim()}${request.url}`);
  });

  it('Meta url uses host header if no hlx-forwarded-host available', () => {
    const req = {
      ...request,
      headers: {
        ...request.headers,
        'hlx-forwarded-host': undefined,
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

    assert.equal(context.content.meta.url, `https://${req.headers.host}${req.url}`);
  });

  it('Meta imageUrl uses content.image', () => {
    const dom = new JSDOM('<html></html');
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

  it('Meta imageUrl uses content.image as absolute URL', () => {
    const dom = new JSDOM('<html></html>');
    const context = {
      content: {
        document: dom.window.document,
        image: '/baz.jpg',
        meta: {},
      },
      request,
    };
    pre(context);

    assert.equal(context.content.meta.imageUrl, `https://${request.headers['hlx-forwarded-host'].split(',')[0].trim()}${context.content.image}`);
  });

  it('Meta imageUrl uses default meta image if no content.image available', () => {
    const dom = new JSDOM('<html></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    pre(context);

    assert.equal(context.content.meta.imageUrl, `https://${request.headers['hlx-forwarded-host'].split(',')[0].trim()}/default-meta-image.png`);
  });

  it('Exposes body attributes as a map to be consumed in the HTL', () => {
    const dom = new JSDOM(
      `<html class="foo" bar="baz" data-qux="corge">
        <body class="grault" garply="waldo" data-fred="plugh">
          <div class="default">
            <h1>Grault</h1>
            <p>Garply</p>
          </div>
        </body>
      </html>`,
    );
    const context = {
      content: {
        document: dom.window.document,
      },
      request,
    };
    pre(context);

    assert.deepEqual(dom.window.document.documentElement.attributesMap, {
      class: 'foo',
      bar: 'baz',
      'data-qux': 'corge',
    });
    assert.deepEqual(dom.window.document.body.attributesMap, {
      class: 'grault',
      garply: 'waldo',
      'data-fred': 'plugh',
    });
  });
});
