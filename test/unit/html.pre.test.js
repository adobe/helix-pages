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
    };
    pre(context);

    const div = dom.window.document.querySelector('div');
    assert.ok(div.classList.contains('default'));
    assert.ok(div.classList.contains('customcssclass'));
    assert.ok(div.classList.contains('customcssclass2'));
  });
});
