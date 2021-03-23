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
const minimatch = require('minimatch');
const { getAbsoluteUrl } = require('./utils.js');

/**
 * Converts all non-valid characters to `-`.
 * @param {string} text input text
 * @returns {string} the meta name
 */
function toMetaName(text) {
  return text
    .toLowerCase()
    .replace(/[^0-9a-z:_]/gi, '-');
}

/**
 * Cleans up comma-separated string lists and returns an array.
 * @param {string} list A comma-separated list
 * @returns {string[]} The clean list
 */
function toList(list) {
  return list
    .split(',')
    .map((key) => key.trim())
    .filter((key) => !!key);
}

/**
 * Extracts the URL path from the request.
 * @param {object} request The request
 * @returns {string} The path
 */
function getPath({ headers = {}, url }) {
  return headers['x-old-url'] || url;
}

/**
 * Returns the config from a block element as object with key/value pairs.
 * @param {HTMLDivElement} $block The block element
 * @returns {object} The block config
 */
function readBlockConfig($block) {
  if (!$block) {
    return {};
  }
  const config = {};
  $block.querySelectorAll(':scope>div').forEach(($row) => {
    if ($row.children && $row.children[1]) {
      const name = toMetaName($row.children[0].textContent);
      if (name) {
        let value;
        if ($row.children[1].hasChildNodes() && $row.children[1].firstElementChild) {
          // check for multiple paragraph or a list
          let childNodes;
          const { tagName } = $row.children[1].firstElementChild;
          if (tagName === 'P') {
            // contains a list of <p> paragraphs
            childNodes = $row.children[1].childNodes;
          } else if (tagName === 'UL' || tagName === 'OL') {
            // contains a list
            childNodes = $row.children[1].children[0].childNodes;
          }

          if (childNodes) {
            value = '';
            childNodes.forEach((child) => {
              value += `${child.textContent}, `;
            });
            value = value.substring(0, value.length - 2);
          }
        }

        if (!value) {
          // for text content only
          value = $row.children[1].textContent.trim().replace(/ {3}/g, ',');
        }

        if (!value) {
          // check for value inside link
          const $a = $row.children[1].querySelector('a');
          if ($a) {
            value = $a.getAttribute('href');
          }
        }
        if (!value) {
          // check for value inside img
          const $img = $row.children[1].querySelector('img');
          if ($img) {
            // strip query string
            value = $img.getAttribute('src');
          }
        }
        if (value) {
          // only keep non-empty value
          config[name] = value;
        }
      }
    }
  });
  return config;
}

/**
 * Looks for metadata from a spreadsheet.
 * @param {string} url The request URL
 * @param {object} action The action
 * @return {object} The metadata
 */
async function getGlobalMetadata(url, action) {
  let metaRules = [];
  if (action) {
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
      const token = (secrets && secrets.GITHUB_TOKEN) || (request.headers ? request.headers['x-github-token'] : '');
      if (token) {
        headers['x-github-token'] = token;
      }
      const res = await downloader.fetch({
        uri: `https://${ref}--${repo}--${owner}.hlx.page/metadata.json`,
        options: {
          timeout: secrets ? secrets.HTTP_TIMEOUT_EXTERNAL : 20000,
          headers,
        },
        headers,
        errorOn404: false,
      });
      if (res.status === 200) {
        let json = JSON.parse(res.body);
        if (typeof json.data === 'object') {
          json = json.data;
        }
        if (!(json instanceof Array)) {
          throw new Error('data must be an array');
        }
        metaRules = json.map((entry) => {
          // lowercase all keys
          const lcEntry = {};
          Object.keys(entry).forEach((key) => {
            lcEntry[key.toLowerCase()] = entry[key];
          });
          return lcEntry;
        });
      }
    } catch (e) {
      log.debug('failed to load global metadata', e);
    }
  }
  const metaConfig = {};
  metaRules.forEach(({ url: glob, ...config }) => {
    if (typeof glob !== 'string') return;
    if (minimatch(url, glob)) {
      Object.assign(metaConfig, config);
    }
  });
  return metaConfig;
}

/**
 * Looks for metadata in the document.
 * @param {HTMLDocument} document The document
 * @return {object} The metadata
 */
function getLocalMetadata(document) {
  let metaConfig = {};
  const metaBlock = document.querySelector('body div.metadata');
  if (metaBlock) {
    metaConfig = readBlockConfig(metaBlock);
    metaBlock.remove();
  }
  return metaConfig;
}

/**
 * Adds image optimization parameters suitable for meta images to a URL.
 * @param {string} pagePath The path of the requested page
 * @param {string} imgUrl The image URL
 * @returns The optimized image URL
 */
function optimizeMetaImage(pagePath, imgUrl) {
  if (typeof imgUrl !== 'string') {
    return null;
  }
  if (imgUrl.startsWith('./')) {
    // resolve relative image path using page path
    // eslint-disable-next-line no-param-reassign
    imgUrl = `${pagePath.substring(0, pagePath.lastIndexOf('/'))}${imgUrl.substring(1)}`;
  }
  return imgUrl.startsWith('/')
    ? `${imgUrl.split('?')[0]}?auto=webp&format=pjpg&optimize=medium&width=1200`
    : imgUrl;
}

/**
 * Looks for a default meta image (JPG) in the GitHub repository
 * and defaults to PNG version.
 * @param action The action
 * @return The path to the default meta image
 */
async function getDefaultMetaImage(action) {
  if (action) {
    const { request, downloader } = action;
    const {
      owner, repo, ref,
    } = request.params || {};
    const path = '/default-meta-image.jpg';
    const res = await downloader.fetchGithub({
      owner,
      repo,
      ref,
      path,
      errorOn404: false,
    });
    if (res.status === 200) {
      return path;
    }
  }
  return '/default-meta-image.png';
}

/**
 * Extracts the metadata and stores it in the content meta
 * @param {object} context The current context of processing pipeline
 * @param {object} action The action
 */
async function extractMetaData(context, action) {
  const { request, content } = context;
  const { document } = content;
  const { url } = request;

  const { meta = {} } = content;
  content.meta = meta;

  // extract global metadata from spreadsheet, and overlay
  // with local metadata from document
  const metaConfig = Object.assign(
    await getGlobalMetadata(getPath(request), action),
    getLocalMetadata(document),
  );

  // first process supported metadata properties
  [
    'title',
    'description',
    'keywords',
    'tags',
    'image',
  ].forEach((name) => {
    if (metaConfig[name]) {
      meta[name] = metaConfig[name];
      delete metaConfig[name];
    }
  });
  if (Object.keys(metaConfig).length > 0) {
    // add rest to meta.custom
    meta.custom = Object.keys(metaConfig).map((name) => ({
      name: toMetaName(name),
      value: metaConfig[name],
      property: name.includes(':'),
    }));
  }

  if (meta.keywords) {
    meta.keywords = toList(meta.keywords).join(', ');
  }
  if (meta.tags) {
    meta.tags = toList(meta.tags);
  }

  // complete metadata with insights from content
  if (!meta.title) {
    meta.title = content.title;
  }
  if (!meta.description) {
    // description: text from paragraphs with 10 or more words
    let desc = [];
    document.querySelectorAll('div > p').forEach((p) => {
      if (desc.length === 0) {
        const words = p.textContent.trim().split(/\s+/);
        if (words.length >= 10) {
          desc = desc.concat(words);
        }
      }
    });
    meta.description = `${desc.slice(0, 25).join(' ')}${desc.length > 25 ? ' ...' : ''}`;
  }
  meta.url = getAbsoluteUrl(request.headers, getPath(request));

  // content.image is not correct if the first image is in a page-block. since the pipeline
  // only respects the image nodes in the mdast
  let $hero;
  document.querySelectorAll('body > div').forEach(($section) => {
    if (!$hero) {
      $hero = $section.querySelector('img');
    }
  });
  if ($hero) {
    content.image = $hero.src;
  }

  meta.image = getAbsoluteUrl(request.headers,
    optimizeMetaImage(url, meta.image || content.image || await getDefaultMetaImage(action)));
}

module.exports = extractMetaData;
