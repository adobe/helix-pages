# [1.1.0](https://github.com/adobe/helix-pages/compare/v1.0.3...v1.1.0) (2019-10-18)


### Bug Fixes

* **IT:** fix the smoke tests, forgot to adjust branch name before merging ([47f84c8](https://github.com/adobe/helix-pages/commit/47f84c8))


### Features

* **IT:** Integration Tests "infrastructure" ([585aed5](https://github.com/adobe/helix-pages/commit/585aed5))

## [1.0.3](https://github.com/adobe/helix-pages/compare/v1.0.2...v1.0.3) (2019-10-07)


### Bug Fixes

* **deps:** update dependency snyk to v1.231.0 ([#92](https://github.com/adobe/helix-pages/issues/92)) ([f42343d](https://github.com/adobe/helix-pages/commit/f42343d))
* **package:** update snyk to version 1.231.1 ([7327903](https://github.com/adobe/helix-pages/commit/7327903))

## [1.0.2](https://github.com/adobe/helix-pages/compare/v1.0.1...v1.0.2) (2019-10-03)


### Bug Fixes

* **word:** add support for onedrive ([#88](https://github.com/adobe/helix-pages/issues/88)) ([bd682e2](https://github.com/adobe/helix-pages/commit/bd682e2))

## [1.0.1](https://github.com/adobe/helix-pages/compare/v1.0.0...v1.0.1) (2019-09-11)


### Bug Fixes

* **scripts:** clean up scripts ([9b7399a](https://github.com/adobe/helix-pages/commit/9b7399a))

# 1.0.0 (2019-09-11)


### Bug Fixes

* **build:** use helix-cli@4.x ([ee76182](https://github.com/adobe/helix-pages/commit/ee76182))
* **css:** add customer loader for content css ([ee98014](https://github.com/adobe/helix-pages/commit/ee98014))
* **fetch:** add preFetch step to favour local content first ([#45](https://github.com/adobe/helix-pages/issues/45)) ([4ddc0d5](https://github.com/adobe/helix-pages/commit/4ddc0d5))
* **google:** use default service when GOOGLE_DOCS_ROOT is not available ([#74](https://github.com/adobe/helix-pages/issues/74)) ([e401f71](https://github.com/adobe/helix-pages/commit/e401f71)), closes [#73](https://github.com/adobe/helix-pages/issues/73)
* **htl:** use document.body directly ([#39](https://github.com/adobe/helix-pages/issues/39)) ([0875faf](https://github.com/adobe/helix-pages/commit/0875faf))
* **js:** add custom loader for min.js ([7d6e7ae](https://github.com/adobe/helix-pages/commit/7d6e7ae))
* **js:** use correct content type ([e13a0e3](https://github.com/adobe/helix-pages/commit/e13a0e3))
* **prefetch:** ensure REPO_RAW_ROOT ([a8728db](https://github.com/adobe/helix-pages/commit/a8728db))
* **release:** reset version ([cfdf356](https://github.com/adobe/helix-pages/commit/cfdf356))
* **scripts:** use unsafe context to avoid xss escaping ([#16](https://github.com/adobe/helix-pages/issues/16)) ([fe86fb1](https://github.com/adobe/helix-pages/commit/fe86fb1))
* .snyk, package.json & package-lock.json to reduce vulnerabilities ([0258c39](https://github.com/adobe/helix-pages/commit/0258c39))


### Features

* **cache:** disable the dispatch cache ([651ce88](https://github.com/adobe/helix-pages/commit/651ce88))
* **content:** Support for google docs mounts ([#70](https://github.com/adobe/helix-pages/issues/70)) ([a526173](https://github.com/adobe/helix-pages/commit/a526173))
* **google:** improve fstab format and handle view only access in google script ([b6a177c](https://github.com/adobe/helix-pages/commit/b6a177c)), closes [#67](https://github.com/adobe/helix-pages/issues/67)
* **index:** adding idx json for rendering tables ([485f845](https://github.com/adobe/helix-pages/commit/485f845))
* **release:** setup semantic-release ([#75](https://github.com/adobe/helix-pages/issues/75)) ([0349c63](https://github.com/adobe/helix-pages/commit/0349c63))
