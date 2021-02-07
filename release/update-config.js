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

/* eslint-disable no-console,no-plusplus */
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const fs = require('fs-extra');
const { HelixConfig } = require('@adobe/helix-shared');
const pkgJson = require('../package.json');

// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const WSK_NAMESPACE = process.env.HLX_WSK_NAMESPACE || 'helix-pages';

async function saveConfig(cfg) {
  const src = cfg.toYAML();
  if (await fs.pathExists(cfg.configPath)) {
    await fs.copy(cfg.configPath, `${cfg.configPath}.old`);
  }
  return fs.writeFile(cfg.configPath, src, 'utf-8');
}

async function run() {
  let { version } = pkgJson;
  let strain = 'default';
  let i = 2;
  while (i < process.argv.length) {
    switch (process.argv[i++]) {
      case '--pkgVersion':
        version = process.argv[i++];
        break;
      case '--strain':
        strain = process.argv[i++];
        break;
      default:
        throw new Error('unknown option: ', process.argv[i - 1]);
    }
  }

  const cfg = await new HelixConfig()
    .withConfigPath(path.resolve(__dirname, '..', 'helix-config.yaml'))
    .init();

  const affected = [cfg.strains.get(strain)];
  let modified = false;

  // update package in affected strains
  console.log('Updating affected strains:');
  const packageProperty = `${WSK_NAMESPACE}/pages_${version}`;
  affected.forEach((s) => {
    console.info(`- ${s.name}`);
    if (s.package !== packageProperty) {
      modified = true;
      // eslint-disable-next-line no-param-reassign
      s.package = packageProperty;
    }
  });

  if (modified) {
    await saveConfig(cfg);
    console.log(`\nUpdated 'helix-config.yaml' to version ${version}`);
  }
}

run().catch(console.error);
