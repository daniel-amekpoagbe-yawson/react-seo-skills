'use strict'

const test = require('node:test')
const assert = require('node:assert')
const fs = require('node:fs')
const path = require('node:path')

const SKILL_ROOT = path.join(__dirname, '..', 'skill')

function listMarkdownFiles(dir) {
  const out = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      out.push(...listMarkdownFiles(full))
    } else if (entry.name.endsWith('.md')) {
      out.push(full)
    }
  }
  return out
}

const LINK_RE = /\]\(([^)]+)\)/g

test('all relative links between skill files resolve', () => {
  const broken = []
  for (const file of listMarkdownFiles(SKILL_ROOT)) {
    const content = fs.readFileSync(file, 'utf8')
    let match
    while ((match = LINK_RE.exec(content)) !== null) {
      const target = match[1].trim()
      if (/^(https?:|mailto:|#)/.test(target)) continue
      const cleaned = target.split('#')[0]
      if (!cleaned) continue
      const resolved = path.resolve(path.dirname(file), cleaned)
      if (!fs.existsSync(resolved)) {
        broken.push(`${path.relative(SKILL_ROOT, file)} -> ${target}`)
      }
    }
  }
  assert.deepStrictEqual(broken, [], `broken links:\n${broken.join('\n')}`)
})
