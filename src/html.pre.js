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
const { getAbsoluteUrl, wrapContent } = require('./utils.js');

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param context The current context of processing pipeline
 * @param context.content The content
 */
function pre(context) {
  const { request, content } = context;
  const { document } = content;
  const $sections = document.querySelectorAll('body > div');

  // Expose the html & body attributes so they can be used in the HTL
  [document.documentElement, document.body].forEach((el) => {
    el.attributesMap = [...el.attributes].reduce((map, attr) => {
      map[attr.name] = attr.value;
      return map;
    }, {});
  });

  // if there are no sections wrap everything in a div
  // with appropriate class names from meta
  if ($sections.length === 0) {
    const div = document.createElement('div');
    if (context.content.meta && context.content.meta.class) {
      context.content.meta.class.split(/[ ,]/)
        .map((c) => c.trim())
        .filter((c) => !!c)
        .forEach((c) => {
          div.classList.add(c);
        });
    }
    wrapContent(div, document.body);
  }

  // ensure content.data is present
  content.data = content.data || {};

  // extract metadata
  const { meta = {} } = content;
  // description: text from paragraphs with 10 or more words
  let desc = [];
  document.querySelectorAll('div > p').forEach((p) => {
    if (desc.length === 0) {
      const words = p.textContent.trim().split(/\s+/);
      if (words.length >= 10) {
        desc = desc.concat(words);
      }
    }
  });
  meta.description = `${desc.slice(0, 25).join(' ')}${desc.length > 25 ? ' ...' : ''}`;
  meta.url = getAbsoluteUrl(request.headers, request.url);
  meta.imageUrl = getAbsoluteUrl(request.headers, content.image || '/default-meta-image.png');
}

module.exports.pre = pre;
