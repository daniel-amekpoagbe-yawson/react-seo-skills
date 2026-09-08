# Validation Tools

Run these after every SEO or GEO implementation. Never assume output is correct
without checking.

---

## Checklist

- [ ] SEO code uses the project's language (JS or TS) and matching file extensions
- [ ] Title and meta description present on every indexable route
- [ ] Canonical URL is absolute and matches the live URL
- [ ] Open Graph image resolves (1200×630 recommended)
- [ ] JSON-LD matches visible content and passes the relevant validator; rich-result eligibility depends on the schema type and current search feature availability
- [ ] `sitemap.xml` is accessible and lists all public routes
- [ ] `robots.txt` is accessible and references the sitemap
- [ ] `llms.txt` is accessible if the project intentionally adopts that emerging convention

---

## Tools

| What                   | Tool                                                   |
| ---------------------- | ------------------------------------------------------ |
| Meta tags & Open Graph | https://www.opengraph.xyz                              |
| Structured data        | https://search.google.com/test/rich-results            |
| Schema.org syntax      | https://validator.schema.org                           |
| Sitemap XML            | https://www.xml-sitemaps.com/validate-xml-sitemap.html |
| Indexing & coverage    | https://search.google.com/search-console               |
| Raw HTML (Vite/SPA)    | View Page Source — confirm tags exist before JS runs   |

---

## Performance Quick Checks

Core Web Vitals affect ranking. After SEO work, also check:

- [ ] Hero / LCP image is **not** lazy-loaded and uses a modern format
      (`next/image` in Next.js; explicit `width`/`height` elsewhere)
- [ ] Images below the fold are lazy-loaded (`loading="lazy"`)
- [ ] No render-blocking third-party scripts in `<head>` — use `defer`, `async`,
      or `next/script` with an appropriate strategy
- [ ] Run [PageSpeed Insights](https://pagespeed.web.dev) — flag LCP > 2.5s,
      CLS > 0.1, INP > 200ms

---

## Common Failures

| Symptom                     | Likely cause                                                          |
| --------------------------- | --------------------------------------------------------------------- |
| OG image missing            | Relative URL without `metadataBase` (Next.js) or missing absolute URL |
| JSON-LD errors              | Missing required fields, wrong `@type`, relative `url` or `image`     |
| Sitemap 404                 | File not in `public/` (Vite) or missing `app/sitemap.ts` (Next.js)    |
| Meta tags missing in source | CSR-only SPA — tags set only after JavaScript runs                    |
| Duplicate titles            | Missing per-route metadata on dynamic routes                          |
