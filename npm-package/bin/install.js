#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const SKILL_NAME = 'nextjs-react-seo-skill'
const TARGET_DIR = path.join(process.cwd(), 'skills', SKILL_NAME)
const SOURCE_DIR = path.join(__dirname, '..', 'skill')

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name)
    const d = path.join(dest, entry.name)
    entry.isDirectory() ? copyDir(s, d) : fs.copyFileSync(s, d)
  }
}

console.log('\n nextjs-react-seo-skill\n')
if (fs.existsSync(TARGET_DIR)) {
  console.log(`Skill already exists at ./skills/${SKILL_NAME}\n`)
  process.exit(0)
}
copyDir(SOURCE_DIR, TARGET_DIR)
console.log(`Skill installed at ./skills/${SKILL_NAME}\n`)
