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

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param context The current context of processing pipeline
 * @param context.content The content
 */
function pre(context) {
  const { request, content } = context;
  const { document } = content;
  const $ = jquery(document.defaultView);

  const $sections = $(document.body).children('div');

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
  }

  // ensure content.data is present
  content.data = content.data || {};

  // extract metadata
  const { meta = {} } = content;
  // description: text from paragraphs with 10 or more words
  const desc = $sections
    .filter('.default')
    .find('p')
    .filter(function minLength() {
      return $(this).text().split(' ').length >= 10;
    })
    .text()
    .trim();
  // truncate after 25 words
  const words = desc.split(' ');
  meta.description = words.length > 25 ? `${words.slice(0, 25).join(' ')} ...` : desc;
  // url: use outer CDN URL if possible
  meta.url = request.headers['x-cdn-url'] || `https://${request.headers.host}${request.url}`;
  meta.imageUrl = content.image;
}

module.exports.pre = pre;
