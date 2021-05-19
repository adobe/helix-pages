# CDN Requirements for Edge Workers

## Backends

I need backends for following origin servers

- `helix-pages.anywhere.run`
- `hlx.blob.core.windows.net`
- `s3.amazonaws.com`

there may be two more origin servers we need, depending on the availability of image optimization.

## Domain

I need a domain name that supports wildcard subdomains such as `ref--repo--owner.mydomain.tld` or `ref--repo--owner.mydomain.tld`

Plus a wildcard cert for my domain name

## Others

- If [Image Optimization](https://www.akamai.com/us/en/products/performance/image-and-video-manager.jsp) can work with EdgeWorkers, then I'd like to enable it, too
