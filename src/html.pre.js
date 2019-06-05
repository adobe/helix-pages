/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
const jquery = require('jquery');

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param context The current context of processing pipeline
 * @param context.content The content
 */
function pre(context) {
  const document = context.content.document;
  const $ = jquery(document.defaultView);

  /* workaround until sections in document are fixed via PR on pipeline */
  let currentCollection = [];
  let sections = [];

  document.body.childNodes.forEach((child) => {
    if (child.tagName === "HR") {
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

  document.querySelectorAll("body>hr").forEach((el) => {
    el.parentNode.removeChild(el)
  });
  /* end of workaround */

  const $sections = $(document).find('div.section');

  // sections with an image
  $sections
    .has(':first-child>img')
    .addClass('image')

  // first section has a starting image: add title class and wrap all subsequent items inside a div
  $sections
    .first()
    .has('p:first-child>img')
    .addClass('title')
    .find(':nth-child(1n+2)')
    .wrapAll('<div class="header"></div>');

  // sections without image and title class gets a default class
  $sections
    .not('.image')
    .not('.title')
    .addClass('default');
}

module.exports.pre = pre;
