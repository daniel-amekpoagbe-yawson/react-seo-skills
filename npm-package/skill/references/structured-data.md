# Structured Data — Schema.org JSON-LD

JSON-LD is the recommended format for structured data by Google and all major
search engines. It is injected as a `<script type="application/ld+json">` tag
and does not interfere with page markup.

---

## Rules

1. **Match project language** — see [language.md](language.md). `.ts` helpers in
   TS projects, `.js` in JS projects.
2. Use JSON-LD — not Microdata or RDFa unless the project already uses them.
3. Always use absolute URLs in `url`, `image`, and `@id` fields.
4. Match `@type` to actual page content — never use `FAQPage` without real Q&A.
5. Place the script in the page component body (App Router, Vite) or page
   component (Pages Router). Both render in the DOM for crawlers.
6. Validate with Rich Results Test after every change.

---

## Choosing the Right Schema Type

Match schema type to page purpose:

| Page type | Schema type |
|---|---|
| Home / business | `Organization`, `LocalBusiness`, `WebSite` |
| Service page | `Service` |
| Product page | `Product` |
| Blog post / article | `Article`, `BlogPosting` |
| FAQ page | `FAQPage` |
| Person / portfolio | `Person` |
| Event | `Event` |
| Review | `Review`, `AggregateRating` |
| Breadcrumbs | `BreadcrumbList` |
| Site search box | `WebSite` with `potentialAction` |

Multiple schema types can appear on the same page (e.g., `Article` +
`BreadcrumbList` on a blog post).

---

## Implementation Patterns

### App Router
Inject JSON-LD directly in the page component as a script tag. Do not use
the metadata API for structured data — it doesn't support it.

```tsx
// app/about/page.tsx
export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Company Name',
    url: 'https://example.com',
    logo: 'https://example.com/logo.png',
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-000-000-0000',
      contactType: 'customer service',
    },
    sameAs: [
      'https://twitter.com/handle',
      'https://linkedin.com/company/name',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* page content */}
    </>
  )
}
```

### Pages Router

Inject in the page component body (preferred) or via a shared SEO component.

```tsx
// pages/about.tsx
export default function AboutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Company Name',
    url: 'https://example.com',
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* page content */}
    </>
  )
}
```

---

## Validation

- Google Rich Results Test
- Schema.org validator
