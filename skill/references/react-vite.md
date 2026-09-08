# React & Vite — Metadata, Sitemap & Robots

Applies to Vite + React apps (`vite.config.ts` or `vite.config.js`, `index.html`,
`src/main.tsx` or `src/main.jsx`). Also covers plain React SPAs and CRA.
Match file extensions to project language — see [language.md](language.md).

**Metadata library:** [react-helmet-async](react-helmet-async.md) — read that file
for install commands, API reference, SSR patterns, and the `SEO` component.

---

## Rules

1. **Match project language** — see [language.md](language.md). Use `main.jsx` /
   `SEO.jsx` in JS projects, `main.tsx` / `SEO.tsx` in TS projects.
2. **Never** suggest Next.js metadata exports, `generateMetadata`, `sitemap.ts`,
   or `robots.ts` — those are Next.js-only APIs.
3. **Choose a metadata implementation that matches the React version.** React 19
   can hoist `<title>`, `<meta>`, `<link>`, and `<script>` from JSX. Use
   `react-helmet-async` for React 16–18, for its `Helmet` API, or when its SSR
   context features are useful. Follow [react-helmet-async.md](react-helmet-async.md)
   when using it.
4. **Never** use `react-helmet` — uninstall it if present.
5. **If using `react-helmet-async`,** wrap the app in `HelmetProvider` at the
   root and use a shared SEO component on indexable routes.
6. **Place static crawl files in `public/`:** `robots.txt` and `sitemap.xml`.
   Add `llms.txt` only when the site has a deliberate audience or integration
   for that emerging convention.
7. **Warn about CSR** on client-only apps. Metadata can be updated after
   JavaScript executes, but initial HTML may be empty for non-JavaScript
   consumers; recommend prerendering or SSR when route indexing matters.

---

## Agent Workflow

When SEO is requested for a Vite or plain React app:

| Step | Action                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------- |
| 1    | Detect package manager from lockfile                                                              |
| 2    | Choose native React metadata or `react-helmet-async` based on the React version and project needs |
| 3    | Remove `react-helmet` if installed                                                                |
| 4    | If using Helmet, add `HelmetProvider` to `src/main.tsx` or `src/main.jsx`                         |
| 5    | If using Helmet, create a shared `SEO.tsx` or `SEO.jsx` component                                 |
| 6    | Add site-wide defaults and per-route metadata using the chosen approach                           |
| 7    | Create `public/robots.txt` and `public/sitemap.xml` when applicable                               |
| 8    | Add `public/llms.txt` only if the project has a specific use for it                               |
| 9    | Warn if CSR-only — recommend prerendering or SSR when initial HTML matters                        |

---

## Stack Detection

| Signal                                         | Stack                                                                          |
| ---------------------------------------------- | ------------------------------------------------------------------------------ |
| `app/layout.tsx` or `next.config.js`           | Next.js — [app-router.md](app-router.md) or [pages-router.md](pages-router.md) |
| `vite.config.ts` + `index.html`                | Vite + React — this file                                                       |
| `react-scripts` in `package.json` dependencies | CRA — this file                                                                |

---

## Client-Side Rendering Warning

A default Vite SPA renders an empty `<div id="root">` in the initial HTML.
Some crawlers, social fetchers, and link unfurlers may not execute JavaScript.

React 19 can manage document metadata from JSX, while `react-helmet-async` is
useful for React 16–18 and for projects that need its API or SSR context. Neither
choice turns a client-only SPA into server-rendered HTML.

**Also warn** when CSR-only and ranking matters. Recommend prerendering
(`vite-ssg`), or migration to Next.js / Astro / Remix.

| Mode                    | Crawlability                             |
| ----------------------- | ---------------------------------------- |
| CSR only (default Vite) | Limited for non-JS crawlers              |
| Prerendered / SSR       | Good — Helmet tags appear in page source |

---

## index.html Defaults

Fallback tags for the home route and non-JS crawlers. Per-route pages override
via `<SEO />`.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Site Name</title>
    <meta name="description" content="Site-wide fallback description." />
    <link rel="canonical" href="https://example.com/" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## sitemap.xml

### Static

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://example.com/</loc><lastmod>2026-01-01</lastmod></url>
  <url><loc>https://example.com/about</loc><lastmod>2026-01-01</lastmod></url>
</urlset>
```

### Build-time script

```ts
// scripts/generate-sitemap.ts
import { writeFileSync } from "fs";

const SITE_URL = "https://example.com";
const routes = ["", "/about", "/services"];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE_URL}${r}</loc></url>`).join("\n")}
</urlset>`;

writeFileSync("public/sitemap.xml", xml);
```

---

## robots.txt

Create `public/robots.txt`:

```txt
User-agent: *
Allow: /
Disallow: /api/

User-agent: GPTBot
Allow: /

Sitemap: https://example.com/sitemap.xml
```

See [geo.md](geo.md) for AI crawler rules.

---

## GEO on Vite/React

| Asset       | Location                                                              |
| ----------- | --------------------------------------------------------------------- |
| `llms.txt`  | `public/llms.txt` when the project deliberately adopts the convention |
| `/ai` page  | React route with `<SEO />` + JSON-LD                                  |
| AI crawlers | `public/robots.txt`                                                   |

---

## Prerendering (When CSR Is Not Enough)

1. **vite-ssg** — static HTML for known routes at build time
2. **Migrate to Next.js or Astro**
3. **Prerender middleware** — last resort

After prerendering, verify Helmet tags appear in View Page Source.

---

## Validation

See [validation.md](validation.md). Also confirm:

- The chosen metadata approach matches the React version and rendering model
- `HelmetProvider` wraps the app root when `react-helmet-async` is used
- Shared defaults and per-route metadata cover every public route
