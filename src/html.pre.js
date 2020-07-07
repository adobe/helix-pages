/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const jquery = require('jquery');
const { getAbsoluteUrl } = require('./utils.js');

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param context The current context of processing pipeline
 * @param context.content The content
 */
function pre(context) {
  const { request, content } = context;
  const { document } = content;
  const $ = jquery(document.defaultView);

  // if there is only a single child, merge its properties on the body node
  // and attach its children directly to the body
  document.body.attributesMap = {};
  if (document.body.children.length === 1 && document.body.children[0].nodeName === 'DIV') {
    const rootElement = document.body.children[0];
    // Merge the root element properties onto the body element
    [...rootElement.attributes].forEach((attr) => {
      document.body.attributesMap[attr.name] = attr.value;
    });
    // Re-attach root element children directly to the body
    [...rootElement.children].forEach((child) => document.body.appendChild(child));
    document.body.removeChild(rootElement);
  }

  let $sections = $(document.body).children('div');

  // first section has a starting image: add title class and wrap all subsequent items inside a div
  $sections
    .first()
    .has('p:first-child>img')
    .addClass('title')
    .find(':nth-child(1n+2)')
    .wrapAll('<div class="header"></div>');

  // sections consisting of only one image
  $sections
    .filter('[data-hlx-types~="has-only-image"]')
    .not('.title')
    .addClass('image');

  // sections without image and title class gets a default class
  $sections
    .not('.image')
    .not('.title')
    .addClass('default');

  // if there are no sections wrap everything in a default div
  // with appropriate class names from meta
  if ($sections.length === 0) {
    const div = $('<div>').addClass('default');
    if (context.content.meta && context.content.meta.class) {
      context.content.meta.class.split(',').forEach((c) => {
        div.addClass(c.trim());
      });
    }
    $(document.body).children().wrapAll(div);
    $sections = $(document.body).children('div');
  }

  // ensure content.data is present
  content.data = content.data || {};

  // extract metadata
  const { meta = {} } = content;
  // description: text from paragraphs with 10 or more words
  let match = false;
  const desc = $sections
    .find('p')
    .map(function exractWords() {
      if (match) {
        // already found paragraph for description
        return null;
      }
      const words = $(this).text().trim().split(/\s+/);
      if (words.length < 10) {
        // skip paragraphs with less than 10 words
        return null;
      }
      match = true;
      return words;
    })
    .toArray();
  meta.description = `${desc.slice(0, 25).join(' ')}${desc.length > 25 ? ' ...' : ''}`;
  meta.url = getAbsoluteUrl(request.headers, request.url);
  meta.imageUrl = getAbsoluteUrl(request.headers, content.image || '/default-meta-image.png');
}

module.exports.pre = pre;
