# How to add indexing to your Helix 3 project step by step

This document explains how to setup indexing in your Helix 3 project.

## Setting up an initial query index

If you start with the `helix-pages-starter` project you will have a `helix-query.yaml` configuration
file in your GitHub repository. After having setup your `fstab.yaml` with a mountpoint that points
into your SharePoint site or Google Drive, select a folder where your query index should be located,
and enter the path relative to your mountpoint, e.g.:

- `/query-index.xlsx` for a Sharepoint Site
- `/query-index` for Google Drive

For Sharepoint, the indexer will automatically setup the Excel workbook. For Google Drive, however,
you have to create the spreadsheet yourself:

1. Create the spreadsheet at the location specified above
2. In that spreadsheet, create a sheet named `raw_index`
3. In that sheet, enter the names of the properties in your `helix-query.yaml` in the first row -
   one property name per cell - and add an entry `path`.

## Setting up the properties that should be added to the index

In order to decide what properties should be indexed in your HTML pages, look at the existing
`properties` node in the starter `helix-query.yaml`. Further information on their semantics can be
found in the [Reference](https://github.com/adobe/helix-index-files#reference) section of the
`helix-index-files` project.

## Checking what your indexed page would look like

The Helix 3 Admin Service has an API endpoint where you can check the index representation of
your page. Given your GitHub owner, repository, branch and owner, and a resource path to your
page, its endpoint is:

https://admin.hlx3.page/index/`owner`/`repo`/`branch`/`path`

You should get a JSON response, where the `data` node contains the index representation of
your page.

## Debug your index configuration

The Helix CLI has a feature where it will print the index record whenever you change your query
configuration, which assists in finding the correct CSS selectors:
```
$ hlx up --print-index
```
For more information, visit https://github.com/adobe/helix-cli.

## Setting up more index configurations

You can have more than one index configuration in the same `helix-query.yaml`, where different
branches are indexed into different Excel workbooks or Google spreadsheets. Again see the
[Reference](https://github.com/adobe/helix-index-files#reference) for more details

## Setting up an AWS queue to store indexed records into

This is currently a manual process, that someone from the Helix Project must invoke. Please contact
some team member and tell them your project's GitHub owner and repository.

## Index a page so it ends up in the Excel workbook or Geegle spreadsheet

Publish a page and it will get indexed, i.e. its index representation will be stored in the AWS
queue, where it is picked up and stored in the Excel workbook or Google spreadsheet.
