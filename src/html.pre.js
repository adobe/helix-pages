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
const jquery = require('jquery');
const fetchGoogle = require('./fetch-google.js');
const fetchFSTab = require('./fetch-fstab.js');

/**
 * The 'pre' function that is executed before the HTML is rendered
 * @param context The current context of processing pipeline
 * @param context.content The content
 */
function pre(context) {
  const { document } = context.content;
  const $ = jquery(document.defaultView);

  const $sections = $(document.body).children('div');

  // first section has a starting image: add title class and wrap all subsequent items inside a div
  $sections
    .first()
    .has('p:first-child>img')
    .addClass('title')
    .find(':nth-child(1n+2)')
    .wrapAll('<div class="header"></div>');

  // sections consisting of only one image
  $sections
    .filter('[data-hlx-types~="has-only-image"]')
    .not('.title')
    .addClass('image');

  // sections without image and title class gets a default class
  $sections
    .not('.image')
    .not('.title')
    .addClass('default');

  // if there are no sections wrap everything in a default div
  if ($sections.length === 0) {
    $(document.body).children().wrapAll('<div class="default"></div>');
  }
}

module.exports.pre = pre;

module.exports.before = {
  fetch: async (context, action) => {
    // could be separate pipeline step or done completely in the dispatcher
    const fstab = await fetchFSTab(context, action);
    if (!fstab) {
      return;
    }
    const { logger, request, secrets } = action;
    const idx = request.params.path.lastIndexOf('.');
    const resourcePath = decodeURIComponent(request.params.path.substring(0, idx));

    logger.info(`resourcePath=${resourcePath}`);

    // sanitize the mountpoints
    fstab.mountpoints.forEach((m) => {
      if (!m.root.endsWith('/')) {
        m.root += '/';
      }
      if (m.url && !m.id) {
        if (m.url.startsWith('https://drive.google.com/')) {
          m.type = 'google';
          m.id = m.url.split('/').pop();
        }
      }
    });
    const mp = fstab.mountpoints.find((m) => resourcePath.startsWith(m.root));
    if (!mp) {
      logger.info(`no mount point for ${resourcePath}`);
      return;
    }
    if (mp.type !== 'google') {
      logger.info(`mount point type '${mp.type}' not supported.`);
      return;
    }
    if (!mp.id) {
      logger.warn('google docs mountpoint needs id');
      return;
    }

    const relPath = resourcePath.substring(mp.root.length - 1);
    logger.info(`relPath=${relPath}`);
    const oldRaw = secrets.REPO_RAW_ROOT;
    const oldTimeout = secrets.HTTP_TIMEOUT;
    secrets.REPO_RAW_ROOT = secrets.GOOGLE_DOCS_ROOT || 'https://adobeioruntime.net/api/v1/web/helix/helix-services/gdocs2md@latest';
    // ump the timeout a bit, since the google docs script might take a while to render
    secrets.HTTP_TIMEOUT = 10000;
    try {
      await fetchGoogle(context, action, relPath, mp.id);
    } finally {
      secrets.REPO_RAW_ROOT = oldRaw;
      secrets.HTTP_TIMEOUT = oldTimeout;
    }
  },
};
