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

'use strict';

const fse = require('fs-extra');
const { resolve } = require('path');
const pick = require('lodash.pick');

/**
 * Algolia compatible read-only index loaded from file for testing.
 */
class AlgoliaIndex {
  constructor(name) {
    this._name = name;
    this._file = resolve(__dirname, `${name}.json`);
  }

  async init() {
    if (!this._contents) {
      this._contents = JSON.parse(await fse.readFile(this._file, 'utf-8'));
    }
  }

  async search(_, { hitsPerPage, page, attributesToRetrieve }) {
    await this.init();

    const startIndex = page * hitsPerPage;
    if (startIndex >= this._contents.length) {
      return [];
    }
    const hits = this._contents
      .slice(startIndex, startIndex + hitsPerPage)
      .map((hit) => pick(hit, attributesToRetrieve));
    return {
      nbHits: hits.length,
      hits,
    };
  }

  async deleteObject(objectID) {
    await this.init();

    const idx = this._contents.findIndex((item) => item.objectID);
    if (idx !== -1) {
      this._contents.splice(idx);
    }
    return objectID;
  }

  async saveObjects(docs) {
    await this.init();

    this._contents.push(...docs);
    return docs.length;
  }

  get name() {
    return this._name;
  }
}

module.exports = AlgoliaIndex;
