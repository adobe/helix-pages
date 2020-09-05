# Breaking Changes

_DRAFT_

This branch is a test to see how specific versions of helix services can be selected
in order to give a preview of upcoming breaking changes.

## How to publish

**DON'T PUBLISH TO THE REAL PAGES Service** (yet)

```
hlx publish --custom-vcl='vcl/extensions.vcl'
```

## Example Request

- https://breaking-september--pages--adobe.99productrules.com/premiere/en/yts-livestream

## Selected Services

### helix-pipeline

*Note*: The pipeline version needs to be _locked_ via the `package.json`

Pipeline that enables the new version-lock feature

- https://github.com/adobe/helix-pipeline/pull/840
- `https://github.com/adobe/helix-pipeline.git#helix-lock-support`


### helix-dispatch

*Note*: The dispatch version needs to be _locked_ via the `extensions.vcl`

Dispatch that enables the new version-lock feature

- https://github.com/adobe/helix-dispatch/pull/338
- `/helix/helix-services/dispatch@ci1939`

### helix-contentproxy

Contentproxy that enables the new version-lock feature

- https://github.com/adobe/helix-content-proxy/pull/155
- `/helix/helix-services/content-proxy@ci830`

### helix-gdocs2md

Google docs converter that has a slight different table handling.

- https://github.com/adobe/helix-gdocs2md/pull/330
- `/helix/helix-services/gdocs2md@ci1485`

# TODO:

- hacking the `x-ow-version-lock` and `dispatch` version to the extensions is not so nice. could also be a property of a strain.
- add simple mechanism to tag some PRs in order to get a stable CI version.
- add a tool to collect/update tagged services
