---
name: react-seo-skills
description: >
  Guides SEO, GEO, and AI visibility for Next.js and React apps in Cursor,
  Claude Code, and Codex. Use when setting up metadata, Open Graph, Twitter cards,
  Schema.org JSON-LD, sitemap, robots.txt, llms.txt, keyword research, keyword
  clustering, auditing SEO, improving discoverability, or setting up structured
  data. Covers Next.js App Router, Pages Router, and Vite + React SPAs. Matches
  JavaScript or TypeScript to the project language.
---

# React SEO Skills

SEO and GEO (AI visibility) for Next.js and React applications. Works in Cursor,
Claude Code, and Codex via native skill discovery.

<!-- BEGIN:react-seo-skills -->
> **This may NOT be the Next.js, React, Vite, or react-helmet-async you know.**
>
> Frameworks ship breaking changes — APIs, conventions, and file structures in
> the target codebase may differ from your training data. Before implementing
> any SEO or GEO work:
>
> 1. **Read the codebase first.** Check the installed versions in `package.json`
>    and the lockfile, the folder structure, and the project's existing
>    conventions.
> 2. **Verify against current documentation.** If the installed version is newer
>    than what you are confident about, look up the official docs for that exact
>    version. Never implement from memory when versions disagree.
> 3. **Implement against what the project actually uses** — not what you
>    remember. Example: `params` in `generateMetadata` is a plain object in
>    Next.js 14 but a `Promise` in Next.js 15+.
<!-- END:react-seo-skills -->

---

## Rules

1. **Detect language before anything else.** JavaScript project → write `.js`/`.jsx`
   with no types. TypeScript project → write `.ts`/`.tsx` with types. See
   [language.md](references/language.md).
2. **Detect the stack before writing code.** Never apply Next.js APIs to a Vite
   project or Vite patterns to a Next.js project.
3. **Verify framework versions before writing code.** Check `package.json` for
   the installed versions of `next`, `react`, `vite`, and `react-helmet-async`.
   If a version is newer than your training data, consult its official docs
   before implementing — APIs and conventions change between major versions.
4. **Ask for real project details — never guess or invent them.** Before writing
   metadata, ask the developer for: site name, production domain, default OG
   image URL, social handles, contact details, locale(s), and target keywords.
   All `example.com` / `Site Name` values in the reference files are
   placeholders. If you must proceed without an answer, mark every placeholder
   with a `TODO` comment and list them for the developer at the end.
5. **Never repeat SEO code.** Define metadata once in a shared, reusable place —
   a `SEO` component (Pages Router, Vite), root-layout defaults plus
   `title.template` (App Router), or schema builder helpers for JSON-LD. If the
   same meta block appears on more than one page, extract it before continuing.
6. **Start with keywords** for full SEO setups. See [keywords.md](references/keywords.md)
   before writing meta tags.
7. **Validate every implementation.** Point the developer to
   [validation.md](references/validation.md). Never assume output is correct.
8. **Install `react-helmet-async@latest` on Vite/plain React apps.** Run the
   install command before writing SEO code. Follow
   [react-helmet-async.md](references/react-helmet-async.md). Never use
   deprecated `react-helmet`.
9. **Warn about CSR limitations.** Vite SPAs without prerendering have poor
   multi-route SEO. Surface this limitation, then still install Helmet and
   implement per-route metadata.
10. **Use framework conventions.** Do not invent custom abstractions unless asked.
11. **Do not over-tag.** Prioritize title, description, canonical, OG, and JSON-LD.
12. **Flag performance issues** that affect ranking: unoptimized images, render-blocking
    scripts, poor LCP. See the performance quick checks in
    [validation.md](references/validation.md).

---

## Detection Order

Always run in this sequence:

| Step | Check | Reference |
|---|---|---|
| 1 | **Language** — JS or TS? | [language.md](references/language.md) |
| 2 | **Stack** — Next.js App/Pages or Vite/React? | Table below |
| 3 | **Implementation** | Stack reference file |

### Stack Detection

| Signal | Stack | Reference |
|---|---|---|
| `app/layout.tsx` or `app/layout.jsx` | Next.js App Router | [app-router.md](references/app-router.md) |
| `pages/_app.tsx` or `pages/_app.jsx` | Next.js Pages Router | [pages-router.md](references/pages-router.md) |
| `vite.config.ts` or `vite.config.js` | Vite + React | [react-vite.md](references/react-vite.md) |
| `react-scripts` in `package.json` dependencies | CRA (treat as Vite SPA) | [react-vite.md](references/react-vite.md) |

If both `app/` and `pages/` exist, App Router takes precedence in Next.js 13+.

> **Planned (not yet supported):** Astro (`0.1.0`) and TanStack Start (`0.2.0`).
> These stacks are on the roadmap but have no reference file yet. If a project
> uses one of them, apply the closest matching general principles, tell the
> developer dedicated support is coming, and do not invent framework-specific
> APIs.

---

## Implementation Order

| Step | Topic | Reference |
|---|---|---|
| 0 | Language (JS / TS) | [language.md](references/language.md) |
| 1 | Keyword clustering & validation | [keywords.md](references/keywords.md) |
| 2 | Metadata & Open Graph | Stack reference file |
| 3 | Structured data (JSON-LD) | [structured-data.md](references/structured-data.md) |
| 4 | Sitemap & robots | Stack reference file |
| 5 | GEO / AI visibility | [geo.md](references/geo.md) |
| 6 | Validation | [validation.md](references/validation.md) |

Adapt all code to the detected language before implementing.

---

## SEO Audit Mode

1. **Detect language** — are SEO files using the correct extensions and syntax?
2. **Detect stack** using the table above.
3. **Keywords** — keyword map? Distinct intents per page?
4. **Metadata** — title, description, canonical, OG, Twitter on key routes.
5. **Structured data** — JSON-LD present? Correct `@type`? Absolute URLs?
6. **Sitemap & robots** — exists? AI crawlers allowed if GEO is a goal?
7. **GEO** — checklist in [geo.md](references/geo.md).
8. **Vite/React** — `react-helmet-async@latest`, `HelmetProvider`, `<SEO />` on routes.
9. **CSR check (Vite)** — meta tags in page source? Flag critical if missing on CSR.
10. **Report** as Critical / Suggestion / OK.

---

## Stack Quick Reference

| Feature | App Router | Pages Router | Vite + React |
|---|---|---|---|
| Metadata API | `next/metadata` | `next/head` | `react-helmet-async@latest` |
| Sitemap | `app/sitemap.ts` or `.js` | API route or `next-sitemap` | `public/sitemap.xml` or build script |
| Robots | `app/robots.ts` or `.js` | `public/robots.txt` | `public/robots.txt` |
| JSON-LD | Page `<script>` | Page `<script>` | `SEO` component via Helmet |
| File ext (TS) | `.tsx`, `.ts` | `.tsx`, `.ts` | `.tsx`, `.ts` |
| File ext (JS) | `.jsx`, `.js` | `.jsx`, `.js` | `.jsx`, `.js` |

---

## General Principles

- Present options and trade-offs. Recommend one path only when asked.
- Performance is SEO — Core Web Vitals affect ranking.
- GEO complements SEO — implement both for maximum discoverability.
