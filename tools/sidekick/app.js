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
/* global window, document, navigator, fetch, btoa */

'use strict';

(() => {
  /**
   * @typedef {Object.<string, string>} elemAttr
   * @description The name and value of the attribute to set on an element.
   */

  /**
   * @typedef {Object.<string, Function>} elemLstnr
   * @description The event name and listener to register on an element.
   */

  /**
   * @typedef {Object} elemConfig
   * @description The configuration of an element to add.
   * @prop {string}      tag    The tag name (mandatory)
   * @prop {string}      text   The text content (optional)
   * @prop {elemAttr[]}  attrs  The attributes (optional)
   * @prop {elemLstnr[]} lstnrs The event listeners (optional)
   */

  /**
   * @typedef {Object} pluginButton
   * @description The configuration for a plugin button. This can be used as
   * a shorthand for {@link elemConfig}.
   * @prop {string}   text   The button text
   * @prop {Function} action The click listener
   */

  /**
   * @typedef {Object} plugin
   * @description The plugin configuration.
   * @prop {string}       id        The plugin ID (mandatory)
   * @prop {pluginButton} button    A button configuration object (optional)
   * @prop {boolean}      override=false  True to replace an existing plugin (optional)
   * @prop {elemConfig[]} elements  An array of elements to add (optional)
   * @prop {Function}     condition Determines whether to show this plugin (optional).
   * This function is expected to return a boolean when called with the sidekick as argument.
   * @prop {Function}     callback  A function called after adding the plugin (optional).
   * This function is called with the sidekick and the newly added plugin as arguments.
   */

  /**
   * @external
   * @name "window.hlx.sidekickConfig"
   * @type {Object}
   * @description The sidekick configuration needs to be defined in this global variable
   * before creating the {@link Sidekick}.
   * @prop {string} owner   The GitHub owner or organization (mandatory)
   * @prop {string} repo    The GitHub owner or organization (mandatory)
   * @prop {string} ref=main The Git reference or branch (optional)
   * @prop {string} host    The production host name (optional)
   * @prop {string} project The name of the Helix project (optional)
   */

  /**
   * @typedef {Object} publishResponse
   * @description The response object for a publish action.
   * @prop {boolean} ok     True if publish action was successful, else false
   * @prop {string}  status The status text returned by the publish action
   * @prop {Object}  json   The JSON object returned by the publish action
   * @prop {string}  path   The path of the published page
   */

  /**
   * @external
   * @name "window.hlx.sidekick"
   * @type {Sidekick}
   * @description The global variable referencing the {@link Sidekick} singleton.
   */

  /**
   * Returns the sidekick configuration based on {@link window.hlx.sidekickConfig}.
   * @private
   * @returns {Object} The sidekick configuration
   */
  function initConfig() {
    const cfg = (window.hlx && window.hlx.sidekickConfig
      ? window.hlx.sidekickConfig
      : window.hlxSidekickConfig) || {};
    const {
      owner, repo, ref = 'master', host, project,
    } = cfg;
    const outerPrefix = owner && repo
      ? `${repo}--${owner}`
      : null;
    const innerPrefix = ref && !['master', 'main'].includes(ref)
      ? `${ref}--${outerPrefix}`
      : outerPrefix;
    // host param for purge request must include ref
    const purgeHost = `${ref}--${outerPrefix}.hlx.page`;
    const publicHost = host && host.startsWith('http') ? new URL(host).host : host;
    // get hlx domain from script src
    let innerHost;
    const script = Array.from(document.querySelectorAll('script[src]'))
      .filter((include) => include.src.endsWith('sidekick/app.js'))[0];
    if (script) {
      const scriptHost = new URL(script.src).host;
      if (scriptHost) {
        // keep only 1st and 2nd level domain
        innerHost = scriptHost.split('.')
          .reverse()
          .splice(0, 2)
          .reverse()
          .join('.');
      }
    }
    if (!innerHost || innerHost.startsWith('localhost')) {
      innerHost = 'hlx.page';
    }
    innerHost = innerPrefix ? `${innerPrefix}.${innerHost}` : null;
    const outerHost = outerPrefix ? `${outerPrefix}.hlx.live` : null;
    return {
      ...cfg,
      innerHost,
      outerHost,
      purgeHost,
      host: publicHost,
      project: project || 'your Helix Pages project',
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
    const {
      hash, host, hostname, href, origin, pathname, port, protocol, search,
    } = window.location;

    // replace single - with 2
    const makeHostHelixCompliant = (ahost) => {
      if (ahost.match(/^.*?--.*?--.*?\./gm)) {
        return ahost;
      }
      return ahost
        .replace(/^([^-.]+)-([^-.]+)-([^-.]+)\./gm, '$1-$2--$3.')
        .replace(/^([^-.]+)-([^-.]+)\./gm, '$1--$2.');
    };

    const newHost = makeHostHelixCompliant(hostname);

    return {
      hash,
      host: host.replace(hostname, newHost),
      hostname: newHost,
      href: href.replace(hostname, newHost),
      origin: origin.replace(hostname, newHost),
      pathname,
      port,
      protocol,
      search,
    };
  }

  /**
   * Makes the given element accessible by setting a title attribute
   * based on its :before CSS style or text content, and enabling
   * keyboard access.
   * @private
   * @param {HTMLElement} elem The element
   * @returns {HTMLElement} The element
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
   * @param {elemConfig}  config The tag configuration object
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
   * @param {elemConfig} config The tag configuration
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
   * @param {elemConfig}  config The tag configuration
   * @returns {HTMLElement} The new tag
   */
  function appendTag(parent, config) {
    return makeAccessible(parent.appendChild(createTag(config)));
  }

  /**
   * Returns the share URL for the sidekick bookmarklet.
   * @private
   * @param {Object} config The sidekick configuration
   * @returns {string} The share URL
   */
  function getShareUrl(config) {
    const shareUrl = new URL('https://www.hlx.page/tools/sidekick/');
    shareUrl.search = new URLSearchParams([
      ['project', config.project || ''],
      ['host', config.host || ''],
      ['giturl', `https://github.com/${config.owner}/${config.repo}${config.ref ? `/tree/${config.ref}` : ''}`],
    ]).toString();
    return shareUrl.toString();
  }

  /**
   * Creates a share URL for this sidekick and either invokes the
   * Web Share API or copies it to the clipboard.
   * @private
   * @param {Sidekick} sk The sidekick
   */
  function shareSidekick(sk) {
    const { config } = sk;
    const shareUrl = getShareUrl(config);
    if (navigator.share) {
      navigator.share({
        title: `Sidekick for ${config.project}`,
        text: `Check out this helper bookmarklet for ${config.project}`,
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      sk.notify('Sharing URL copied to clipboard');
    }
  }

  /**
   * Checks for updates and informs the user.
   * @private
   * @param {Sidekick} sk The sidekick
   */
  function checkForUpdates(sk) {
    window.setTimeout(() => {
      // check for legacy config property
      if (typeof window.hlxSidekickConfig === 'object') {
        // eslint-disable-next-line no-alert
        if (window.confirm('Good news! There is a newer version of the Helix Sidekick Bookmarklet available!\n\nDo you want to install it now? It will only take a minute …')) {
          sk.showModal('Please wait …', true);
          const url = new URL(getShareUrl(sk.config));
          const params = new URLSearchParams(url.search);
          params.set('from', sk.location.href);
          url.search = params.toString();
          window.location.href = url.toString();
        }
      }
    }, 1000);
  }

  /**
   * Adds the preview plugin to the sidekick.
   * @private
   * @param {Sidekick} sk The sidekick
   */
  function addPreviewPlugin(sk) {
    sk.add({
      id: 'preview',
      condition: (s) => s.isEditor() || s.location.host === s.config.host,
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
          window.open(url.toString(), `hlx-sk-preview-${btoa(location.href)}`);
        },
      },
    });
  }

  /**
   * Adds the edit plugin to the sidekick.
   * @private
   * @param {Sidekick} sk The sidekick
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
          window.open(url, `hlx-sk-edit-${btoa(location.href)}`);
        },
      },
    });
  }

  /**
   * Adds the reload plugin to the sidekick.
   * @private
   * @param {Sidekick} sk The sidekick
   */
  function addReloadPlugin(sk) {
    sk.add({
      id: 'reload',
      condition: (sidekick) => sidekick.location.host === sidekick.config.innerHost,
      button: {
        action: () => {
          const { location } = sk;
          const path = location.pathname;
          sk.showModal('Please wait …', true);
          sk
            .publish(path, true)
            .then((resp) => {
              if (resp && resp.ok) {
                window.location.reload();
              } else {
                sk.showModal([
                  `Failed to reload ${path}. Please try again later.`,
                  JSON.stringify(resp),
                ], true, 0);
              }
            });
        },
      },
    });
  }

  /**
   * Adds the publish plugin to the sidekick.
   * @private
   * @param {Sidekick} sk The sidekick
   */
  function addPublishPlugin(sk) {
    sk.add({
      id: 'publish',
      condition: (sidekick) => sidekick.isHelix() && sidekick.config.host,
      button: {
        action: async () => {
          const { config, location } = sk;
          const path = location.pathname;
          sk.showModal(`Publishing ${path}`, true);
          let urls = [path];
          // purge dependencies
          if (Array.isArray(window.hlx.dependencies)) {
            urls = urls.concat(window.hlx.dependencies);
          }

          await Promise.all(urls.map((url) => sk.publish(url)));
          if (config.host) {
            sk.showModal('Please wait …', true);
            // fetch and redirect to production
            const prodURL = `https://${config.host}${path}`;
            await fetch(prodURL, { cache: 'reload', mode: 'no-cors' });
            // eslint-disable-next-line no-console
            console.log(`redirecting to ${prodURL}`);
            window.location.href = prodURL;
          } else {
            sk.notify('Successfully published');
          }
        },
      },
    });
  }

  /**
   * The sidekick provides helper tools for authors.
   */
  class Sidekick {
    /**
     * Creates a new sidekick based on a configuration object in
     * {@link window.hlx.sidekickConfig}.
     */
    constructor() {
      this.config = initConfig();
      this.root = appendTag(document.body, {
        tag: 'div',
        attrs: {
          class: 'hlx-sk hlx-sk-hidden hlx-sk-empty',
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
      addReloadPlugin(this);
      addPublishPlugin(this);
      // custom plugins
      if (this.config.plugins && Array.isArray(this.config.plugins)) {
        this.config.plugins.forEach((plugin) => this.add(plugin));
      }
      if ((this.isHelix() || this.isEditor())
        && (this.config.pluginHost || this.config.innerHost)) {
        const prefix = this.config.pluginHost || (this.isEditor() ? `https://${this.config.innerHost}` : '');
        appendTag(document.head, {
          tag: 'script',
          attrs: {
            src: `${prefix}/tools/sidekick/plugins.js`,
          },
        });
      }
      checkForUpdates(this);
    }

    /**
     * Shows/hides the sidekick.
     * @returns {Sidekick} The sidekick
     */
    toggle() {
      this.root.classList.toggle('hlx-sk-hidden');
      return this;
    }

    /**
     * Adds a plugin to the sidekick.
     * @param {plugin} plugin The plugin configuration.
     * @returns {HTMLElement} The plugin
     */
    add(plugin) {
      if (typeof plugin === 'object') {
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
          this.root.classList.remove('hlx-sk-empty');
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
        return $plugin;
      }
      return null;
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
     * @returns {Sidekick} The sidekick
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
     * @returns {boolean} <code>true</code> if editor URL, else <code>false</code>
     */
    isEditor() {
      return /.*\.sharepoint\.com/.test(this.location.host)
        || this.location.host === 'docs.google.com';
    }

    /**
     * Checks if the current location is a configured Helix URL.
     * @returns {boolean} <code>true</code> if Helix URL, else <code>false</code>
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
     * @param {string|string[]} msg The message (lines) to display
     * @param {number}          level error (0), warning (1), of info (2)
     */
    notify(msg, level = 2) {
      this.showModal(msg, false, level);
    }

    /**
     * Displays a modal notification.
     * @param {string|string[]} msg The message (lines) to display
     * @param {boolean}         sticky <code>true</code> if message should be sticky (optional)
     * @param {number}          level error (0), warning (1), of info (2)
     * @returns {Sidekick} The sidekick
     */
    showModal(msg, sticky = false, level = 2) {
      if (!this._modal) {
        const $spinnerWrap = appendTag(document.body, {
          tag: 'div',
          attrs: {
            class: 'hlx-sk-overlay',
          },
          lstnrs: {
            click: () => this.hideModal(),
          },
        });
        this._modal = appendTag($spinnerWrap, { tag: 'div' });
      } else {
        this._modal.parentNode.classList.remove('hlx-sk-hidden');
      }
      if (msg) {
        if (Array.isArray(msg)) {
          this._modal.textContent = '';
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
     * @returns {Sidekick} The sidekick
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
     * @returns {Sidekick} The sidekick
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

    /**
     * Publishes the page at the specified path if {@code config.host} is defined.
     * @param {string} path The path of the page to publish
     * @param {boolean} innerOnly {@code true} to only refresh inner CDN, else {@code false}
     * @return {publishResponse} The response object
     */
    async publish(path, innerOnly = false) {
      if (!innerOnly && !this.config.host) return null;
      /* eslint-disable no-console */
      console.log(`purging ${path}`);
      const xfh = innerOnly
        ? [this.config.innerHost]
        : [this.config.innerHost, this.config.outerHost, this.config.host];
      const u = new URL('https://adobeioruntime.net/api/v1/web/helix/helix-services/purge@v1');
      u.search = new URLSearchParams([
        ['host', this.config.purgeHost],
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
        ok: resp.ok && Array.isArray(json) && json.every((e) => e.status === 'ok'),
        status: resp.status,
        json,
        path,
      };
    }
  }

  window.hlx = window.hlx || {};
  // launch sidekick
  if (!window.hlx.sidekick) {
    window.hlx.sidekick = new Sidekick().toggle();
  }
})();
