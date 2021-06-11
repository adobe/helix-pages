## [7.2.4](https://github.com/adobe/helix-pages/compare/v7.2.3...v7.2.4) (2021-06-11)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v14.0.11 ([#933](https://github.com/adobe/helix-pages/issues/933)) ([a7a133f](https://github.com/adobe/helix-pages/commit/a7a133f3cb4b343d29a3fc729b3d0dbed3787686))

## [7.2.3](https://github.com/adobe/helix-pages/compare/v7.2.2...v7.2.3) (2021-06-10)


### Bug Fixes

* **deploy:** do not pin the universal strain to amazon web services ([#841](https://github.com/adobe/helix-pages/issues/841)) ([07f87ea](https://github.com/adobe/helix-pages/commit/07f87ea97e33e4a4ef83b152f900d9e0cea113eb))

## [7.2.2](https://github.com/adobe/helix-pages/compare/v7.2.1...v7.2.2) (2021-06-07)


### Bug Fixes

* **deps:** update adobe fixes ([#930](https://github.com/adobe/helix-pages/issues/930)) ([b8f121b](https://github.com/adobe/helix-pages/commit/b8f121ba08d4f62f0df76b5aac848d33fe111685))

## [7.2.1](https://github.com/adobe/helix-pages/compare/v7.2.0...v7.2.1) (2021-06-01)


### Bug Fixes

* **deps:** update adobe fixes ([#912](https://github.com/adobe/helix-pages/issues/912)) ([ae43b17](https://github.com/adobe/helix-pages/commit/ae43b170cc99fca6d55f3c97afe38a511f91ceb5))

# [7.2.0](https://github.com/adobe/helix-pages/compare/v7.1.0...v7.2.0) (2021-05-31)


### Features

* **sidekick:** make branch-agnostic ([195530b](https://github.com/adobe/helix-pages/commit/195530b52b168bd015f37f027973af8d553fada8))

# [7.1.0](https://github.com/adobe/helix-pages/compare/v7.0.1...v7.1.0) (2021-05-31)


### Features

* enable RUM through helix-publish ([9112300](https://github.com/adobe/helix-pages/commit/9112300f310ceb4a9ee5ddcbd36066135571dbe0))
* **sidekick:** suppress /index from webUrl in .lnk report ([6de207f](https://github.com/adobe/helix-pages/commit/6de207f918526b6c882949a191b7758cca75bfa6))

## [7.0.1](https://github.com/adobe/helix-pages/compare/v7.0.0...v7.0.1) (2021-05-20)


### Bug Fixes

* **metadata:** use real Headers ([67a348c](https://github.com/adobe/helix-pages/commit/67a348c3210545fa25453c135aad66f17e155d11))

# [7.0.0](https://github.com/adobe/helix-pages/compare/v6.2.0...v7.0.0) (2021-05-20)


### Bug Fixes

* **pages:** Revert back to 6.1.0 ([37848b2](https://github.com/adobe/helix-pages/commit/37848b29bc71741e704947a63a2f6fba3ca33bb6))
* **pages:** Revert Revert. back to 6.2.0 [skip ci] ([7c72356](https://github.com/adobe/helix-pages/commit/7c72356a6c09f1c4dc06de0d06dae20837f1c648))


### Features

* **sidekick:** seamless env roundtrips ([6133483](https://github.com/adobe/helix-pages/commit/613348374708374675a9c3beecf21671d8f176dd))
* **sidekick:** seamless env roundtrips ([98215c0](https://github.com/adobe/helix-pages/commit/98215c02125dc47a1a09cdd11db0ec41e57b373f))
* **sidekick:** seamless env roundtrips ([91cd642](https://github.com/adobe/helix-pages/commit/91cd6428c68f5bf0efe97e322e78347544e89727))
* **sidekick:** switch default branch to main in bookmarklet generator ([915e00e](https://github.com/adobe/helix-pages/commit/915e00ebee83bba30d2a4fdbd81c4af253529902))
* **sidekick:** use hlx3 lookup links ([07e5334](https://github.com/adobe/helix-pages/commit/07e533432b663d5fced6b0636328e2fa8660332c))


### BREAKING CHANGES

* **sidekick:** custom overrides or extensions of the prior edit or preview plugins need to be refactored
* **sidekick:** projects still using master as default need to specify it as part of the gh url, e.g. https://github/owner/repo/tree/master

# [6.2.0](https://github.com/adobe/helix-pages/compare/v6.1.0...v6.2.0) (2021-05-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-cli to v13.4.34 ([#911](https://github.com/adobe/helix-pages/issues/911)) ([53fa896](https://github.com/adobe/helix-pages/commit/53fa896e843bd2d944375224bcd0aee46427ab1a))
* **pre:** ensure that embed and plain also run pre ([3f53072](https://github.com/adobe/helix-pages/commit/3f53072bf9d492ffc6e60394e56a285d990ea94a))
* **seo:** metadata can be duplicated vs overridden ([db4bb01](https://github.com/adobe/helix-pages/commit/db4bb0152f2d7de8e4ec07e69d6c16e37067ef6d))
* add own strain ([0e51996](https://github.com/adobe/helix-pages/commit/0e519967e01c811db05e5efc4bda17303bae3afb))


### Features

* simpler glob matching ([2d948c4](https://github.com/adobe/helix-pages/commit/2d948c4d05a02863ba3e68e40401874e00e81347))
* simpler glob matching ([1ae0ad9](https://github.com/adobe/helix-pages/commit/1ae0ad9124b32742559eb588ac8ba139bf7c1127))
* **seo:** do not overwrite empty values ([13468f0](https://github.com/adobe/helix-pages/commit/13468f059156bac7899de3e89d5f4200d926a483))
* **seo:** metadata from spreadsheet ([2221248](https://github.com/adobe/helix-pages/commit/2221248e8db5084a87c7f01392f3b30cff7f4dee))
* **seo:** metadata from spreadsheet ([0fa085d](https://github.com/adobe/helix-pages/commit/0fa085d3083a2300ea6849abd856f74679cf4e3a))
* **seo:** metadata from spreadsheet ([ea76cf3](https://github.com/adobe/helix-pages/commit/ea76cf317b68817a5aaf7729cd2a57507d17dedd))
* **seo:** metadata from spreadsheet ([978b3e2](https://github.com/adobe/helix-pages/commit/978b3e2bd9d6f85331a6ab90a85804fd5646cd36))

# [6.1.0](https://github.com/adobe/helix-pages/compare/v6.0.1...v6.1.0) (2021-05-13)


### Bug Fixes

* **blocks:** add support for package block in tables ([cd839f5](https://github.com/adobe/helix-pages/commit/cd839f5283d184b533f0405d9bae52677fe0f26a))
* **deps:** update dependency @adobe/helix-deploy to v4.5.1 ([#906](https://github.com/adobe/helix-pages/issues/906)) ([75268f9](https://github.com/adobe/helix-pages/commit/75268f9747a7faba6b723b1c804f1b2bb8f86fb1))


### Features

* **tables:** support nested tables ([96b7092](https://github.com/adobe/helix-pages/commit/96b70925812b51cd97cbd276f7482e6f4d927f1d))

## [6.0.1](https://github.com/adobe/helix-pages/compare/v6.0.0...v6.0.1) (2021-05-08)


### Bug Fixes

* **deps:** update dependency @adobe/helix-deploy to v4.5.0 ([fa901fb](https://github.com/adobe/helix-pages/commit/fa901fbd1ae4ecfe89ce1c724371894540babeb2))
* **deps:** update dependency @adobe/helix-universal to v1.5.0 ([6a771bd](https://github.com/adobe/helix-pages/commit/6a771bde7c6bff71d3abce96c5b634471cea919d))

# [6.0.0](https://github.com/adobe/helix-pages/compare/v5.0.4...v6.0.0) (2021-05-06)


* Merge pull request #662 from adobe/breaking-202103 ([f00f452](https://github.com/adobe/helix-pages/commit/f00f452bc8a52a97e296fbb40b373f9a537382da)), closes [#662](https://github.com/adobe/helix-pages/issues/662) [#657](https://github.com/adobe/helix-pages/issues/657) [#638](https://github.com/adobe/helix-pages/issues/638) [#728](https://github.com/adobe/helix-pages/issues/728) [#729](https://github.com/adobe/helix-pages/issues/729) [#745](https://github.com/adobe/helix-pages/issues/745) [#786](https://github.com/adobe/helix-pages/issues/786) [#796](https://github.com/adobe/helix-pages/issues/796) [#806](https://github.com/adobe/helix-pages/issues/806) [#748](https://github.com/adobe/helix-pages/issues/748) [adobe/helix-pipeline#1005](https://github.com/adobe/helix-pipeline/issues/1005)


### Bug Fixes

* **breaking:** make branch unsticky ([0478b9a](https://github.com/adobe/helix-pages/commit/0478b9a3e6912dee3d1e34340f8ba8d60601b879))
* **breaking:** revert metadata from spreadsheet ([a59601b](https://github.com/adobe/helix-pages/commit/a59601b881a910bcc0ae5b1eef8cd721b9240383)), closes [#801](https://github.com/adobe/helix-pages/issues/801)
* **config:** add breaking strain and version file ([9513746](https://github.com/adobe/helix-pages/commit/9513746eb65f677fa7b07ef5bb2a10ca61823a26))
* **deps:** update adobe fixes ([#661](https://github.com/adobe/helix-pages/issues/661)) ([161bf09](https://github.com/adobe/helix-pages/commit/161bf09547528ce220355829597fdac918a15e54))
* **deps:** update adobe fixes ([#881](https://github.com/adobe/helix-pages/issues/881)) ([09d5c77](https://github.com/adobe/helix-pages/commit/09d5c77ca354e2924b83f6b717808b736c96712f))
* **deps:** use universal-logger ([c3ba89a](https://github.com/adobe/helix-pages/commit/c3ba89a683fbffb1a93af76b8b6a717d4ee25c0a))
* **html:** fix sections for also plain.html ([65a78de](https://github.com/adobe/helix-pages/commit/65a78def95da7fc1d1f43ff25a25f5888db8d3cd)), closes [#748](https://github.com/adobe/helix-pages/issues/748)
* **meta:** hero image is not correct ([#775](https://github.com/adobe/helix-pages/issues/775)) ([b510376](https://github.com/adobe/helix-pages/commit/b510376f7fb607de1230d3b0054efbec4c874808)), closes [#745](https://github.com/adobe/helix-pages/issues/745)
* **pageblocks:** avoid errors if empty table header ([40b57be](https://github.com/adobe/helix-pages/commit/40b57be219b16f0d61f805d2e43d95ddf5e3c050))
* **pageblocks:** remove classes from cells ([04fff0c](https://github.com/adobe/helix-pages/commit/04fff0cc9c62e935b3bc9cd30c4f3793cc945af4))
* **picture:** use backward compatible format ([0491276](https://github.com/adobe/helix-pages/commit/049127683ff30188ccae73078ac8420b96ed0c0b))
* **pre:** adjust image optimization ([#828](https://github.com/adobe/helix-pages/issues/828)) ([743911b](https://github.com/adobe/helix-pages/commit/743911b8e75cf772249052aca49d360b0be808e6)), closes [#657](https://github.com/adobe/helix-pages/issues/657)
* **seo:** canonical url enforces html extension ([5f121cd](https://github.com/adobe/helix-pages/commit/5f121cdd7ff34baedfe7776cc19afc266449ef80))
* **seo:** detect meta title inside block ([6a25bef](https://github.com/adobe/helix-pages/commit/6a25bef371d2e81e51ad8b33e73f4051e470f7e6))
* **seo:** meta title is not document title ([62b8533](https://github.com/adobe/helix-pages/commit/62b85336d73cb628142761fff6060864d05d4ea9))
* **sidekick:** endless update loop ([a3ca8f7](https://github.com/adobe/helix-pages/commit/a3ca8f7619dc30772f924aa979429487eefafae1))


### Features

* **blob:** adjust to rootless image paths ([daaf3b3](https://github.com/adobe/helix-pages/commit/daaf3b33cc2238dab89841659d20a4030268bb40))
* **blob:** adjust to rootless image paths ([91ad284](https://github.com/adobe/helix-pages/commit/91ad2844c06944f9d2c232067f2bf2922895b1ee))
* **blob:** adjust to rootless image paths ([ba541cd](https://github.com/adobe/helix-pages/commit/ba541cd93f90f1746352bf0fbe3251817f2c3856))
* **blobs:** adjust to rootless image paths ([6dce2ec](https://github.com/adobe/helix-pages/commit/6dce2ec5936adac58abbdc566b223560ed008476))
* **html:** all img tags ([00c3bbf](https://github.com/adobe/helix-pages/commit/00c3bbfdba7626ac4aea268b7595b15faa26e90f))
* **html:** responsive images with <picture> ([#657](https://github.com/adobe/helix-pages/issues/657)) ([4e81f25](https://github.com/adobe/helix-pages/commit/4e81f25ab81df15b3972500a3520307eeb0ba43d))
* **html:** responsive images with <picture> ([#657](https://github.com/adobe/helix-pages/issues/657)) ([ee700b5](https://github.com/adobe/helix-pages/commit/ee700b5adac46b88b547cbcd539ffa86d6abfc8f))
* **html:** responsive images with <picture> ([#657](https://github.com/adobe/helix-pages/issues/657)) ([31bcc77](https://github.com/adobe/helix-pages/commit/31bcc77a61d543e35ca286364e5e68d6c779ddee))
* **meta:** add support for metadata with array of values (multiple p or ol/ul) ([4f03461](https://github.com/adobe/helix-pages/commit/4f03461fc0ac525e59556fb2e015ae3a100418a3))
* **metadata:** support line-separated lists and custom metadata ([688e9c0](https://github.com/adobe/helix-pages/commit/688e9c0fa4d41a117a6c43c7687fdf81fe19f6cb))
* **render:** wrap all sections in 2 divs ([85990f9](https://github.com/adobe/helix-pages/commit/85990f9983fc0d5731112fb87a8e096209d6c171)), closes [#640](https://github.com/adobe/helix-pages/issues/640)
* **seo:** metadata block handling ([fbfa503](https://github.com/adobe/helix-pages/commit/fbfa503c02e424b47985f5114cfa7de004277e18))
* **seo:** metadata from spreadsheet ([#801](https://github.com/adobe/helix-pages/issues/801)) ([cd6b9db](https://github.com/adobe/helix-pages/commit/cd6b9db1d47c2b98af4229ade61a5b4a8b13bdb5))
* **seo:** use meta image from block ([5ffa59e](https://github.com/adobe/helix-pages/commit/5ffa59e15310949cfe81b7508689af9abd37b996))
* inplement server side blocks handling ([#702](https://github.com/adobe/helix-pages/issues/702)) ([73c1a0a](https://github.com/adobe/helix-pages/commit/73c1a0a2bcfce0783c072d0a4094b9ec8c06adae)), closes [#638](https://github.com/adobe/helix-pages/issues/638)


### BREAKING CHANGES

* march 2021

## [5.0.4](https://github.com/adobe/helix-pages/compare/v5.0.3...v5.0.4) (2021-04-28)


### Bug Fixes

* **sidekick:** auto-heal ([8d0e1e4](https://github.com/adobe/helix-pages/commit/8d0e1e4561930086244ff6f402a23fd8b78361e1))
* **sidekick:** byocdn flag always set on update ([7622deb](https://github.com/adobe/helix-pages/commit/7622debaf2945c4234c11c00f0f78693e452235a))
* **sidekick:** trigger update dialog on affected configs ([d113272](https://github.com/adobe/helix-pages/commit/d1132729feff70d1f77aa6b045250cfbff9f2ce4))

## [5.0.3](https://github.com/adobe/helix-pages/compare/v5.0.2...v5.0.3) (2021-04-23)


### Bug Fixes

* **vcl:** reduce workspace usage ([3ff5f21](https://github.com/adobe/helix-pages/commit/3ff5f21dd6b3d98be6da5f8cb23d370853910d67))

## [5.0.2](https://github.com/adobe/helix-pages/compare/v5.0.1...v5.0.2) (2021-04-22)


### Bug Fixes

* trigger publish ([d946a05](https://github.com/adobe/helix-pages/commit/d946a05b23b81a4c87d806c90cd3b89f86f8604b))

## [5.0.1](https://github.com/adobe/helix-pages/compare/v5.0.0...v5.0.1) (2021-04-22)


### Bug Fixes

* **sidekick:** share url missing byocdn flag ([a9099a7](https://github.com/adobe/helix-pages/commit/a9099a76cfa08b812c9b12316c63cbed260b9412))

# [5.0.0](https://github.com/adobe/helix-pages/compare/v4.28.0...v5.0.0) (2021-04-21)


### Bug Fixes

* **deps:** update adobe fixes ([d952bec](https://github.com/adobe/helix-pages/commit/d952becbd75486ed15b88a0b8dc064b2336f089d))


### Features

* **sidekick:** switch default branch to main in bookmarklet generator ([19357fe](https://github.com/adobe/helix-pages/commit/19357fe9fee593dd59945c97288b45c7703be96e))


### BREAKING CHANGES

* **sidekick:** projects still using master as default need to specify it as part of the gh url, e.g. https://github/owner/repo/tree/master

# [4.28.0](https://github.com/adobe/helix-pages/compare/v4.27.2...v4.28.0) (2021-04-21)


### Bug Fixes

* **deps:** update adobe fixes ([#874](https://github.com/adobe/helix-pages/issues/874)) ([86329a4](https://github.com/adobe/helix-pages/commit/86329a4b496e91ce2345b45e30f3034e6222466d))
* accelerate loading plugins in editor ([5554c40](https://github.com/adobe/helix-pages/commit/5554c406b162cc882e955d302dfc6835c8853b0d))
* **sidekick:** innerHost is hlx.live ([943eed0](https://github.com/adobe/helix-pages/commit/943eed0902247fa662ebf37a20cd1271170d421e))


### Features

* **sidekick:** always reload context when activated ([6122e94](https://github.com/adobe/helix-pages/commit/6122e9428c77e0636a9a942d72ae389bf42c44b3))
* **sidekick:** load sidekick from same host as bookmarklet generator ([b7f3893](https://github.com/adobe/helix-pages/commit/b7f38938996179a521e55415921541919f98278d))
* **sidekick:** middle click and meta key support for all plugins ([8bc4db5](https://github.com/adobe/helix-pages/commit/8bc4db50d4249b1c0c52a1824ec15e6d23ec186d))
* **sidekick:** middle click and meta key support for all plugins ([f5bd6c0](https://github.com/adobe/helix-pages/commit/f5bd6c037dc0328c3d301c1abc1daaa3b4915fee))
* **sidekick:** middle click and meta key support for all plugins ([af52552](https://github.com/adobe/helix-pages/commit/af52552cb68244c7792b0f8d626ca452c2033a60))
* **sidekick:** no publish button on byocdn prod host ([20c1a21](https://github.com/adobe/helix-pages/commit/20c1a2136b7534a3f55fe1be6ba69196d9d2b3fc))
* **sidekick:** use .lnk URLs ([2ab96ab](https://github.com/adobe/helix-pages/commit/2ab96ab71f790eafa5f5043e29b59d2c0e00b1a1))
* **sidekick:** use HLXPURGE ([1a33116](https://github.com/adobe/helix-pages/commit/1a3311679b75a7e0d3438a207dd028a8b4a20fe0))
* **sidekick:** write sidekick config on every invocation ([b5f53f6](https://github.com/adobe/helix-pages/commit/b5f53f6cc38f605001157e3b7b799076bac6e78f))

## [4.27.2](https://github.com/adobe/helix-pages/compare/v4.27.1...v4.27.2) (2021-04-20)


### Bug Fixes

* **extensions:** allow access to private, acl-restricted content with github token ([ee45ff9](https://github.com/adobe/helix-pages/commit/ee45ff9ff739695c553aba3c9ac8841e90356b73))
* correct client AS number for Fastly ([72f818e](https://github.com/adobe/helix-pages/commit/72f818e71932265f9f6843e9e1022a22070cde14))
* **extensions.vcl:** don't apply acl filter to PURGE requests ([63b86e8](https://github.com/adobe/helix-pages/commit/63b86e8f5f59b36babb8398af53d6e8a6290b786))

## [4.27.1](https://github.com/adobe/helix-pages/compare/v4.27.0...v4.27.1) (2021-04-20)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.26.3 ([e4d4e67](https://github.com/adobe/helix-pages/commit/e4d4e67a6b9d643e61810961aaf907524e41945b))

# [4.27.0](https://github.com/adobe/helix-pages/compare/v4.26.1...v4.27.0) (2021-04-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.9.8 ([#870](https://github.com/adobe/helix-pages/issues/870)) ([b9bdb5d](https://github.com/adobe/helix-pages/commit/b9bdb5d916c9e397289d36419de060ae441a4115))


### Features

* **extension.vcl:** support private gh repos and acls ([ddbc7e1](https://github.com/adobe/helix-pages/commit/ddbc7e11cde044d913915f2d41fd05a679e58bfa))

## [4.26.1](https://github.com/adobe/helix-pages/compare/v4.26.0...v4.26.1) (2021-04-19)


### Bug Fixes

* **deps:** update adobe fixes ([#865](https://github.com/adobe/helix-pages/issues/865)) ([757495f](https://github.com/adobe/helix-pages/commit/757495fd8c3b2f101ec49daac3171abd30a81317))
* **deps:** update external fixes ([#869](https://github.com/adobe/helix-pages/issues/869)) ([d81dd95](https://github.com/adobe/helix-pages/commit/d81dd95b1aafde6577b8b9acfba81f84e8f68ded))

# [4.26.0](https://github.com/adobe/helix-pages/compare/v4.25.6...v4.26.0) (2021-04-16)


### Features

* **sidekick:** always include branch in preview host ([5f92801](https://github.com/adobe/helix-pages/commit/5f9280191914612021187cb830e39ce67f5595be))
* **sidekick:** use main as default branch ([2a4e3e9](https://github.com/adobe/helix-pages/commit/2a4e3e9880e3c40b2d5ee65eba892b8b72679aa9))

## [4.25.6](https://github.com/adobe/helix-pages/compare/v4.25.5...v4.25.6) (2021-04-16)


### Bug Fixes

* **deploy:** use google-compatible package version names ([71f0c01](https://github.com/adobe/helix-pages/commit/71f0c01c8cfdff79c0ea70b6605df526cc50ccfb))


### Reverts

* Revert "Revert "Merge pull request #840 from adobe/deploy-gooooooooooogle"" ([a2d4260](https://github.com/adobe/helix-pages/commit/a2d42602ef06c375ad42fa57beaba419f673ab33)), closes [#840](https://github.com/adobe/helix-pages/issues/840)

## [4.25.5](https://github.com/adobe/helix-pages/compare/v4.25.4...v4.25.5) (2021-04-15)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.9.4 ([760dd4c](https://github.com/adobe/helix-pages/commit/760dd4cd98a74bffe51cdf2772d2c2c6783bd0ce))

## [4.25.4](https://github.com/adobe/helix-pages/compare/v4.25.3...v4.25.4) (2021-04-15)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.25.1 ([ddbc71c](https://github.com/adobe/helix-pages/commit/ddbc71ccfd816798d08626c387192079e7802816))

## [4.25.3](https://github.com/adobe/helix-pages/compare/v4.25.2...v4.25.3) (2021-04-15)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.9.3 ([#862](https://github.com/adobe/helix-pages/issues/862)) ([13fd3c9](https://github.com/adobe/helix-pages/commit/13fd3c98414f6702690d326e1f0216aa7a393ccd))

## [4.25.2](https://github.com/adobe/helix-pages/compare/v4.25.1...v4.25.2) (2021-04-15)


### Bug Fixes

* **deps:** update adobe fixes ([#860](https://github.com/adobe/helix-pages/issues/860)) ([4ecf1ef](https://github.com/adobe/helix-pages/commit/4ecf1ef06ca1ba8d5b88d4a6ccb4be789f511c8a))
* **deps:** update dependency @adobe/helix-shared to v7.25.0 ([#861](https://github.com/adobe/helix-pages/issues/861)) ([85f8368](https://github.com/adobe/helix-pages/commit/85f8368bef6a7d57c9a8e3a74046e61e9f9696be))

## [4.25.1](https://github.com/adobe/helix-pages/compare/v4.25.0...v4.25.1) (2021-04-13)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.9.1 ([#855](https://github.com/adobe/helix-pages/issues/855)) ([ca5ebb5](https://github.com/adobe/helix-pages/commit/ca5ebb5c91da33bd10e6343f68e89f43be37243c))

# [4.25.0](https://github.com/adobe/helix-pages/compare/v4.24.4...v4.25.0) (2021-04-12)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.9.0 ([#853](https://github.com/adobe/helix-pages/issues/853)) ([6438f69](https://github.com/adobe/helix-pages/commit/6438f6914a9c749ce786544fa389a367d13075f9))


### Features

* **sidekick:** serve from www.hlx.live ([b1dbf4c](https://github.com/adobe/helix-pages/commit/b1dbf4cc92941ed0bc0386e97f6082f566f2cea5))

## [4.24.4](https://github.com/adobe/helix-pages/compare/v4.24.3...v4.24.4) (2021-04-12)


### Bug Fixes

* **deps:** update dependency @adobe/openwhisk-action-logger to v2.4.4 ([#852](https://github.com/adobe/helix-pages/issues/852)) ([be99d2e](https://github.com/adobe/helix-pages/commit/be99d2e91cf0530c7f11e651cc68b5d0e26ac9d2))

## [4.24.3](https://github.com/adobe/helix-pages/compare/v4.24.2...v4.24.3) (2021-04-12)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.8.22 ([#851](https://github.com/adobe/helix-pages/issues/851)) ([d8e31d6](https://github.com/adobe/helix-pages/commit/d8e31d6b7346ec73107656060ad330ca798ef4c4))

## [4.24.2](https://github.com/adobe/helix-pages/compare/v4.24.1...v4.24.2) (2021-04-12)


### Bug Fixes

* **deps:** update adobe fixes ([4467c04](https://github.com/adobe/helix-pages/commit/4467c04aff2f8d92b0300ca8f510b423124b56a0))

## [4.24.1](https://github.com/adobe/helix-pages/compare/v4.24.0...v4.24.1) (2021-04-12)


### Bug Fixes

* **deps:** update adobe fixes ([#842](https://github.com/adobe/helix-pages/issues/842)) ([8ebb5a3](https://github.com/adobe/helix-pages/commit/8ebb5a302af670be00900451b5db569eecbe6186))
* **deps:** update adobe fixes ([#849](https://github.com/adobe/helix-pages/issues/849)) ([730e914](https://github.com/adobe/helix-pages/commit/730e9144c02cda4f437b17aea00d0de50f043f02))
* **html:** new rule for description meta ([bc8e170](https://github.com/adobe/helix-pages/commit/bc8e170e93bbdfe47165fa3d001bbdc47de441b4))

# [4.24.0](https://github.com/adobe/helix-pages/compare/v4.23.6...v4.24.0) (2021-04-08)


### Bug Fixes

* **deps:** update dependency @adobe/helix-deploy to v3.17.0 ([#839](https://github.com/adobe/helix-pages/issues/839)) ([93a6e8b](https://github.com/adobe/helix-pages/commit/93a6e8b94982f9b25623909d4f029120aa5154c7))


### Features

* **deploy:** add two strains for testing google cloud functions ([4ceb58a](https://github.com/adobe/helix-pages/commit/4ceb58a663fc769bc5b6161f8564425fdb3e2782))
* **deploy:** deploy to google ([ca1648e](https://github.com/adobe/helix-pages/commit/ca1648e2e4b5c25b0db215b1af1d52373204c62f))

## [4.23.6](https://github.com/adobe/helix-pages/compare/v4.23.5...v4.23.6) (2021-04-05)


### Bug Fixes

* **deps:** update adobe fixes ([#838](https://github.com/adobe/helix-pages/issues/838)) ([0e56575](https://github.com/adobe/helix-pages/commit/0e56575083183aece982c645f868c7d4e8521ab7))

## [4.23.5](https://github.com/adobe/helix-pages/compare/v4.23.4...v4.23.5) (2021-04-05)


### Bug Fixes

* **deps:** update adobe fixes ([#835](https://github.com/adobe/helix-pages/issues/835)) ([13a2211](https://github.com/adobe/helix-pages/commit/13a2211302afa2bc9797613b87934bbbea3b23ac))
* **deps:** update dependency @adobe/helix-pipeline to v13.8.15 ([#836](https://github.com/adobe/helix-pages/issues/836)) ([2b9b1f1](https://github.com/adobe/helix-pages/commit/2b9b1f117188d2c44fdb8c856ce8c4d2e003126a))

## [4.23.4](https://github.com/adobe/helix-pages/compare/v4.23.3...v4.23.4) (2021-04-02)


### Bug Fixes

* **deps:** update dependency @adobe/helix-deploy to v3.16.6 ([40d2eb4](https://github.com/adobe/helix-pages/commit/40d2eb481fc83bae9ed3246609bec2adcd29313a))

## [4.23.3](https://github.com/adobe/helix-pages/compare/v4.23.2...v4.23.3) (2021-03-31)


### Bug Fixes

* force release/deploy/publish ([8befa04](https://github.com/adobe/helix-pages/commit/8befa0447ff5691feb5e888eb4062f7ade1248ec))

## [4.23.2](https://github.com/adobe/helix-pages/compare/v4.23.1...v4.23.2) (2021-03-31)


### Bug Fixes

* **deps:** update dependency @adobe/helix-deploy to v3.16.5 ([f34c54b](https://github.com/adobe/helix-pages/commit/f34c54bca2a65b941fdf01e80dc1f2435f5ecbfd))

## [4.23.1](https://github.com/adobe/helix-pages/compare/v4.23.0...v4.23.1) (2021-03-31)


### Bug Fixes

* **deps:** update adobe fixes ([#830](https://github.com/adobe/helix-pages/issues/830)) ([aa8b759](https://github.com/adobe/helix-pages/commit/aa8b759c1af8152e39ff828a94a79120f98dd820))
* **deps:** update dependency @adobe/helix-deploy to v3.16.4 ([97d8788](https://github.com/adobe/helix-pages/commit/97d87887c1eeb5efcf01aeeef2c6258125c4e575))

# [4.23.0](https://github.com/adobe/helix-pages/compare/v4.22.14...v4.23.0) (2021-03-31)


### Bug Fixes

* force deploy ([d0e77e9](https://github.com/adobe/helix-pages/commit/d0e77e9690db7cfb9f7fd95deba7f47956159f0c))
* **deps:** update adobe fixes ([#829](https://github.com/adobe/helix-pages/issues/829)) ([120869a](https://github.com/adobe/helix-pages/commit/120869a0b18503cdd2f20dcc10bdf4345534334a))


### Features

* **pre:** remove unused index_json and sitemap cgi ([#816](https://github.com/adobe/helix-pages/issues/816)) ([02ce2cb](https://github.com/adobe/helix-pages/commit/02ce2cb22a5103a134c6120413e0089ab6623666)), closes [#798](https://github.com/adobe/helix-pages/issues/798)

## [4.22.14](https://github.com/adobe/helix-pages/compare/v4.22.13...v4.22.14) (2021-03-29)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.8.10 ([#825](https://github.com/adobe/helix-pages/issues/825)) ([caf569c](https://github.com/adobe/helix-pages/commit/caf569c8079183ae208bc24b1b9db2a3a98637e2))

## [4.22.13](https://github.com/adobe/helix-pages/compare/v4.22.12...v4.22.13) (2021-03-27)


### Bug Fixes

* **deps:** update adobe fixes ([8f55c45](https://github.com/adobe/helix-pages/commit/8f55c45bb0641e6ff65a6b9702a5e4cae01b51e1))

## [4.22.12](https://github.com/adobe/helix-pages/compare/v4.22.11...v4.22.12) (2021-03-27)


### Bug Fixes

* **deps:** update dependency @adobe/helix-deploy to v3.16.0 ([#821](https://github.com/adobe/helix-pages/issues/821)) ([fbd071d](https://github.com/adobe/helix-pages/commit/fbd071dc066e853c33da9159833f48de3cb2d8c0))
* **deps:** update dependency @adobe/helix-pipeline to v13.8.8 ([#822](https://github.com/adobe/helix-pages/issues/822)) ([7292679](https://github.com/adobe/helix-pages/commit/7292679bcdab26175f04be8651b5f5ad32d691fa))

## [4.22.11](https://github.com/adobe/helix-pages/compare/v4.22.10...v4.22.11) (2021-03-26)


### Bug Fixes

* **deps:** update adobe fixes ([1ae8241](https://github.com/adobe/helix-pages/commit/1ae82412e7abf2e084ac82631c27aed284f26833))

## [4.22.10](https://github.com/adobe/helix-pages/compare/v4.22.9...v4.22.10) (2021-03-26)


### Bug Fixes

* **deps:** update dependency @adobe/helix-fetch to v2.1.9 ([#819](https://github.com/adobe/helix-pages/issues/819)) ([dc29fda](https://github.com/adobe/helix-pages/commit/dc29fda43835e6906bccc1a38c0b1780db7edf98))

## [4.22.9](https://github.com/adobe/helix-pages/compare/v4.22.8...v4.22.9) (2021-03-25)


### Bug Fixes

* **releng:** trigger publish ([23f1d2d](https://github.com/adobe/helix-pages/commit/23f1d2df13e490ef447ddfc320588036cd5ef6da))

## [4.22.8](https://github.com/adobe/helix-pages/compare/v4.22.7...v4.22.8) (2021-03-25)


### Bug Fixes

* **rel:** trigger release ([6bd49ef](https://github.com/adobe/helix-pages/commit/6bd49efc67e364a761bcceb51a27e9761b87be2e))

## [4.22.7](https://github.com/adobe/helix-pages/compare/v4.22.6...v4.22.7) (2021-03-24)


### Bug Fixes

* **deps:** update dependency @adobe/helix-deploy to v3.15.1 ([#815](https://github.com/adobe/helix-pages/issues/815)) ([5291f88](https://github.com/adobe/helix-pages/commit/5291f88edeb2036e55ea9682b55ca67c9e19c5c3))

## [4.22.6](https://github.com/adobe/helix-pages/compare/v4.22.5...v4.22.6) (2021-03-23)


### Bug Fixes

* **deps:** update dependency @adobe/helix-deploy to v3.15.0 ([f4b0816](https://github.com/adobe/helix-pages/commit/f4b08161a709faf3e2c481a2d4d24a2f88e0cc7b))

## [4.22.5](https://github.com/adobe/helix-pages/compare/v4.22.4...v4.22.5) (2021-03-23)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.8.4 ([#812](https://github.com/adobe/helix-pages/issues/812)) ([7352384](https://github.com/adobe/helix-pages/commit/73523848db718dbb929b55d73f48f3fdc23c9837))

## [4.22.4](https://github.com/adobe/helix-pages/compare/v4.22.3...v4.22.4) (2021-03-23)


### Bug Fixes

* **deps:** update adobe fixes ([4d0403e](https://github.com/adobe/helix-pages/commit/4d0403e9a833fda812aa3c9052d24ced388458bf))
* **deps:** update dependency @adobe/helix-pipeline to v13.8.3 ([#809](https://github.com/adobe/helix-pages/issues/809)) ([c9bf2b6](https://github.com/adobe/helix-pages/commit/c9bf2b68ea790870a16ae869977228570f4a9e60))

## [4.22.3](https://github.com/adobe/helix-pages/compare/v4.22.2...v4.22.3) (2021-03-22)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.8.1 ([#805](https://github.com/adobe/helix-pages/issues/805)) ([7b04d62](https://github.com/adobe/helix-pages/commit/7b04d629dda8422fe071316ad4c1cf0cad525a52))

## [4.22.2](https://github.com/adobe/helix-pages/compare/v4.22.1...v4.22.2) (2021-03-21)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.21.5 ([3eed50c](https://github.com/adobe/helix-pages/commit/3eed50c011c1739f62718d0965c24de57d21fbdc))

## [4.22.1](https://github.com/adobe/helix-pages/compare/v4.22.0...v4.22.1) (2021-03-19)


### Bug Fixes

* **sidekick:** encode from param ([022ccd0](https://github.com/adobe/helix-pages/commit/022ccd0c2db2a1ac928390a8ee5d7aad2d03befd))

# [4.22.0](https://github.com/adobe/helix-pages/compare/v4.21.2...v4.22.0) (2021-03-19)


### Features

* **ci:** hard purge test domain ([37268a3](https://github.com/adobe/helix-pages/commit/37268a3e06ae00f4f3d1481b9420595d900e6352))

## [4.21.2](https://github.com/adobe/helix-pages/compare/v4.21.1...v4.21.2) (2021-03-18)


### Bug Fixes

* **breaking:** make branch unsticky ([9e1e9b0](https://github.com/adobe/helix-pages/commit/9e1e9b09e89c66fb2722f2389fda2a50336a58ac))
* **ci:** fix failing smoke tests init ([963d736](https://github.com/adobe/helix-pages/commit/963d736a30b0a3f957b158c08b262c4b26c83a33))
* **deps:** update dependency @adobe/helix-pipeline to v13.8.0 ([#791](https://github.com/adobe/helix-pages/issues/791)) ([35ae43e](https://github.com/adobe/helix-pages/commit/35ae43ebf836eaf4114a37985eeedc2a06ce46f3))

## [4.21.1](https://github.com/adobe/helix-pages/compare/v4.21.0...v4.21.1) (2021-03-15)


### Bug Fixes

* **feed:** support leading slash ([9d0a4dd](https://github.com/adobe/helix-pages/commit/9d0a4dd79271bd58cc128e6285c0a8861dd443e0))

# [4.21.0](https://github.com/adobe/helix-pages/compare/v4.20.1...v4.21.0) (2021-03-15)


### Features

* **sidekick:** show reload button on localhost ([b4fc960](https://github.com/adobe/helix-pages/commit/b4fc9603991d3dcf8cea5f9455d5a0ce95d12583))

## [4.20.1](https://github.com/adobe/helix-pages/compare/v4.20.0...v4.20.1) (2021-03-15)


### Bug Fixes

* **deps:** update adobe fixes ([f1e5628](https://github.com/adobe/helix-pages/commit/f1e5628a1e86d069cbb4fbcc52f989dbc0efcba9))

# [4.20.0](https://github.com/adobe/helix-pages/compare/v4.19.3...v4.20.0) (2021-03-15)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.21.3 ([#779](https://github.com/adobe/helix-pages/issues/779)) ([9d71767](https://github.com/adobe/helix-pages/commit/9d7176764cb83a34a8c3b54759b03fc3cf4b7f15))


### Features

* **sidekick:** support relative dependency URLs ([2b88118](https://github.com/adobe/helix-pages/commit/2b881186df8bb17cfe546b8a6833ebf2508f7615))

## [4.19.3](https://github.com/adobe/helix-pages/compare/v4.19.2...v4.19.3) (2021-03-12)


### Bug Fixes

* **breaking:** do not set cookies ([33a6d61](https://github.com/adobe/helix-pages/commit/33a6d61946351374054c7ff75ec844f78f899127))

## [4.19.2](https://github.com/adobe/helix-pages/compare/v4.19.1...v4.19.2) (2021-03-12)


### Bug Fixes

* **rel:** trigger release ([d3dba10](https://github.com/adobe/helix-pages/commit/d3dba10dd9900708b90efe7eb3391b5784f27723))

## [4.19.1](https://github.com/adobe/helix-pages/compare/v4.19.0...v4.19.1) (2021-03-12)


### Bug Fixes

* **deploy:** use helix-deploy-3.14.0 ([3de69f3](https://github.com/adobe/helix-pages/commit/3de69f3fc86e487fef194a538849480264290804))
* **vcl:** disable caching of HTML ([#771](https://github.com/adobe/helix-pages/issues/771)) ([d787fd2](https://github.com/adobe/helix-pages/commit/d787fd276026ede40ea74508dec16a815057f56a))

# [4.19.0](https://github.com/adobe/helix-pages/compare/v4.18.13...v4.19.0) (2021-03-11)


### Bug Fixes

* **deploy:** use universal runtime by default ([4d60ce1](https://github.com/adobe/helix-pages/commit/4d60ce1d2e30bbd9ea4c3801b7c3eab969bb7d83))


### Features

* **config:** use universal runtime for preflight ([e3b3d28](https://github.com/adobe/helix-pages/commit/e3b3d28cb060826151398b93f93701173c31f85a))

## [4.18.13](https://github.com/adobe/helix-pages/compare/v4.18.12...v4.18.13) (2021-03-11)


### Bug Fixes

* **deps:** use latest pipeline ([#769](https://github.com/adobe/helix-pages/issues/769)) ([f284a2d](https://github.com/adobe/helix-pages/commit/f284a2d2066136010dd6431c5c21b891533acfde))

## [4.18.12](https://github.com/adobe/helix-pages/compare/v4.18.11...v4.18.12) (2021-03-11)


### Bug Fixes

* **deps:** update adobe fixes ([b738b93](https://github.com/adobe/helix-pages/commit/b738b93921c28f81c2ab96bae31aaf64d0d5a989))
* **sidekick:** reload fails without production host ([4722c97](https://github.com/adobe/helix-pages/commit/4722c978d93f38d6dfcd7d5d4ee4e644f9055538))

## [4.18.11](https://github.com/adobe/helix-pages/compare/v4.18.10...v4.18.11) (2021-03-10)


### Bug Fixes

* **deps:** update adobe fixes ([#764](https://github.com/adobe/helix-pages/issues/764)) ([c8835b3](https://github.com/adobe/helix-pages/commit/c8835b36b6164ec3500aa644b7dad92808b8ceed))
* **deps:** update dependency @adobe/helix-pipeline to v13.7.14 ([#763](https://github.com/adobe/helix-pages/issues/763)) ([9c47cbe](https://github.com/adobe/helix-pages/commit/9c47cbe0fffc92fc43cc844a4ab169ed1bac7080))

## [4.18.10](https://github.com/adobe/helix-pages/compare/v4.18.9...v4.18.10) (2021-03-09)


### Bug Fixes

* **rel:** trigger release ([b4f5b0a](https://github.com/adobe/helix-pages/commit/b4f5b0a81b20801f100619b7cdccb4642bd68bbb))

## [4.18.9](https://github.com/adobe/helix-pages/compare/v4.18.8...v4.18.9) (2021-03-09)


### Bug Fixes

* **deps:** update adobe fixes ([#761](https://github.com/adobe/helix-pages/issues/761)) ([679d7dd](https://github.com/adobe/helix-pages/commit/679d7dd151b833498255ce7e40c6361b88d60d84))
* **rel:** trigger release ([d4d0dd5](https://github.com/adobe/helix-pages/commit/d4d0dd50e1b1d0560483a7d5304c62cb3198b10d))

## [4.18.8](https://github.com/adobe/helix-pages/compare/v4.18.7...v4.18.8) (2021-03-09)


### Bug Fixes

* **deploy:** bump helix-deploy version ([#762](https://github.com/adobe/helix-pages/issues/762)) ([5ccb105](https://github.com/adobe/helix-pages/commit/5ccb105b4534ba43b071885360dd3e7259086604))

## [4.18.7](https://github.com/adobe/helix-pages/compare/v4.18.6...v4.18.7) (2021-03-04)


### Bug Fixes

* **deps:** update dependency @adobe/helix-fetch to v2.1.7 ([c8b4e12](https://github.com/adobe/helix-pages/commit/c8b4e1271df3f3a9f7e424a9f45bbd66bab58270))

## [4.18.6](https://github.com/adobe/helix-pages/compare/v4.18.5...v4.18.6) (2021-03-04)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.7.8 ([#747](https://github.com/adobe/helix-pages/issues/747)) ([d9a77c2](https://github.com/adobe/helix-pages/commit/d9a77c25849214d99ab324bdcaacfab93ffa1ef3))

## [4.18.5](https://github.com/adobe/helix-pages/compare/v4.18.4...v4.18.5) (2021-03-03)


### Bug Fixes

* **deploy:** trigger a release to get full universal runtime loggin ([10014d6](https://github.com/adobe/helix-pages/commit/10014d65848814be7aea0af01ba76a308050eda7))

## [4.18.4](https://github.com/adobe/helix-pages/compare/v4.18.3...v4.18.4) (2021-03-02)


### Bug Fixes

* **sidekick:** do not bubble up purge errors to the ui ([e939490](https://github.com/adobe/helix-pages/commit/e9394904fc29f0bd164b2789341a0d237a855be9))

## [4.18.3](https://github.com/adobe/helix-pages/compare/v4.18.2...v4.18.3) (2021-03-02)


### Bug Fixes

* **sidekick:** include branch name in host when purging ([d98b7c1](https://github.com/adobe/helix-pages/commit/d98b7c1c740d5054288016b94ade62954d1ed489))

## [4.18.2](https://github.com/adobe/helix-pages/compare/v4.18.1...v4.18.2) (2021-03-02)


### Bug Fixes

* **sidekick:** reload button not reliable ([8d78af4](https://github.com/adobe/helix-pages/commit/8d78af418e82cc3c43151fcf89fe2ec08aecb160))

## [4.18.1](https://github.com/adobe/helix-pages/compare/v4.18.0...v4.18.1) (2021-03-02)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.7.5 ([#720](https://github.com/adobe/helix-pages/issues/720)) ([520334b](https://github.com/adobe/helix-pages/commit/520334bed66cfebd10141e192e881ab91e6c79b3))

# [4.18.0](https://github.com/adobe/helix-pages/compare/v4.17.1...v4.18.0) (2021-03-02)


### Features

* **sidekick:** reload plugin ([3df43fd](https://github.com/adobe/helix-pages/commit/3df43fd26ea5905058c15c79420bda30683d630c))

## [4.17.1](https://github.com/adobe/helix-pages/compare/v4.17.0...v4.17.1) (2021-03-01)


### Bug Fixes

* **config:** fix 404 for static files in breaking branch ([#722](https://github.com/adobe/helix-pages/issues/722)) ([03ce464](https://github.com/adobe/helix-pages/commit/03ce464f1ef920e927cadf42351dfd1da3dd7c73)), closes [#713](https://github.com/adobe/helix-pages/issues/713)

# [4.17.0](https://github.com/adobe/helix-pages/compare/v4.16.14...v4.17.0) (2021-02-26)


### Features

* **sidekick:** also purge .md ([0f5e7b2](https://github.com/adobe/helix-pages/commit/0f5e7b2351396bca72fc341172bea37f4c7b1d73))
* **sidekick:** purge with and without extension ([a55f452](https://github.com/adobe/helix-pages/commit/a55f452a710f77c6108f57ddb872a4f9f0211f9b))

## [4.16.14](https://github.com/adobe/helix-pages/compare/v4.16.13...v4.16.14) (2021-02-25)


### Bug Fixes

* **deploy:** use release version in deploy script ([5246797](https://github.com/adobe/helix-pages/commit/52467977b02d396191df0f39bc206ebf3d0bbf56)), closes [#716](https://github.com/adobe/helix-pages/issues/716)

## [4.16.13](https://github.com/adobe/helix-pages/compare/v4.16.12...v4.16.13) (2021-02-25)


### Bug Fixes

* **deploy:** use separate universal subdomain ([4547049](https://github.com/adobe/helix-pages/commit/4547049bd39a8f904ec71b2122deca5062d6f4a9))

## [4.16.12](https://github.com/adobe/helix-pages/compare/v4.16.11...v4.16.12) (2021-02-22)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.6.20 ([77d01e7](https://github.com/adobe/helix-pages/commit/77d01e7bf5cefc8e9fe36351cc6c9728e96bebbc))

## [4.16.11](https://github.com/adobe/helix-pages/compare/v4.16.10...v4.16.11) (2021-02-22)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.19.10 ([#707](https://github.com/adobe/helix-pages/issues/707)) ([b4f8b3d](https://github.com/adobe/helix-pages/commit/b4f8b3d407ffad81f5edbf6dfe3b06d89c94b140))

## [4.16.10](https://github.com/adobe/helix-pages/compare/v4.16.9...v4.16.10) (2021-02-19)


### Bug Fixes

* **deps:** update adobe fixes ([86b8cb8](https://github.com/adobe/helix-pages/commit/86b8cb8b2dcf4bfd77bb39d138992e6fa442447a))

## [4.16.9](https://github.com/adobe/helix-pages/compare/v4.16.8...v4.16.9) (2021-02-18)


### Bug Fixes

* re-enable http/2 ([4734f4d](https://github.com/adobe/helix-pages/commit/4734f4d2efb85f1978d115034058679d93eb78e9))

## [4.16.8](https://github.com/adobe/helix-pages/compare/v4.16.7...v4.16.8) (2021-02-18)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.6.16 ([#699](https://github.com/adobe/helix-pages/issues/699)) ([12a7b7a](https://github.com/adobe/helix-pages/commit/12a7b7a3a17661a5bdc2e207af5149d6e9c79d25))
* **deps:** update dependency @adobe/helix-pipeline to v13.6.17 ([#700](https://github.com/adobe/helix-pages/issues/700)) ([5564ee7](https://github.com/adobe/helix-pages/commit/5564ee7eba9dc4a34625a41190f755b05a692e4c))

## [4.16.7](https://github.com/adobe/helix-pages/compare/v4.16.6...v4.16.7) (2021-02-16)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.6.14 ([f807888](https://github.com/adobe/helix-pages/commit/f807888c65cffc97d0d1d4c806afa40b2289c708))

## [4.16.6](https://github.com/adobe/helix-pages/compare/v4.16.5...v4.16.6) (2021-02-16)


### Bug Fixes

* **deps:** update dependency @adobe/htlengine to v6.3.7 ([#696](https://github.com/adobe/helix-pages/issues/696)) ([640baef](https://github.com/adobe/helix-pages/commit/640baeffa3e97b41367c6c89c477150f51c1f095))

## [4.16.5](https://github.com/adobe/helix-pages/compare/v4.16.4...v4.16.5) (2021-02-15)


### Bug Fixes

* **deps:** update adobe fixes ([#689](https://github.com/adobe/helix-pages/issues/689)) ([5fbdc59](https://github.com/adobe/helix-pages/commit/5fbdc59dec8065e7fcda293ffd00492d70c7aeb2))
* **deps:** update dependency @adobe/helix-pipeline to v13.6.13 ([#690](https://github.com/adobe/helix-pages/issues/690)) ([8cf3632](https://github.com/adobe/helix-pages/commit/8cf3632e5f529e741da35d8aa6710a3150c0cc83))

## [4.16.4](https://github.com/adobe/helix-pages/compare/v4.16.3...v4.16.4) (2021-02-14)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.6.8 ([#683](https://github.com/adobe/helix-pages/issues/683)) ([d19fec9](https://github.com/adobe/helix-pages/commit/d19fec91cda7556dd6fcb0ae2d09c6ec2c340cc4))
* **deps:** update external fixes ([#688](https://github.com/adobe/helix-pages/issues/688)) ([42fc75a](https://github.com/adobe/helix-pages/commit/42fc75ade59fcdb8f2808674b547b54f3cf5b5ad))

## [4.16.3](https://github.com/adobe/helix-pages/compare/v4.16.2...v4.16.3) (2021-02-10)


### Bug Fixes

* **ci:** use correct package for universal ([0d7a9dc](https://github.com/adobe/helix-pages/commit/0d7a9dc3e737a89b8df0c42489137bea3f46d05d))

## [4.16.2](https://github.com/adobe/helix-pages/compare/v4.16.1...v4.16.2) (2021-02-10)


### Bug Fixes

* **ci:** don't use new git features ([8fee099](https://github.com/adobe/helix-pages/commit/8fee0993a23bebefc441e1ca744658c4c562a009))

## [4.16.1](https://github.com/adobe/helix-pages/compare/v4.16.0...v4.16.1) (2021-02-10)


### Bug Fixes

* **ci:** release fist, deploy later ([dea54ec](https://github.com/adobe/helix-pages/commit/dea54ec7e12c1a4ac76a72d806a475262f46ad22))

# [4.16.0](https://github.com/adobe/helix-pages/compare/v4.15.4...v4.16.0) (2021-02-10)


### Bug Fixes

* **deps:** update adobe fixes ([#661](https://github.com/adobe/helix-pages/issues/661)) ([9ff03c8](https://github.com/adobe/helix-pages/commit/9ff03c8b8c91c22ab39b9794105e71b626e8089a))
* **deps:** update adobe fixes ([#677](https://github.com/adobe/helix-pages/issues/677)) ([9f75309](https://github.com/adobe/helix-pages/commit/9f753094c8890c786328bb9f707a127e8e7293fc))
* **deps:** update dependency @adobe/helix-pipeline to v13.6.6 ([#672](https://github.com/adobe/helix-pages/issues/672)) ([5873fbf](https://github.com/adobe/helix-pages/commit/5873fbf42a8655917d023f0a1b7ff164171b2c47))
* **deps:** update dependency @adobe/htlengine to v6.3.2 ([#654](https://github.com/adobe/helix-pages/issues/654)) ([dd247e8](https://github.com/adobe/helix-pages/commit/dd247e8173be30927f581782810cd64e2078501e))


### Features

* **helix:** try using the universal runtime ([035c3de](https://github.com/adobe/helix-pages/commit/035c3def91687496434348a5154dbdac882b88de))
* **sidekick:** add publish() member for reuse by custom plugins ([8ff1b84](https://github.com/adobe/helix-pages/commit/8ff1b849957750335efb249ac914d066c69fcf80))

## [4.15.4](https://github.com/adobe/helix-pages/compare/v4.15.3...v4.15.4) (2021-01-28)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.5.3 ([#647](https://github.com/adobe/helix-pages/issues/647)) ([5949c11](https://github.com/adobe/helix-pages/commit/5949c119093d78db3dce3a0c548b8820a16c0c59))
* **sidekick:** purge directory index ([#648](https://github.com/adobe/helix-pages/issues/648)) ([4c83d00](https://github.com/adobe/helix-pages/commit/4c83d007dafebb3c4ed8935e058afddab22cad9d))

## [4.15.3](https://github.com/adobe/helix-pages/compare/v4.15.2...v4.15.3) (2021-01-25)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.19.2 ([#645](https://github.com/adobe/helix-pages/issues/645)) ([2473b69](https://github.com/adobe/helix-pages/commit/2473b6914e23fc4b5ade38749e1b118ab683c365))
* **deps:** update dependency @adobe/htlengine to v6.3.1 ([#646](https://github.com/adobe/helix-pages/issues/646)) ([a5a123c](https://github.com/adobe/helix-pages/commit/a5a123cee38fb3fa912a58ede900fc18b0cfbcc4))

## [4.15.2](https://github.com/adobe/helix-pages/compare/v4.15.1...v4.15.2) (2021-01-23)


### Bug Fixes

* switch to main branch of theblog-tests ([#642](https://github.com/adobe/helix-pages/issues/642)) ([0513404](https://github.com/adobe/helix-pages/commit/0513404d36634eac24b619b28db9edea4f532761))

## [4.15.1](https://github.com/adobe/helix-pages/compare/v4.15.0...v4.15.1) (2021-01-15)


### Bug Fixes

* increase timeout ([#632](https://github.com/adobe/helix-pages/issues/632)) ([502fd0e](https://github.com/adobe/helix-pages/commit/502fd0e3949c326b64f9f57077260ecf22df8393))
* **deps:** update dependency @adobe/helix-pipeline to v13.4.0 ([06b393c](https://github.com/adobe/helix-pages/commit/06b393c31addc819c1fd7e9577a03822d3e1bc09))
* **deps:** update dependency @adobe/htlengine to v6.2.15 ([25398bd](https://github.com/adobe/helix-pages/commit/25398bd3682facbae8ccf06fc1c1de99e5164244))

# [4.15.0](https://github.com/adobe/helix-pages/compare/v4.14.3...v4.15.0) (2021-01-12)


### Features

* use helix-deploy ([d05f7ee](https://github.com/adobe/helix-pages/commit/d05f7ee9f7b032d2b0dbe9f141cd9deb26679a06))

## [4.14.3](https://github.com/adobe/helix-pages/compare/v4.14.2...v4.14.3) (2021-01-11)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.3.4 ([26046f7](https://github.com/adobe/helix-pages/commit/26046f7bcf158bdab1adcd46ca06fe0b1a6aa825))

## [4.14.2](https://github.com/adobe/helix-pages/compare/v4.14.1...v4.14.2) (2021-01-11)


### Bug Fixes

* **deps:** update adobe fixes ([912b7e1](https://github.com/adobe/helix-pages/commit/912b7e1945afc02b0b328e7e16fd0bd6d2ad0930))
* **deps:** update dependency @adobe/helix-pipeline to v13.3.3 ([3861b16](https://github.com/adobe/helix-pages/commit/3861b167661701f5405a0182d6b2a859e8412210))
* **deps:** update dependency @adobe/helix-shared to v7.18.3 ([9bf2c02](https://github.com/adobe/helix-pages/commit/9bf2c028e4db162c8a6e4fd34bc9f5f4323998a1))

## [4.14.1](https://github.com/adobe/helix-pages/compare/v4.14.0...v4.14.1) (2021-01-08)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.2.6 ([8844afe](https://github.com/adobe/helix-pages/commit/8844afe5c7e7a4709c11941c0e2cec9ae6057d43))
* **deps:** update dependency @adobe/helix-pipeline to v13.2.7 ([16ee80e](https://github.com/adobe/helix-pages/commit/16ee80ead7171db1c2b6f397cefff76adee12cba))
* **deps:** update dependency @adobe/helix-pipeline to v13.2.8 ([ff986cf](https://github.com/adobe/helix-pages/commit/ff986cfe7e80bfc1b5aacf55420c6ab6ce1f22fa))

# [4.14.0](https://github.com/adobe/helix-pages/compare/v4.13.1...v4.14.0) (2020-12-18)


### Bug Fixes

* **sidekick:** remove outer cdn probe (cors) ([8c6ff95](https://github.com/adobe/helix-pages/commit/8c6ff9576219267f12983d7cc083e43318bacc97))


### Features

* **sidekick:** increase z-index ([b0da55e](https://github.com/adobe/helix-pages/commit/b0da55ef4637a277943c2e560fcd65a7f92926ce))

## [4.13.1](https://github.com/adobe/helix-pages/compare/v4.13.0...v4.13.1) (2020-12-16)


### Bug Fixes

* **deps:** update adobe fixes ([f454484](https://github.com/adobe/helix-pages/commit/f454484d86114043fcf12bcd452e0aa07052059a))
* **deps:** update adobe fixes ([#599](https://github.com/adobe/helix-pages/issues/599)) ([19dba41](https://github.com/adobe/helix-pages/commit/19dba4123f0d4ac64a2a32c26262eefeace76827))
* **sidekick:** fix inner cdn only use case ([0398b5a](https://github.com/adobe/helix-pages/commit/0398b5a4bdc908ad68a933c314b9f715b89780cc))
* **sidekick:** fix new location resolution ([1fd7f1a](https://github.com/adobe/helix-pages/commit/1fd7f1ac07bddec70350b6fa2cf4f6743a4bbf8e))
* **sidekick:** fix outer cdn validation, adjust tests ([6a9037f](https://github.com/adobe/helix-pages/commit/6a9037f06de23d0eb41d6bd3020b3fad29a1675d))
* **sidekick:** keep master as default branch for now ([47f33a2](https://github.com/adobe/helix-pages/commit/47f33a2fcccb39a39506a5f059b1aa66d80d1e5a))
* **sidekick:** no more redirect to prod after publish ([cb4d616](https://github.com/adobe/helix-pages/commit/cb4d616f8ded1f8f4f40d51624ccf13c1773dd23))

# [4.13.0](https://github.com/adobe/helix-pages/compare/v4.12.0...v4.13.0) (2020-12-08)


### Features

* **sidekick:** make Sidekick compliant with Helix URL scheme ([13449e8](https://github.com/adobe/helix-pages/commit/13449e845ab557db0ab4b88718c77b70c7544270))

# [4.12.0](https://github.com/adobe/helix-pages/compare/v4.11.1...v4.12.0) (2020-12-07)


### Bug Fixes

* **deps:** update adobe fixes ([#586](https://github.com/adobe/helix-pages/issues/586)) ([7ab71dc](https://github.com/adobe/helix-pages/commit/7ab71dc191897c2dd9f91940c14c9386af17f9fd))
* **deps:** update adobe fixes ([#595](https://github.com/adobe/helix-pages/issues/595)) ([dd5d40e](https://github.com/adobe/helix-pages/commit/dd5d40e1feb03bec5f265636dad212901ab68aac))
* **deps:** update dependency @adobe/helix-pipeline to v13.0.8 ([#588](https://github.com/adobe/helix-pages/issues/588)) ([cc8062d](https://github.com/adobe/helix-pages/commit/cc8062d7ba2276a3e3b08760db70c206ce95a140))
* **deps:** update dependency @adobe/openwhisk-action-utils to v4.3.3 ([2b99f87](https://github.com/adobe/helix-pages/commit/2b99f87f34928a25bb68a51680a7a92da440f5b6))
* **sidekick:** check for namespace existence in bookmarklet ([ef57a80](https://github.com/adobe/helix-pages/commit/ef57a809e100fcae09b8111e8c75633282a05c0c))
* **sidekick:** ignore 3rd level domain ([ebc85e7](https://github.com/adobe/helix-pages/commit/ebc85e7e38e3bff4c2b4db0932487a83131b0bda))


### Features

* **seidekick:** backward compatibility ([dd9f83c](https://github.com/adobe/helix-pages/commit/dd9f83cdf3f85cb43b51e4df1843259c9208bfca))
* **sidekick:** also publish on inner cdn only ([118abc8](https://github.com/adobe/helix-pages/commit/118abc84265d964a09ac8cf2e7ad10d9089aa898))
* **sidekick:** hlx namespace, better empty display, update check, simpler add() ([82547db](https://github.com/adobe/helix-pages/commit/82547db4d567942704e979084133820943e6c421))
* **sidekick:** loosen window recyling ([#581](https://github.com/adobe/helix-pages/issues/581)) ([2c74c5a](https://github.com/adobe/helix-pages/commit/2c74c5ad94c6568224bbace32dbc04678dc51dfa))
* **sidekick:** purge dependencies ([#579](https://github.com/adobe/helix-pages/issues/579)), enhanced modal handling ([bb51a97](https://github.com/adobe/helix-pages/commit/bb51a97588dc3f910ca7862b1b3242b1bb8a1d28))
* **sidekick:** support back link ([9aaafa1](https://github.com/adobe/helix-pages/commit/9aaafa1d2848b522e423d817ab08d31917ca7df4))

## [4.11.1](https://github.com/adobe/helix-pages/compare/v4.11.0...v4.11.1) (2020-12-01)


### Bug Fixes

* code/fixed font dark mode issue ([5933151](https://github.com/adobe/helix-pages/commit/5933151ff3ebcd8ae5b09471fbd5ed1fd1c54f26))

# [4.11.0](https://github.com/adobe/helix-pages/compare/v4.10.0...v4.11.0) (2020-12-01)


### Bug Fixes

* **deps:** update adobe fixes ([88db02e](https://github.com/adobe/helix-pages/commit/88db02ed61373e59f4dfb9c6f3334db50ad0cd7d))
* **sidekick:** actually load plugins from fixed host ([92d0744](https://github.com/adobe/helix-pages/commit/92d0744d20353b1d7d38f856969a88fd1a56b4fe))


### Features

* **sidekick:** allow hiding modal thru click on overlay ([5cdec72](https://github.com/adobe/helix-pages/commit/5cdec7241411de6f1b82fe2147e6fd70a880295c))
* **sidekick:** allow loading plugins from a fixed host ([f730ce1](https://github.com/adobe/helix-pages/commit/f730ce1685b28308025f866ed7910743c08b42c7))

# [4.10.0](https://github.com/adobe/helix-pages/compare/v4.9.0...v4.10.0) (2020-11-30)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.16.2 ([e3121b2](https://github.com/adobe/helix-pages/commit/e3121b27c3c4f781c7eadd562f45aeabfaee145f))
* **deps:** update external fixes ([04f236f](https://github.com/adobe/helix-pages/commit/04f236fe5dc2860d4d08f8e8e92c72517abb86c5))


### Features

* **sidekick:** preview to cycle inner and outer cdn ([d1051dc](https://github.com/adobe/helix-pages/commit/d1051dc0251807ac9ea395112475f839d456932a))
* **sidekick:** share button ([0b9a21a](https://github.com/adobe/helix-pages/commit/0b9a21a622417abbf6289393d76bf360ce2f3caf))

# [4.9.0](https://github.com/adobe/helix-pages/compare/v4.8.0...v4.9.0) (2020-11-26)


### Bug Fixes

* **sidekick:** allow dynamic hlx.page domain for smoke tests ([6996bd0](https://github.com/adobe/helix-pages/commit/6996bd0d9a575b6ad1b2afe6dfcdda305011762d))


### Features

* **seo:** add fastly io params to meta image url ([964eef0](https://github.com/adobe/helix-pages/commit/964eef073e6af21c91e274b243364404a1690089))
* **sidekick:** allow extension of existing plugin ([a6043d0](https://github.com/adobe/helix-pages/commit/a6043d00294992de45730793466851581646d64a))
* **sidekick:** allow extension of existing plugin ([24a2340](https://github.com/adobe/helix-pages/commit/24a234071d314324293676ef10f0969abb7735f9))
* **sidekick:** switch from outer to inner cdn ([dcf553d](https://github.com/adobe/helix-pages/commit/dcf553d60bf4b1e103363e1cca077fa9755fade4))
* **sidekick:** switch from outer to inner cdn ([33abeac](https://github.com/adobe/helix-pages/commit/33abeacf9a0c71dfd328d46ec6ec1742d78c9652))

# [4.8.0](https://github.com/adobe/helix-pages/compare/v4.7.0...v4.8.0) (2020-11-23)


### Bug Fixes

* **sidekick:** do not try to reuse opener ([#565](https://github.com/adobe/helix-pages/issues/565)) ([56519bf](https://github.com/adobe/helix-pages/commit/56519bf3651a9712dc9ec0bcd8307db51ff5ff47))
* **sidekick:** limit accessibility to certain tags ([5f9352b](https://github.com/adobe/helix-pages/commit/5f9352b7a49893a64dab9a84a3182f53177e60c7))


### Features

* **sidekick:** close button, accessibility and i18n ([ba9c472](https://github.com/adobe/helix-pages/commit/ba9c472e38d0d743b2305a5df66efd3890ab9f70))
* **sidekick:** preview/edit roundtrip ([#550](https://github.com/adobe/helix-pages/issues/550)) ([8a2abf3](https://github.com/adobe/helix-pages/commit/8a2abf3053ae58d5045e074370a289c73dfa2f3c))
* **sidekick:** switch configurator default branch to main ([5e04e24](https://github.com/adobe/helix-pages/commit/5e04e24864ae0387b931fbfc0b6b1917471dbcf8))

# [4.7.0](https://github.com/adobe/helix-pages/compare/v4.6.2...v4.7.0) (2020-11-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.0.5 ([#559](https://github.com/adobe/helix-pages/issues/559)) ([9c1e65f](https://github.com/adobe/helix-pages/commit/9c1e65f7ba16a9de8f5d9684756f7fb620ec4ac6))
* **sidekick:** add margins for multiple button rows ([#554](https://github.com/adobe/helix-pages/issues/554)) ([39529c8](https://github.com/adobe/helix-pages/commit/39529c869a2def270183a8b78f01049c10f71278))
* **sidekick:** anticipate main or master branch in config ([e06b375](https://github.com/adobe/helix-pages/commit/e06b3759efee0a29d8c454154f1c4d3dbf399611))
* **sidekick:** js error in publish action ([#548](https://github.com/adobe/helix-pages/issues/548)) ([50e6ad3](https://github.com/adobe/helix-pages/commit/50e6ad336d7b89821b2dca9812edcff12aba6dca))
* **sidekick:** omit master branch in url ([#552](https://github.com/adobe/helix-pages/issues/552)) ([f518b3a](https://github.com/adobe/helix-pages/commit/f518b3a524eb78706c042e14cb54301f8bf676d7))


### Features

* **sidekick:** multi-line notifications ([#549](https://github.com/adobe/helix-pages/issues/549)) ([a7d836e](https://github.com/adobe/helix-pages/commit/a7d836eb72b6eb8d340a935e27c5176b45b5b822))
* **sidekick:** use content-proxy@v2 ([2524b8b](https://github.com/adobe/helix-pages/commit/2524b8b5db1c70f6991428c6d9bd37537d5c775f))

## [4.6.2](https://github.com/adobe/helix-pages/compare/v4.6.1...v4.6.2) (2020-11-19)


### Bug Fixes

* **deps:** update adobe fixes ([446b3d1](https://github.com/adobe/helix-pages/commit/446b3d106dcae183e0b8e3851225ef1528c97b9a))
* **deps:** update dependency @adobe/helix-pipeline to v13.0.4 ([80114d5](https://github.com/adobe/helix-pages/commit/80114d5809fe79e3f19cd0a1b1de110d0570ddd7))

## [4.6.1](https://github.com/adobe/helix-pages/compare/v4.6.0...v4.6.1) (2020-11-18)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.0.3 ([3700ad5](https://github.com/adobe/helix-pages/commit/3700ad51ea0206897694a9619f8c433a3a4c0748))

# [4.6.0](https://github.com/adobe/helix-pages/compare/v4.5.3...v4.6.0) (2020-11-17)


### Bug Fixes

* **sidekick:** bookmarklet name is "helix logo" ([8967a46](https://github.com/adobe/helix-pages/commit/8967a46e892b05daf883307e4590619c8d47c5f0))
* **sidekick:** js error ([3803bc8](https://github.com/adobe/helix-pages/commit/3803bc8882791ef824a780e8600a9ee84a22fc31))
* **sidekick:** process override before condition ([874155f](https://github.com/adobe/helix-pages/commit/874155f3bc96c926c095f11ae340bcd6f74001ab))


### Features

* **sidekick:** app and configurator ([#543](https://github.com/adobe/helix-pages/issues/543)) ([5dbb6ca](https://github.com/adobe/helix-pages/commit/5dbb6ca674c1cb98515d4bd034fb60dca8ee04d5))
* **sidekick:** configurator ([fafc9ae](https://github.com/adobe/helix-pages/commit/fafc9aec58ca72b81c1e6108b7c23ed2f5add53d))
* **sidekick:** move app and tests here ([90f6ad8](https://github.com/adobe/helix-pages/commit/90f6ad8a40f86eedf8a5623481956a90215a87f1))
* **sidekick:** prefer loading custom plugins from current site ([fa906a2](https://github.com/adobe/helix-pages/commit/fa906a2dcdacfa1b6382c14d22ef375ea873020e))

## [4.5.3](https://github.com/adobe/helix-pages/compare/v4.5.2...v4.5.3) (2020-11-13)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13.0.1 ([#542](https://github.com/adobe/helix-pages/issues/542)) ([a9ac182](https://github.com/adobe/helix-pages/commit/a9ac18279b00d8a53e0bfe772028de8f20de96c4))

## [4.5.2](https://github.com/adobe/helix-pages/compare/v4.5.1...v4.5.2) (2020-11-12)


### Bug Fixes

* **deps:** update adobe fixes ([#540](https://github.com/adobe/helix-pages/issues/540)) ([9b1d216](https://github.com/adobe/helix-pages/commit/9b1d2161aae4aa2069e3b53b65d8c9ee79d02bb4))

## [4.5.1](https://github.com/adobe/helix-pages/compare/v4.5.0...v4.5.1) (2020-11-12)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v13 ([6f365ce](https://github.com/adobe/helix-pages/commit/6f365ce157af884ed003e42966a61a9131f6ce27))

# [4.5.0](https://github.com/adobe/helix-pages/compare/v4.4.0...v4.5.0) (2020-11-10)


### Features

* **test:** add support for version lock in diff tests ([#518](https://github.com/adobe/helix-pages/issues/518)) ([5976d74](https://github.com/adobe/helix-pages/commit/5976d749b9707a77234d78d7bca677d3c0116599))

# [4.4.0](https://github.com/adobe/helix-pages/compare/v4.3.0...v4.4.0) (2020-10-29)


### Features

* **src/util.js:** force release ([#528](https://github.com/adobe/helix-pages/issues/528)) ([81261fb](https://github.com/adobe/helix-pages/commit/81261fb0b12f20fdfd5c714a8a2fac18deb21432))

# [4.3.0](https://github.com/adobe/helix-pages/compare/v4.2.0...v4.3.0) (2020-10-23)


### Features

* **css:** suppress layout shift ([#512](https://github.com/adobe/helix-pages/issues/512)) ([a33c1b3](https://github.com/adobe/helix-pages/commit/a33c1b321a551ac4816172263beca541d21d12ec))
* **css:** suppress layout shift ([#512](https://github.com/adobe/helix-pages/issues/512)) ([0fedd71](https://github.com/adobe/helix-pages/commit/0fedd71f3b6055ade3ee8d0e8bab915cc301b760))
* **seo:** support jpg as default meta image ([#411](https://github.com/adobe/helix-pages/issues/411)) ([5cab436](https://github.com/adobe/helix-pages/commit/5cab43620c6022bbe600cdc811295eca3ab80678))

# [4.2.0](https://github.com/adobe/helix-pages/compare/v4.1.3...v4.2.0) (2020-10-14)


### Bug Fixes

* **seo:** avoid markup in meta description ([#501](https://github.com/adobe/helix-pages/issues/501)) ([658a3fc](https://github.com/adobe/helix-pages/commit/658a3fccd44372bb2064ee08952c993e77e3d1ed))


### Features

* **style:** new default styling ([#502](https://github.com/adobe/helix-pages/issues/502)) ([364e8d3](https://github.com/adobe/helix-pages/commit/364e8d319dc6680812f9aaf6fcabedbeaeae236b)), closes [#493](https://github.com/adobe/helix-pages/issues/493)

## [4.1.3](https://github.com/adobe/helix-pages/compare/v4.1.2...v4.1.3) (2020-10-06)


### Bug Fixes

* **deps:** update [@adobe](https://github.com/adobe) fixes ([a9c18a4](https://github.com/adobe/helix-pages/commit/a9c18a45ad5b91c9a1dbe54fdabe3283dbb7b0ea))
* **deps:** update dependency @adobe/helix-pipeline to v12.0.4 ([#490](https://github.com/adobe/helix-pages/issues/490)) ([6903fa9](https://github.com/adobe/helix-pages/commit/6903fa9c056ba63f3fd18078c6b82b3f7682bbe3))

## [4.1.2](https://github.com/adobe/helix-pages/compare/v4.1.1...v4.1.2) (2020-10-03)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v12.0.1 ([#485](https://github.com/adobe/helix-pages/issues/485)) ([a8a3156](https://github.com/adobe/helix-pages/commit/a8a31561c099792826edd29e1f268654d0cdd38b))
* **deps:** update dependency @adobe/helix-shared to v7.15.0 ([f8a72f2](https://github.com/adobe/helix-pages/commit/f8a72f20794884e515a3eade9b8d074a5c279cd1))

## [4.1.1](https://github.com/adobe/helix-pages/compare/v4.1.0...v4.1.1) (2020-10-02)


### Bug Fixes

* **html:** guard against spaces in class names ([9f96dd4](https://github.com/adobe/helix-pages/commit/9f96dd44208ea7bafa7526b063339940fdf3825d)), closes [#482](https://github.com/adobe/helix-pages/issues/482)

# [4.1.0](https://github.com/adobe/helix-pages/compare/v4.0.7...v4.1.0) (2020-09-30)


### Bug Fixes

* **ci:** breaking changes for sempteber ([8b673e2](https://github.com/adobe/helix-pages/commit/8b673e27b0087f9ec24c2b37ccb6dd771246398e))
* **deps:** update dependency @adobe/helix-pipeline to v11 ([#457](https://github.com/adobe/helix-pages/issues/457)) ([12e0806](https://github.com/adobe/helix-pages/commit/12e08069425cb5125d083997ab4662605079761f))
* **deps:** update dependency @adobe/helix-pipeline to v11.2.3 ([bedb748](https://github.com/adobe/helix-pages/commit/bedb748c9260b1df9bd1d10c3af499ccecd57ba9))
* **deps:** update dependency @adobe/helix-shared to v7.13.0 ([8275fbd](https://github.com/adobe/helix-pages/commit/8275fbd3fd1617ac66ae90e2be5ed4d0bef9260d))
* **deps:** update external fixes ([3afd208](https://github.com/adobe/helix-pages/commit/3afd208eb25cb16cdf09e2f9c93ffedd383f5ce2))


### Features

* **deps:** use helix-pipeline v12 ([7f21335](https://github.com/adobe/helix-pages/commit/7f213357780b77da191f36a87b65335839289bd4))
* **markup:** no default decoration ([#403](https://github.com/adobe/helix-pages/issues/403)) ([829980b](https://github.com/adobe/helix-pages/commit/829980b71e704a24d8e374f0a67e371d71135ddb))

## [4.0.7](https://github.com/adobe/helix-pages/compare/v4.0.6...v4.0.7) (2020-09-30)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v11.2.3 ([9d347b5](https://github.com/adobe/helix-pages/commit/9d347b57c813290b4587403788e338e2b4b4c7ee))
* **deps:** update dependency @adobe/helix-pipeline to v11.2.4 ([f6d4a4f](https://github.com/adobe/helix-pages/commit/f6d4a4f84b5625df96786944348e7563aef38f66))
* **deps:** update dependency @adobe/helix-pipeline to v11.3.0 ([0dfd7a2](https://github.com/adobe/helix-pages/commit/0dfd7a23e7758dc93953ea8b7de69909fa5f0aa7))
* **deps:** update dependency @adobe/helix-pipeline to v11.3.1 ([#479](https://github.com/adobe/helix-pages/issues/479)) ([67e6112](https://github.com/adobe/helix-pages/commit/67e61126e40e9cce55b8e324e46b3f7c9de6bdba))
* **deps:** update dependency @adobe/openwhisk-action-utils to v4.3.1 ([b17b771](https://github.com/adobe/helix-pages/commit/b17b7713c540bd9fb9f3c4fc6a8384aeae1bdb63))
* **deps:** update external fixes ([db35862](https://github.com/adobe/helix-pages/commit/db35862a4ece4d1249bfdd08225c0a67037d887d))

## [4.0.6](https://github.com/adobe/helix-pages/compare/v4.0.5...v4.0.6) (2020-09-14)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v11.2.2 ([#470](https://github.com/adobe/helix-pages/issues/470)) ([8bb6a1b](https://github.com/adobe/helix-pages/commit/8bb6a1bf106b8d483a40377d9021d36358987847))

## [4.0.5](https://github.com/adobe/helix-pages/compare/v4.0.4...v4.0.5) (2020-09-11)


### Bug Fixes

* **deps:** pin dependency xml-escape to 1.1.0 ([fc39f97](https://github.com/adobe/helix-pages/commit/fc39f97caf05a48f3666027d340fed618bdc3685))
* **deps:** update dependency @adobe/helix-pipeline to v11 ([#457](https://github.com/adobe/helix-pages/issues/457)) ([21238e1](https://github.com/adobe/helix-pages/commit/21238e133b59c7051d93388dc7c1656a2aface84))
* **deps:** update dependency @adobe/helix-shared to v7.12.0 ([ebe0bbc](https://github.com/adobe/helix-pages/commit/ebe0bbc49f7619c5fd712f4c826138a16507a78f))
* **deps:** update dependency @adobe/helix-shared to v7.13.0 ([4669f59](https://github.com/adobe/helix-pages/commit/4669f594cacaf8ca575bcdda643f41a24410c3cf))

## [4.0.4](https://github.com/adobe/helix-pages/compare/v4.0.3...v4.0.4) (2020-09-04)


### Bug Fixes

* **deps:** update dependency @adobe/openwhisk-action-utils to v4.3.0 ([bc58462](https://github.com/adobe/helix-pages/commit/bc5846246386cb25ea789d299db9e20564173b24))

## [4.0.3](https://github.com/adobe/helix-pages/compare/v4.0.2...v4.0.3) (2020-09-03)


### Bug Fixes

* **sitemap:** anticipate data format change ([#448](https://github.com/adobe/helix-pages/issues/448)) ([cb577c8](https://github.com/adobe/helix-pages/commit/cb577c8501652485cd71407035eda2a8014c0f34)), closes [#400](https://github.com/adobe/helix-pages/issues/400)

## [4.0.2](https://github.com/adobe/helix-pages/compare/v4.0.1...v4.0.2) (2020-09-03)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.5.1 ([#453](https://github.com/adobe/helix-pages/issues/453)) ([3ee04b7](https://github.com/adobe/helix-pages/commit/3ee04b7cfb34b7bd787be0bfafa97842d4e49f2b))
* **feed:** escape xml in titles ([dbc68a7](https://github.com/adobe/helix-pages/commit/dbc68a7105453d7d704cd8f8432a531d5d53d119))

## [4.0.1](https://github.com/adobe/helix-pages/compare/v4.0.0...v4.0.1) (2020-09-01)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.5.0 ([26369d0](https://github.com/adobe/helix-pages/commit/26369d05698858fc09417f53eee4be21bcb431a8))

# [4.0.0](https://github.com/adobe/helix-pages/compare/v3.2.1...v4.0.0) (2020-09-01)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.4.2 ([5f07641](https://github.com/adobe/helix-pages/commit/5f07641549d6d03a169115894ca942632131d005))


### Features

* **sitemap:** remove sitemap.xml ([30ab8ef](https://github.com/adobe/helix-pages/commit/30ab8ef4c61950fcbcfe209f043a672239fdf5ca))


### BREAKING CHANGES

* **sitemap:** projects using this feature need to add their own sitemap.xml in the project repository.

## [3.2.1](https://github.com/adobe/helix-pages/compare/v3.2.0...v3.2.1) (2020-08-28)


### Bug Fixes

* **deps:** update [@adobe](https://github.com/adobe) fixes ([#438](https://github.com/adobe/helix-pages/issues/438)) ([8308587](https://github.com/adobe/helix-pages/commit/83085871396338185a9a32db95fe3f227fcf62c0))

# [3.2.0](https://github.com/adobe/helix-pages/compare/v3.1.5...v3.2.0) (2020-08-27)


### Bug Fixes

* **ci:** increase action memory to 512mb ([#446](https://github.com/adobe/helix-pages/issues/446)) ([6c81619](https://github.com/adobe/helix-pages/commit/6c8161919bbbff8cece81532d286de9f2ddf9542))


### Features

* **pages.test.js:** add documentation ([#440](https://github.com/adobe/helix-pages/issues/440)) ([d6ee835](https://github.com/adobe/helix-pages/commit/d6ee835ee308bbb6efe93bc893d2aaf266a383f2))
* **pages.test.js:** remove theblog-tests ([#441](https://github.com/adobe/helix-pages/issues/441)) ([88603a2](https://github.com/adobe/helix-pages/commit/88603a2d899115a9a77224a316ade76031ae23d9))

## [3.1.5](https://github.com/adobe/helix-pages/compare/v3.1.4...v3.1.5) (2020-08-26)


### Bug Fixes

* **ci:** trigger release ([71151c0](https://github.com/adobe/helix-pages/commit/71151c0910aa8e9a375c1710a41669bbddd1d5a5))

## [3.1.4](https://github.com/adobe/helix-pages/compare/v3.1.3...v3.1.4) (2020-08-26)


### Bug Fixes

* **ci:** trigger release ([56a907e](https://github.com/adobe/helix-pages/commit/56a907e43f3e72e451310462a56ac2cf756dea8c))
* **deps:** update dependency @adobe/helix-pipeline to v10.4.0 ([915a898](https://github.com/adobe/helix-pages/commit/915a898170a9a1049cd7b4eac3d6a0407e942944))

## [3.1.3](https://github.com/adobe/helix-pages/compare/v3.1.2...v3.1.3) (2020-08-21)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.3.0 ([8c8a569](https://github.com/adobe/helix-pages/commit/8c8a56985d9b2624d338e98af8ba8cf03124dc11))

## [3.1.2](https://github.com/adobe/helix-pages/compare/v3.1.1...v3.1.2) (2020-08-21)


### Bug Fixes

* **vcl:** revert caching directive for dispatch ([#433](https://github.com/adobe/helix-pages/issues/433)) ([0d7f974](https://github.com/adobe/helix-pages/commit/0d7f97435bcf81fc88fbfcf4774c23d4f93f5d89)), closes [#424](https://github.com/adobe/helix-pages/issues/424)

## [3.1.1](https://github.com/adobe/helix-pages/compare/v3.1.0...v3.1.1) (2020-08-20)


### Bug Fixes

* **ci:** trigger a new clean release ([d21cab6](https://github.com/adobe/helix-pages/commit/d21cab611688ae78dc5d13325cb130df1fb599ef))

# [3.1.0](https://github.com/adobe/helix-pages/compare/v3.0.2...v3.1.0) (2020-08-17)


### Bug Fixes

* properly adjust body and html tag properties for url markup match ([e18a8a9](https://github.com/adobe/helix-pages/commit/e18a8a9c078f7df66afde400c9775e82d8f21231))
* properly adjust body and html tag properties for url markup match ([1a3ac61](https://github.com/adobe/helix-pages/commit/1a3ac61a7a5cf7e0966b964c9e09a950b191ebfc))


### Features

* **markup:** add helix markup properties to the html root node ([8217fd3](https://github.com/adobe/helix-pages/commit/8217fd3dd74b649b98d9ee624dcec8aa222f2a31))
* **markup:** add helix markup properties to the html root node ([8d1726e](https://github.com/adobe/helix-pages/commit/8d1726ed5caad9ae2ed8545587c61fabecd2f4e3))
* **markup:** add helix markup properties to the html root node ([b434cc8](https://github.com/adobe/helix-pages/commit/b434cc841ee41fded75551eec055ba421b80fa5f)), closes [adobe/theblog#241](https://github.com/adobe/theblog/issues/241)

## [3.0.2](https://github.com/adobe/helix-pages/compare/v3.0.1...v3.0.2) (2020-08-14)


### Bug Fixes

* **docs:** trigger publish ([7d2e08b](https://github.com/adobe/helix-pages/commit/7d2e08b1e410f65a6552a084fa7ac050ced8cf8c))

## [3.0.1](https://github.com/adobe/helix-pages/compare/v3.0.0...v3.0.1) (2020-08-14)


### Bug Fixes

* **embed:** typo ([8722da3](https://github.com/adobe/helix-pages/commit/8722da35f98e5e22b72f0e89d5bfc6bf2e3d2f10))

# [3.0.0](https://github.com/adobe/helix-pages/compare/v2.9.0...v3.0.0) (2020-08-11)


### Bug Fixes

* **embed:** increase robustness ([bd9b7e6](https://github.com/adobe/helix-pages/commit/bd9b7e6b62a02cf2bceb5b39d588deb50da6fa8a))
* **feed:** wrap feed entries with CDATA ([9f1d616](https://github.com/adobe/helix-pages/commit/9f1d6164fba4ca91af5f28a4c78a84b5b9713c16))


### Features

* **embed:** add directory basename to embed class ([f888ae4](https://github.com/adobe/helix-pages/commit/f888ae4cc5cfca8d57a63f10058ef6bfa7824a5a))
* **embed:** add embed class to internal embeds ([4ba772f](https://github.com/adobe/helix-pages/commit/4ba772f8beccaa4c33a6a036278f4d1f1223fa92))
* **embed:** add wrapping div around internal embeds ([34cce9a](https://github.com/adobe/helix-pages/commit/34cce9ab1d7659b66fd26999414895f6fe36700c))
* **embeds:** include embedded file basename ([96b574b](https://github.com/adobe/helix-pages/commit/96b574b6e489cc5c1e4a4392c8d2846ce5836102)), closes [#408](https://github.com/adobe/helix-pages/issues/408)
* **html:** add div.embed-internal around internal embeds ([438d7ca](https://github.com/adobe/helix-pages/commit/438d7ca428fcac004e927b1945335adb12f87dc8))


### BREAKING CHANGES

* **embed:** fixes #408

# [2.9.0](https://github.com/adobe/helix-pages/compare/v2.8.1...v2.9.0) (2020-08-11)


### Features

* **feed:** include link, title, and updated for each entry ([6597456](https://github.com/adobe/helix-pages/commit/6597456436f16784400099763033e8de19174a69))
* **feeds:** add rough support for ESI-based feed generation ([808fd85](https://github.com/adobe/helix-pages/commit/808fd8570b6d004854abb4c4c6f4a5a6852a3bde))

## [2.8.1](https://github.com/adobe/helix-pages/compare/v2.8.0...v2.8.1) (2020-08-11)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.2.4 ([6c7232f](https://github.com/adobe/helix-pages/commit/6c7232f00a3bc44251b98a4bb90a7ca3a6c76192))

# [2.8.0](https://github.com/adobe/helix-pages/compare/v2.7.6...v2.8.0) (2020-08-10)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.2.1 ([aa4fe76](https://github.com/adobe/helix-pages/commit/aa4fe7614de1b3508066587ba9430ddeddc464b4))
* **deps:** update dependency @adobe/helix-pipeline to v10.2.2 ([39430ac](https://github.com/adobe/helix-pages/commit/39430ac97ada5b011835f66e42462b94a3112957))
* **deps:** update dependency @adobe/helix-pipeline to v10.2.3 ([fbc19e0](https://github.com/adobe/helix-pages/commit/fbc19e0c317252dbad816516d42235d73bbc7d85))
* **deps:** update external fixes ([664b084](https://github.com/adobe/helix-pages/commit/664b084210662260ddbe3dd65a74a80e2b5cd026))
* **vcl:** ensure test domains are considered, too ([8b55915](https://github.com/adobe/helix-pages/commit/8b5591556536c91f214dc94bd96a4a11cd470e0e)), closes [#402](https://github.com/adobe/helix-pages/issues/402)


### Features

* **vcl:** enable caching on sites with an outer CDN ([fade111](https://github.com/adobe/helix-pages/commit/fade1111591e02cb1e3de296161363e25428403a)), closes [#402](https://github.com/adobe/helix-pages/issues/402)

## [2.7.6](https://github.com/adobe/helix-pages/compare/v2.7.5...v2.7.6) (2020-07-30)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.2.0 ([fb53660](https://github.com/adobe/helix-pages/commit/fb53660b8f84df4df216593b048ed09f9ce38fcc))
* **deps:** update dependency algoliasearch to v4.3.1 ([5dda40e](https://github.com/adobe/helix-pages/commit/5dda40ebdf64b298baa6bc6507381ddf45b31e58))

## [2.7.5](https://github.com/adobe/helix-pages/compare/v2.7.4...v2.7.5) (2020-07-21)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.1.4 ([#399](https://github.com/adobe/helix-pages/issues/399)) ([554aab6](https://github.com/adobe/helix-pages/commit/554aab64ffc442a3975d5ba8645ed9b8342121df))
* **deps:** update dependency @adobe/helix-shared to v7.10.0 ([#398](https://github.com/adobe/helix-pages/issues/398)) ([d39da5d](https://github.com/adobe/helix-pages/commit/d39da5debe4b0148d11bacb365ee25720981b574))

## [2.7.4](https://github.com/adobe/helix-pages/compare/v2.7.3...v2.7.4) (2020-07-16)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.1.2 ([#392](https://github.com/adobe/helix-pages/issues/392)) ([b9f34bd](https://github.com/adobe/helix-pages/commit/b9f34bdd027b998c8f78be09ba7a2f22d0b120d7))

## [2.7.3](https://github.com/adobe/helix-pages/compare/v2.7.2...v2.7.3) (2020-07-07)


### Bug Fixes

* **readme:** no-change to deploy with helix-publish@6.1.0 ([05affde](https://github.com/adobe/helix-pages/commit/05affde92deac4b2f0bf5bcc7a179a8ca35b391f))

## [2.7.2](https://github.com/adobe/helix-pages/compare/v2.7.1...v2.7.2) (2020-07-07)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.1.1 ([#383](https://github.com/adobe/helix-pages/issues/383)) ([9458cc9](https://github.com/adobe/helix-pages/commit/9458cc9d3aadfa29b515f1fa7485aff858c5c328))
* **deps:** update minor ([c70dcac](https://github.com/adobe/helix-pages/commit/c70dcac01b593f0ab74701ba6e01725520020071))

## [2.7.1](https://github.com/adobe/helix-pages/compare/v2.7.0...v2.7.1) (2020-06-30)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.0.8 ([#372](https://github.com/adobe/helix-pages/issues/372)) ([5507a5b](https://github.com/adobe/helix-pages/commit/5507a5b779fb5a9f5003cf02d6c4ec611b84fd08))

# [2.7.0](https://github.com/adobe/helix-pages/compare/v2.6.1...v2.7.0) (2020-06-29)


### Features

* **ci:** diff test blocks publish and shares test file ([8591689](https://github.com/adobe/helix-pages/commit/859168909a3b2e44f4e5700de534b6abf491a6ff))
* **ci:** diff test blocks publish and shares test file ([3663ef1](https://github.com/adobe/helix-pages/commit/3663ef15082914ec88db458426173216f00002de))
* **ci:** diff test blocks publish and shares test file ([e2308ed](https://github.com/adobe/helix-pages/commit/e2308edcd04aca5decc1f62caf79c1fea1e24113))

## [2.6.1](https://github.com/adobe/helix-pages/compare/v2.6.0...v2.6.1) (2020-06-29)


### Bug Fixes

* **deps:** pin dependency lodash.pickby to 4.6.0 ([2386b40](https://github.com/adobe/helix-pages/commit/2386b408744ed1886ca0d7c09b32c4a33d54eb6d))
* **deps:** update dependency @adobe/helix-pipeline to v10.0.6 ([6411661](https://github.com/adobe/helix-pages/commit/641166128e5c9d58ff636ce58dd5a62f8e5f55a5))
* **deps:** update dependency @adobe/helix-pipeline to v10.0.7 ([5689693](https://github.com/adobe/helix-pages/commit/5689693149a17c4de5ec07eb326c7360d2fba83c))
* **deps:** update dependency @adobe/helix-shared to v7.9.0 ([a0d9d10](https://github.com/adobe/helix-pages/commit/a0d9d10738f97cf63d4ccebf174ebf5d66241dc7))
* **deps:** update dependency @adobe/openwhisk-action-utils to v4.2.3 ([0c56130](https://github.com/adobe/helix-pages/commit/0c561309de0b48a15ef293bf878d106156f67885))

# [2.6.0](https://github.com/adobe/helix-pages/compare/v2.5.3...v2.6.0) (2020-06-26)


### Features

* **sitemap:** add azure provider ([#360](https://github.com/adobe/helix-pages/issues/360)) ([dd37a95](https://github.com/adobe/helix-pages/commit/dd37a9509d6e737c45c2a65e42acd5d99c31242d))

## [2.5.3](https://github.com/adobe/helix-pages/compare/v2.5.2...v2.5.3) (2020-06-26)


### Bug Fixes

* **pages.tests.js:** increases test timeout ([889be8d](https://github.com/adobe/helix-pages/commit/889be8dd83e186fb88ce3b3d10350fec4f7a58c1))

## [2.5.2](https://github.com/adobe/helix-pages/compare/v2.5.1...v2.5.2) (2020-06-26)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.8.1 ([b8bae02](https://github.com/adobe/helix-pages/commit/b8bae02e65dc145d331b28e3e7d45262b00b15d7))

## [2.5.1](https://github.com/adobe/helix-pages/compare/v2.5.0...v2.5.1) (2020-06-26)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.0.5 ([84c35ae](https://github.com/adobe/helix-pages/commit/84c35ae22b9f93bd7820bdabf1a125ab5dbd783b))
* **deps:** update dependency @adobe/helix-shared to v7.8.0 ([1c833d8](https://github.com/adobe/helix-pages/commit/1c833d891db95a7ebf308feead7408e64646dee0))

# [2.5.0](https://github.com/adobe/helix-pages/compare/v2.4.1...v2.5.0) (2020-06-26)


### Features

* **pages.test.js:** add tests to detect changes ([#337](https://github.com/adobe/helix-pages/issues/337)) ([39c47e2](https://github.com/adobe/helix-pages/commit/39c47e2f6ce2a91427a506a7c22e3e7a0169afd3)), closes [#355](https://github.com/adobe/helix-pages/issues/355)

## [2.4.1](https://github.com/adobe/helix-pages/compare/v2.4.0...v2.4.1) (2020-06-25)


### Bug Fixes

* **deps:** update [@adobe](https://github.com/adobe) ([12014f4](https://github.com/adobe/helix-pages/commit/12014f4c384b4d6b81eeb674af2353eff75b37c7))
* **vcl:** vary XFH ([f707345](https://github.com/adobe/helix-pages/commit/f707345d278b2164fd87b56c84bcfd9bb24d08e4))

# [2.4.0](https://github.com/adobe/helix-pages/compare/v2.3.2...v2.4.0) (2020-06-22)


### Features

* **sitemap:** Allow sitemap entries to be fed from a json endpoint ([#352](https://github.com/adobe/helix-pages/issues/352)) ([1440541](https://github.com/adobe/helix-pages/commit/1440541e8d9d51072cb00c29b27e30de16d133b8))

## [2.3.2](https://github.com/adobe/helix-pages/compare/v2.3.1...v2.3.2) (2020-06-19)


### Bug Fixes

* **ci:** trigger a new clean release ([cb90dd2](https://github.com/adobe/helix-pages/commit/cb90dd29e3794a0f6636b4345f7ea9f3c3d194bf))

## [2.3.1](https://github.com/adobe/helix-pages/compare/v2.3.0...v2.3.1) (2020-06-19)


### Bug Fixes

* **ci:** trigger a new clean release ([3172b5a](https://github.com/adobe/helix-pages/commit/3172b5a8ba5bffcc495e1a030b4550880e8d4faa))

# [2.3.0](https://github.com/adobe/helix-pages/compare/v2.2.0...v2.3.0) (2020-06-18)


### Features

* **seo:** keep robots out on fastly instead ([84bfb37](https://github.com/adobe/helix-pages/commit/84bfb37f4e779940397d6d3f41a14f98e1bbcb56))

# [2.2.0](https://github.com/adobe/helix-pages/compare/v2.1.0...v2.2.0) (2020-06-18)


### Features

* **seo:** default meta image ([ddd59a6](https://github.com/adobe/helix-pages/commit/ddd59a6d0561d20a453a23ae8a88c9297707e1a9))

# [2.1.0](https://github.com/adobe/helix-pages/compare/v2.0.8...v2.1.0) (2020-06-18)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.0.3 ([139aee2](https://github.com/adobe/helix-pages/commit/139aee24496f09f8c87da94472438bc8734c9ef1))


### Features

* **publish:** use new publish version with blocklist ([8d740a5](https://github.com/adobe/helix-pages/commit/8d740a5e01ef2082e9b95e4ee1804ec3f9637cd3))

## [2.0.8](https://github.com/adobe/helix-pages/compare/v2.0.7...v2.0.8) (2020-06-17)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.0.2 ([#346](https://github.com/adobe/helix-pages/issues/346)) ([25c5917](https://github.com/adobe/helix-pages/commit/25c591729e250cd371a4ee97e6856119b845d1c0))

## [2.0.7](https://github.com/adobe/helix-pages/compare/v2.0.6...v2.0.7) (2020-06-16)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10.0.1 ([#344](https://github.com/adobe/helix-pages/issues/344)) ([2316067](https://github.com/adobe/helix-pages/commit/23160678824f879ca9fca528c23e6ae536c60cda))

## [2.0.6](https://github.com/adobe/helix-pages/compare/v2.0.5...v2.0.6) (2020-06-15)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v10 ([71c71f1](https://github.com/adobe/helix-pages/commit/71c71f14b0daec8d5c8d7cd3db03ce4634b6e702))

## [2.0.5](https://github.com/adobe/helix-pages/compare/v2.0.4...v2.0.5) (2020-06-15)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.6.0 ([a13b72d](https://github.com/adobe/helix-pages/commit/a13b72d36ebeff8f75674d7e2809833680869fbb))
* **deps:** update external ([46aac83](https://github.com/adobe/helix-pages/commit/46aac8372cfe534836e0f7fbc443d1866b80ee25))

## [2.0.4](https://github.com/adobe/helix-pages/compare/v2.0.3...v2.0.4) (2020-06-13)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v9 ([#336](https://github.com/adobe/helix-pages/issues/336)) ([8cff87e](https://github.com/adobe/helix-pages/commit/8cff87e5a7afe2f61dd8bb06733d620d6b48436d))

## [2.0.3](https://github.com/adobe/helix-pages/compare/v2.0.2...v2.0.3) (2020-06-12)


### Bug Fixes

* **readme:** trigger new publish ([c3e5121](https://github.com/adobe/helix-pages/commit/c3e5121fc8de23378969c7fbffb0312ea4c43fe3))

## [2.0.2](https://github.com/adobe/helix-pages/compare/v2.0.1...v2.0.2) (2020-06-12)


### Bug Fixes

* **readme:** epsagon tracing ([ea73fd9](https://github.com/adobe/helix-pages/commit/ea73fd9d963b464cf21ec2316643993daf357aa7))

## [2.0.1](https://github.com/adobe/helix-pages/compare/v2.0.0...v2.0.1) (2020-06-09)


### Bug Fixes

* **seo:** move robots.txt to htdocs ([74c46ab](https://github.com/adobe/helix-pages/commit/74c46ab70e1ad74e377f901203dc481c8f1e6e9f))

# [2.0.0](https://github.com/adobe/helix-pages/compare/v1.14.21...v2.0.0) (2020-06-09)


### Features

* **seo:** keep robots out by default ([8953df0](https://github.com/adobe/helix-pages/commit/8953df0fc7b230b054105f31b69c96efe2c3e720))


* Merge pull request #330 from adobe/robots ([3c79c6d](https://github.com/adobe/helix-pages/commit/3c79c6d15088788d3b9df338f6db7aa2e2cb3c14)), closes [#330](https://github.com/adobe/helix-pages/issues/330)


### BREAKING CHANGES

* Add a robots.txt to your Helix Pages project to enable crawling and indexing.

## [1.14.21](https://github.com/adobe/helix-pages/compare/v1.14.20...v1.14.21) (2020-06-08)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v8.0.6 ([#325](https://github.com/adobe/helix-pages/issues/325)) ([4597187](https://github.com/adobe/helix-pages/commit/459718761a7779271e5fec15f4334d111c63d4c4))

## [1.14.20](https://github.com/adobe/helix-pages/compare/v1.14.19...v1.14.20) (2020-06-05)


### Bug Fixes

* **seo:** split hlx-forwarded-host list and use first ([b938fb8](https://github.com/adobe/helix-pages/commit/b938fb8a1e06a09c66982c58405baaf6224f9b05))

## [1.14.19](https://github.com/adobe/helix-pages/compare/v1.14.18...v1.14.19) (2020-06-05)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v8.0.4 ([c8b49f0](https://github.com/adobe/helix-pages/commit/c8b49f0bf2e2d383f6e028eb4f91b7f63c1d5075))
* **deps:** update dependency @adobe/helix-pipeline to v8.0.5 ([6140064](https://github.com/adobe/helix-pages/commit/614006477bfbecf5fbabfc4b190abfd191f9b6ab))
* **deps:** update dependency @adobe/helix-shared to v7.4.0 ([e708803](https://github.com/adobe/helix-pages/commit/e70880352b75af9346101d9b88d091a634f26666))
* **seo:** use hlx-forwarded-host header and switch canonical url back to absolute ([ee8f166](https://github.com/adobe/helix-pages/commit/ee8f166d00a7ba9631b225a66ea50f07d45c12c2))

## [1.14.18](https://github.com/adobe/helix-pages/compare/v1.14.17...v1.14.18) (2020-06-03)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v8.0.3 ([67c0476](https://github.com/adobe/helix-pages/commit/67c0476f05ed48fdf1891e77fc36d82032209674))

## [1.14.17](https://github.com/adobe/helix-pages/compare/v1.14.16...v1.14.17) (2020-06-02)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v8.0.2 ([#316](https://github.com/adobe/helix-pages/issues/316)) ([6e7ec26](https://github.com/adobe/helix-pages/commit/6e7ec26be287dbf83ab9aa4749daca587e717037))

## [1.14.16](https://github.com/adobe/helix-pages/compare/v1.14.15...v1.14.16) (2020-06-02)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v8 ([#314](https://github.com/adobe/helix-pages/issues/314)) ([a596a74](https://github.com/adobe/helix-pages/commit/a596a7464ea083cd5e1063669710203fb6824502))

## [1.14.15](https://github.com/adobe/helix-pages/compare/v1.14.14...v1.14.15) (2020-05-29)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v7.6.0 ([a419bb3](https://github.com/adobe/helix-pages/commit/a419bb31c29b871c0db4458529a406a6e127d6ef))
* **deps:** update dependency @adobe/helix-pipeline to v7.7.0 ([01604f2](https://github.com/adobe/helix-pages/commit/01604f22d76d5504c5df4c8b275c929a0481b4a8))
* **seo:** make sure image url is absolute ([172a65d](https://github.com/adobe/helix-pages/commit/172a65dc84ff57b251427ac3cf56f5db83985d30))

## [1.14.14](https://github.com/adobe/helix-pages/compare/v1.14.13...v1.14.14) (2020-05-28)


### Bug Fixes

* **seo:** use relative url only in canconical link ([084ba32](https://github.com/adobe/helix-pages/commit/084ba32af4ff8332b5d7d87454e3685e4a728d8a))

## [1.14.13](https://github.com/adobe/helix-pages/compare/v1.14.12...v1.14.13) (2020-05-28)


### Bug Fixes

* **seo:** workaround: use relative URL for canonical link ([b949772](https://github.com/adobe/helix-pages/commit/b949772f4e4046571d961950f124a0c14dc840c6))

## [1.14.12](https://github.com/adobe/helix-pages/compare/v1.14.11...v1.14.12) (2020-05-28)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v7.5.0 ([a7f532c](https://github.com/adobe/helix-pages/commit/a7f532c247b76ff15209b8562f254539d416f412))

## [1.14.11](https://github.com/adobe/helix-pages/compare/v1.14.10...v1.14.11) (2020-05-27)


### Bug Fixes

* **seo:** workaround: use relative URL for canonical link ([8a11b44](https://github.com/adobe/helix-pages/commit/8a11b44bfb83bdbe2c16648d3410c9bae0350f83))

## [1.14.10](https://github.com/adobe/helix-pages/compare/v1.14.9...v1.14.10) (2020-05-27)


### Bug Fixes

* **url:** use more reasonable headers to retrieve outer CDN hostname ([405a12c](https://github.com/adobe/helix-pages/commit/405a12c54c69e4f46516aaff60dbebefe3979cf9))

## [1.14.9](https://github.com/adobe/helix-pages/compare/v1.14.8...v1.14.9) (2020-05-26)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v7.4.1 ([0071981](https://github.com/adobe/helix-pages/commit/007198197dabde7f9762823cfb71762a3c753e09))
* **sitemap:** missing helix-query.yaml shouldn't report 500 ([#302](https://github.com/adobe/helix-pages/issues/302)) ([155d0ab](https://github.com/adobe/helix-pages/commit/155d0ab8e31d61b181a5a273f74815f2b1e36e1e))

## [1.14.8](https://github.com/adobe/helix-pages/compare/v1.14.7...v1.14.8) (2020-05-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v7.2.0 ([a57cf17](https://github.com/adobe/helix-pages/commit/a57cf177e5b27fd2aef3b2bdac87eb89512e46d6))

## [1.14.7](https://github.com/adobe/helix-pages/compare/v1.14.6...v1.14.7) (2020-05-18)


### Bug Fixes

* revert commit f413610 to master ([4fb00ee](https://github.com/adobe/helix-pages/commit/4fb00ee8cfef8390505ff18b2d5761416bd0a5cb))

## [1.14.6](https://github.com/adobe/helix-pages/compare/v1.14.5...v1.14.6) (2020-05-18)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v7.1.6 ([de677d3](https://github.com/adobe/helix-pages/commit/de677d384fb6bf5f6e159d8d816af3dd9b8cd3c4))

## [1.14.5](https://github.com/adobe/helix-pages/compare/v1.14.4...v1.14.5) (2020-05-18)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v7.1.2 ([b530fe2](https://github.com/adobe/helix-pages/commit/b530fe2b55f169750cd730348d3ec7a7c9be9aaf))
* **deps:** update dependency @adobe/helix-pipeline to v7.1.3 ([17e0aee](https://github.com/adobe/helix-pages/commit/17e0aeeb8639b8dae1c9243cf9fbd0042f564750))
* **deps:** update dependency @adobe/helix-pipeline to v7.1.4 ([22708ce](https://github.com/adobe/helix-pages/commit/22708ce79b102988cfc8b125f327b16c8e859d1a))
* **deps:** update dependency @adobe/helix-pipeline to v7.1.5 ([#290](https://github.com/adobe/helix-pages/issues/290)) ([d95b890](https://github.com/adobe/helix-pages/commit/d95b890241d4b9e6d9765125e83e263e51dc84a2))

## [1.14.4](https://github.com/adobe/helix-pages/compare/v1.14.3...v1.14.4) (2020-05-14)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.3.2 ([#286](https://github.com/adobe/helix-pages/issues/286)) ([b1a1cc3](https://github.com/adobe/helix-pages/commit/b1a1cc37203b22cf33124d684d04599a2def3f16))

## [1.14.3](https://github.com/adobe/helix-pages/compare/v1.14.2...v1.14.3) (2020-05-14)


### Bug Fixes

* **deps:** update [@adobe](https://github.com/adobe) ([#285](https://github.com/adobe/helix-pages/issues/285)) ([9a5a82c](https://github.com/adobe/helix-pages/commit/9a5a82c7da7b467aec1622039e386f13a4af81e2))

## [1.14.2](https://github.com/adobe/helix-pages/compare/v1.14.1...v1.14.2) (2020-05-13)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v7.0.4 ([a31b7c2](https://github.com/adobe/helix-pages/commit/a31b7c247fa7cd883c7392be86cad874041a6d77))
* **deps:** update dependency @adobe/helix-pipeline to v7.1.0 ([#282](https://github.com/adobe/helix-pages/issues/282)) ([77e3893](https://github.com/adobe/helix-pages/commit/77e3893c8b1ea215c9613227ef2373e1856bf321))

## [1.14.1](https://github.com/adobe/helix-pages/compare/v1.14.0...v1.14.1) (2020-05-12)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v7.0.3 ([83adda1](https://github.com/adobe/helix-pages/commit/83adda12a06dac06c35628ec289c32c991e91687))
* **deps:** update dependency jquery to v3.5.1 ([#277](https://github.com/adobe/helix-pages/issues/277)) ([b6a1b8d](https://github.com/adobe/helix-pages/commit/b6a1b8d35676725659837312541ce3b6205412bb))

# [1.14.0](https://github.com/adobe/helix-pages/compare/v1.13.1...v1.14.0) (2020-05-08)


### Features

* **seo:** add twitter tags ([4dbf538](https://github.com/adobe/helix-pages/commit/4dbf538fb46a8e3e576ae204ed67bca8c2fd814c))

## [1.13.1](https://github.com/adobe/helix-pages/compare/v1.13.0...v1.13.1) (2020-05-07)


### Bug Fixes

* nothing ([40c3e52](https://github.com/adobe/helix-pages/commit/40c3e52842f8508c80548f3e10af3cd6aa063554))

# [1.13.0](https://github.com/adobe/helix-pages/compare/v1.12.0...v1.13.0) (2020-05-07)


### Bug Fixes

* **deps:** update [@adobe](https://github.com/adobe) ([2c22a1f](https://github.com/adobe/helix-pages/commit/2c22a1ff0c173a6d3d97ab3c3f019e84cfd10b28))
* **deps:** update dependency @adobe/helix-pipeline to v7 ([#256](https://github.com/adobe/helix-pages/issues/256)) ([fe254e9](https://github.com/adobe/helix-pages/commit/fe254e9c84c36f3fa6dbafb2de49385921a438ec))
* **metadata:** use correct variables in output ([cc06c9c](https://github.com/adobe/helix-pages/commit/cc06c9cce1c168341e27aa61bae36d94c1467d93))


### Features

* **metadata:** add open graph meta tags ([421a5c6](https://github.com/adobe/helix-pages/commit/421a5c6e6ddb8e1c875abd055dbdec0c84c38e1a))
* **metadata:** pad description text from multiple paragraphs with spaces ([b7e948f](https://github.com/adobe/helix-pages/commit/b7e948f17d2be5cecbffc12ee196bfb517c5cdd4))
* **metadata:** use paragraphs with 10 or more words for description, limited to 25 words ([9ccb546](https://github.com/adobe/helix-pages/commit/9ccb546b402ce1f92136c736e2be476567c7cc0d))

# [1.12.0](https://github.com/adobe/helix-pages/compare/v1.11.0...v1.12.0) (2020-05-06)


### Features

* **sitemap:** use external path if available ([#267](https://github.com/adobe/helix-pages/issues/267)) ([59e2faf](https://github.com/adobe/helix-pages/commit/59e2fafc5e06de55bca279fdd6daf9a86b3e89aa))

# [1.11.0](https://github.com/adobe/helix-pages/compare/v1.10.6...v1.11.0) (2020-05-05)


### Bug Fixes

* **rendering:** class in top Frontmatter not respected if no section ([9de3bfb](https://github.com/adobe/helix-pages/commit/9de3bfbba62ebca3635ce5b93bf545a45191ae9b))


### Features

* **rendering:** support for internal embeds ([16a35d2](https://github.com/adobe/helix-pages/commit/16a35d285c8a875b4f2881ea5e5efeaa79ec1531))

## [1.10.6](https://github.com/adobe/helix-pages/compare/v1.10.5...v1.10.6) (2020-05-04)


### Bug Fixes

* nothing ([1e79008](https://github.com/adobe/helix-pages/commit/1e79008e851483b27091f0b6378f50d6456f14f6))

## [1.10.5](https://github.com/adobe/helix-pages/compare/v1.10.4...v1.10.5) (2020-04-28)


### Bug Fixes

* **monitoring:** module is not defined ([0053ec1](https://github.com/adobe/helix-pages/commit/0053ec178fd0d682ee08343654928d1d5a62dacd))
* **monitoring:** module is not defined ([bb87817](https://github.com/adobe/helix-pages/commit/bb87817ad882a6ef2c4f0307189f008d2fad9307))

## [1.10.4](https://github.com/adobe/helix-pages/compare/v1.10.3...v1.10.4) (2020-04-28)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.14.0 ([#254](https://github.com/adobe/helix-pages/issues/254)) ([4054ca8](https://github.com/adobe/helix-pages/commit/4054ca8f5f71a50cf1c8edce568a78f0baec0acc))

## [1.10.3](https://github.com/adobe/helix-pages/compare/v1.10.2...v1.10.3) (2020-04-28)


### Bug Fixes

* **deps:** update external ([#251](https://github.com/adobe/helix-pages/issues/251)) ([2c0deb0](https://github.com/adobe/helix-pages/commit/2c0deb0b2c54d1b2610de63b7f738bcb05337c85))

## [1.10.2](https://github.com/adobe/helix-pages/compare/v1.10.1...v1.10.2) (2020-04-27)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7.2.1 ([883024c](https://github.com/adobe/helix-pages/commit/883024c086f630c1964f74a448499fe95065c08f))

## [1.10.1](https://github.com/adobe/helix-pages/compare/v1.10.0...v1.10.1) (2020-04-27)


### Bug Fixes

* **package.json:** add statuspage ([56e10bf](https://github.com/adobe/helix-pages/commit/56e10bf08efc48579838c6f252149aa701113da1))


### Performance Improvements

* **error500.js:** house monitor script for pages ([4e9f7a0](https://github.com/adobe/helix-pages/commit/4e9f7a05adc59ea63d8339cbbdd47aa81eb1f5bf))

# [1.10.0](https://github.com/adobe/helix-pages/compare/v1.9.0...v1.10.0) (2020-04-23)


### Bug Fixes

* **ci:** trigger a new clean release ([8a35b1e](https://github.com/adobe/helix-pages/commit/8a35b1e9a27e2548ad6bc1b2f97ad5d80e4b37bc))
* **deps:** update dependency @adobe/helix-shared to v7.1.0 ([c74300a](https://github.com/adobe/helix-pages/commit/c74300a17618dd1d95216d395630b2fe8b1e80a4))
* **monitoring:** missing orb ([fce62f7](https://github.com/adobe/helix-pages/commit/fce62f750296d52a3ae8401ab6c19cb93f6e1425))
* **monitoring:** missing statuspage group ([a94b469](https://github.com/adobe/helix-pages/commit/a94b4695d02abadb2c5833fa3cd44c863bd6bd45))


### Features

* **monitoring:** configure automation ([76c2826](https://github.com/adobe/helix-pages/commit/76c2826904e445269a3a51a9ae05a7176d14f9f0))


### Performance Improvements

* **error500.js:** house monitor script for pages ([2d850eb](https://github.com/adobe/helix-pages/commit/2d850ebf404efe75d174fd68f8a656ca77d3a154))

# [1.9.0](https://github.com/adobe/helix-pages/compare/v1.8.21...v1.9.0) (2020-04-20)


### Features

* **meta:** allow meta data to be viewed by query users ([f1bf6c0](https://github.com/adobe/helix-pages/commit/f1bf6c0a2dde2c41bb6b7ee65dd69c5a2d8a3331))

## [1.8.21](https://github.com/adobe/helix-pages/compare/v1.8.20...v1.8.21) (2020-04-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.13.1 ([0006414](https://github.com/adobe/helix-pages/commit/000641455e9e53e7ea04c625ba36d92ca87abd26))

## [1.8.20](https://github.com/adobe/helix-pages/compare/v1.8.19...v1.8.20) (2020-04-16)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.13.0 ([c984468](https://github.com/adobe/helix-pages/commit/c9844687363a918a9ff0f20ff268ffdbb0baf42f))

## [1.8.19](https://github.com/adobe/helix-pages/compare/v1.8.18...v1.8.19) (2020-04-15)


### Bug Fixes

* **deps:** update [@adobe](https://github.com/adobe) ([d682441](https://github.com/adobe/helix-pages/commit/d6824416120f033accd08a77f4bf797afe981b5d))

## [1.8.18](https://github.com/adobe/helix-pages/compare/v1.8.17...v1.8.18) (2020-04-15)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v7 ([#232](https://github.com/adobe/helix-pages/issues/232)) ([e874771](https://github.com/adobe/helix-pages/commit/e874771761e9eda8418af83589cdf401f4027058))

## [1.8.17](https://github.com/adobe/helix-pages/compare/v1.8.16...v1.8.17) (2020-04-14)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.12.6 ([#231](https://github.com/adobe/helix-pages/issues/231)) ([b67423c](https://github.com/adobe/helix-pages/commit/b67423cceb7d44537242991c917eedc72753eb5d))

## [1.8.16](https://github.com/adobe/helix-pages/compare/v1.8.15...v1.8.16) (2020-04-14)


### Bug Fixes

* **deps:** update dependency jquery to v3.5.0 ([#229](https://github.com/adobe/helix-pages/issues/229)) ([31edfd4](https://github.com/adobe/helix-pages/commit/31edfd4769a5ac5142389230ef00e099d7e10703))

## [1.8.15](https://github.com/adobe/helix-pages/compare/v1.8.14...v1.8.15) (2020-04-14)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.12.5 ([#230](https://github.com/adobe/helix-pages/issues/230)) ([eadbd80](https://github.com/adobe/helix-pages/commit/eadbd80cad700996fff3d0fd534183a0bd148d70))

## [1.8.14](https://github.com/adobe/helix-pages/compare/v1.8.13...v1.8.14) (2020-04-10)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.12.4 ([#228](https://github.com/adobe/helix-pages/issues/228)) ([36160db](https://github.com/adobe/helix-pages/commit/36160dbfc5e23c08a98b0e00bc975dae27814ee6))

## [1.8.13](https://github.com/adobe/helix-pages/compare/v1.8.12...v1.8.13) (2020-04-08)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.12.3 ([ee845ac](https://github.com/adobe/helix-pages/commit/ee845ac03f6084f4e6f0dca041a7d023064f9b3a))

## [1.8.12](https://github.com/adobe/helix-pages/compare/v1.8.11...v1.8.12) (2020-04-07)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.12.1 ([#225](https://github.com/adobe/helix-pages/issues/225)) ([2bdf0c4](https://github.com/adobe/helix-pages/commit/2bdf0c4b02da0ab313539176679e39f6b463f9cd))

## [1.8.11](https://github.com/adobe/helix-pages/compare/v1.8.10...v1.8.11) (2020-04-03)


### Bug Fixes

* **readme:** remove trailing spaces ([bf94256](https://github.com/adobe/helix-pages/commit/bf94256966af8e5c543f8cf2f6e9e1ab5dc522f9))

## [1.8.10](https://github.com/adobe/helix-pages/compare/v1.8.9...v1.8.10) (2020-04-03)


### Bug Fixes

* **sitemap:** use helix-query.yaml ([#224](https://github.com/adobe/helix-pages/issues/224)) ([e4fe013](https://github.com/adobe/helix-pages/commit/e4fe013962b16c33db6ccbfc739b91b63fb5ece6))

## [1.8.9](https://github.com/adobe/helix-pages/compare/v1.8.8...v1.8.9) (2020-04-03)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.11.4 ([4c51df8](https://github.com/adobe/helix-pages/commit/4c51df8aa8d7928f74d21f77eadaf207ef8bd990))

## [1.8.8](https://github.com/adobe/helix-pages/compare/v1.8.7...v1.8.8) (2020-04-02)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.11.3 ([1bfa8a9](https://github.com/adobe/helix-pages/commit/1bfa8a9ab81891742fcc6f10a0b75606b0d15ba1))

## [1.8.7](https://github.com/adobe/helix-pages/compare/v1.8.6...v1.8.7) (2020-04-01)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.11.2 ([f965f86](https://github.com/adobe/helix-pages/commit/f965f86550d83e6b37d3de3e8c744aff3a161874))

## [1.8.6](https://github.com/adobe/helix-pages/compare/v1.8.5...v1.8.6) (2020-03-26)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.11.1 ([88b9651](https://github.com/adobe/helix-pages/commit/88b96510fb303a1cd21d69a82abfb59afb2f3221))

## [1.8.5](https://github.com/adobe/helix-pages/compare/v1.8.4...v1.8.5) (2020-03-26)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.10.4 ([#216](https://github.com/adobe/helix-pages/issues/216)) ([857d764](https://github.com/adobe/helix-pages/commit/857d764d9b4bf4ae000adc1a5becca8fcb9efc5e))

## [1.8.4](https://github.com/adobe/helix-pages/compare/v1.8.3...v1.8.4) (2020-03-25)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.10.2 ([6a7e7c8](https://github.com/adobe/helix-pages/commit/6a7e7c81d898e2c985c890fa476eea599b74727a))

## [1.8.3](https://github.com/adobe/helix-pages/compare/v1.8.2...v1.8.3) (2020-03-25)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.10.1 ([#212](https://github.com/adobe/helix-pages/issues/212)) ([4f707d2](https://github.com/adobe/helix-pages/commit/4f707d26129b610e8a0cb5307a127d7a81e66f22))

## [1.8.2](https://github.com/adobe/helix-pages/compare/v1.8.1...v1.8.2) (2020-03-24)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.9.6 ([#211](https://github.com/adobe/helix-pages/issues/211)) ([ef196a1](https://github.com/adobe/helix-pages/commit/ef196a1972fbd8a952a7cf807b68efbd5148625a))

## [1.8.1](https://github.com/adobe/helix-pages/compare/v1.8.0...v1.8.1) (2020-03-24)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.9.5 ([#210](https://github.com/adobe/helix-pages/issues/210)) ([407779d](https://github.com/adobe/helix-pages/commit/407779df4be4611225901fcce1c8d59853529e14))

# [1.8.0](https://github.com/adobe/helix-pages/compare/v1.7.6...v1.8.0) (2020-03-24)


### Features

* **tests:** add theblog smoke tests ([#205](https://github.com/adobe/helix-pages/issues/205)) ([13a90e0](https://github.com/adobe/helix-pages/commit/13a90e0764e9ca26c1d99caa7c8d86e35b0aa3aa))

## [1.7.6](https://github.com/adobe/helix-pages/compare/v1.7.5...v1.7.6) (2020-03-24)


### Bug Fixes

* **deps:** update [@adobe](https://github.com/adobe) ([3deb0d2](https://github.com/adobe/helix-pages/commit/3deb0d2ef309657165e57f36d3fb44c162fd2d7d))
* **deps:** update dependency fs-extra to v9 ([#209](https://github.com/adobe/helix-pages/issues/209)) ([e4859ea](https://github.com/adobe/helix-pages/commit/e4859eaf693488a3224d41eeaffd83f104aa4cda))

## [1.7.5](https://github.com/adobe/helix-pages/compare/v1.7.4...v1.7.5) (2020-03-23)


### Bug Fixes

* **buid:** trigger release ([b33ac76](https://github.com/adobe/helix-pages/commit/b33ac769a27c08104ded463a8327351d6a6b1543))

## [1.7.4](https://github.com/adobe/helix-pages/compare/v1.7.3...v1.7.4) (2020-03-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.9.1 ([c797f89](https://github.com/adobe/helix-pages/commit/c797f899af63f1c45837aef9ebbf5fc36ed8eb01))

## [1.7.3](https://github.com/adobe/helix-pages/compare/v1.7.2...v1.7.3) (2020-03-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.9.0 ([c4e85ad](https://github.com/adobe/helix-pages/commit/c4e85ada5814c9a00999f8ab2b3ff2b91db1766d))

## [1.7.2](https://github.com/adobe/helix-pages/compare/v1.7.1...v1.7.2) (2020-03-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.8.1 ([c39aaf2](https://github.com/adobe/helix-pages/commit/c39aaf2197c6222c0ba14d784013377ea2234e8a))

## [1.7.1](https://github.com/adobe/helix-pages/compare/v1.7.0...v1.7.1) (2020-03-18)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.8.0 ([b1aca93](https://github.com/adobe/helix-pages/commit/b1aca9323c96939090ab53fd347364e77ea7b332))

# [1.7.0](https://github.com/adobe/helix-pages/compare/v1.6.2...v1.7.0) (2020-03-18)


### Features

* **epsagon:** instrument with Epsagon ([#196](https://github.com/adobe/helix-pages/issues/196)) ([64ed95a](https://github.com/adobe/helix-pages/commit/64ed95ac8ceed28e86663eca8ce52e2a732f3445))

## [1.6.2](https://github.com/adobe/helix-pages/compare/v1.6.1...v1.6.2) (2020-03-17)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.7.5 ([29f5bdd](https://github.com/adobe/helix-pages/commit/29f5bddcaeec56a7dca7c6d95fc97b1cb5667848))

## [1.6.1](https://github.com/adobe/helix-pages/compare/v1.6.0...v1.6.1) (2020-03-17)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.7.4 ([#193](https://github.com/adobe/helix-pages/issues/193)) ([b7bc12a](https://github.com/adobe/helix-pages/commit/b7bc12a0104f3d51fb8c1afa14faa4fa06a926b0))

# [1.6.0](https://github.com/adobe/helix-pages/compare/v1.5.8...v1.6.0) (2020-03-17)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.7.3 ([5fb62a6](https://github.com/adobe/helix-pages/commit/5fb62a6db7133b046429602969615d7f6a75e5de))


### Features

* **log:** enable log to Coralogix ([#189](https://github.com/adobe/helix-pages/issues/189)) ([28e8920](https://github.com/adobe/helix-pages/commit/28e8920242475ba7b92689831572d7863dd5c9dc))

## [1.5.8](https://github.com/adobe/helix-pages/compare/v1.5.7...v1.5.8) (2020-03-17)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v6.0.4 ([bfc6b4c](https://github.com/adobe/helix-pages/commit/bfc6b4ced6aa5e44fffae75b810f66e34daad5c4))

## [1.5.7](https://github.com/adobe/helix-pages/compare/v1.5.6...v1.5.7) (2020-03-17)


### Bug Fixes

* **deps:** update external ([#190](https://github.com/adobe/helix-pages/issues/190)) ([c24c59a](https://github.com/adobe/helix-pages/commit/c24c59a18be87af87aa698c74e4c320e8ebcbe2b))

## [1.5.6](https://github.com/adobe/helix-pages/compare/v1.5.5...v1.5.6) (2020-03-10)


### Bug Fixes

* **deps:** update external ([bf81bd9](https://github.com/adobe/helix-pages/commit/bf81bd92726f95c729bd64ddfdd4914d0b9d4c0b))

## [1.5.5](https://github.com/adobe/helix-pages/compare/v1.5.4...v1.5.5) (2020-03-10)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.7.2 ([dd32508](https://github.com/adobe/helix-pages/commit/dd32508a630d1fa0f6a4470156306fbe160c32df))

## [1.5.4](https://github.com/adobe/helix-pages/compare/v1.5.3...v1.5.4) (2020-03-10)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.7.1 ([75833f1](https://github.com/adobe/helix-pages/commit/75833f1f25145f2a232eb3384baeeb119d841de9))

## [1.5.3](https://github.com/adobe/helix-pages/compare/v1.5.2...v1.5.3) (2020-03-09)


### Bug Fixes

* **deps:** update dependency @adobe/helix-shared to v6.0.3 ([af549c8](https://github.com/adobe/helix-pages/commit/af549c878f726bdafa498791d5f6275341ef5ac5))

## [1.5.2](https://github.com/adobe/helix-pages/compare/v1.5.1...v1.5.2) (2020-03-09)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.7.0 ([f884e61](https://github.com/adobe/helix-pages/commit/f884e6148d11a37f231d7295d9548a537a770284))
* **deps:** update dependency @adobe/openwhisk-action-utils to v4.2.2 ([1f91bc9](https://github.com/adobe/helix-pages/commit/1f91bc9a594103448c6c9ceb64d10aa8fb071a79))

## [1.5.1](https://github.com/adobe/helix-pages/compare/v1.5.0...v1.5.1) (2020-03-06)


### Bug Fixes

* **deps:** update dependency @adobe/openwhisk-action-utils to v4.2.0 ([da7015d](https://github.com/adobe/helix-pages/commit/da7015d37b4c9654a6a2ea9397806e85ff6343a9))
* **deps:** update dependency @adobe/openwhisk-action-utils to v4.2.1 ([64f9af9](https://github.com/adobe/helix-pages/commit/64f9af96cfad638e22e4d55477c2caab57f3e7e1))

# [1.5.0](https://github.com/adobe/helix-pages/compare/v1.4.14...v1.5.0) (2020-03-04)


### Features

* **doc:** update title ([61db847](https://github.com/adobe/helix-pages/commit/61db847fb5fbf3f99673fe315b26705c3c0278d5))

## [1.4.14](https://github.com/adobe/helix-pages/compare/v1.4.13...v1.4.14) (2020-03-04)


### Bug Fixes

* **deps:** update [@adobe](https://github.com/adobe) ([a1f5774](https://github.com/adobe/helix-pages/commit/a1f57748f2bedba88bcab93f19f83a09f6d94e66))
* **deps:** update dependency @adobe/helix-pipeline to v6.6.3 ([#177](https://github.com/adobe/helix-pages/issues/177)) ([c7c7855](https://github.com/adobe/helix-pages/commit/c7c78554fc8ce921d5171df2e57fd80b5a46075c))
* **deps:** update dependency @adobe/openwhisk-action-logger to v2.2.0 ([#176](https://github.com/adobe/helix-pages/issues/176)) ([398fafc](https://github.com/adobe/helix-pages/commit/398fafc808ec26e69fb9deaa0995ac6b80685cd5))

## [1.4.13](https://github.com/adobe/helix-pages/compare/v1.4.12...v1.4.13) (2020-03-02)


### Bug Fixes

* **deps:** update to @adobe/helix-shared 6.0.1 ([#171](https://github.com/adobe/helix-pages/issues/171)) ([614ddcb](https://github.com/adobe/helix-pages/commit/614ddcb8cf58a2524040a526f19bb924f0cf65e2))

## [1.4.12](https://github.com/adobe/helix-pages/compare/v1.4.11...v1.4.12) (2020-03-02)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.6.1 ([#172](https://github.com/adobe/helix-pages/issues/172)) ([0f3339c](https://github.com/adobe/helix-pages/commit/0f3339c058925ac2c66a04ed498d8ecab825b628))

## [1.4.11](https://github.com/adobe/helix-pages/compare/v1.4.10...v1.4.11) (2020-03-02)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.5.0 ([#170](https://github.com/adobe/helix-pages/issues/170)) ([eaa9b4d](https://github.com/adobe/helix-pages/commit/eaa9b4d3b8f5346c81b590e2b14d3cdab2cdc7d3))

## [1.4.10](https://github.com/adobe/helix-pages/compare/v1.4.9...v1.4.10) (2020-02-28)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.4.6 ([#169](https://github.com/adobe/helix-pages/issues/169)) ([3688bef](https://github.com/adobe/helix-pages/commit/3688bef2d4f3fbe18a82ad6321d140132cc8e003))

## [1.4.9](https://github.com/adobe/helix-pages/compare/v1.4.8...v1.4.9) (2020-02-25)


### Bug Fixes

* **deps:** update [@adobe](https://github.com/adobe) ([2af27f1](https://github.com/adobe/helix-pages/commit/2af27f1eae74ed0e1fa5365087e14d3ab8141b1a))

## [1.4.8](https://github.com/adobe/helix-pages/compare/v1.4.7...v1.4.8) (2020-02-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.4.3 ([ce999ea](https://github.com/adobe/helix-pages/commit/ce999eac192de830babc652afa500b5400d6c10e))

## [1.4.7](https://github.com/adobe/helix-pages/compare/v1.4.6...v1.4.7) (2020-02-19)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.4.2 ([#165](https://github.com/adobe/helix-pages/issues/165)) ([3ae4504](https://github.com/adobe/helix-pages/commit/3ae4504581b51ce3981299eccb8e0b295e31bc55))

## [1.4.6](https://github.com/adobe/helix-pages/compare/v1.4.5...v1.4.6) (2020-02-18)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.4.1 ([#164](https://github.com/adobe/helix-pages/issues/164)) ([9ecbaff](https://github.com/adobe/helix-pages/commit/9ecbaffed5dd5d15f706223d214b4b2f99c9c6f4))

## [1.4.5](https://github.com/adobe/helix-pages/compare/v1.4.4...v1.4.5) (2020-02-18)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.4.0 ([892f56b](https://github.com/adobe/helix-pages/commit/892f56b3f4c668d834bc5baf5a0b9739683d6829))
* **deps:** update external ([#161](https://github.com/adobe/helix-pages/issues/161)) ([7a6b6c6](https://github.com/adobe/helix-pages/commit/7a6b6c6b0360c468ed430f6d5440f86537e3dd77))

## [1.4.4](https://github.com/adobe/helix-pages/compare/v1.4.3...v1.4.4) (2020-02-14)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.3.0 ([0576b3d](https://github.com/adobe/helix-pages/commit/0576b3d5256fb760897ee07eabc9911b4b77216d))

## [1.4.3](https://github.com/adobe/helix-pages/compare/v1.4.2...v1.4.3) (2020-02-12)


### Bug Fixes

* **sitemap:** add x-hlx-pages-host header ([76767c2](https://github.com/adobe/helix-pages/commit/76767c2ebcade7b4c9294548e9c31f42ad7150ce))

## [1.4.2](https://github.com/adobe/helix-pages/compare/v1.4.1...v1.4.2) (2020-02-12)


### Bug Fixes

* **sitemap:** add algolia params to hlx deploy ([eaa9669](https://github.com/adobe/helix-pages/commit/eaa9669b473ad2908144d79db78c757039a5d509))
* **sitemap:** add xml doctype ([762daa9](https://github.com/adobe/helix-pages/commit/762daa94da322b52c1d1a8b832f8dda53e940e46))

## [1.4.1](https://github.com/adobe/helix-pages/compare/v1.4.0...v1.4.1) (2020-02-11)


### Bug Fixes

* **deps:** pin dependencies ([09bf644](https://github.com/adobe/helix-pages/commit/09bf6444a3e08907f61b7ab01708f40a987504a6))

# [1.4.0](https://github.com/adobe/helix-pages/compare/v1.3.4...v1.4.0) (2020-02-11)


### Features

* **sitemap:** add logger wrapper for __ow_logger ([0b4789e](https://github.com/adobe/helix-pages/commit/0b4789efaedc7bab89d7142c6e08dc88ac9776b6))
* **sitemap:** add logger wrapper for __ow_logger ([bef8e54](https://github.com/adobe/helix-pages/commit/bef8e5488611a451843c54e9c3d55363eac0b1d6))
* **sitemap:** add test ([960bc25](https://github.com/adobe/helix-pages/commit/960bc25fe4ae79f37e9608d8e24df60b6b412e1e))
* **sitemap:** Generate sitemap.xml from search index ([a9c9c2b](https://github.com/adobe/helix-pages/commit/a9c9c2b224c0a54ae661ca1eca3185c1c0d18544))
* **sitemap:** Generate sitemap.xml from search index ([f1991e0](https://github.com/adobe/helix-pages/commit/f1991e066e88262d098b44ca93a1e37b75835e9a))
* **sitemap:** let static strain point to my branch (will be undone) ([461e6fc](https://github.com/adobe/helix-pages/commit/461e6fc7c39152017863e8501841cedc3f6af1f9))
* **sitemap:** missing headers argument ([8199aac](https://github.com/adobe/helix-pages/commit/8199aacc71b72f33d7112791b59bc4cbdb727713))
* **sitemap:** missing headers argument ([0469f24](https://github.com/adobe/helix-pages/commit/0469f24fdb6d709e13260c9d499596da458d9ddd))

## [1.3.4](https://github.com/adobe/helix-pages/compare/v1.3.3...v1.3.4) (2020-02-11)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.2.3 ([0af42fd](https://github.com/adobe/helix-pages/commit/0af42fdbb848956cb896e6331cb01a81258c3962))

## [1.3.3](https://github.com/adobe/helix-pages/compare/v1.3.2...v1.3.3) (2020-01-21)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.2.1 ([53b7310](https://github.com/adobe/helix-pages/commit/53b7310582818c2ef22f035710256ae4e9010f31))

## [1.3.2](https://github.com/adobe/helix-pages/compare/v1.3.1...v1.3.2) (2020-01-15)


### Bug Fixes

* **readme:** add CircleCI badge ([da5872f](https://github.com/adobe/helix-pages/commit/da5872f5b0cca0962a9bde7b09e8de7f8512b479))

## [1.3.1](https://github.com/adobe/helix-pages/compare/v1.3.0...v1.3.1) (2020-01-15)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.1.10 ([#141](https://github.com/adobe/helix-pages/issues/141)) ([664f854](https://github.com/adobe/helix-pages/commit/664f854bcc75bc01e7f8ad7fbcbafc8a954271ad))

# [1.3.0](https://github.com/adobe/helix-pages/compare/v1.2.1...v1.3.0) (2020-01-15)


### Features

* **indexing:** include a x-source-hash meta tag for indexing support ([#140](https://github.com/adobe/helix-pages/issues/140)) ([42bc86c](https://github.com/adobe/helix-pages/commit/42bc86c5026961a0213cb806bbbd1419e2f17e0a))

## [1.2.1](https://github.com/adobe/helix-pages/compare/v1.2.0...v1.2.1) (2020-01-10)


### Bug Fixes

* **deps:** update dependency @adobe/helix-pipeline to v6.1.6 ([#136](https://github.com/adobe/helix-pages/issues/136)) ([a4c8cfb](https://github.com/adobe/helix-pages/commit/a4c8cfbded98d4bd6305e5b733e234d02bce7ae2))

# [1.2.0](https://github.com/adobe/helix-pages/compare/v1.1.2...v1.2.0) (2019-12-18)


### Bug Fixes

* **deps:** use fixed pipeline dependency ([#133](https://github.com/adobe/helix-pages/issues/133)) ([f35f2fa](https://github.com/adobe/helix-pages/commit/f35f2fa23ee6151f92824ea335174a05bb286c42))


### Features

* **doc:** Remove greenkeeper badge ([20c78f7](https://github.com/adobe/helix-pages/commit/20c78f7c4233deba3afae9d5d77d68e20750274e))

## [1.1.2](https://github.com/adobe/helix-pages/compare/v1.1.1...v1.1.2) (2019-11-04)


### Bug Fixes

* **deps:** update any ([2af00aa](https://github.com/adobe/helix-pages/commit/2af00aa3a75a9fb7bbe3f538bd4bd04e4eb1a0c0))

## [1.1.1](https://github.com/adobe/helix-pages/compare/v1.1.0...v1.1.1) (2019-10-23)


### Bug Fixes

* **deps:** redeploy with @adobe/helix-cli@5.7.1 ([7a25a0f](https://github.com/adobe/helix-pages/commit/7a25a0f45bcfc613ac6839793c9fb1dc5f1271e3))
* **deps:** redeploy with @adobe/helix-cli@5.7.1 ([3e17bc4](https://github.com/adobe/helix-pages/commit/3e17bc4e083d33c48a13a4955e629e9450296984))

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
