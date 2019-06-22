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

const rp = require('request-promise-native');

/**
 * Tries to load the respective raw resource from the content repository. This is to
 * workaround an issue in the order the Fastly logic executes the templates.
 */
async function preFetch(context, { secrets = {}, request, logger }) {
  // logger.info(JSON.stringify(secrets, null, 2));
  const {
    owner, repo, path, ref, extension, selector,
  } = request.params;
  if (!path.endsWith('.md')) {
    return;
  }
  const rootUrl = secrets.REPO_RAW_ROOT || 'https://raw.githubusercontent.com/';
  const sel = selector ? `.${selector}` : '';
  const htmlPath = `${owner}/${repo}/${ref}/${path.substring(0, path.length - 3)}${sel}.${extension}`.replace(/\/+/g, '/');
  const url = `${rootUrl}${htmlPath}`;
  logger.info(`trying to load ${url}`);

  if (!context.response) {
    context.response = {};
  }
  if (!context.content) {
    context.content = {};
  }
  try {
    context.response.body = await rp({
      url,
      json: false,
    });
    context.content.sources = [url];
    context.content.body = '';
  } catch (e) {
    // ignore
  }
}

module.exports = {
  preFetch,
};
