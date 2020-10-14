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

/* eslint-disable no-undef */
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
 * Wraps all the elements identified by the selector with a div.section-wrapper.
 * @param {string} selector selector
 */

function wrap(selector, className) {
  document.querySelectorAll(selector).forEach(($e) => {
    const $wrapper = createTag('div', { class: className });
    $e.parentNode.replaceChild($wrapper, $e);
    $wrapper.appendChild($e);
  });
}

/**
 * Turn leading image into a title section.
 */

function createHeroSection() {
  const $headerImg = document.querySelector('main>div:first-of-type>div>:first-child>img');
  if ($headerImg) {
    const src = $headerImg.getAttribute('src');
    const $wrapper = $headerImg.closest('.section-wrapper');
    $wrapper.style.backgroundImage = `url(${src})`;
    $wrapper.classList.add('hero');
    $headerImg.parentNode.remove();
  }
}

function decoratePage() {
  wrap('main table', 'table-wrapper');
  wrap('main>div', 'section-wrapper');
  createHeroSection();
}

window.addEventListener('DOMContentLoaded', () => {
  decoratePage();
});
