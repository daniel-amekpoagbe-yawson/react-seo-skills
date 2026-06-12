# Changelog

All notable changes to this project are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.0.8] - 2026-06-12

### Added

- Training-data warning block in `SKILL.md`: frameworks may have shipped
  breaking changes since the agent's training cut-off, so it must read the
  installed versions and current docs before implementing.
- New core rules in `SKILL.md`: verify framework versions before writing code,
  ask the developer for real project details (site name, domain, OG image,
  social handles, locales, keywords) instead of guessing, and keep SEO code
  DRY via shared `SEO` components, layout-level defaults, and schema helpers.

### Fixed

- CRA detection now checks for `react-scripts` in dependencies (the previous
  `create-react-app` signal never matched real CRA projects).
- App Router dynamic metadata example: `params` is typed as
  `Promise<{ slug: string }>` to match Next.js 15+, with explicit guidance for
  Next.js 14 and earlier.
- All JSON-LD serialization examples escape `<` via
  `JSON.stringify(...).replace(/</g, '\\u003c')` to prevent `</script>`
  breakout (XSS) from CMS- or user-provided data, with a matching rule in
  `structured-data.md` and `react-helmet-async.md`.
- `prioritizeSeoTags` rule reworded to match the shared `SEO` component
  (always include it — no-op on CSR and React 19).
- Removed an unused variable from the JavaScript `SEO` example in `language.md`.

### Changed

- Added SEO-relevant performance quick checks (LCP, lazy-loading,
  render-blocking scripts) to `validation.md`, referenced from `SKILL.md`.
- Replaced version- and date-pinned `react-helmet-async` claims with `v3+`
  and removed a dated keyword example.

## [0.0.7] - 2026-06-12

### Added

- README callout clarifying that this is a CLI installer, not a runtime
  dependency: run `npx react-seo-skills`, do not `npm install` it.

## [0.0.6] - 2026-06-12

### Added

- Contributor infrastructure: `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`,
  `CHANGELOG.md`, GitHub issue/PR templates, and CI.
- Installer test suite (`node --test`) and `npm test` / `prepublishOnly` scripts.
- README badges, a "How agent skills work" section, and a roadmap.
- Installer `--dry-run` flag and a Node.js version guard.
- Redesigned installer terminal UI: header box, aligned status rows, colored
  status glyphs, and a skill-file summary (zero dependencies; color
  auto-disables on non-TTY, `NO_COLOR`, or `TERM=dumb`).

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

[Unreleased]: https://github.com/daniel-amekpoagbe-yawson/react-seo-skills/compare/v0.0.8...HEAD
[0.0.8]: https://github.com/daniel-amekpoagbe-yawson/react-seo-skills/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/daniel-amekpoagbe-yawson/react-seo-skills/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/daniel-amekpoagbe-yawson/react-seo-skills/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/daniel-amekpoagbe-yawson/react-seo-skills/releases/tag/v0.0.5
