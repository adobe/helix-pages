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

const PATH_REGEXP = /^\/([a-zA-Z0-9_-]+=*)\.md$/;

/**
 * Simple action that responds to external image requests with a redirect. This should allow
 * Fastly to cache the images. The image src should be of the format:
 *
 * `/${encoded}.external.image`
 *
 * where:
 *
 * ```
 * encoded = base64(url).replaceAll('/', '_').replaceAll('+', '-');
 * ```
 */
async function main(params) {
  const {
    __ow_headers: {
      accept,
    },
    path,
    __ow_logger: log,
  } = params;

  log.info(`accept: ${accept}, path=${path}`);
  const r = PATH_REGEXP.exec(path);
  if (!r) {
    log.info('invalid external image path.');
    return {
      statusCode: 404,
    };
  }
  const encoded = r[1].replace(/_/, '/').replace(/-/, '+');
  const url = Buffer.from(encoded, 'base64').toString('utf-8');
  log.info(`url=${url}`);
  if (!url.startsWith('https://')) {
    return {
      statusCode: 404,
    };
  }
  const a = accept.split(',');
  if (!a.find((mt) => mt.startsWith('image/'))) {
    log.info('rejecting non image accept header');
    return {
      statusCode: 404,
    };
  }

  return {
    statusCode: 307,
    headers: {
      location: url,
    },
  };
}

module.exports.main = main;
