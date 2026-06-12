#!/usr/bin/env node

const fs = require('fs')
const os = require('os')
const path = require('path')

const pkg = require('../package.json')

const SKILL_DIR_NAME = 'react-seo-skills'
const SOURCE_DIR = path.join(__dirname, '..', 'skill')

// --- Terminal UI helpers (zero dependencies) ---------------------------------
const useColor =
  Boolean(process.stdout.isTTY) &&
  !process.env.NO_COLOR &&
  process.env.TERM !== 'dumb'

const wrap = (open, close) => (s) =>
  useColor ? `\x1b[${open}m${s}\x1b[${close}m` : String(s)

const c = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  red: wrap(31, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  magenta: wrap(35, 39),
  cyan: wrap(36, 39),
}

const stripAnsi = (s) => s.replace(/\x1b\[[0-9;]*m/g, '')
const visibleLen = (s) => stripAnsi(s).length
const pad = (s, width) => s + ' '.repeat(Math.max(0, width - visibleLen(s)))

function box(lines) {
  const width = Math.max(...lines.map(visibleLen))
  const border = c.dim
  const top = border('╭' + '─'.repeat(width + 2) + '╮')
  const bottom = border('╰' + '─'.repeat(width + 2) + '╯')
  const body = lines.map(
    (line) => border('│ ') + pad(line, width) + border(' │')
  )
  return [top, ...body, bottom].join('\n')
}

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
  const opt = (flag, desc) => `  ${c.cyan(pad(flag, 11))} ${c.dim(desc)}`
  const ex = (cmd) => `  ${c.dim('$')} ${cmd}`
  console.log(
    [
      '',
      `${c.bold('react-seo-skills')} ${c.dim('— SEO/GEO skills for Cursor, Claude Code & Codex')}`,
      '',
      c.bold('Usage:'),
      `  ${c.dim('$')} npx react-seo-skills [options]`,
      '',
      c.bold('Options:'),
      opt('--all', 'Install for all agents (default)'),
      opt('--cursor', 'Install for Cursor only'),
      opt('--claude', 'Install for Claude Code only'),
      opt('--codex', 'Install for Codex only'),
      opt('--global', 'Install to user-level skill dirs (~/.cursor, …)'),
      opt('--force', 'Overwrite an existing installation'),
      opt('--dry-run', 'Preview without writing any files'),
      opt('--help', 'Show this help message'),
      '',
      c.bold('Examples:'),
      ex('npx react-seo-skills'),
      ex('npx react-seo-skills --global'),
      ex('npx react-seo-skills --cursor --claude'),
      ex('npx react-seo-skills --codex --force'),
      '',
    ].join('\n')
  )
}

function parseArgs(argv) {
  const options = {
    agents: new Set(),
    global: false,
    force: false,
    help: false,
    dryRun: false,
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
    if (arg === '--dry-run') {
      options.dryRun = true
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

function installTo(baseDir, force, dryRun) {
  const targetDir = path.join(baseDir, SKILL_DIR_NAME)

  if (fs.existsSync(targetDir)) {
    if (!force) {
      return { status: 'skipped', path: targetDir }
    }
    if (!dryRun) {
      fs.rmSync(targetDir, { recursive: true, force: true })
    }
  }

  if (dryRun) {
    return { status: 'would-install', path: targetDir }
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

function checkNodeVersion() {
  const major = Number(process.versions.node.split('.')[0])
  if (Number.isFinite(major) && major < 18) {
    console.error(
      `react-seo-skills requires Node.js 18 or newer. You are running ${process.version}.`
    )
    process.exit(1)
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    printHelp()
    process.exit(0)
  }

  checkNodeVersion()

  const scope = options.global ? 'global' : 'project'
  const cwd = process.cwd()
  const results = []

  for (const agent of options.agents) {
    const target = TARGETS[agent]
    const baseDir = options.global
      ? target.global
      : path.join(cwd, target.project)

    const result = installTo(baseDir, options.force, options.dryRun)
    results.push({ agent, label: target.label, ...result })
  }

  // Header
  console.log()
  console.log(
    box([
      `${c.bold(c.cyan('react-seo-skills'))}  ${c.dim('v' + pkg.version)}`,
      c.dim('SEO & GEO skills for your AI coding agent'),
    ])
  )
  console.log()

  const heading = options.dryRun
    ? `${c.bold('Preview')} ${c.dim(`· ${scope} scope · no files written`)}`
    : `${c.bold('Installing')} ${c.dim(`· ${scope} scope`)}`
  console.log(`  ${heading}`)
  console.log()

  // Status rows
  const STATUS = {
    installed: { glyph: c.green('✓'), word: c.green('Installed') },
    'would-install': { glyph: c.cyan('→'), word: c.cyan('Would add') },
    skipped: { glyph: c.yellow('•'), word: c.yellow('Skipped') },
  }

  const labelWidth = Math.max(...results.map((r) => r.label.length))
  for (const result of results) {
    const s = STATUS[result.status]
    const note =
      result.status === 'skipped'
        ? c.dim('already exists — use --force')
        : c.dim(formatPath(result.path))
    console.log(
      `  ${s.glyph}  ${pad(c.bold(result.label), labelWidth + 2)}${pad(s.word, 12)}${note}`
    )
  }

  const installed = results.some((result) => result.status === 'installed')
  const wouldInstall = results.some((r) => r.status === 'would-install')

  if (installed || wouldInstall) {
    const files = [
      ['SKILL.md', 'entry point — rules & audit workflow'],
      ['references/language.md', 'JS vs TS detection'],
      ['references/keywords.md', 'keyword clustering & validation'],
      ['references/app-router.md', 'Next.js App Router'],
      ['references/pages-router.md', 'Next.js Pages Router'],
      ['references/react-vite.md', 'Vite + React / SPA'],
      ['references/react-helmet-async.md', 'Helmet install & API'],
      ['references/structured-data.md', 'Schema.org JSON-LD'],
      ['references/geo.md', 'AI visibility (llms.txt, /ai)'],
      ['references/validation.md', 'post-implementation checks'],
    ]
    const nameWidth = Math.max(...files.map(([name]) => name.length))
    console.log()
    console.log(`  ${c.bold('Skill files')} ${c.dim(`(${files.length})`)}`)
    for (const [name, desc] of files) {
      console.log(`    ${c.dim('•')} ${pad(name, nameWidth + 2)}${c.dim(desc)}`)
    }
  }

  // Next steps
  const steps = []
  if (options.agents.has('cursor')) {
    steps.push(['Cursor', 'auto-discovers from SKILL.md — no extra config'])
  }
  if (options.agents.has('claude')) {
    steps.push(['Claude Code', 'auto-discovers from .claude/skills'])
  }
  if (options.agents.has('codex')) {
    steps.push(['Codex', 'restart the CLI so it rescans skill directories'])
  }

  console.log()
  console.log(`  ${c.bold('Next steps')}`)
  const stepWidth = Math.max(...steps.map(([label]) => label.length))
  for (const [label, desc] of steps) {
    console.log(`    ${c.cyan(pad(label, stepWidth + 2))}${c.dim(desc)}`)
  }
  console.log(`    ${c.dim('See the README for per-agent setup details.')}`)

  console.log()
  console.log(
    c.dim('  Created by Daniel Amekpoagbe · https://www.amekpoagbe.com/')
  )
  console.log()
}

main()
