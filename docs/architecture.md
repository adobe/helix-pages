# Helix Architecture

## Architectural Evolution

Helix has undergone some architectural evolution since the start of the project. The main phases are:

1. Helix 1 – a bring-your-own (Adobe I/O) runtime framework-driven approach that would allow server-side customization
2. [Helix 2](./architecture-legacy.md) – a software as a service that relies on client-side customization
3. [Helix 3](#helix-3) – a software as a service with superior availability and performance with the same feature set as Helix 2

The current version of the architecture is Helix 3, prior versions stay documented as long as they are in active use.

## Helix 3

Helix 3 delivers the core feature set of Helix (high-performance websites with low code and zero-friction authoring) in a simplified architecture that optimizes stability and availability.

![](./Helix%20Architecture/Helix%203%20Stack.png)

### Preface

Project Helix is based on serverless micro services architecture, where each service is managed in a separate GitHub repository. Each individual service is designed to be single-purpose and can typically be understood on its own within 15 minutes to half an hour. The connections between the different services however that make up the overall architecture require some explanation.

The goal of this document is to provide this explanation and give a lay of the land of the Helix architecture.

The three main areas in Project Helix are:

- **EDGE** delivery through the Fastly Edge computing platform
- **PIPE** markdown-based content transformation into hypermedia
- **AUTHOR** authoring of content using Google Docs and Word Online, and publishing into high-availability content stores
- **DEV** development workflow

The architecture diagram at the beginning of this document uses the Fundamental Modeling Concepts structure chart notation.

Unless otherwise indicated, inter-service communication is based on HTTP.

### EDGE

A typical Helix Pages production deployment uses two stacked Fastly Service Configurations, with each Service Config using a performance-enhancing technique called shielding. 

Shielding means that all traffic from an edge node in Fastly's CDN will be forwarded to a designated "shield" node that then makes requests to the origin or backend server. This increases the likelihood of content already being cached in the shield node and reduces the overall number of requests on the origin. The shield node is simply another edge node that has been picked for reasons of proximity to the origin.

In the architecture chart above, the two CDN configurations are referred to as "outer CDN" (receives incoming requests first, serves a custom domain name, adds custom caching rules) and "inner CDN" (provides basic caching, routes requests to the various backends used by Project Helix)

The CDN configuration is managed as a VCL-based Fastly service configuration (although experimental implementations based on Cloudflare Workers and Fastly Compute@Edge exist).

Based on the URL, the Fastly Service performs an edge dictionary lookup to determine the appropriate Content Bus ID (a unique identifier of a content source used while publishing) and the type of request to handle.

- Media Requests (images, videos, etc.) are served directly from the Media Bus using content-addressable storage, where the content hash forms the significant part of the URL
- Content Requests (HTML and JSON) are served using the Helix Pipeline Service, see the [PIPE](#pipe) section for details
- Static Content is served from the Content Bus directly, or if unavailable, from the Code Bus storage location.

At the Inner CDN level, no caching is applied, so that all requests accurately represent the latest state of published content.

### PIPE

The main delivery functionality is provided by the [`helix-pipeline-service`](https://github.com/adobe/helix-pipeline-service), which uses the [`helix-pipeline`](https://github.com/adobe/helix-pipeline) framework to render HTML, and renders filtered JSON directly (after applying some filters).

The Pipeline Service pulls configuration from the Code Bus and the published Content from the Content Bus.

### AUTHOR

Authoring in Helix 3 is handled through the interplay of three components:

1. The [Helix Bot](https://github.com/adobe/helix-bot) watches a GitHub repository for code changes and invokes Helix Admin
2. The [Helix Sidekick](https://github.com/adobe/helix-sidekick) allows authors to trigger publishing actions explicitly and invokes Helix Admin
3. [Helix Admin](https://github.com/adobe/helix-admin) does all the work, with the help of [Helix Content Proxy](https://github.com/adobe/helix-content-proxy), which renders content from Sharepoint and Google Drive by invoking [Helix Data Embed](https://github.com/adobe/helix-data-embed), [Helix Word Markdown Adapter](https://github.com/adobe/helix-word2md) or [Helix Google Docs Markdown Adapter](https://github.com/adobe/helix-gdoc2md)

The [Helix Admin REST API](https://opensource.adobe.com/helix-home/admin/) is fully documented and covers the main functionality:

- Preview: generates a Markdown document from the original content source, places it in the `preview` partition of the content bus and returns the preview URL
- Publish: copies a Markdown document from the `preview` partition into the `live` partition of the content bus
- Code: copies code from the GitHub repository into the Code Bus storage, also updates the Inner CDN edge dictionaries according to the `fstab` mappings
- Cache: clears the Outer CDN cache

### DEV

Other than in Helix 2, the Helix CLI does not simulate a full blown Helix setup, but simply proxies content and media requests to the inner CDN. This allows developers to see their code changes in real-time (served from the working copy), but mix it with real content from Content and Media Bus.
