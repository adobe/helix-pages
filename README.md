# helix-pages

Helix Pages is the Helix project behind [https://*.project-helix.page/](https://www.project-helix.page/)

## Installation

Clone the current repo and run `hlx up`.

## Deployment and publication

// TODO: setup blackbox

## Publishing

Run `hlx publish`.

The project requires a patch of the online VCL as long as this issue [https://github.com/adobe/helix-pages/issues/1](https://github.com/adobe/helix-pages/issues/1) is not fixed.
Here are the manual step to go through after the `hlx publish`:

- Connect to Fastly
- Open the project-helix.page service
- Clone the latest configuration
- Edit the helix.vcl file:
  - locate the `hlx_owner`, `hlx_repo`, `hlx_ref` subroutines
  - remove them and replace them by the ones in this gits [https://gist.github.com/kptdobe/bd0f5bb10b88783a3cefd917beb98a68](https://gist.github.com/kptdobe/bd0f5bb10b88783a3cefd917beb98a68)
- Update the modifications
- Activate the new configuration
- **Purge the cache**

The patched version of the 3 subroutines adds the parsing of the host url to extract the content owner / repo that would override the one stored in the Fastly dictionnary.
