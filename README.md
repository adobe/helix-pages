# helix-pages

[![CircleCI](https://img.shields.io/circleci/project/github/adobe/helix-pages.svg)](https://circleci.com/gh/adobe/helix-pages)

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

## Testing with a new `helix-publish` version

1. create a branch in `helix-publish`
2. create a branch in `helix-pages` where the name contains `-publish-ci`
3. Helix Pages test builds will use the `helix-publish@ci` version
4. When everything works, merge the branch in `helix-publish` first, then in `helix-pages`


## "Redeploy" the current version

It is sometimes useful to re-deploy the current version. Re-running the CI publish process does not work because `hlx deploy` use the current `helix-config.yaml` and does not find "something new" to deploy.
To trigger a fresh new build, you simply need to push an empty commit to master (you need admin privileges) - the commit message must respect the semantic release logic to trigger what is needed. Here is an example:

```
git commit --allow-empty -m "fix(ci): trigger a new clean release"
```

## Incident management: revert to a previous working version

In case of incident, you may want to revert the production environment to a earlier version.

Requirements: you need to clone the current project and add a `.env` file which contains:

```
HLX_FASTLY_AUTH=<your auth token>
HLX_FASTLY_NAMESPACE=<the helix-pages fastly service id>
```

Checkout a previous working tag:

```bash
git checkout <tag>
```

and then run the publish command:

```bash
 hlx publish --custom-vcl='vcl/extensions.vcl'
```

After a few seconds, you can test a project like [https://theblog--adobe.hlx.page/](https://theblog--adobe.hlx.page/). Note that the browser cache needs to be clean, otherwise you may have false positives.

## Tracing

All actions on Runtime and the Fasty service config are instrumented (via CircleCI env vars) with Epsagon tracing instructions in the "Helix Services" app.

## How to use with Google Drive

Go to your Google Drive account
 * https://drive.google.com/drive/my-drive

Create a new shared folder to hold the website root
 * Click on the button “+ New” > Folder
 * Give the folder a name (e.g., sitename)
 * Double-click the sitename folder to open

Share the folder with helix
 * Select the menu arrow after MyDrive > sitename > Share with others ...
 * Share it with helix.integration@gmail.com
 * Give helix write permission (necessary for ???)
 * Copy the folder URL (e.g., https://drive.google.com/drive/folders/{id} )

Create a domain mount point on GitHub
 * Go to your GitHub home (e.g., https://github.com/username/ )
 * Select Repositories tab and green New button
 * Create a new repository
   * Give it a short name (for the domain)
   * Make it Public
 * Inside repository, create a new [fstab](https://github.com/adobe/helix-shared/blob/master/docs/fstab.md) file “fstab.yaml” with content:
```
mountpoints:
  /g: https://drive.google.com/drive/folders/{id}

```
where “url” is the Google Drive folder URL above

Create a file for each page of the site
 * Use drag & drop or the button “+ New” > Google Docs
 * Change the filename to index (no extension) or a page name (no extension)
 * Be sure to add an image (bug) and make a Heading 1 style title

Type your new website URL into a browser:
```
  https://{repo}-{username}.hlx.page/g/index.html
```

If you wish to view a different branch, you can use the following convention:
```
  https://{branch}--{repo}--{username}.hlx.page/g/index.html
```