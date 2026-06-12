#!/usr/bin/env node

const fs = require('fs')
const os = require('os')
const path = require('path')

const SKILL_DIR_NAME = 'react-seo-skills'
const SOURCE_DIR = path.join(__dirname, '..', 'skill')

const TARGETS = {
  cursor: {
    label: 'Cursor',
    project: path.join('.cursor', 'skills'),
    global: path.join(os.homedir(), '.cursor', 'skills'),
  },
  claude: {
    label: 'Claude Code',
    project: path.join('.claude', 'skills'),
    global: path.join(os.homedir(), '.claude', 'skills'),
  },
  codex: {
    label: 'Codex',
    project: path.join('.agents', 'skills'),
    global: path.join(os.homedir(), '.codex', 'skills'),
  },
}

function printHelp() {
  console.log(`
react-seo-skills — install SEO/GEO skill for Cursor, Claude Code, and Codex

Usage:
  npx react-seo-skills [options]

Options:
  --all       Install for all agents (default)
  --cursor    Install for Cursor only
  --claude    Install for Claude Code only
  --codex     Install for Codex only
  --global    Install to user-level skill directories (~/.cursor, ~/.claude, ~/.codex)
  --force     Overwrite existing installation
  --help      Show this help message

Examples:
  npx react-seo-skills
  npx react-seo-skills --global
  npx react-seo-skills --cursor --claude
  npx react-seo-skills --codex --force
`)
}

function parseArgs(argv) {
  const options = {
    agents: new Set(),
    global: false,
    force: false,
    help: false,
  }

  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      options.help = true
      continue
    }
    if (arg === '--global') {
      options.global = true
      continue
    }
    if (arg === '--force') {
      options.force = true
      continue
    }
    if (arg === '--all') {
      options.agents = new Set(Object.keys(TARGETS))
      continue
    }
    if (arg === '--cursor') {
      options.agents.add('cursor')
      continue
    }
    if (arg === '--claude') {
      options.agents.add('claude')
      continue
    }
    if (arg === '--codex') {
      options.agents.add('codex')
      continue
    }
    console.error(`Unknown option: ${arg}`)
    printHelp()
    process.exit(1)
  }

  if (options.agents.size === 0) {
    options.agents = new Set(Object.keys(TARGETS))
  }

  return options
}

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  const entries = fs.readdirSync(src, { withFileTypes: true })
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function installTo(baseDir, force) {
  const targetDir = path.join(baseDir, SKILL_DIR_NAME)

  if (fs.existsSync(targetDir)) {
    if (!force) {
      return { status: 'skipped', path: targetDir }
    }
    fs.rmSync(targetDir, { recursive: true, force: true })
  }

  copyDir(SOURCE_DIR, targetDir)
  return { status: 'installed', path: targetDir }
}

function formatPath(targetPath) {
  const home = os.homedir()
  return targetPath.startsWith(home)
    ? `~${targetPath.slice(home.length)}`
    : targetPath
}

function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    printHelp()
    process.exit(0)
  }

  console.log('\n react-seo-skills\n')

  const scope = options.global ? 'global' : 'project'
  const cwd = process.cwd()
  const results = []

  for (const agent of options.agents) {
    const target = TARGETS[agent]
    const baseDir = options.global
      ? target.global
      : path.join(cwd, target.project)

    const result = installTo(baseDir, options.force)
    results.push({ agent, label: target.label, ...result })
  }

  for (const result of results) {
    const prefix = result.status === 'installed' ? '✓' : '·'
    const action = result.status === 'installed' ? 'Installed' : 'Skipped (exists)'
    console.log(`${prefix} ${result.label}: ${action} at ${formatPath(result.path)}`)
    if (result.status === 'skipped') {
      console.log(`  Re-run with --force to overwrite.`)
    }
  }

  const installed = results.some((result) => result.status === 'installed')

  if (installed) {
    console.log('\nWhat was installed:')
    console.log('  SKILL.md                      main skill file')
    console.log('  references/language.md         JS vs TS detection rules')
    console.log('  references/keywords.md         keyword clustering & validation')
    console.log('  references/app-router.md       App Router metadata, sitemap, robots')
    console.log('  references/pages-router.md     Pages Router metadata, sitemap, robots')
    console.log('  references/react-helmet-async.md  react-helmet-async install & API')
    console.log('  references/react-vite.md       Vite + React workflow, sitemap, robots')
    console.log('  references/structured-data.md  Schema.org JSON-LD patterns')
    console.log('  references/geo.md              GEO / AI visibility (llms.txt, /ai page)')
    console.log('  references/validation.md       Post-implementation validation tools')
  }

  console.log('\nNext steps:')
  if (options.agents.has('cursor')) {
    console.log('  Cursor:      skills auto-discover from SKILL.md — no extra config needed')
  }
  if (options.agents.has('claude')) {
    console.log('  Claude Code: skills auto-discover from ~/.claude/skills or .claude/skills')
  }
  if (options.agents.has('codex')) {
    console.log('  Codex:       restart the CLI after install so it rescans skill directories')
  }
  console.log('  See README for per-agent setup details.')
  console.log('\n  Created by Daniel Amekpoagbe — https://www.amekpoagbe.com/\n')
}

main()
