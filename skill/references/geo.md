# GEO — AI Visibility

GEO (Generative Engine Optimization) makes your site legible and citable to
AI-powered search tools: ChatGPT, Perplexity, Claude, Google AI Overviews,
Bing Copilot, and others.

Traditional SEO targets crawlers that index pages for keyword ranking. GEO
targets AI models that synthesize answers and cite sources. Implement both.

---

## Rules

1. **Match project language** for any code files — see [language.md](language.md).
   `robots.ts`/`robots.js`, page components, and routes follow project convention.
2. **Never block AI crawlers** unless there is a deliberate privacy reason.
3. **Always** create `llms.txt` at the site root for GEO-focused projects.
4. **Always** allow AI crawlers in `robots.ts` / `robots.js` (Next.js) or
   `robots.txt` (Vite).
5. Write factual, structured content — avoid marketing fluff on `/ai` pages.
6. Verify AI crawler user-agent names periodically. They change over time.

---

## The Five Pillars of GEO

### 1. Robots — Allow AI Crawlers

Explicitly allow AI crawlers. Do not rely on a blanket `Allow: /` alone if other
rules might block them.

**Next.js App Router** (`app/robots.ts`):

```ts
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/'] },
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'Applebot-Extended', allow: '/' },
    ],
    sitemap: 'https://example.com/sitemap.xml',
  }
}
```

**Vite / Pages Router** (`public/robots.txt`):

```txt
User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

Sitemap: https://example.com/sitemap.xml
```

---

### 2. llms.txt — Machine-Readable Site Summary

`llms.txt` is an emerging convention (see [llmstxt.org](https://llmstxt.org))
that gives AI models a structured overview of your site. Place it at
`public/llms.txt` (served at `/llms.txt`).

**Format:**

```markdown
# Site Name

> One-sentence summary of what the site/business is.

## About
Brief description of the company, product, or service. 2–4 sentences.
Write in plain language — this is read by AI models, not humans.

## Services / Products
- Service or product name: brief description
- Service or product name: brief description

## Key Pages
- [Home](https://example.com): What the home page covers
- [About](https://example.com/about): Company background and team
- [Services](https://example.com/services): Full service listing
- [AI Overview](https://example.com/ai): Structured knowledge base for AI systems

## Contact
- Email: hello@example.com
- Location: City, Country

## Social
- LinkedIn: https://linkedin.com/company/name
```

Keep it factual and concise. Optionally add `llms-full.txt` with extended
detail for models that support it.

---

### 3. /ai Knowledge Base Page

A dedicated route at `/ai` written for AI comprehension — plain, structured
prose with no marketing fluff.

**Include:**
- What the business does (one factual paragraph)
- Who the customers are
- Key differentiators (factual, not superlatives)
- Services with clear names and descriptions
- Location, contact, and founding context
- FAQ in plain Q&A format

**Requirements:**
- Add `AboutPage` or `WebPage` JSON-LD on this route
- List `/ai` in `llms.txt` and `sitemap.xml`
- Use descriptive H2/H3 headings

For Vite SPAs, prioritize prerendering this route if the rest of the app is
CSR-only.

---

### 4. Schema.org for AI Comprehension

Prioritize these schema types for GEO:

| Schema | Where |
|---|---|
| `Organization` or `LocalBusiness` | Homepage |
| `Service` | Service pages |
| `FAQPage` | FAQ sections |
| `Person` | Team / author pages |
| `Article` or `BlogPosting` | Content pages |

Every schema must include:
- `name` — exact, consistent entity name
- `url` — canonical absolute URL
- `description` — one factual sentence
- `sameAs` — social profiles, Wikipedia, Wikidata if available

`sameAs` builds cross-platform entity recognition for AI models.

---

### 5. Content Structure for AI Citation

- Use clear H2/H3 headings — AI models parse topic structure from them
- Lead each section with a direct answer
- Use numbered lists for processes, bullets for features
- Include specific facts: numbers, dates, locations, names
- Avoid vague marketing language ("world-class", "best-in-class")
- Add FAQ sections to major pages — Q&A is the most extractable format

---

## GEO Baseline Tracker (Optional)

Track AI visibility over time by querying AI tools with branded and category
queries and recording whether your site is cited.

**Queries to track:**
- `"[business name] [city]"` — branded + local
- `"best [service] in [city]"` — category
- `"what is [business name]"` — entity recognition

**Record:** date, query, AI tool, cited (yes/no), citation URL.

A spreadsheet is sufficient. For database tracking, any table with those
columns works — Supabase is one option:

```sql
create table geo_baseline (
  id uuid primary key default gen_random_uuid(),
  checked_at timestamptz default now(),
  query text not null,
  ai_tool text not null,
  cited boolean not null,
  citation_url text,
  notes text
);
```

---

## GEO Checklist

- [ ] AI crawlers explicitly allowed in robots.ts or robots.txt
- [ ] `/llms.txt` created and accessible
- [ ] `/ai` knowledge base page created
- [ ] `Organization` or `LocalBusiness` schema on homepage with `sameAs`
- [ ] `FAQPage` schema on FAQ sections
- [ ] Major pages have descriptive, factual H2/H3 headings
- [ ] Baseline snapshot recorded (optional)
- [ ] Site submitted to Google Search Console
