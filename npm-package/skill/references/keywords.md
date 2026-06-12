# Keyword Clustering & Validation

Keyword strategy must happen before any metadata or structured data is written.
It determines page titles, descriptions, content hierarchy, URL slugs, and
schema types.

---

## Step 1 — Ideation

Gather seed keywords using a combination of:

- **The product/service itself**: what does it do, who is it for, what problem
  does it solve?
- **User language**: how would a non-technical user search for this?
- **Competitor analysis**: what terms do ranking competitors target? (Use
  Ahrefs, Semrush, or free tools like Ubersuggest.)
- **Google autocomplete & "People also ask"**: real query patterns, zero cost.
- **Search Console** (if the site already has traffic): filter by impressions
  to find queries the site almost ranks for.

Prompt the developer to answer:
1. Who is the primary user persona?
2. What is the one action they want the user to take?
3. What city/region/language is the target audience in?
4. Are there seasonal or event-driven search patterns?

---

## Step 2 — Clustering

Group keywords by **search intent**, not just topic similarity.

| Intent | Description | Example |
|---|---|---|
| Informational | User wants to learn | "what is server side rendering" |
| Navigational | User wants a specific site/page | "Next.js docs routing" |
| Commercial | User is researching before buying | "best Next.js hosting 2025" |
| Transactional | User is ready to act | "hire Next.js developer Ghana" |

**Clustering rules:**
- One primary keyword per page. Do not target two competing intents on one page.
- Group supporting (secondary) keywords that share the same intent around the
  primary keyword for that page.
- Long-tail keywords (3+ words, lower volume, higher conversion) should anchor
  service/product pages. Short-tail keywords (1-2 words, high volume, high
  competition) are for blog/educational content where you build authority over
  time.
- Local modifiers (city, country, region) go on location-specific pages, not
  sitewide.

**Cluster format to produce:**

```
Page: /services/nextjs-development
Primary keyword: "Next.js developer for hire"
Secondary keywords:
  - "hire Next.js developer"
  - "Next.js web development services"
  - "freelance Next.js developer"
Intent: Transactional
Schema type: Service
```

---

## Step 3 — Validation

Before committing a keyword to a page, validate it:

### Volume & Difficulty
- Use **Google Keyword Planner**, **Ahrefs**, **Semrush**, or **Ubersuggest**.
- For new sites: target keywords with KD (keyword difficulty) below 30.
- For established sites: you can compete for KD 30–60 with strong content.
- Volume below 100/month is fine for transactional or local keywords — they
  convert better than high-volume informational ones.

### SERP Analysis
- Search the keyword manually. Look at the top 5 results.
- If the top results are all large authority sites (Wikipedia, major news),
  reconsider. If small/medium sites rank, you can compete.
- Check if the SERP shows a featured snippet, local pack, or People Also Ask
  box — these are opportunities to structure content to win.

### Cannibalization Check
- Ensure no two pages on the site target the same primary keyword.
- Use Search Console > Performance > Pages to spot overlap on existing sites.
- On new sites, maintain a keyword map (a simple spreadsheet: URL | Primary KW
  | Secondary KWs | Intent | Status).

---

## Step 4 — Mapping to Implementation

Once clusters are validated, hand them off to metadata and content:

| Cluster output | Where it goes |
|---|---|
| Primary keyword | `<title>`, `og:title`, H1 |
| Secondary keywords | `<meta description>`, body copy subheadings |
| Intent → Schema type | JSON-LD `@type` selection |
| Local modifiers | Page slug, title, LocalBusiness schema |
| Long-tail variations | FAQ schema, blog content, internal links |

---

## Tools Reference

| Tool | Free tier | Best for |
|---|---|---|
| Google Keyword Planner | Yes | Volume data |
| Google Search Console | Yes (own site only) | Gap analysis |
| Ubersuggest | Limited | Beginner research |
| Ahrefs | No | Full competitor analysis |
| Semrush | Limited trial | Full competitor analysis |
| AnswerThePublic | Limited | Question-based keyword ideation |
