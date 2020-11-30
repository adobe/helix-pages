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
/* global window, document, navigator, HTMLElement, fetch */

'use strict';

(() => {
  /**
   * Returns the initialized configuration.
   * @private
   * @param {object} cfg The configuration options
   */
  function initConfig(cfg = {}) {
    const outerPrefix = (cfg && cfg.owner && cfg.repo)
      ? `${cfg.repo}--${cfg.owner}`
      : null;
    const innerPrefix = cfg.ref && !['master', 'main'].includes(cfg.ref)
      ? `${cfg.ref}--${outerPrefix}`
      : outerPrefix;
    // check if host is a URL
    if (cfg.host && cfg.host.startsWith('http')) {
      cfg.host = new URL(cfg.host).host;
    }
    // get hlx domain from script src
    let innerDomain;
    const script = Array.from(document.querySelectorAll('script[src]'))
      .filter((include) => include.src.endsWith('sidekick/app.js'))[0];
    if (script) {
      const scriptHost = new URL(script.src).host;
      if (scriptHost) {
        innerDomain = scriptHost.replace('www.', '');
      }
    }
    if (!innerDomain) {
      innerDomain = 'hlx.page';
    }
    return {
      ...cfg,
      innerHost: innerPrefix ? `${innerPrefix}.${innerDomain}` : null,
      outerHost: outerPrefix ? `${outerPrefix}.hlx.live` : null,
      project: cfg.project || 'your Helix Pages project',
    };
  }

  /**
   * Returns the location of the current document.
   * @private
   * @returns {Location} The location object
   */
  function getLocation() {
    // first check if there is a test location
    const $test = document.getElementById('sidekick_test_location');
    if ($test) {
      try {
        return new URL($test.value);
      } catch (e) {
        return null;
      }
    }
    // fall back to window location
    return window.location;
  }

  /**
   * Makes the given element accessible by setting a title attribute
   * based on its :before CSS style or text content, and enabling
   * keyboard access.
   * @private
   * @param {HTMLElement} elem The element
   */
  function makeAccessible(elem) {
    if (elem.tagName === 'A' || elem.tagName === 'BUTTON') {
      const ensureTitle = (tag) => {
        if (!tag.title) {
          // wait for computed style to be available
          setTimeout(() => {
            let title = window.getComputedStyle(tag, ':before').getPropertyValue('content');
            title = title !== 'normal' && title !== 'none'
              ? title.substring(1, title.length - 1)
              : '';
            if (!title) {
              title = tag.textContent;
            }
            tag.setAttribute('title', title);
          }, 200);
        }
      };
      ensureTitle(elem);
      elem.setAttribute('tabindex', '0');
    }
    return elem;
  }

  /**
   * Extends a tag.
   * @private
   * @param {HTMLElement} tag The tag to extend
   * @param {object}      config The tag configuration object
   *   with the following properties:
   *   - {string} tag    The tag name (mandatory)
   *   - {string} text   The text content (optional)
   *   - {object} attrs  The attributes (optional)
   *   - {object} lstnrs The event listeners (optional)
   * @returns {HTMLElement} The extended tag
   */
  function extendTag(tag, config) {
    if (typeof config.attrs === 'object') {
      for (const [key, value] of Object.entries(config.attrs)) {
        tag.setAttribute(key, value);
      }
    }
    if (typeof config.lstnrs === 'object') {
      for (const [name, fn] of Object.entries(config.lstnrs)) {
        if (typeof fn === 'function') {
          tag.addEventListener(name, fn);
        }
      }
    }
    if (typeof config.text === 'string') {
      tag.textContent = config.text;
    }
    return tag;
  }

  /**
   * Creates a tag.
   * @private
   * @param {object} config The tag configuration object
   *   with the following properties:
   *   - {string} tag    The tag name (mandatory)
   *   - {string} text   The text content (optional)
   *   - {object} attrs  The attributes (optional)
   *   - {object} lstnrs The event listeners (optional)
   * @returns {HTMLElement} The new tag
   */
  function createTag(config) {
    if (typeof config.tag !== 'string') {
      return null;
    }
    const el = document.createElement(config.tag);
    return extendTag(el, config);
  }

  /**
   * Creates a tag with the given name, attributes and listeners,
   * and appends it to the parent element.
   * @private
   * @param {HTMLElement} parent The parent element
   * @param {object}      config The tag configuration object
   *   with the following properties:
   *   - {string} tag    The tag name (mandatory)
   *   - {string} text   The text content (optional)
   *   - {object} attrs  The attributes (optional)
   *   - {object} lstnrs The event listeners (optional)
   * @returns {HTMLElement} The new tag
   */
  function appendTag(parent, config) {
    return makeAccessible(parent.appendChild(createTag(config)));
  }

  /**
   * Creates a share URL for this sidekick and either invokes the
   * Web Share API or copies it to the clipboard.
   * @param {object} sk The sidekick
   */
  function shareSidekick(sk) {
    const { config } = sk;
    const shareUrl = new URL('https://www.hlx.page/tools/sidekick/');
    shareUrl.search = new URLSearchParams([
      ['project', config.project || ''],
      ['host', config.host || ''],
      ['giturl', `https://github.com/${config.owner}/${config.repo}${config.ref ? `/tree/${config.ref}` : ''}`],
    ]).toString();
    if (navigator.share) {
      navigator.share({
        title: `Sidekick for ${config.project}`,
        text: `Check out this helper bookmarklet for ${config.project}`,
        url: shareUrl.toString(),
      });
    } else {
      navigator.clipboard.writeText(shareUrl.toString());
      sk.notify('Sharing URL copied to clipboard');
    }
  }

  /**
   * Adds the preview plugin to the sidekick.
   * @private
   * @param {object} sk The sidekick
   */
  function addPreviewPlugin(sk) {
    sk.add({
      id: 'preview',
      condition: (sidekick) => sidekick.config.innerHost
          && (sk.isEditor() || sk.isHelix()),
      button: {
        action: () => {
          const { config, location } = sk;
          let url;
          if (sk.isEditor()) {
            url = new URL('https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2');
            url.search = new URLSearchParams([
              ['owner', config.owner],
              ['repo', config.repo],
              ['ref', config.ref || 'main'],
              ['path', '/'],
              ['lookup', location.href],
            ]).toString();
          } else {
            const host = location.host === config.innerHost ? config.host : config.innerHost;
            url = new URL(`https://${host}${location.pathname}`);
          }
          window.open(url.toString(), `hlx-sk-preview-${config.repo}--${config.owner}`);
        },
      },
    });
  }

  /**
   * Adds the edit plugin to the sidekick.
   * @private
   * @param {object} sk The sidekick
   */
  function addEditPlugin(sk) {
    sk.add({
      id: 'edit',
      condition: (sidekick) => sidekick.isHelix(),
      button: {
        action: () => {
          const { config, location } = sk;
          const url = new URL('https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v2');
          url.search = new URLSearchParams([
            ['owner', config.owner],
            ['repo', config.repo],
            ['ref', config.ref || 'main'],
            ['path', '/'],
            ['edit', location.href],
          ]).toString();
          window.open(url, `hlx-sk-edit-${config.repo}--${config.owner}`);
        },
      },
    });
  }

  /**
   * Adds the publish plugin to the sidekick.
   * @private
   * @param {object} sk The sidekick
   */
  function addPublishPlugin(sk) {
    async function sendPurge(cfg, path) {
      /* eslint-disable no-console */
      console.log(`purging ${path}`);
      const xfh = [
        cfg.host,
        cfg.outerHost,
      ];
      const u = new URL('https://adobeioruntime.net/api/v1/web/helix/helix-services/purge@v1');
      u.search = new URLSearchParams([
        ['host', cfg.innerHost],
        ['xfh', xfh.join(',')],
        ['path', path],
      ]).toString();
      const resp = await fetch(u, {
        method: 'POST',
      });
      const json = await resp.json();
      console.log(JSON.stringify(json));
      /* eslint-enable no-console */
      return {
        ok: resp.ok && json.every((e) => e.status === 'ok'),
        status: resp.status,
        json,
        path,
      };
    }

    sk.add({
      id: 'publish',
      condition: (sidekick) => sidekick.isHelix(),
      button: {
        action: async () => {
          const { config, location } = sk;
          if (!config.innerHost || !config.host) {
            sk.notify(`Publish is not configured for ${config.project}`, 0);
            return;
          }
          sk.showModal('Publishing...', true);
          const path = location.pathname;
          const resp = await sendPurge(config, path);
          if (resp.ok) {
            // fetch and redirect to production
            const prodURL = `https://${config.host}${path}`;
            await fetch(prodURL, { cache: 'reload', mode: 'no-cors' });
            // eslint-disable-next-line no-console
            console.log(`redirecting to ${prodURL}`);
            window.location.href = prodURL;
          } else {
            sk.showModal([
              `Failed to purge ${resp.path} from the cache. Please reload this page and try again later.`,
              `Status: ${resp.status}`,
              JSON.stringify(resp.json),
            ], true, 0);
          }
        },
      },
    });
  }

  /**
   * A sidekick with helper tools for authors.
   */
  class Sidekick {
    /**
     * Creates a new sidekick.
     * @param {object} cfg The configuration options
     */
    constructor(cfg) {
      this.config = initConfig(cfg);
      this.root = appendTag(document.body, {
        tag: 'div',
        attrs: {
          class: 'hlx-sk hlx-sk-hidden',
        },
      });
      this.location = getLocation();
      this.loadCSS();
      // share button
      const share = appendTag(this.root, {
        tag: 'button',
        text: '<',
        attrs: {
          class: 'share',
        },
        lstnrs: {
          click: () => shareSidekick(this),
        },
      });
      appendTag(share, {
        tag: 'span',
        attrs: {
          class: 'dots',
        },
      });
      // close button
      appendTag(this.root, {
        tag: 'button',
        text: '✕',
        attrs: {
          class: 'close',
        },
        lstnrs: {
          click: () => this.toggle(),
        },
      });
      // default plugins
      addEditPlugin(this);
      addPreviewPlugin(this);
      addPublishPlugin(this);
      // custom plugins
      if (this.config.plugins && Array.isArray(this.config.plugins)) {
        this.config.plugins.forEach((plugin) => this.add(plugin));
      }
      if ((this.isHelix() || this.isEditor()) && this.config.innerHost) {
        const prefix = this.isEditor() ? `https://${this.config.innerHost}` : '';
        appendTag(document.head, {
          tag: 'script',
          attrs: {
            src: `${prefix}/tools/sidekick/plugins.js`,
          },
        });
      }
    }

    /**
     * Shows/hides the sidekick.
     * @returns {object} The sidekick
     */
    toggle() {
      this.root.classList.toggle('hlx-sk-hidden');
      return this;
    }

    /**
     * Adds a plugin to the sidekick.
     * @param {object|string|function|HTMLElement} plugin The plugin, e.g.:
     *   - A {string} or {HTMLElement}
     *   - A {function} that returns a plugin object when called with the sidekick as argument
     *   - An {object} with the following properties:
     *     - {string} id          The plugin ID (mandatory)
     *     - {object} button      A button configuration object (optional)
     *       - {string}   text    The button text
     *       - {function} action  The click listener
     *     - {boolean} override   True to replace an existing plugin (optional)
     *     - {array} elements An array of tag configuration objects (optional)
     *       A tag configuration object can have the following properties:
     *       - {string} tag    The tag name (mandatory)
     *       - {string} text   The text content (optional)
     *       - {object} attrs  The attributes (optional)
     *       - {object} lstnrs The event listeners (optional)
     *     - {function} condition A function determining whether to show this plugin (optional)
     *       This function is expected to return a boolean when called with the sidekick as argument
     *     - {function} callback  A function called after adding the plugin (optional)
     *       This function is called with the sidekick and the newly added plugin as arguments
     * @returns {object} The sidekick
     */
    add(plugin) {
      if (plugin instanceof HTMLElement) {
        this.root.appendChild(plugin);
      } else if (typeof plugin === 'string') {
        this.root.innerHTML += plugin;
      } else if (typeof plugin === 'function') {
        return this.add(plugin(this));
      } else if (typeof plugin === 'object') {
        if (plugin.override) {
          this.remove(plugin.id);
        }
        let $plugin = this.get(plugin.id);
        if (typeof plugin.condition === 'function' && !plugin.condition(this)) {
          if ($plugin) $plugin.remove();
          return this;
        }
        if (!$plugin) {
          $plugin = appendTag(this.root, {
            tag: 'div',
            attrs: {
              class: plugin.id,
            },
          });
        }
        if (Array.isArray(plugin.elements)) {
          plugin.elements.forEach((elem) => appendTag($plugin, elem));
        }
        if (plugin.button) {
          const cfg = {
            tag: 'button',
            text: plugin.button.text,
            lstnrs: {
              click: plugin.button.action,
            },
          };
          const $button = $plugin.querySelector(cfg.tag);
          if ($button) {
            extendTag($button, cfg);
          } else {
            appendTag($plugin, cfg);
          }
        }
        if (typeof plugin.callback === 'function') {
          plugin.callback(this, $plugin);
        }
      }
      return this;
    }

    /**
     * Returns the sidekick plugin with the specified ID.
     * @param {string} id The plugin ID
     * @returns {HTMLElement} The plugin
     */
    get(id) {
      return this.root.querySelector(`.${id}`);
    }

    /**
     * Removes the plugin with the specified ID from the sidekick.
     * @param {string} id The plugin ID
     * @returns {object} The sidekick
     */
    remove(id) {
      const $plugin = this.get(id);
      if ($plugin) {
        $plugin.remove();
      }
      return this;
    }

    /**
     * Checks if the current location is an editor URL (SharePoint or Google Docs).
     * @returns {boolean} true if editor URL, else false
     */
    isEditor() {
      return /.*\.sharepoint\.com/.test(this.location.host)
        || this.location.host === 'docs.google.com';
    }

    /**
     * Checks if the current location is a configured Helix URL.
     * @returns {boolean} true if Helix URL, else false
     */
    isHelix() {
      const { config, location } = this;
      return [
        '', // for unit testing
        'localhost:3000', // for browser testing
        config.host,
        config.outerHost,
        config.innerHost,
      ].includes(location.host);
    }

    /**
     * Displays a non-sticky notification.
     * @param {string|array} msg The message(s) to display
     * @param {number} level error (0), warning (1), of info (2) (default)
     */
    notify(msg, level = 2) {
      this.showModal(msg, false, level);
    }

    /**
     * Displays a modal notification.
     * @param {string|array} msg The message(s) to display
     * @param {boolean} sticky True if message should be sticky, else false (default)
     * @param {number} level error (0), warning (1), of info (2) (default)
     * @returns {object} The sidekick
     */
    showModal(msg, sticky, level = 2) {
      if (!this._modal) {
        const $spinnerWrap = appendTag(document.body, {
          tag: 'div',
          attrs: {
            class: 'hlx-sk-overlay',
          },
        });
        this._modal = appendTag($spinnerWrap, { tag: 'div' });
      } else {
        this._modal.parentNode.classList.remove('hlx-sk-hidden');
      }
      if (msg) {
        if (Array.isArray(msg)) {
          msg.forEach((line) => appendTag(this._modal, {
            tag: 'p',
            text: line,
          }));
        } else {
          this._modal.textContent = msg;
        }
        this._modal.className = `modal${level < 2 ? ` level-${level}` : ''}`;
      }
      if (!sticky) {
        const sk = this;
        window.setTimeout(() => {
          sk.hideModal();
        }, 3000);
      } else {
        this._modal.classList.add('wait');
      }
      return this;
    }

    /**
     * Hides the modal if shown.
     * @returns {object} The sidekick
     */
    hideModal() {
      if (this._modal) {
        this._modal.innerHTML = '';
        this._modal.className = '';
        this._modal.parentNode.classList.add('hlx-sk-hidden');
      }
      return this;
    }

    /**
     * Loads the specified default CSS file, or a sibling of the
     * current JS or HTML file. E.g. when called without argument from
     * /foo/bar.js, it will attempt to load /foo/bar.css.
     * @param {string} path The path to the CSS file (optional)
     * @returns {object} The sidekick
     */
    loadCSS(path) {
      let href = path;
      if (!href) {
        const script = Array.from(document.querySelectorAll('script[src]'))
          .filter((include) => include.src.endsWith('sidekick/app.js'))[0];
        if (script) {
          href = script.src.replace('.js', '.css');
        } else {
          const filePath = this.location.pathname;
          href = `${filePath.substring(filePath.lastIndexOf('/') + 1).split('.')[0]}.css`;
        }
      }
      appendTag(document.head, {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href,
        },
      });
      // i18n
      if (!navigator.language.startsWith('en')) {
        // look for language file in same directory
        const langHref = `${href.substring(0, href.lastIndexOf('/'))}/${navigator.language}.css`;
        appendTag(document.head, {
          tag: 'link',
          attrs: {
            rel: 'stylesheet',
            href: langHref,
          },
        });
      }
      return this;
    }
  }

  // launch sidekick
  if (!window.hlxSidekick) {
    window.hlxSidekick = new Sidekick(window.hlxSidekickConfig).toggle();
  }
})();
