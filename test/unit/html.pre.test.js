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
const { logging } = require('@adobe/helix-testutils');
const { JSDOM } = require('jsdom');

const { pre } = require('../../src/html.pre.js');

const request = {
  headers: {
    host: 'foo.bar',
    'hlx-forwarded-host': 'www.foo.bar, foo-baz.hlx.page',
  },
  url: '/foo/bar/baz.html',
};
const action = {
  request: {
    owner: 'test',
    repo: 'test',
    ref: 'main',
  },
  downloader: {
    fetchGithub: async () => ({ status: 200 }),
    fetch: async () => ({ status: 200 }),
  },
  logger: logging.createTestLogger({ level: 'debug' }),
};

describe('Testing pre requirements for main function', () => {
  it('Exports pre', () => {
    assert.ok(pre);
  });

  it('pre is a function', () => {
    assert.strictEqual('function', typeof pre);
  });
});

describe('Testing pre.js', () => {
  it('Body content is wrapped in a div', async () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const context = {
      content: {
        document: dom.window.document,
      },
      request,
    };
    await pre(context, action);

    const div = dom.window.document.querySelector('div');
    assert.ok(div, 'A div must have been added');
    assert.strictEqual(div.innerHTML, '<h1>Title</h1>');
  });

  it('Multiline and text node body content is wrapped in a div', async () => {
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
    await pre(context, action);

    const div = dom.window.document.querySelector('div');
    assert.ok(div !== null, 'A div must have been added');
    assert.strictEqual(dom.window.document.body.childNodes.length, 1, 'Body must have only one child');
    assert.strictEqual(div.innerHTML, `
      <h1>Title</h1>
      This is a text.
    `);
  });

  it('Div is wrapped with class name', async () => {
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
    await pre(context, action);

    const div = dom.window.document.querySelector('div');
    assert.ok(div.classList.contains('customcssclass'));
  });

  it('Div is wrapped with multiple class names', async () => {
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
    await pre(context, action);

    const div = dom.window.document.querySelector('div');
    assert.ok(div.classList.contains('customcssclass'));
    assert.ok(div.classList.contains('customcssclass2'));
  });

  it('Div is wrapped with multiple class names even when space separated', async () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {
          class: 'customcssclass customcssclass2',
        },
      },
      request,
    };
    await pre(context, action);

    const div = dom.window.document.querySelector('div');
    assert.ok(div.classList.contains('customcssclass'));
    assert.ok(div.classList.contains('customcssclass2'));
  });

  it('Section divs are left alone', async () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><div class="customcssclass"><h1>Title</h1></div></body></html>');
    const context = {
      content: {
        document: dom.window.document,
      },
      request,
    };
    await pre(context, action);

    const div = dom.window.document.querySelector('div');
    assert.ok(div.classList.contains('customcssclass'));
  });

  it('Image tags get transformed to picture tags', async () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><div><img src="./media_dd76df9c9b121fec5f1b6bc39481247a1f756139.png"></div></body></html>');
    const context = {
      content: {
        document: dom.window.document,
      },
      request,
    };
    await pre(context, action);
    const { documentElement: doc } = context.content.document;
    assert.ok(doc.querySelector('picture'), 'Picture tag missing');
    assert.strictEqual(
      doc.querySelector('picture').innerHTML,
      '<source media="(max-width: 400px)" srcset="./media_dd76df9c9b121fec5f1b6bc39481247a1f756139.png?width=750&amp;format=webply&amp;optimize=medium"><img src="./media_dd76df9c9b121fec5f1b6bc39481247a1f756139.png?width=2000&amp;format=webply&amp;optimize=medium" loading="eager">',
      'Image tag not transformed correctly',
    );
  });

  it('Meta data is extracted from content', async () => {
    const dom = new JSDOM(`
    <div class="metadata">
      <div>
        <div>Title</div><div>Foo Bar</div>
      </div>
      <div>
        <div>Description</div><div>Lorem ipsum dolor sit amet</div>
      </div>
      <div>
        <div>Keywords</div><div>Foo, Bar, Baz</div>
      </div>
      <div>
        <div>Image</div><div>https://foo.bar/baz.jpg</div>
      </div>
    </div>
    <div>
      <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.</p>
    </div>
    `);
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    await pre(context, action);

    assert.strictEqual(context.content.meta.title, 'Foo Bar');
    assert.strictEqual(context.content.meta.description, 'Lorem ipsum dolor sit amet');
    assert.deepStrictEqual(context.content.meta.keywords, 'Foo, Bar, Baz');
    assert.strictEqual(context.content.meta.image, 'https://foo.bar/baz.jpg');
    assert.ok(!context.content.document.querySelector('.metadata'), 'Metadata block not removed');
  });

  it('Meta keywords and tags can be comma- and/or line-separated', async () => {
    const dom = new JSDOM(`
    <div class="metadata">
      <div>
        <div>Keywords</div>
        <div>Foo, ,,Bar, Baz   One   Two   Three</div>
      </div>
      <div>
        <div>Tags</div>
        <div>Foo, Bar, Baz   One      Two   Three</div>
      </div>
    </div>
    `);
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    await pre(context, action);

    assert.strictEqual(context.content.meta.keywords, 'Foo, Bar, Baz, One, Two, Three');
    assert.deepStrictEqual(context.content.meta.tags, ['Foo', 'Bar', 'Baz', 'One', 'Two', 'Three']);
  });

  it('Custom meta data is preserved', async () => {
    const dom = new JSDOM(`
    <div class="metadata">
      <div>
        <div>Foo</div>
        <div>Bar</div>
      </div>
      <div>
        <div>og:locale</div>
        <div>en_UK</div>
      </div>
    </div>
    `);
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    await pre(context, action);

    // eslint-disable-next-line no-underscore-dangle
    assert.deepStrictEqual(context.content.meta.custom, [
      { name: 'foo', value: 'Bar', property: false },
      { name: 'og:locale', value: 'en_UK', property: true },
    ]);
  });

  it('Meta image is extracted from link', async () => {
    const dom = new JSDOM(`
    <div class="metadata">
      <div><div>Image</div><div><a href="https://foo.bar/baz.jpg"></a></div></div>
    </div>
    `);
    const context = {
      content: {
        document: dom.window.document,
        image: 'https://foo.bar/baz.jpg',
        meta: {},
      },
      request,
    };
    await pre(context, action);

    assert.strictEqual(context.content.meta.image, 'https://foo.bar/baz.jpg');
    assert.ok(!context.content.document.querySelector('.metadata'), 'Metadata block not removed');
  });

  it('Meta image is extracted from image tag and optimized', async () => {
    const expectedUrl = 'https://www.foo.bar/foo/bar/media_d6675ca179a0837756ceebe7f93aba2f14dabde.jpeg?auto=webp&format=pjpg&optimize=medium&width=1200';
    const dom = new JSDOM(`
    <div class="metadata">
      <div>
        <div>Image</div>
        <div>
          <picture>
            <source media="(max-width: 400px)" srcset="./media_d6675ca179a0837756ceebe7f93aba2f14dabde.jpeg?width=750&amp;format=webply&amp;optimize=medium">
            <img src="./media_d6675ca179a0837756ceebe7f93aba2f14dabde.jpeg?width=2000&amp;format=webply&amp;optimize=medium" alt="" loading="eager">
          </picture>
        </div>
      </div>
    </div>
    `);
    const context = {
      content: {
        document: dom.window.document,
        image: 'https://foo.bar/baz.jpg',
        meta: {},
      },
      request,
    };
    await pre(context, action);

    assert.strictEqual(context.content.meta.image, expectedUrl);
    assert.ok(!context.content.document.querySelector('.metadata'), 'Metadata block not removed');
  });

  it('Meta description is extracted from first <p> with 10 or more words', async () => {
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
    await pre(context, action);

    assert.ok(context.content.meta.description);
    assert.strictEqual(context.content.meta.description, gt10Words);
  });

  it('Meta description is truncated after 25 words', async () => {
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
    await pre(context, action);

    assert.strictEqual(context.content.meta.description.split(' ').length, 26); // 25 words + ...
    assert.ok(context.content.meta.description.endsWith('...'));
  });

  it('Meta description does not contain markup', async () => {
    const dom = new JSDOM(`
    <html>
      <head>
        <title>Foo</title>
      </head>
      <body>
        <div><p>Lorem ipsum <b>dolor</b> sit <a href="https://www.hlx.page/">amet</a>, consectetuer adipiscing elit, sed diam nonummy nibh.</p></div>
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
    await pre(context, action);

    assert.strictEqual(context.content.meta.description, 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh.'); // 25 words + ...
  });

  it('Meta url uses hlx-forwarded-host header if available', async () => {
    const dom = new JSDOM('<html></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    await pre(context, action);

    assert.strictEqual(context.content.meta.url, 'https://www.foo.bar/foo/bar/baz.html');
  });

  it('Meta url uses host header if no hlx-forwarded-host available', async () => {
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
    await pre(context, action);

    assert.strictEqual(context.content.meta.url, 'https://foo.bar/foo/bar/baz.html');
  });

  it('Meta url does not enforce html extension', async () => {
    const noExtRequest = {
      ...request,
      url: '/foo/bar/baz',
      headers: {
        ...request.headers,
        'x-old-url': '/foo/bar/baz',
      },
    };
    const dom = new JSDOM('<html></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request: noExtRequest,
    };
    await pre(context, action);

    assert.strictEqual(context.content.meta.url, 'https://www.foo.bar/foo/bar/baz');
  });

  it('Meta image uses absolute content.image', async () => {
    const dom = new JSDOM('<html></html');
    const context = {
      content: {
        document: dom.window.document,
        image: 'https://foo.bar/baz.jpg',
        meta: {},
      },
      request,
    };
    await pre(context, action);

    assert.strictEqual(context.content.meta.image, context.content.image);
  });

  it('Meta image uses and optimizes relative content.image as absolute URL', async () => {
    const expectedUrl = 'https://www.foo.bar/foo/bar/media_d6675ca179a0837756ceebe7f93aba2f14dabde.jpeg?auto=webp&format=pjpg&optimize=medium&width=1200';
    const dom = new JSDOM('<html></html>');
    const context = {
      content: {
        document: dom.window.document,
        image: './media_d6675ca179a0837756ceebe7f93aba2f14dabde.jpeg',
        meta: {},
      },
      request,
    };
    await pre(context, action);

    assert.strictEqual(context.content.meta.image, expectedUrl);
  });

  it('Meta image uses JPG from repo if no content.image available', async () => {
    const dom = new JSDOM('<html></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    await pre(context, action);

    assert.strictEqual(context.content.meta.image, 'https://www.foo.bar/default-meta-image.jpg?auto=webp&format=pjpg&optimize=medium&width=1200');
  });

  it('Meta image uses default meta image if neither content.image nor JPG from repo available', async () => {
    const dom = new JSDOM('<html></html>');
    const context = {
      content: {
        document: dom.window.document,
        meta: {},
      },
      request,
    };
    await pre(context, {
      ...action,
      downloader: {
        fetchGithub: async () => ({ status: 404 }),
      },
    });

    assert.strictEqual(context.content.meta.image, 'https://www.foo.bar/default-meta-image.png?auto=webp&format=pjpg&optimize=medium&width=1200');
  });

  it('Exposes body attributes as a map to be consumed in the HTL', async () => {
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
    await pre(context, action);

    assert.deepStrictEqual(dom.window.document.documentElement.attributesMap, {
      class: 'foo',
      bar: 'baz',
      'data-qux': 'corge',
    });
    assert.deepStrictEqual(dom.window.document.body.attributesMap, {
      class: 'grault',
      garply: 'waldo',
      'data-fred': 'plugh',
    });
  });
});
