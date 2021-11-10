# Setup indexing in your helix project step by step

This document explains how to setup indexing in your Helix 3 project. Currently, indexing into
an Excel workbook in a SharePoint folder, only, is supported.

## Setting up an initial query index

If you start with the `helix-pages-starter` project you will have a `helix-query.yaml` configuration
file in your GitHub repository. After having setup your `fstab.yaml` with a mountpoint that points
into your SharePoint folder, find a location where your query index will be located (e.g. `/mysite`).

Now enter the target URL of that query index location:

1. Select the parent folder in the Sharepoint UI
2. Choose action `Copy Link`, and select `Copy` in the popup window
3. Paste the link into the `helix-query.yaml`s target property

In order to decide what properties should be indexed in your HTML pages, look at the existing
`properties` found in the starter `helix-query.yaml`. Further information on their semantics
can be found in the [Reference](https://github.com/adobe/helix-index-files#reference) section
of the `helix-index-files` project.

## Checking what your indexed page would look like

The Helix 3 Admin Service has an API endpoint where you can check the index representation of
your page. Given your GitHub owner, repository, branch and owner, and a resource, its endpoint
is:

https://admin.hlx3.page/index/`owner`/`repo`/`branch`/`resource`

You should get a JSON response, where `data` contains the index representation of your page.

## Setting up more index configurations

You can have more than index configuration in the same `helix-query.yaml`, again see
[Reference](https://github.com/adobe/helix-index-files#reference) for more details

## Setting up an AWS queue to store inded records into

This is currently a manual process, that someone from the Helix Project must invoke. Please contact
some team member and tell them your project's GitHub owner and repository.

## Index a page so it ends up in the Excel workbook

Publish a page and it will get indexed, i.e. its index representation will be stored in the AWS
queue, where it is picked up and stored in the Excel workbook.