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

async function fetchMetadata(context, action) {
  const {
    request,
    downloader,
    secrets,
    logger: log,
  } = action;
  const {
    owner, repo, ref,
  } = request.params || {};
  try {
    const headers = {};
    const token = (secrets && secrets.GITHUB_TOKEN)
      || (request.headers && typeof request.headers.get === 'function' ? request.headers.get('x-github-token') : '') 
      || (request.headers ? request.headers['x-github-token'] : '');
    if (token) {
      headers['x-github-token'] = token;
    }
    // schedule fetch task
    downloader.fetch({
      uri: `https://${ref}--${repo}--${owner}.hlx.page/metadata.json`,
      headers,
      errorOn404: false,
      options: {
        timeout: 20000,
      },
      id: 'metadata',
    });
  } catch (err) {
    log.debug('failed to load global metadata', err);
  }
}

module.exports = fetchMetadata;
