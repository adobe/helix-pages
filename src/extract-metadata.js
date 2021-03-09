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
        let value = $row.children[1].textContent.trim().replace(/ {3}/g, ',');
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
 * Adds image optimization parameters suitable for meta images to a path.
 * @param {string} path The image path
 * @returns The optimized image path
 */
function optimizeMetaImage(path) {
  return (path.startsWith('/') || path.startsWith('./'))
    ? `${path.split('?')[0]}?auto=webp&format=pjpg&optimize=medium&width=1200`
    : path;
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

  // extract metadata
  const { meta = {} } = content;
  content.meta = meta;

  const metaBlock = document.querySelector('body div.metadata');
  if (metaBlock) {
    const metaConfig = readBlockConfig(metaBlock);
    [
      // supported metadata properties
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
        name,
        value: metaConfig[name],
        property: name.includes(':'),
      }));
    }
    metaBlock.remove();
  }

  if (meta.keywords) {
    meta.keywords = toList(meta.keywords).join(', ');
  }
  if (meta.tags) {
    meta.tags = toList(meta.tags);
  }
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
  meta.url = getAbsoluteUrl(request.headers, request.url);
  meta.image = optimizeMetaImage(meta.image || content.image || await getDefaultMetaImage(action));
  meta.image = getAbsoluteUrl(request.headers, meta.image);
}

module.exports = extractMetaData;
