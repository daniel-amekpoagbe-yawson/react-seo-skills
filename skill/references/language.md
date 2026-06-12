# Language Detection — JavaScript vs TypeScript

Run this check **before** stack detection and **before** writing any code.
All generated files, examples, and edits must match the project's language.

---

## Rules

1. **Detect language first.** Never write TypeScript in a JavaScript project or
   JavaScript in a TypeScript project.
2. **Match file extensions** used in the project (`.js`/`.jsx` vs `.ts`/`.tsx`).
3. **Match import style** — if the project omits extensions, do not add them.
4. **Never add `tsconfig.json` or TypeScript** to a JS project unless the
   developer explicitly asks to migrate.
5. **Never strip types** from a TS project to simplify examples.
6. **Reference examples** in this skill use TypeScript by default — adapt them
   to JavaScript when the project is JS.

---

## Detection

Check these signals in order. Use the first clear match.

| Signal | Language |
|---|---|
| `tsconfig.json` exists | TypeScript |
| `typescript` in `package.json` devDependencies | TypeScript |
| Majority of source files are `.ts` / `.tsx` | TypeScript |
| `jsconfig.json` exists, no `tsconfig.json` | JavaScript |
| Majority of source files are `.js` / `.jsx`, no `.ts` files | JavaScript |
| `vite.config.ts` | TypeScript (config only — still check `src/`) |
| `vite.config.js` | Check `src/` — config language ≠ app language |

If signals conflict, inspect `src/` or `app/` / `pages/` and match the majority.
Ask the developer if still unclear.

---

## File Extensions

| Artifact | TypeScript | JavaScript |
|---|---|---|
| React component | `Component.tsx` | `Component.jsx` |
| App entry | `main.tsx`, `index.tsx` | `main.jsx`, `index.jsx` |
| Next.js page | `page.tsx`, `layout.tsx` | `page.jsx`, `layout.jsx` |
| Next.js sitemap | `app/sitemap.ts` | `app/sitemap.js` |
| Next.js robots | `app/robots.ts` | `app/robots.js` |
| API route | `route.ts`, `sitemap.ts` | `route.js`, `sitemap.js` |
| Utility / helper | `structured-data.ts` | `structured-data.js` |
| Build script | `generate-sitemap.ts` | `generate-sitemap.js` |
| Vite config | `vite.config.ts` | `vite.config.js` |

---

## Code Adaptation

### TypeScript → remove for JavaScript

| TypeScript | JavaScript |
|---|---|
| `import type { Metadata } from 'next'` | `/** @type {import('next').Metadata} */` or omit |
| `type Props = { slug: string }` | JSDoc `@param` or plain destructuring |
| `: Metadata` return type | Omit |
| `: Promise<Metadata>` | `async function generateMetadata({ params })` |
| `Record<string, unknown>` | Plain object, no type |
| `.tsx` files | `.jsx` files |

### JavaScript patterns

```jsx
// app/about/page.jsx — App Router static metadata
/** @type {import('next').Metadata} */
export const metadata = {
  title: 'About Us — Site Name',
  description: 'A clear description under 160 characters.',
}
```

```jsx
// src/components/SEO.jsx — Vite/React
import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Site Name'
const TITLE_TEMPLATE = `%s — ${SITE_NAME}`

export function SEO({
  title,
  description,
  canonical,
  ogImage = 'https://example.com/og/default.png',
  ogType = 'website',
  noIndex = false,
  jsonLd,
  hrefLangs,
}) {
  const fullTitle = `${title} — ${SITE_NAME}`

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {/* OG, Twitter, hreflang, jsonLd — same as TS version */}
    </Helmet>
  )
}
```

```js
// app/sitemap.js — App Router
/** @type {import('next').MetadataRoute.Sitemap} */
export default function sitemap() {
  return [{ url: 'https://example.com', lastModified: new Date() }]
}
```

### TypeScript patterns

Keep types, `import type`, and `.ts`/`.tsx` extensions as shown in stack
reference files.

---

## Checklist Before Writing Code

- [ ] Language detected (JS or TS)
- [ ] File extensions match project convention
- [ ] No `type` / `interface` keywords in JS output
- [ ] No `.ts` imports or files added to a JS project
- [ ] Sitemap/robots use `.js` or `.ts` matching the project
