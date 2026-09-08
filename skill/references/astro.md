# Astro — Metadata, Sitemap, Robots, and JSON-LD

Applies to Astro 5+ projects using `src/pages/` and `.astro` components. The
current Astro release is 7.x. The core metadata and routing patterns are broadly
stable, while the content-collection examples use Astro's current content layer
API (`src/content.config.*`).

Use this file for Astro projects only. Do not apply Next.js metadata exports or
React Helmet patterns to Astro.

## Rules

1. Match the project's JavaScript or TypeScript convention in configuration and
   page frontmatter. Astro components use `.astro`; configuration can use
   `astro.config.mjs`, `.js`, `.ts`, or `.mts`.
2. Set the deployed `site` URL in `astro.config.*`. Astro uses it for absolute
   URLs, canonical links, and sitemap generation.
3. Put shared `<head>` tags in a reusable layout. Pass page-specific title,
   description, canonical path, image, and structured data as props.
4. Use `@astrojs/sitemap` for statically generated routes. It cannot discover
   routes rendered only at request time; add those URLs through a custom sitemap
   or another server-side process.
5. Use `public/robots.txt` for static sites, or a `src/pages/robots.txt.ts` / `.js`
   endpoint when the sitemap URL must be generated from `Astro.site`.
6. Inject JSON-LD into the rendered page and escape `<` before using
   `set:html`. Never place unescaped CMS or user data inside a script tag.
7. Astro prerenders pages by default. If using `output: 'server'` or
   `prerender = false`, verify that the deployed adapter returns the intended
   metadata and status codes for each route.

## Project detection

Use the first clear signal:

| Signal                                                                                 | Stack | Reference |
| -------------------------------------------------------------------------------------- | ----- | --------- |
| `astro.config.mjs`, `astro.config.js`, `astro.config.ts`, or `astro` in `package.json` | Astro | This file |
| `src/pages/` containing `.astro`, `.md`, or `.mdx` pages                               | Astro | This file |

If the project also contains React, Vue, Svelte, or Solid integrations, keep the
SEO implementation in Astro layouts and pages. The UI framework integration does
not change Astro's routing or metadata model.

## Site configuration

Set the production URL once. Use the project's package manager and keep the
installed Astro and integration versions aligned:

```bash
npx astro add sitemap
```

The equivalent manual installation is:

```bash
npm install @astrojs/sitemap
```

### JavaScript configuration

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [sitemap()],
});
```

### TypeScript configuration

```ts
// astro.config.ts
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [sitemap()],
});
```

`site` must be a full `http://` or `https://` URL. Keep the project's URL policy
consistent with `trailingSlash` and `build.format`; canonical URLs, internal
links, redirects, and sitemap URLs should resolve to one preferred form.

## Shared layout metadata

Astro does not have a Next-style metadata export. Render normal HTML metadata in
a layout component and pass values as props.

### JavaScript layout

```astro
---
const {
  title,
  description,
  canonicalPath = Astro.url.pathname,
  ogImage,
  ogType = 'website',
  jsonLd,
} = Astro.props

const canonical = Astro.site
  ? new URL(canonicalPath, Astro.site).href
  : new URL(canonicalPath, Astro.url).href

const serializedJsonLd = jsonLd
  ? JSON.stringify(jsonLd).replace(/</g, '\\u003c')
  : null
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width" />
    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={canonical} />
    <meta property="og:type" content={ogType} />
    {ogImage && <meta property="og:image" content={ogImage} />}

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {ogImage && <meta name="twitter:image" content={ogImage} />}

    {serializedJsonLd && (
      <script type="application/ld+json" set:html={serializedJsonLd} />
    )}
  </head>
  <body>
    <slot />
  </body>
</html>
```

### TypeScript layout

```astro
---
interface Props {
  title: string
  description: string
  canonicalPath?: string
  ogImage?: string
  ogType?: 'website' | 'article'
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
}

const {
  title,
  description,
  canonicalPath = Astro.url.pathname,
  ogImage,
  ogType = 'website',
  jsonLd,
} = Astro.props

const canonical = Astro.site
  ? new URL(canonicalPath, Astro.site).href
  : new URL(canonicalPath, Astro.url).href

const serializedJsonLd = jsonLd
  ? JSON.stringify(jsonLd).replace(/</g, '\\u003c')
  : null
---
<!-- Use the same HTML head and body structure as the JavaScript layout. -->
```

For a page that imports the layout:

```astro
---
import SiteLayout from '../layouts/SiteLayout.astro'
---

<SiteLayout
  title="About Us"
  description="Learn about our team and services."
  canonicalPath="/about/"
>
  <main>
    <h1>About Us</h1>
  </main>
</SiteLayout>
```

Do not invent `example.com`, site names, social handles, or image URLs in a real
project. Ask for those values first, or mark every missing value as `TODO`.

## Dynamic pages and content collections

Astro's default output is static. A dynamic route in `src/pages/` must use
`getStaticPaths()` when it is prerendered. Content collections are defined in
`src/content.config.ts` or `.js` with a loader and optional schema, then queried
with `getCollection()` or `getEntry()`.

Example for a blog route:

```astro
---
import { getCollection, render } from 'astro:content'
import SiteLayout from '../../layouts/SiteLayout.astro'

export async function getStaticPaths() {
  const posts = await getCollection('blog', ({ data }) => !data.draft)

  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }))
}

const { post } = Astro.props
const { Content } = await render(post)
const canonicalPath = `/blog/${post.id}/`
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: post.data.title,
  description: post.data.description,
  datePublished: post.data.pubDate.toISOString(),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': new URL(canonicalPath, Astro.site).href,
  },
}
---

<SiteLayout
  title={post.data.title}
  description={post.data.description}
  canonicalPath={canonicalPath}
  ogType="article"
  jsonLd={jsonLd}
>
  <article>
    <h1>{post.data.title}</h1>
    <Content />
  </article>
</SiteLayout>
```

Validate collection fields such as `title`, `description`, and publication dates
with Astro's content-collection schema. Filter drafts before generating routes
and before adding URLs to a sitemap.

For on-demand pages, install an adapter, set `output: 'server'` or export
`prerender = false`, and read the route parameter from `Astro.params`. Do not
call `getStaticPaths()` for a route that is rendered only on demand.

## Sitemap

`@astrojs/sitemap` generates sitemap files for statically generated routes. It
uses the configured `site` URL and writes the output during `astro build`.

```js
// astro.config.mjs
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://example.com",
  integrations: [
    sitemap({
      filter: (page) => !page.includes("/private/"),
    }),
  ],
});
```

Use `lastmod` only when it reflects a real significant update. Google ignores
`changefreq` and `priority`. For localized routes, configure the integration's
`i18n` option or emit correct alternate links according to the project's URL
structure.

The integration cannot discover routes rendered only at request time. For a
large or fully dynamic site, create a custom sitemap endpoint or include custom
pages/sitemaps as appropriate for the deployment.

## Robots

### Static robots file

For a static site, create `public/robots.txt`:

```txt
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://example.com/sitemap-index.xml
```

Use the actual sitemap filename produced by the installed `@astrojs/sitemap`
version. Do not use `robots.txt` as a security boundary; protect private data
with authentication or server controls.

### Dynamic robots endpoint

When the deployed URL is configured in `astro.config.*`, generate the sitemap URL
from Astro's site value:

```ts
// src/pages/robots.txt.ts
import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const sitemapUrl = site
    ? new URL("sitemap-index.xml", site).href
    : "https://example.com/sitemap-index.xml";

  return new Response(`User-agent: *\nAllow: /\nSitemap: ${sitemapUrl}\n`, {
    headers: { "Content-Type": "text/plain" },
  });
};
```

Use `.js` instead when the Astro project is JavaScript-only, removing the type
import and `APIRoute` annotation.

## JSON-LD

Place JSON-LD in the page or shared layout where it describes visible content.
Use the escaping rule from [structured-data.md](structured-data.md):

```astro
---
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Company Name',
  url: 'https://example.com',
}

const serializedJsonLd = JSON.stringify(jsonLd).replace(/</g, '\\u003c')
---

<script type="application/ld+json" set:html={serializedJsonLd} />
```

Use absolute URLs for `url`, `image`, and `@id`. Structured data must match the
visible page and does not guarantee a rich result.

## Validation

After implementation:

- Run `astro check` and `astro build`.
- Confirm metadata appears in the generated HTML in `dist/` for static pages.
- Request on-demand routes with `astro preview` or the deployed adapter and inspect
  the response HTML.
- Confirm the sitemap files are present and contain only canonical, indexable URLs.
- Open `/robots.txt` and verify that its sitemap URL resolves.
- Validate JSON-LD with the relevant Schema.org or Google tooling.
- Check canonical URLs, trailing-slash behavior, redirects, and localized links.
- Check LCP image loading, dimensions, and structured page headings as described
  in [validation.md](validation.md).

## Official references

- [Astro configuration reference](https://docs.astro.build/en/reference/configuration-reference/)
- [Astro layouts](https://docs.astro.build/en/basics/layouts/)
- [Astro routing](https://docs.astro.build/en/guides/routing/)
- [Astro content collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro on-demand rendering](https://docs.astro.build/en/guides/on-demand-rendering/)
- [Astro sitemap integration](https://docs.astro.build/en/guides/integrations-guide/sitemap/)
- [Astro integrations](https://docs.astro.build/en/guides/integrations/)
