# React SEO Skills

An agent skill that teaches **Cursor**, **Claude Code**, and **Codex** how to implement SEO and GEO (AI visibility) in **Next.js** and **React** apps.

From keyword strategy to metadata, Schema.org JSON-LD, sitemaps, robots.txt, and `llms.txt` — with stack-aware patterns for App Router, Pages Router, and Vite SPAs.

```bash
npx react-seo-skills
```

---

## Why this exists

Most SEO advice is generic. This skill is built for how modern React apps actually ship:

- Detects **JavaScript vs TypeScript** and writes code in the matching language
- Detects **Next.js App Router**, **Pages Router**, or **Vite + React**
- Installs and configures [`react-helmet-async`](https://www.npmjs.com/package/react-helmet-async) for SPA apps
- Covers **GEO** — making your site legible to ChatGPT, Perplexity, and Google AI Overviews
- Includes an **SEO audit workflow** agents can run on existing projects

---

## Quick start

Run from your project root:

```bash
npx react-seo-skills
```

Install globally (available in every project):

```bash
npx react-seo-skills --global
```

Install for one agent only:

```bash
npx react-seo-skills --cursor
npx react-seo-skills --claude
npx react-seo-skills --codex
```

Overwrite an existing install:

```bash
npx react-seo-skills --force
```

No extra config required. Agents discover the skill from the `description` in `SKILL.md`.

---

## Where it installs

| Agent | Project path | Global path |
|---|---|---|
| Cursor | `.cursor/skills/react-seo-skills/` | `~/.cursor/skills/react-seo-skills/` |
| Claude Code | `.claude/skills/react-seo-skills/` | `~/.claude/skills/react-seo-skills/` |
| Codex | `.agents/skills/react-seo-skills/` | `~/.codex/skills/react-seo-skills/` |

Restart **Claude Code** or **Codex** after installing if the skill does not appear.

---

## What the agent learns

| Area | Covers |
|---|---|
| **Keywords** | Ideation, intent clustering, validation, cannibalization checks |
| **Metadata** | Title, description, canonical, Open Graph, Twitter cards, hreflang |
| **Structured data** | Schema.org JSON-LD — Organization, Article, FAQ, LocalBusiness, and more |
| **Sitemap & robots** | `sitemap.ts` / `sitemap.xml`, `robots.ts` / `robots.txt`, AI crawler rules |
| **GEO** | `llms.txt`, `/ai` knowledge pages, entity schema, AI citation structure |
| **Vite / SPA** | `react-helmet-async`, CSR warnings, prerender guidance |

### Supported stacks

| Stack | Reference |
|---|---|
| Next.js App Router | `skill/references/app-router.md` |
| Next.js Pages Router | `skill/references/pages-router.md` |
| Vite + React / CRA | `skill/references/react-vite.md` |

---

## Example prompts

Once installed, ask your agent:

- "Set up SEO metadata for my Next.js app"
- "Audit SEO on this project"
- "Add Schema.org JSON-LD to my blog posts"
- "How do I write llms.txt for AI search?"
- "My Vite SPA isn't ranking — what should I do?"
- "Set up sitemap and robots.txt with AI crawler permissions"

---

## Skill structure

```
skill/
├── SKILL.md                         Entry point, rules, audit workflow
└── references/
    ├── language.md                  JS vs TS detection
    ├── keywords.md                  Keyword clustering & validation
    ├── app-router.md                Next.js App Router patterns
    ├── pages-router.md              Next.js Pages Router patterns
    ├── react-vite.md                Vite / SPA workflow
    ├── react-helmet-async.md          Helmet install & API reference
    ├── structured-data.md           JSON-LD templates
    ├── geo.md                         AI visibility (GEO)
    └── validation.md                  Post-implementation checklist
```

---

## Requirements

- Node.js 18+
- A project using Next.js or React (Vite / CRA)

---

## Author

**[Daniel Amekpoagbe](https://www.amekpoagbe.com/)** — Full-Stack Developer, Accra, Ghana

Building fast, SEO-ready React and Next.js apps. Portfolio at [amekpoagbe.com](https://www.amekpoagbe.com/).

---

## License

[MIT](LICENSE) — Copyright (c) 2026 Daniel Amekpoagbe
