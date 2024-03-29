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
const fetchMetadata = require('./fetch-metadata.js');
const preHTML = require('./html.pre').pre;

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param context The current context of processing pipeline
 * @param context.content The content
 */
async function pre(context, action) {
  await preHTML(context, action);

  const [filename, dirname] = context.request.pathInfo.split('/').reverse();
  const [basename] = filename.split('.');
  context.content.meta.basename = (basename || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  context.content.meta.dirname = (dirname || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

module.exports = {
  pre,
  before: {
    content: fetchMetadata,
  },
};
