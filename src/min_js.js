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

/* eslint-disable import/no-unresolved */

const { computeSurrogateKey } = require('@adobe/helix-shared').utils;
const { runPipeline } = require('@adobe/helix-pipeline').OpenWhiskAction;
const { preFetch } = require('./utils.js');

/**
 * Tries to load the respective raw resource from the content repository. This is to
 * workaround an issue in the order the Fastly logic executes the templates.
 */
async function main(params) {
  const pipe = async (cont, context, action) => {
    await preFetch(context, action);
    if (context.response && context.response.body) {
      return {
        response: {
          status: 200,
          body: context.response.body,
          headers: {
            'Surrogate-Key': context.content.sources.map(computeSurrogateKey).join(' '),
            'Content-Type': 'application/javascript',
            'Cache-Control': 's-maxage=604800',
          },
        },
      };
    }
    return {
      response: {
        status: 404,
      },
    };
  };
  return runPipeline(() => {}, pipe, params);
}

module.exports.main = main;
