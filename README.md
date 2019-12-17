# helix-pages

Helix Pages is the Helix project behind [https://*.project-helix.page/](https://www.project-helix.page/)

## Installation

Clone the current repo and run `hlx up`.

## Deployment and publication

Direct commits to `master` branch are blocked, all changes must come via a PR. Once the PR is merged into `master`, the CI will `hlx deploy` and `hlx publish` the new code.

## Manual publishing

The project requires some extensions of the default VCL provided by Helix. The publish steps requires to include the extensions in [vcl/extensions.vcl](vcl/extensions.vcl). To publish, run:

```bash
 hlx publish --custom-vcl='vcl/extensions.vcl'
```

The patched version of the 3 subroutines adds the parsing of the host url to extract the content owner / repo that would override the one stored in the Fastly dictionary.
