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
const fetchMetadata = require('./fetch-metadata.js');
const extractMetaData = require('./extract-metadata.js');

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param {object} context The current context of processing pipeline
 * @param {object} action The action
 */
async function pre(context, action) {
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
  await extractMetaData(context, action);
}

pre.before = { content: fetchMetadata };
module.exports.pre = pre;
