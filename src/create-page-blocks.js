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
const { toClassName } = require('./utils.js');

/**
 * Creates a "DIV representation" of a table.
 * @param {Document} document
 * @param {HTMLTableElement} $table the table element
 * @param {string[]} cols the column names
 * @returns {HTMLDivElement} the resulting div
 */
function tableToDivs(document, $table, cols) {
  const $rows = $table.querySelectorAll('tbody tr');
  const $cards = document.createElement('div');
  $cards.classList.add(cols.join('-'));
  $rows.forEach(($tr) => {
    const $card = document.createElement('div');
    $tr.querySelectorAll('td').forEach(($td, i) => {
      const $div = document.createElement('div');
      if (cols.length > 1) {
        $div.classList.add(cols[i]);
      }
      $div.append(...$td.childNodes);
      $card.append($div);
    });
    $cards.append($card);
  });
  return $cards;
}

/**
 * Converts tables into page blocks.
 * see https://github.com/adobe/helix-pages/issues/638
 * @param context The current context of processing pipeline
 */
function createPageBlocks({ content }) {
  const { document } = content;
  document.querySelectorAll('body div > table').forEach(($table) => {
    const $cols = $table.querySelectorAll('thead tr th');
    const cols = Array.from($cols).map((e) => toClassName(e.innerHTML)).filter((e) => !!e);
    const $div = tableToDivs(document, $table, cols);
    $table.parentNode.replaceChild($div, $table);
  });
}

module.exports = createPageBlocks;
