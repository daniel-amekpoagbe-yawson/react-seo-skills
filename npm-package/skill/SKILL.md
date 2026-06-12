---
name: nextjs-react-seo
description: >
  Guides SEO and GEO for Next.js apps. Use when setting up metadata, Open Graph,
  Schema.org JSON-LD, sitemap, robots.txt, or keyword research.
---

# Next.js & React SEO Skill

## Router Detection

- **App Router** — `app/layout.tsx`, `next/metadata`
- **Pages Router** — `pages/_app.tsx`, `next/head`

See `references/app-router.md` and `references/pages-router.md`.

## Implementation Order

1. Keywords → `references/keywords.md`
2. Metadata → router reference
3. Structured data → `references/structured-data.md`
4. Sitemap & robots → router reference
5. GEO → `references/geo.md`


Warn about CSR limitations on Vite SPAs without prerendering.
