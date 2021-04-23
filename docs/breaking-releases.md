# Breaking Release Handling

Most of the new features and bug fixes are backward compatible. Those updates are automatically
applied to helix pages and its services.

For major update or incompatible changes, helix has a mechanism in place to deal with those breaking
changes. We usually allow 1 month for stabilizing the release and 1 month for customers to adopt
the changes. A potential timeline would be:

| time | action |
|------|--------|
| March     | start the breaking release **March 2021**. | 
|           | add changes, stabilize release |
| April     | notify customers |
|           | customers have time to adjust their code base |
| EOF April | apply breaking changes to default |
| May       | start the breaking release **May 2021**. |


Here's an overview of lifecycle of a breaking change:

0. One or several changes are identified that are breaking and are scheduled for the next breaking release.
1. A special branch with the format `breaking-YYYYMM` is created in `helix-pages`. for example `breaking-202103` for
   the March 2021 release. 
2. Along with the new branch also a new strain is added to the `helix-config.yaml`, eg:
```yaml
  - name: breaking-202103
    sticky: false
    condition:
      preflight.x-pages-version=: breaking-202103
    code: https://github.com/adobe/helix-pages.git#breaking-202103
    content: https://github.com/adobe/helix-pages.git#breaking-202103
    static: https://github.com/adobe/helix-pages.git/htdocs#breaking-202103
    package: https://helix-pages.anywhere.run/pages_4-27-2-breaking-202103
```

3. The respective helix-pages code changes are added to the breaking branch via a pull request.
   **Note** that the PRs must have the breaking branch as a base.
4. Circle CI will automatically deploy and publish the changes and update the helix config in 
   the default branch automatically.
5. Breaking changes in services need to be deployed using the next major versions which will be added
   to the `version-lock` property of the strain config. eg:
```
   version-lock:
    content-proxy: 4.2.1-breaking
```
6. Breaking changes in `helix-pipeline` will be maintained on dedicated breaking branch and
   referenced via a github npm dependency eg:
```
   "@adobe/helix-pipeline": "adobe/helix-pipeline#breaking-202103",
```
7. At the end of the month, all customers will be notified about the upcoming breaking release via
   respective communication channels.
8. Customers can create testing branches by adding a `helix-version.txt` containing the name of the
   breaking release, eg:
```
breaking-202103
```
9. Local devs using `helix-cli` will be presented with an information / warning if their `main`
   branch s not running on the breaking release version yet.
10. At the end of the following month, the breaking changes will become default:
    - changes to `helix-pipeline` will be released using a new major version
    - changes to any services will be released using the new major version
    - the breaking branch in `helix-pages` will be merged to the default branch.
