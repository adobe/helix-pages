/*
 * Copyright 2020 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

/**
 * Returns the original host name from the request to the outer CDN.
 * @param {object} headers The request headers
 * @returns {string} The original host
 */
function getOriginalHost(headers) {
  if (headers['hlx-forwarded-host']) {
    return headers['hlx-forwarded-host'].split(',')[0].trim();
  }
  return headers.host;
}

/**
 * Turns arelative into an absolute URL.
 * @param {object} headers The request headers
 * @param {string} url The relative or absolute URL
 * @returns {string} The absolute URL or <code>null</code>
 *                   if <code>url</code> is not a string
 */
function getAbsoluteUrl(headers, url) {
  if (typeof url !== 'string') {
    return null;
  }
  return url.startsWith('/')
    ? `https://${getOriginalHost(headers)}${url}`
    : url;
}

/**
 * Wraps the content of node with a new parent node.
 * @param {node} node The content of the node to wrap
 * @param {node} newparent The new parent node
 */
function wrapContent(newparent, node) {
  newparent.innerHTML = node.innerHTML;
  node.innerHTML = '';
  node.appendChild(newparent);
}

module.exports = {
  getOriginalHost,
  getAbsoluteUrl,
  wrapContent
};
