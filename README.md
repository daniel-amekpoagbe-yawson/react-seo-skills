# React SEO Skills

[![npm](https://img.shields.io/npm/v/react-seo-skills?color=cb3837&logo=npm)](https://www.npmjs.com/package/react-seo-skills)
[![license](https://img.shields.io/npm/l/react-seo-skills?color=blue)](LICENSE)

An agent skill that teaches **Cursor**, **Claude Code**, and **Codex** how to
implement SEO and improve AI-search visibility in **Next.js**, **Astro**, and
**React** apps.

It covers the full workflow — keyword strategy, metadata, Open Graph, Schema.org
JSON-LD, sitemaps, `robots.txt`, and `llms.txt` — with patterns tailored to your
stack: Next.js App Router, Pages Router, Astro, or Vite + React.

> [!IMPORTANT]
> **This is a CLI installer, not a runtime dependency.**
> Run `npx react-seo-skills` — do **not** run `npm install react-seo-skills`.
> `npm install` only downloads the package; it never copies the skill into your
> agent's directory, so nothing will appear to happen. If you added it to your
> dependencies by mistake, remove it with `npm uninstall react-seo-skills` and
> run `npx react-seo-skills` instead.

```bash
npx react-seo-skills
```

---

## Contents

- [How agent skills work](#how-agent-skills-work)
- [Why this exists](#why-this-exists)
- [Quick start](#quick-start)
- [CLI reference](#cli-reference)
- [Where it installs](#where-it-installs)
- [Updating](#updating)
- [What the agent learns](#what-the-agent-learns)
- [Supported stacks](#supported-stacks)
- [Example prompts](#example-prompts)
- [Skill structure](#skill-structure)
- [Requirements](#requirements)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Author](#author)
- [License](#license)

---

## How agent skills work

This package does not add a runtime dependency to your app. It installs a set of
Markdown files — an _agent skill_ — into your AI coding agent's skill directory.
When you ask the agent an SEO question, it discovers the skill from the
`description` in `SKILL.md` and reads the relevant reference files on demand.

In short, you are installing **knowledge, not a library**. Nothing is imported
into your code and nothing ships to production. This is also why you run it with
`npx` (which executes the installer) instead of `npm install` (which would only
download the files without copying them into place).

---

## Why this exists

Most SEO advice is generic and stack-agnostic. This skill is built around the
metadata and rendering conventions used by modern React, Next.js, and Astro apps:

- **Language-aware.** Detects JavaScript vs TypeScript and writes code in the
  matching language — no stray types in a JS project, no missing types in a TS one.
- **Stack-aware.** Detects Next.js App Router, Pages Router, Astro, Vite + React,
  and CRA, then applies the correct APIs for each. It never mixes framework
  patterns between stacks.
- **AI-search aware.** Applies foundational SEO to AI-search surfaces and treats
  emerging conventions such as `llms.txt` as optional rather than guaranteed
  ranking requirements.
- **Version-aware.** Tells the agent its training data may be stale — it must
  check the installed framework versions and current docs before writing code,
  instead of implementing from memory.
- **Asks, doesn't guess.** The agent asks for your real site name, domain, OG
  image, and social handles — placeholder values never slip silently into your
  codebase.
- **DRY by design.** Metadata is defined once — through a shared `SEO` component,
  layout-level defaults, or schema helpers — never copy-pasted across pages.
- **Rendering-aware.** Chooses React 19 native metadata or
  [`react-helmet-async`](https://www.npmjs.com/package/react-helmet-async) when
  appropriate, and explains the SEO implications of client rendering,
  prerendering, static output, and SSR.
- **Audit-capable.** Includes a structured SEO audit workflow the agent can run
  against an existing project and report back as Critical / Suggestion / OK.

---

## Quick start

Run from your project root and choose options with flags when needed:

```bash
npx react-seo-skills
```

By default this installs the skill for all three agents (Cursor, Claude Code, and
Codex) into the current project. No extra configuration is required — agents
discover the skill automatically from the `description` in `SKILL.md`.

---

## CLI reference

```bash
npx react-seo-skills [options]
```

| Option      | Description                                                              |
| ----------- | ------------------------------------------------------------------------ |
| _(none)_    | Install for all agents into the current project                          |
| `--all`     | Install for all agents (explicit form of the default)                    |
| `--cursor`  | Install for Cursor only                                                  |
| `--claude`  | Install for Claude Code only                                             |
| `--codex`   | Install for Codex only                                                   |
| `--global`  | Install to user-level directories (`~/.cursor`, `~/.claude`, `~/.codex`) |
| `--force`   | Overwrite an existing installation                                       |
| `--dry-run` | Show what would be installed without writing any files                   |
| `--help`    | Show usage information                                                   |

You can combine flags. A few common examples:

```bash
npx react-seo-skills --global              # available in every project
npx react-seo-skills --cursor --claude     # only these two agents
npx react-seo-skills --codex --force       # reinstall for Codex, overwriting
npx react-seo-skills --dry-run             # preview the changes first
```

---

## Where it installs

| Agent       | Project path                       | Global path (`--global`)             |
| ----------- | ---------------------------------- | ------------------------------------ |
| Cursor      | `.cursor/skills/react-seo-skills/` | `~/.cursor/skills/react-seo-skills/` |
| Claude Code | `.claude/skills/react-seo-skills/` | `~/.claude/skills/react-seo-skills/` |
| Codex       | `.agents/skills/react-seo-skills/` | `~/.codex/skills/react-seo-skills/`  |

After installing, restart **Claude Code** or **Codex** if the skill does not
appear — they rescan their skill directories on startup. Cursor picks it up
automatically.

---

## Updating

To pull the latest version into an existing install, re-run with `@latest` and
`--force`:

```bash
npx react-seo-skills@latest --force
```

| Goal                     | Command                                        |
| ------------------------ | ---------------------------------------------- |
| Update a project install | `npx react-seo-skills@latest --force`          |
| Update a global install  | `npx react-seo-skills@latest --global --force` |

- **`@latest`** bypasses the `npx` cache. A plain `npx react-seo-skills` may
  re-run an older cached copy without checking the registry.
- **`--force`** overwrites the existing skill files — without it the installer
  detects the current install and skips with "already exists."

After updating, restart **Claude Code** or **Codex** so they rescan the skill
directory. Cursor picks up changes automatically.

---

## What the agent learns

| Area                     | What it covers                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **Keywords**             | Ideation, search-intent clustering, validation, and cannibalization checks            |
| **Metadata**             | Title, description, canonical, Open Graph, Twitter cards, and hreflang                |
| **Structured data**      | Schema.org JSON-LD — Organization, Article, LocalBusiness, and more                   |
| **Sitemap & robots**     | `sitemap.ts` / `sitemap.xml`, `robots.ts` / `robots.txt`, and deliberate crawl policy |
| **AI-search visibility** | Helpful content structure, entity clarity, optional `llms.txt`, and measurement       |
| **Astro**                | `.astro` layouts, content collections, `@astrojs/sitemap`, robots, and JSON-LD        |
| **Vite / SPA**           | React metadata choices, CSR warnings, and prerendering guidance                       |

---

## Supported stacks

| Stack                | Reference                          | Status            |
| -------------------- | ---------------------------------- | ----------------- |
| Next.js App Router   | `skill/references/app-router.md`   | Available         |
| Next.js Pages Router | `skill/references/pages-router.md` | Available         |
| Vite + React / CRA   | `skill/references/react-vite.md`   | Available         |
| Astro                | `skill/references/astro.md`        | Available         |
| TanStack Start       | —                                  | Planned (`0.4.0`) |

See the [roadmap](#roadmap) for details on planned stacks.

---

## Example prompts

Once the skill is installed, ask your agent things like:

- "Set up SEO metadata for my Next.js app."
- "Audit the SEO on this project and report what's missing."
- "Add Schema.org JSON-LD to my blog posts."
- "Should this site have an `llms.txt`, and what should it contain?"
- "My Vite SPA isn't ranking — what should I do?"
- "Set up a sitemap and `robots.txt` that match this site's crawl policy."
- "Add SEO metadata, JSON-LD, and a sitemap to my Astro blog."

---

## Skill structure

```text
skill/
├── SKILL.md                       Entry point — rules, detection order, audit workflow
└── references/
    ├── language.md                JavaScript vs TypeScript detection
    ├── keywords.md                Keyword clustering and validation
    ├── astro.md                   Astro metadata, sitemap, and robots
    ├── app-router.md              Next.js App Router patterns
    ├── pages-router.md            Next.js Pages Router patterns
    ├── react-vite.md              Vite / SPA workflow
    ├── react-helmet-async.md      react-helmet-async install and API reference
    ├── structured-data.md         Schema.org JSON-LD templates
    ├── geo.md                     AI visibility (GEO)
    └── validation.md              Post-implementation checklist
```

`SKILL.md` stays intentionally small. It links to the reference files, which the
agent loads only when they are relevant to the task.

---

## Requirements

- **Node.js 18 or newer** to run the installer
- A project using **Next.js**, **Astro 5+**, or **React** (Vite or CRA)

---

## Roadmap

Upcoming stack support is tracked in [CHANGELOG.md](CHANGELOG.md):

| Version | Stack          | Scope                                                                    |
| ------- | -------------- | ------------------------------------------------------------------------ |
| `0.4.0` | TanStack Start | Route-level `head()` metadata, server routes for sitemap/robots, JSON-LD |

Want to help build these? See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Contributing

Contributions are welcome — content corrections, new stack support, and installer
improvements. Start with [CONTRIBUTING.md](CONTRIBUTING.md) and please read the
[Code of Conduct](CODE_OF_CONDUCT.md).

```bash
git clone https://github.com/daniel-amekpoagbe/react-seo-skills.git
cd react-seo-skills
npm test
```

---

## Author

**[Daniel Amekpoagbe](https://www.amekpoagbe.com/)** — Full-Stack Developer, Accra, Ghana.

Building fast, SEO-ready React, Next.js, and Astro apps. Portfolio at
[amekpoagbe.com](https://www.amekpoagbe.com/).

---

## License

[MIT](LICENSE) — Copyright (c) 2026 Daniel Amekpoagbe
