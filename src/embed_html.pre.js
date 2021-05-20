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
const fixSections = require('./fix-sections.js');
const createPageBlocks = require('./create-page-blocks.js');
const createPictures = require('./create-pictures.js');

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param context The current context of processing pipeline
 * @param context.content The content
 */
async function pre(context) {
  const { content } = context;
  const { document } = content;

  // Expose the html & body attributes so they can be used in the HTL
  [document.documentElement, document.body].forEach((el) => {
    el.attributesMap = [...el.attributes].reduce((map, attr) => {
      map[attr.name] = attr.value;
      return map;
    }, {});
  });
  // ensure content.data is present
  content.data = content.data || {};

  fixSections(context);
  createPageBlocks(context);
  createPictures(context);

  const [filename, dirname] = context.request.pathInfo.split('/').reverse();
  const [basename] = filename.split('.');
  context.content.meta.basename = (basename || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  context.content.meta.dirname = (dirname || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

module.exports = {
  pre,
};
