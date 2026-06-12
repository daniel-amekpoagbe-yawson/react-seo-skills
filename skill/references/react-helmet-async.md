# react-helmet-async

Official reference for [react-helmet-async](https://www.npmjs.com/package/react-helmet-async)
(v3+). Use this package for all Vite and plain React SEO — never `react-helmet`.

Thread-safe fork of React Helmet. Requires `HelmetProvider` to encapsulate state per
request. Peer dependency: `react` ^16.6.0 || ^17.0.0 || ^18.0.0 || ^19.0.0.

---

## Rules

1. **Match project language** — see [language.md](language.md). Examples below
   use TypeScript; adapt to `.jsx`/`.js` with no types for JavaScript projects.
2. **Install with `@latest`:** `npm install react-helmet-async@latest`
3. **Named imports only** — no default export since v1.0.0:
   `import { Helmet, HelmetProvider } from 'react-helmet-async'`
4. **Always wrap the app** in `<HelmetProvider>` — required on client and server.
5. **Never use `react-helmet`** — it relies on `react-side-effect`, which is not
   thread-safe and is unmaintained.
6. **Use `<Helmet>` per route** for title, meta, link, and script tags.
7. **Use `titleTemplate` + `defaultTitle`** on `<Helmet>` for site-wide title patterns.
8. **Add `prioritizeSeoTags` to the shared `SEO` component.** It surfaces title,
   canonical, and OG tags early in `<head>` on SSR/prerendered React 16–18 apps,
   and is a harmless no-op on CSR apps and React 19.
9. **Escape `<` in JSON-LD** — serialize with
   `JSON.stringify(jsonLd).replace(/</g, '\\u003c')`, never bare `JSON.stringify`.

---

## Install

Detect the project's package manager and run:

| Lockfile | Command |
|---|---|
| `pnpm-lock.yaml` | `pnpm add react-helmet-async@latest` |
| `yarn.lock` | `yarn add react-helmet-async@latest` |
| `bun.lock` / `bun.lockb` | `bun add react-helmet-async@latest` |
| `package-lock.json` / none | `npm install react-helmet-async@latest` |

If `react-helmet` is installed, remove it first:

```bash
npm uninstall react-helmet && npm install react-helmet-async@latest
```

---

## Client Setup (Vite / CRA)

```tsx
// src/main.tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>
)
```

Per the official docs, `Helmet` goes inside your app tree — not in `main.tsx`:

```tsx
// src/App.tsx
import { Helmet } from 'react-helmet-async'

export default function App() {
  return (
    <>
      <Helmet
        defaultTitle="Site Name"
        titleTemplate="%s — Site Name"
      />
      {/* routes */}
    </>
  )
}
```

---

## Per-Page Metadata

```tsx
import { Helmet } from 'react-helmet-async'

export default function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About Us</title>
        <meta name="description" content="Learn about our team and mission." />
        <link rel="canonical" href="https://example.com/about" />
        <meta property="og:title" content="About Us — Site Name" />
        <meta property="og:description" content="Learn about our team and mission." />
        <meta property="og:url" content="https://example.com/about" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <main>{/* content */}</main>
    </>
  )
}
```

With `titleTemplate="%s — Site Name"` set in `App.tsx`, `<title>About Us</title>`
renders as `About Us — Site Name`.

---

## Helmet Props Reference

| Prop | Purpose |
|---|---|
| `titleTemplate` | Format string — `%s` replaced by child `<title>` (e.g. `"%s — Site Name"`) |
| `defaultTitle` | Fallback when no child `<title>` is set |
| `prioritizeSeoTags` | SSR only (React 16–18): surfaces title, canonical, OG tags early in `<head>` |
| `htmlAttributes` | Attributes on `<html>` — DOM manipulation even on React 19 |
| `bodyAttributes` | Attributes on `<body>` — DOM manipulation even on React 19 |
| `onChangeClientState` | Callback when head state changes (React 16–18) |

---

## JSON-LD via Helmet

Place structured data inside `<Helmet>` as a script tag. Always escape `<` in
the serialized JSON — a `</script>` sequence in CMS- or user-provided data would
otherwise break out of the tag (see [structured-data.md](structured-data.md)):

```tsx
<Helmet>
  <script type="application/ld+json">
    {JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Company Name',
      url: 'https://example.com',
    }).replace(/</g, '\\u003c')}
  </script>
</Helmet>
```

For SSR (React 16–18), include `${helmet.script.toString()}` in the server
template after `helmet.priority.toString()`.

---

## prioritizeSeoTags (SSR / React 16–18)

On server-rendered apps, certain SEO tags should appear early in `<head>`:

```tsx
<Helmet prioritizeSeoTags>
  <title>A fancy webpage</title>
  <link rel="canonical" href="https://example.com/page" />
  <meta property="og:title" content="A very important title" />
  <meta name="robots" content="index, follow" />
</Helmet>
```

Server template order:

```html
<head>
  ${helmet.title.toString()}
  ${helmet.priority.toString()}
  ${helmet.meta.toString()}
  ${helmet.link.toString()}
  ${helmet.script.toString()}
</head>
```

> **React 19:** `prioritizeSeoTags` has no effect. React hoists `<title>`, `<meta>`,
> and `<link>` natively — tag order follows component render order.

---

## Server-Side Rendering

Pass a `context` object to `HelmetProvider`. After `renderToString`, read helmet
state from context (React 16–18 only):

```tsx
import { renderToString } from 'react-dom/server'
import { HelmetProvider } from 'react-helmet-async'

const helmetContext = {}

const html = renderToString(
  <HelmetProvider context={helmetContext}>
    <App />
  </HelmetProvider>
)

const { helmet } = helmetContext

const page = `<!DOCTYPE html>
<html ${helmet.htmlAttributes.toString()}>
  <head>
    ${helmet.title.toString()}
    ${helmet.priority.toString()}
    ${helmet.meta.toString()}
    ${helmet.link.toString()}
    ${helmet.script.toString()}
  </head>
  <body ${helmet.bodyAttributes.toString()}>
    <div id="root">${html}</div>
  </body>
</html>`
```

> **React 19 SSR:** `title`, `meta`, and `link` inside `<Helmet>` are included in
> the React render output and hoisted to `<head>` automatically. The `context`
> object is **not** populated on React 19. Do not rely on `helmetContext.helmet`
> for React 19 SSR.

---

## React Version Behavior

| React | `Helmet` behavior | `HelmetProvider` |
|---|---|---|
| 16.6–18 | Collects instances, deduplicates, updates DOM manually | Required — manages per-request state |
| 19+ | Renders native JSX; React hoists tags to `<head>` | Transparent passthrough |

v3+ detects the React version at runtime. The same `<Helmet>` API works on all
supported versions — no code changes needed when upgrading React.

---

## Testing (Jest / Vitest)

For SSR emulation on React 16–18:

```tsx
import { HelmetProvider } from 'react-helmet-async'

HelmetProvider.canUseDOM = false
```

No effect on React 19 — `HelmetProvider` is a passthrough.

---

## Shared SEO Component

Use this wrapper in Vite/React projects. See [react-vite.md](react-vite.md) for
the full agent workflow. Use `SEO.tsx` for TypeScript, `SEO.jsx` for JavaScript.

### TypeScript (`src/components/SEO.tsx`)

```tsx
// src/components/SEO.tsx
import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Site Name'
const TITLE_TEMPLATE = `%s — ${SITE_NAME}`
const DEFAULT_OG_IMAGE = 'https://example.com/og/default.png'

type SEOProps = {
  title: string
  description: string
  canonical: string
  ogImage?: string
  ogType?: 'website' | 'article'
  noIndex?: boolean
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  hrefLangs?: Array<{ lang: string; href: string }>
}

export function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noIndex = false,
  jsonLd,
  hrefLangs,
}: SEOProps) {
  const fullTitle = `${title} — ${SITE_NAME}`

  return (
    <Helmet prioritizeSeoTags>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {hrefLangs?.map(({ lang, href }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
        </script>
      )}
    </Helmet>
  )
}

// Site-wide defaults — render once in App.tsx:
export function SiteHelmetDefaults() {
  return (
    <Helmet defaultTitle={SITE_NAME} titleTemplate={TITLE_TEMPLATE} />
  )
}
```

Usage in `App.tsx`:

```tsx
import { SiteHelmetDefaults } from './components/SEO'

export default function App() {
  return (
    <>
      <SiteHelmetDefaults />
      {/* routes */}
    </>
  )
}
```

### JavaScript (`src/components/SEO.jsx`)

```jsx
// src/components/SEO.jsx
import { Helmet } from 'react-helmet-async'

const SITE_NAME = 'Site Name'
const TITLE_TEMPLATE = `%s — ${SITE_NAME}`
const DEFAULT_OG_IMAGE = 'https://example.com/og/default.png'

export function SEO({
  title,
  description,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
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
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {hrefLangs?.map(({ lang, href }) => (
        <link key={lang} rel="alternate" hrefLang={lang} href={href} />
      ))}

      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd).replace(/</g, '\\u003c')}
        </script>
      )}
    </Helmet>
  )
}

export function SiteHelmetDefaults() {
  return (
    <Helmet defaultTitle={SITE_NAME} titleTemplate={TITLE_TEMPLATE} />
  )
}
```

Usage on a page:

```tsx
<SEO title="About Us" description="..." canonical="https://example.com/about" />
// Renders: <title>About Us — Site Name</title>
```

---

## Why Not react-helmet?

| | `react-helmet` | `react-helmet-async` |
|---|---|---|
| Maintenance | Abandoned (archived) | Actively maintained (v3+) |
| Thread safety | No (`react-side-effect`) | Yes (`HelmetProvider` context) |
| React 19 | Broken / hydration issues | Native hoisting support |
| SSR | `Helmet.renderStatic()` | `context` prop on `HelmetProvider` |
| Default export | Yes (legacy) | Named exports only |
