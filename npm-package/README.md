# react-seo-skills

An agent skill for **Cursor**, **Claude Code**, and **Codex** — SEO, GEO, and AI
visibility for **Next.js** and **React (Vite)** apps.

Covers keyword strategy, metadata, Open Graph, Schema.org JSON-LD, sitemap/robots,
and making your app show up in ChatGPT, Perplexity, and Google AI Overviews.

---

## Supported stacks

| Stack | Reference file |
|---|---|
| Next.js App Router | `references/app-router.md` |
| Next.js Pages Router | `references/pages-router.md` |
| Vite + React / CRA | `references/react-vite.md` |

The skill detects your stack automatically and applies the correct patterns.
For Vite/plain React apps, the agent installs
[`react-helmet-async@latest`](https://www.npmjs.com/package/react-helmet-async),
wraps the app in `HelmetProvider`, and uses the shared `SEO` component before
implementing metadata.

---

## What's included

| File | Covers |
|---|---|
| `SKILL.md` | Language + stack detection, rules, audit workflow |
| `references/language.md` | JavaScript vs TypeScript detection and file extensions |
| `references/keywords.md` | Keyword ideation, clustering, validation, SERP analysis |
| `references/app-router.md` | `next/metadata`, `sitemap.ts`, `robots.ts`, hreflang |
| `references/pages-router.md` | `next/head`, reusable SEO component, sitemap, hreflang |
| `references/react-helmet-async.md` | Official `react-helmet-async` install, API, SSR, `SEO` component |
| `references/react-vite.md` | Vite/React workflow, sitemap, robots, CSR warnings |
| `references/structured-data.md` | Schema.org JSON-LD templates for all stacks |
| `references/geo.md` | `llms.txt`, AI crawler permissions, `/ai` page, baseline tracker |
| `references/validation.md` | Post-implementation validation tools and checklist |

---

## Installation

### All agents, project-level (recommended)

```bash
npx react-seo-skills
```

### All agents, user-level

```bash
npx react-seo-skills --global
```

### Single agent

```bash
npx react-seo-skills --cursor
npx react-seo-skills --claude
npx react-seo-skills --codex
```

### Overwrite existing install

```bash
npx react-seo-skills --force
```

---

## Install paths

| Agent | Project | Global |
|---|---|---|
| **Cursor** | `.cursor/skills/react-seo-skills/` | `~/.cursor/skills/react-seo-skills/` |
| **Claude Code** | `.claude/skills/react-seo-skills/` | `~/.claude/skills/react-seo-skills/` |
| **Codex** | `.agents/skills/react-seo-skills/` | `~/.codex/skills/react-seo-skills/` |

No extra config needed. All three agents discover skills from the `description`
in `SKILL.md`. Restart Claude Code or Codex if the skill does not appear.

---

## Example prompts

- "Set up metadata for my Next.js app"
- "Audit SEO on this Vite project"
- "How do I add Schema.org to my React app?"
- "My Vite SPA isn't ranking — what do I do?"
- "Set up sitemap and robots.txt"
- "How do I write llms.txt?"

---

## Author

**[Daniel Amekpoagbe](https://www.amekpoagbe.com/)** — Full-Stack Web Developer, Accra, Ghana

- Portfolio: [amekpoagbe.com](https://www.amekpoagbe.com/)
- Email: [work@amekpoagbe.com](mailto:work@amekpoagbe.com)

Specializes in React, Next.js, TypeScript, SEO, and performance optimization.

---

## License

MIT — Copyright (c) 2026 [Daniel Amekpoagbe](https://www.amekpoagbe.com/)
