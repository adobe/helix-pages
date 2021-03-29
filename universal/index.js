/*
 * Copyright 2021 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const { Response } = require('@adobe/helix-fetch');

/*

NOTE:
  this is currently not used.
  this serves as an example how to easily create a multi-script action.

*/

/* eslint-disable global-require */
const scripts = {
  embed_html: require('../.hlx/build/src/embed_html.js'),
  html: require('../.hlx/build/src/html.js'),
  plain_html: require('../.hlx/build/src/plain_html.js'),
  'cgi-bin-feed': require('../cgi-bin/feed.js'),
};

/**
 * Universal function the dispatches the request to the respective script.
 * @param req
 * @param context
 * @returns {Promise<void>}
 */
async function main(req, context) {
  const { pathInfo } = context;
  const sel = pathInfo && pathInfo.suffix;
  const script = sel ? scripts[sel.substring(1)] : null;
  if (!script) {
    return new Response(`${sel} not found`, {
      status: 404,
    });
  }
  return script.main(req, context);
}

module.exports.main = main;
