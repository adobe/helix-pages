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
/* global window, document, HTMLElement, fetch */

'use strict';

(() => {
  /**
   * A sidekick with helper tools for authors.
   */
  class Sidekick {
    /**
     * Creates a new sidekick.
     * @param {object} cfg The configuration options
     */
    constructor(cfg) {
      this._initConfig(cfg);
      this.root = Sidekick.appendTag(document.body, {
        tag: 'div',
        attrs: {
          class: 'hlx-sk hlx-sk-hidden',
        },
      });
      this.location = Sidekick.getLocation();
      this.loadCSS();
      // default plugins
      this.addPreviewPlugin();
      this.addPublishPlugin();
      // custom plugins
      if (this.config.plugins && Array.isArray(this.config.plugins)) {
        this.config.plugins.forEach((plugin) => this.add(plugin));
      }
      this._loadCustomPlugins();
    }

    /**
     * Initializes the configuration.
     * @private
     * @param {object} cfg The configuration options
     */
    _initConfig(cfg = {}) {
      const prefix = (cfg && cfg.owner && cfg.repo)
        ? `${cfg.ref && cfg.ref !== 'master' ? `${cfg.ref}--` : ''}${cfg.repo}--${cfg.owner}`
        : null;
      this.config = {
        ...cfg,
        innerHost: prefix ? `${prefix}.hlx.page` : null,
        outerHost: prefix ? `${prefix}.hlx.live` : null,
        project: cfg.project || 'your Helix Pages project',
      };
    }

    /**
     * Loads custom plugins from the current Helix site.
     * @private
     */
    _loadCustomPlugins() {
      if (!(this.isHelix() || this.isEditor()) || !this.config.innerHost) {
        return;
      }
      const prefix = this.isEditor() ? `https://${this.config.innerHost}` : '';
      Sidekick.appendTag(document.head, {
        tag: 'script',
        attrs: {
          src: `${prefix}/tools/sidekick/plugins.js`,
        },
      });
    }

    /**
     * Adds the preview plugin.
     * @private
     */
    addPreviewPlugin() {
      this.add({
        id: 'preview',
        condition: (sidekick) => sidekick.isEditor() || sidekick.isHelix(),
        button: {
          text: 'Preview',
          action: () => {
            const { config, location } = this;
            if (!config.innerHost) {
              this.notify(`Preview is not configured for ${config.project}`, 0);
              return;
            }
            // check if host is a URL
            if (config.host && config.host.startsWith('http')) {
              config.host = new URL(config.host).host;
            }
            const currentHost = location.host;
            const currentPath = location.pathname;
            if (this.isEditor()) {
              // source document, open window with staging url
              const u = new URL('https://adobeioruntime.net/api/v1/web/helix/helix-services/content-proxy@v1');
              u.search = new URLSearchParams([
                ['owner', config.owner],
                ['repo', config.repo],
                ['ref', config.ref || 'master'],
                ['path', '/'],
                ['lookup', location.href],
              ]).toString();
              window.open(u, `hlx-sk-${config.ref}--${config.repo}--${config.owner}`);
            } else {
              this.showModal('Please wait...', true);
              switch (currentHost) {
                case config.innerHost:
                case config.outerHost:
                  // staging, switch to production
                  if (!config.host) {
                    this.notify(`Production host for ${config.project} is unknown`, 1);
                    return;
                  }
                  window.location.href = `https://${config.host}${currentPath}`;
                  break;
                case config.host:
                  // production, switch to staging
                  window.location.href = `https://${config.innerHost}${currentPath}`;
                  break;
                default:
                  this.notify(
                    `<p>Preview can be used on source documents or any page on:</p>
                    <p><ul>
                      <li>https://${config.innerHost}/
                      ${config.host ? `<li>https://${config.host}/` : ''}
                    </ul><p>`,
                  );
              }
            }
          },
        },
      });
    }

    /**
     * Adds the publish plugin.
     * @private
     */
    addPublishPlugin() {
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
        const ok = json.every((e) => e.status === 'ok');
        if (!resp.ok || !ok) {
          this.notify(
            `<p>Failed to purge ${path} from the cache. Please try again later.</p>
            <pre>Status: ${resp.status}</pre>
            <pre>${JSON.stringify(json)}</pre>`,
            0,
          );
        }
        return json;
        /* eslint-enable no-console */
      }

      this.add({
        id: 'publish',
        condition: (sidekick) => sidekick.isHelix(),
        button: {
          text: 'Publish',
          action: async () => {
            const { config, location } = this;
            if (!config.innerHost || !config.host) {
              this.notify(`Publish is not configured for ${config.project}`, 0);
              return;
            }
            this.showModal('Publishing...', true);
            const path = location.pathname;
            await sendPurge(config, path);
            const outerURL = `https://${config.host}${path}`;
            await fetch(outerURL, { cache: 'reload', mode: 'no-cors' });
            // eslint-disable-next-line no-console
            console.log(`redirecting ${outerURL}`);
            window.location.href = outerURL;
          },
        },
      });
    }

    /**
     * Creates a tag.
     * @private
     * @static
     * @param {object} elem The tag configuration object
     *   with the following properties:
     *   - {string} tag    The tag name (mandatory)
     *   - {string} text   The text content (optional)
     *   - {object} attrs  The attributes (optional)
     *   - {object} lstnrs The event listeners (optional)
     * @returns {HTMLElement} The new tag
     */
    static createTag(elem) {
      if (typeof elem.tag !== 'string') {
        return null;
      }
      const el = document.createElement(elem.tag);
      if (typeof elem.attrs === 'object') {
        for (const [key, value] of Object.entries(elem.attrs)) {
          el.setAttribute(key, value);
        }
      }
      if (typeof elem.lstnrs === 'object') {
        for (const [name, fn] of Object.entries(elem.lstnrs)) {
          if (typeof fn === 'function') {
            el.addEventListener(name, fn);
          }
        }
      }
      if (typeof elem.text === 'string') {
        el.textContent = elem.text;
      }
      return el;
    }

    /**
     * Creates a tag with the given name, attributes and listeners,
     * and appends it to the parent element.
     * @private
     * @static
     * @param {HTMLElement} parent The parent element
     * @param {object}      elem   The tag configuration object
     *   with the following properties:
     *   - {string} tag    The tag name (mandatory)
     *   - {string} text   The text content (optional)
     *   - {object} attrs  The attributes (optional)
     *   - {object} lstnrs The event listeners (optional)
     * @returns {HTMLElement} The new tag
     */
    static appendTag(parent, elem) {
      return parent.appendChild(Sidekick.createTag(elem));
    }

    /**
     * Returns the location of the current document.
     * @private
     * @static
     * @returns {Location} The location object
     */
    static getLocation() {
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
        if (typeof plugin.condition === 'function' && !plugin.condition(this)) {
          return this;
        }
        const $plugin = Sidekick.appendTag(this.root, {
          tag: 'div',
          attrs: {
            class: plugin.id,
          },
        });
        if (Array.isArray(plugin.elements)) {
          plugin.elements.forEach((elem) => Sidekick.appendTag($plugin, elem));
        }
        if (plugin.button) {
          Sidekick.appendTag($plugin, {
            tag: 'button',
            text: plugin.button.text,
            lstnrs: {
              click: plugin.button.action,
            },
          });
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

    isTest() {
      return this.config;
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
     * @param {string} msg The message to display
     * @param {number} level error (0), warning (1), of info (2) (default)
     */
    notify(msg, level = 2) {
      this.showModal(msg, false, level);
    }

    /**
     * Displays a modal notification.
     * @param {string} msg The message to display
     * @param {boolean} sticky True if message should be sticky, else false (default)
     * @param {number} level error (0), warning (1), of info (2) (default)
     * @returns {object} The sidekick
     */
    showModal(msg, sticky, level = 2) {
      if (!this._modal) {
        const $spinnerWrap = Sidekick.appendTag(document.body, {
          tag: 'div',
          attrs: {
            class: 'hlx-sk-overlay',
          },
        });
        this._modal = Sidekick.appendTag($spinnerWrap, { tag: 'div' });
      } else {
        this._modal.parentNode.classList.remove('hlx-sk-hidden');
      }
      if (msg) {
        this._modal.innerHTML = msg;
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
      Sidekick.appendTag(document.head, {
        tag: 'link',
        attrs: {
          rel: 'stylesheet',
          href,
        },
      });
      return this;
    }
  }

  // launch sidekick
  if (!window.hlxSidekick) {
    window.hlxSidekick = new Sidekick(window.hlxSidekickConfig).toggle();
  }
})();
