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
 * Tries to load the `fstab.json` from the content repository.
 * @return {*} the fstab object or {@code null}
 */
async function fetch(context, { secrets = {}, request, logger: log }) {
  const {
    owner, repo, ref,
  } = request.params;
  const rootUrl = secrets.REPO_RAW_ROOT || 'https://raw.githubusercontent.com/';
  const url = `${rootUrl}${owner}/${repo}/${ref}/fstab.json`;
  log.info(`trying to load ${url}`);
  try {
    return await rp({
      url,
      json: true,
    });
  } catch (e) {
    log.info('unable to load fstab', e);
    return null;
  }
}

module.exports = fetch;
