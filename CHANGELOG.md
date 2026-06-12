# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Contributor infrastructure: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `CHANGELOG.md`, GitHub issue/PR templates, and CI.
- Installer test suite (`node --test`) and `npm test` / `prepublishOnly` scripts.
- README badges, a "How agent skills work" section, and a roadmap.

## Roadmap (planned)

Support for these stacks is planned. Track or claim them via a GitHub issue
before starting — see [CONTRIBUTING.md](CONTRIBUTING.md).

- **`0.1.0` — Astro support.** `skill/references/astro.md` covering the
  Astro `<head>`, content collections metadata, `@astrojs/sitemap`, `robots.txt`,
  and JSON-LD patterns.
- **`0.2.0` — TanStack Start support.** `skill/references/tanstack-start.md`
  covering route-level `head()` metadata, server routes for sitemap/robots, and
  JSON-LD.

## [0.0.5] - 2026-06-12

### Added

- Initial public release of the `react-seo-skills` agent skill.
- `SKILL.md` entry point with language detection, stack detection, implementation
  order, SEO audit mode, and quick-reference tables.
- Reference files: `language.md`, `keywords.md`, `app-router.md`,
  `pages-router.md`, `react-vite.md`, `react-helmet-async.md`,
  `structured-data.md`, `geo.md`, `validation.md`.
- Zero-dependency installer (`bin/install.js`) supporting Cursor, Claude Code,
  and Codex, with `--global` and `--force` options.

[Unreleased]: https://github.com/daniel-amekpoagbe-yawson/react-seo-skills/compare/v0.0.5...HEAD
[0.0.5]: https://github.com/daniel-amekpoagbe-yawson/react-seo-skills/releases/tag/v0.0.5
