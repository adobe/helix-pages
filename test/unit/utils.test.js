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

const { wrapContent } = require('../../src/utils.js');

describe('Testing wrapNodes', () => {
  it('Wraps one element in one div', () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>Title</h1></body></html>');
    const document = dom.window.document;

    const div = document.createElement('div');
    wrapContent(div, document.body);

    assert.equal(document.body.innerHTML, '<div><h1>Title</h1></div>');
  });

  it('Wraps multiple elements in one div', () => {
    const dom = new JSDOM('<html><head><title>Foo</title></head><body><h1>T1</h1><h1>T2</h1><h1>T3</h1></body></html>');
    const document = dom.window.document;

    const div = document.createElement('div');
    wrapContent(div, document.body);

    assert.equal(document.body.innerHTML, '<div><h1>T1</h1><h1>T2</h1><h1>T3</h1></div>');
  });

  it('Wraps elements including line breaks in one div', () => {
    const dom = new JSDOM(`<html><head><title>Foo</title></head><body>
      <h1>T1</h1>
      Some text
      <h1>T2</h1>
      Some more text
      <h1>T3</h1>
      Final text
      <div>A div</div>
    </body></html>`);
    const document = dom.window.document;

    const div = document.createElement('div');
    wrapContent(div, document.body);

    assert.equal(document.body.innerHTML, `<div>
      <h1>T1</h1>
      Some text
      <h1>T2</h1>
      Some more text
      <h1>T3</h1>
      Final text
      <div>A div</div>
    </div>`);
  });
});
