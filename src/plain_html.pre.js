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
/* eslint-disable no-param-reassign */
const jquery = require('jquery');

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param context The current context of processing pipeline
 * @param context.content The content
 */
function pre(context) {
  const { document } = context.content;
  const $ = jquery(document.defaultView);

  /* cache killer */
  context.response = context.response || {};
  context.response.headers = context.response.headers || {};
  context.response.headers['Cache-Control'] = 'no-cache';
  context.response.headers['Surrogate-Control'] = 'max-age=0';
  /* end of cache killer */

  /* workaround until sections in document are fixed via PR on pipeline */
  let currentCollection = [];
  const sections = [];

  document.body.childNodes.forEach((child) => {
    if (child.tagName === 'HR') {
      sections.push(currentCollection);
      currentCollection = [];
    } else {
      currentCollection.push(child);
    }
  });

  sections.push(currentCollection);
  sections.forEach((el) => {
    $(el).wrapAll('<div class="section"></div>');
  });

  document.querySelectorAll('body>hr').forEach((el) => {
    el.parentNode.removeChild(el);
  });
  /* end of workaround */
}

module.exports.pre = pre;
