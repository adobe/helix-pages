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
const { getAbsoluteUrl, toClassName } = require('./utils.js');

const fixSections = require('./fix-sections.js');
const createPageBlocks = require('./create-page-blocks.js');
const createPictures = require('./create-pictures.js');

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
      const name = toClassName($row.children[0].textContent);
      if (name) {
        let value = $row.children[1].textContent.trim();
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
  return path.startsWith('/')
    ? `${path.split('?')[0]}?auto=webp&format=pjpg&optimize=medium&width=1200`
    : path;
}

/**
 * Looks for a default meta image (JPG) in the GitHub repository
 * and defaults to PNG version.
 * @param context The current context of processing pipeline
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
 * The 'pre' function that is executed before the HTML is rendered
 * @param context The current context of processing pipeline
 * @param context.content The content
 */
async function pre(context, action) {
  const { request, content } = context;
  const { document } = content;

  // Expose the html & body attributes so they can be used in the HTL
  [document.documentElement, document.body].forEach((el) => {
    el.attributesMap = [...el.attributes].reduce((map, attr) => {
      map[attr.name] = attr.value;
      return map;
    }, {});
  });

  fixSections(context);

  // convert tables to page blocks
  createPageBlocks(context);

  // transform <img> to <picture>
  createPictures(context);

  // ensure content.data is present
  content.data = content.data || {};

  // extract metadata
  const { meta = {} } = content;

  const metaBlock = document.querySelector('body div.metadata');
  if (metaBlock) {
    const metaConfig = readBlockConfig(metaBlock);
    [
      // supported metadata properties
      'title',
      'description',
      'keywords',
      'image',
    ].forEach((name) => {
      if (metaConfig[name]) {
        meta[name] = metaConfig[name];
      }
    });
    metaBlock.remove();
  }

  if (meta.keywords) {
    meta.tags = meta.keywords.split(',').map((tag) => tag.trim());
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

module.exports.pre = pre;
