# React SEO Skills

[![npm version](https://img.shields.io/npm/v/react-seo-skills.svg)](https://www.npmjs.com/package/react-seo-skills)
[![npm downloads](https://img.shields.io/npm/dm/react-seo-skills.svg)](https://www.npmjs.com/package/react-seo-skills)
[![CI](https://github.com/daniel-amekpoagbe-yawson/react-seo-skills/actions/workflows/ci.yml/badge.svg)](https://github.com/daniel-amekpoagbe-yawson/react-seo-skills/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

An agent skill that teaches **Cursor**, **Claude Code**, and **Codex** how to implement SEO and GEO (AI visibility) in **Next.js** and **React** apps.

From keyword strategy to metadata, Schema.org JSON-LD, sitemaps, robots.txt, and `llms.txt` — with stack-aware patterns for App Router, Pages Router, and Vite SPAs.

> [!IMPORTANT]
> **This is a CLI installer, not a runtime dependency.**
> Run `npx react-seo-skills` — **do not** `npm install react-seo-skills`.
> `npm install` only downloads the package; it never copies the skill into your
> agent's directory, so nothing will appear to happen. If you added it to your
> dependencies by mistake, remove it with `npm uninstall react-seo-skills` and
> run `npx react-seo-skills` instead.

```bash
npx react-seo-skills
```

---

## How agent skills work

This package does **not** add a runtime dependency to your app. It installs a set
of Markdown files — an *agent skill* — into your AI coding agent's skill directory.
When you ask the agent an SEO question, it discovers the skill from the
`description` in `SKILL.md` and reads the relevant reference files on demand.

Nothing is imported into your code. You're installing **knowledge**, not a library.
That's why you run it with `npx` (which executes the installer) rather than
`npm install` (which would only download it without copying anything).

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

Preview without writing any files:

```bash
npx react-seo-skills --dry-run
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

| Stack | Reference | Status |
|---|---|---|
| Next.js App Router | `skill/references/app-router.md` | Available |
| Next.js Pages Router | `skill/references/pages-router.md` | Available |
| Vite + React / CRA | `skill/references/react-vite.md` | Available |
| Astro | — | Planned (`0.1.0`) |
| TanStack Start | — | Planned (`0.2.0`) |

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

## Roadmap

Upcoming stack support, tracked in [CHANGELOG.md](CHANGELOG.md):

| Version | Stack |
|---|---|
| `0.1.0` | Astro (`<head>`, content collections, `@astrojs/sitemap`, robots, JSON-LD) |
| `0.2.0` | TanStack Start (route `head()` metadata, server routes for sitemap/robots, JSON-LD) |

Want to help build these? See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Contributing

Contributions are welcome — content corrections, new stack support, and installer
improvements. Start with [CONTRIBUTING.md](CONTRIBUTING.md), and please read the
[Code of Conduct](CODE_OF_CONDUCT.md).

```bash
git clone https://github.com/daniel-amekpoagbe-yawson/react-seo-skills.git
cd react-seo-skills
npm test
```

---

## Author

**[Daniel Amekpoagbe](https://www.amekpoagbe.com/)** — Full-Stack Developer, Accra, Ghana

Building fast, SEO-ready React and Next.js apps. Portfolio at [amekpoagbe.com](https://www.amekpoagbe.com/).

---

## License

[MIT](LICENSE) — Copyright (c) 2026 Daniel Amekpoagbe
