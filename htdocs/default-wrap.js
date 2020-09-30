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
/* global window, document */

/**
 * Creates a tag with the given name and attributes.
 * @param {string} name The tag name
 * @param {object} attrs An object containing the attributes
 * @returns The new tag
 */
function createTag(name, attrs) {
  const el = document.createElement(name);
  if (typeof attrs === 'object') {
    for (const [key, value] of Object.entries(attrs)) {
      el.setAttribute(key, value);
    }
  }
  return el;
}

/**
 * Wraps nodes with a new parent node.
 * @param {array} nodes The nodes to wrap
 * @param {node} newparent The new parent node
 */
function wrapNodes(newparent, nodes) {
  nodes.forEach((el) => {
    newparent.appendChild(el.cloneNode(true));
    if (newparent.children.length !== 1) {
      el.parentNode.removeChild(el);
    } else {
      el.parentNode.replaceChild(newparent, el);
    }
  });
}

/**
 * Uses a selector to find and wrap nodes with a new parent element,
 * which will get the specified CSS class.
 * @param {string} classname The CSS class for the wrapping node
 * @param {array|string} selectors The selectors for the affected nodes
 * @param {HTMLElement} root The root element for the query selector (defaults to document)
 */
function wrap(classname, selectors, root) {
  if (!Array.isArray(selectors)) {
    // eslint-disable-next-line no-param-reassign
    selectors = [selectors];
  }
  const div = createTag('div', { class: classname });

  selectors.forEach((selector) => {
    const elems = (root || document).querySelectorAll(selector);
    wrapNodes(div, elems);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('main > div');

  if (sections[0]) {
    // first section has starting image: add title class and wrap all subsequent items inside a div
    if (sections[0].querySelector('p:first-child>img')) {
      sections[0].classList.add('title');
      wrap('header', ':nth-child(1n+2)', sections[0]);
    }
  }

  sections.forEach((section) => {
    // sections consisting of only one image
    if (!section.classList.contains('title')
      && section['data-hlx-types'] === 'has-only-image') {
      section.classList.add('image');
    }
    // sections without image and title class gets a default class
    if (!section.classList.contains('image')
      && !section.classList.contains('title')) {
      section.classList.add('default');
    }
  });
});
