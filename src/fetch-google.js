/*
 * Copyright 2018 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const { inspect } = require('util');
const client = require('request-promise-native');
const { setdefault } = require('ferrum');

/**
 * Fetches the Markdown from google docs
 */
async function fetch(context, action, resourcePath, rootId) {
  const { logger, request, secrets } = action;
  const content = setdefault(context, 'content', {});
  let timeout;
  if (!secrets.HTTP_TIMEOUT) {
    logger.warn('No HTTP timeout set, risk of denial-of-service');
  } else {
    timeout = secrets.HTTP_TIMEOUT;
  }

  // extract some tracing info
  const {
    owner, repo, ref,
  } = request.params;
  const source = `${owner}/${repo}/${ref}`;
  const requestId = request.headers['x-request-id']
    || request.headers['x-cdn-request-id']
    || request.headers['x-openwhisk-activation-id']
    || '';
  const uri = `${secrets.REPO_RAW_ROOT}?path=${encodeURIComponent(resourcePath)}&rootId=${encodeURIComponent(rootId)}&src=${encodeURIComponent(source)}&rid=${encodeURIComponent(requestId)}`;
  const options = {
    uri,
    json: false,
    timeout,
    time: true,
    followAllRedirects: true,
  };

  logger.info(`fetching Markdown from ${options.uri}`);
  try {
    content.body = await client(options);
  } catch (e) {
    if (e.statusCode === 404) {
      logger.error(`Could not find Markdown at ${options.uri}`);
      setdefault(context, 'response', {}).status = 404;
    } else if ((e.response && e.response.elapsedTime && e.response.elapsedTime > timeout) || (e.cause && e.cause.code && (e.cause.code === 'ESOCKETTIMEDOUT' || e.cause.code === 'ETIMEDOUT'))) {
      // return gateway timeout
      logger.error(`Gateway timout of ${timeout} milliseconds exceeded for ${options.uri}`);
      setdefault(context, 'response', {}).status = 504;
    } else {
      logger.error(`Error while fetching Markdown from ${options.uri} with the following `
        + `options:\n${inspect(options, { depth: null })}`);
      setdefault(context, 'response', {}).status = 502;
    }
    context.error = e;
  }
}

module.exports = fetch;
