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

function takeMeThere() {
  // eslint-disable-next-line no-undef
  const giturl = document.getElementById('giturl').value;
  const resegs = /(?<!\?.+)(?<=\/)[\w-]+(?=[/\r\n?]|$)/g;
  const segments = [...giturl.matchAll(resegs)];
  const user = segments[0][0];
  const repo = segments[1][0];
  const branch = segments[3][0];
  let separator = '-';

  const path = giturl.substr(
    segments[3].index + branch.length,
    giturl.length - (segments[3].index + branch.length) - 3
  );
  if (user.indexOf('-') >= 0 || branch !== 'master') {
    separator = '--';
  }
  const branchprefix = (branch === 'master' ? '' : branch + separator);
  const url = `https://${branchprefix}${repo}${separator}${user}.project-helix.page${path}.html`;
  // eslint-disable-next-line no-undef
  window.location = url;
}

function takeMeThereInit() {
  // eslint-disable-next-line no-undef
  const takeMeThereButton = document.getElementById('takeMeThere');
  if (takeMeThereButton) {
    takeMeThereButton.onclick = takeMeThere;
  }
}

takeMeThereInit();
