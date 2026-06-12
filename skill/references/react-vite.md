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
2. **Never** suggest `next/metadata`, `generateMetadata`, `sitemap.ts`, or
   `robots.ts` — those are Next.js-only APIs.
3. **Always install `react-helmet-async@latest`** and follow
   [react-helmet-async.md](react-helmet-async.md) before writing SEO code.
4. **Never** use `react-helmet` — uninstall it if present.
5. **Always** wrap the app in `HelmetProvider` at the root.
6. **Always** use the shared `SEO` component on every indexable route.
7. **Always** place static crawl files in `public/`: `robots.txt`, `sitemap.xml`,
   `llms.txt`.
8. **Warn about CSR** on client-only apps, then still install Helmet — required
   for social previews and JS-executing crawlers.

---

## Agent Workflow

When SEO is requested for a Vite or plain React app:

| Step | Action |
|---|---|
| 1 | Detect package manager from lockfile |
| 2 | Run `npm install react-helmet-async@latest` (or pnpm/yarn/bun equivalent) |
| 3 | Remove `react-helmet` if installed |
| 4 | Add `HelmetProvider` to `src/main.tsx` or `src/main.jsx` |
| 5 | Create `src/components/SEO.tsx` or `SEO.jsx` — see [react-helmet-async.md](react-helmet-async.md) |
| 6 | Add `<SiteHelmetDefaults />` in `App.tsx` or `App.jsx` |
| 7 | Add `<SEO />` to every indexable route |
| 8 | Create `public/robots.txt`, `public/sitemap.xml`, `public/llms.txt` |
| 9 | Warn if CSR-only — recommend prerendering for full crawlability |

---

## Stack Detection

| Signal | Stack |
|---|---|
| `app/layout.tsx` or `next.config.js` | Next.js — [app-router.md](app-router.md) or [pages-router.md](pages-router.md) |
| `vite.config.ts` + `index.html` | Vite + React — this file |
| `react-scripts` in `package.json` dependencies | CRA — this file |

---

## Client-Side Rendering Warning

A default Vite SPA renders an empty `<div id="root">` in the initial HTML.
Some crawlers may not execute JavaScript.

**Still install `react-helmet-async@latest`** — it handles:
- Social sharing previews (OG / Twitter)
- Crawlers that execute JavaScript (Googlebot)
- Correct tab titles for users

**Also warn** when CSR-only and ranking matters. Recommend prerendering
(`vite-ssg`), or migration to Next.js / Astro / Remix.

| Mode | Crawlability |
|---|---|
| CSR only (default Vite) | Limited for non-JS crawlers |
| Prerendered / SSR | Good — Helmet tags appear in page source |

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
import { writeFileSync } from 'fs'

const SITE_URL = 'https://example.com'
const routes = ['', '/about', '/services']

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE_URL}${r}</loc></url>`).join('\n')}
</urlset>`

writeFileSync('public/sitemap.xml', xml)
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

| Asset | Location |
|---|---|
| `llms.txt` | `public/llms.txt` |
| `/ai` page | React route with `<SEO />` + JSON-LD |
| AI crawlers | `public/robots.txt` |

---

## Prerendering (When CSR Is Not Enough)

1. **vite-ssg** — static HTML for known routes at build time
2. **Migrate to Next.js or Astro**
3. **Prerender middleware** — last resort

After prerendering, verify Helmet tags appear in View Page Source.

---

## Validation

See [validation.md](validation.md). Also confirm:
- `react-helmet-async@latest` in `package.json`
- `HelmetProvider` wraps app root
- `SiteHelmetDefaults` in `App.tsx`
- `<SEO />` on every public route
