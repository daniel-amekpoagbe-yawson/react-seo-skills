"use strict";

const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const ROOT = path.join(__dirname, "..");
const INSTALLER = path.join(ROOT, "bin", "install.js");
const SKILL_DIR = "react-seo-skills";

const AGENT_PROJECT_PATHS = {
  cursor: path.join(".cursor", "skills"),
  claude: path.join(".claude", "skills"),
  codex: path.join(".agents", "skills"),
};

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "react-seo-skills-test-"));
}

function runInstaller(cwd, args) {
  return execFileSync("node", [INSTALLER, ...args], {
    cwd,
    encoding: "utf8",
  });
}

test("installs into the Cursor project directory", () => {
  const cwd = makeTempDir();
  try {
    runInstaller(cwd, ["--cursor"]);
    const installed = path.join(cwd, AGENT_PROJECT_PATHS.cursor, SKILL_DIR);
    assert.ok(
      fs.existsSync(path.join(installed, "SKILL.md")),
      "SKILL.md exists",
    );
    assert.ok(
      fs.existsSync(path.join(installed, "references", "app-router.md")),
      "reference files copied",
    );
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test("default (no agent flag) installs all three agents", () => {
  const cwd = makeTempDir();
  try {
    runInstaller(cwd, []);
    for (const rel of Object.values(AGENT_PROJECT_PATHS)) {
      const installed = path.join(cwd, rel, SKILL_DIR);
      assert.ok(
        fs.existsSync(path.join(installed, "SKILL.md")),
        `SKILL.md exists at ${rel}`,
      );
    }
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test("copies the full set of skill files", () => {
  const cwd = makeTempDir();
  try {
    runInstaller(cwd, ["--cursor"]);
    const installed = path.join(cwd, AGENT_PROJECT_PATHS.cursor, SKILL_DIR);
    const sourceRefs = fs
      .readdirSync(path.join(ROOT, "skill", "references"))
      .sort();
    const installedRefs = fs
      .readdirSync(path.join(installed, "references"))
      .sort();
    assert.deepStrictEqual(installedRefs, sourceRefs);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test("skips an existing install without --force", () => {
  const cwd = makeTempDir();
  try {
    runInstaller(cwd, ["--cursor"]);
    const out = runInstaller(cwd, ["--cursor"]);
    assert.match(out, /Already installed/);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test("--force overwrites an existing install", () => {
  const cwd = makeTempDir();
  try {
    runInstaller(cwd, ["--cursor"]);
    const installed = path.join(cwd, AGENT_PROJECT_PATHS.cursor, SKILL_DIR);
    const stray = path.join(installed, "stray.md");
    fs.writeFileSync(stray, "should be removed on force");
    const out = runInstaller(cwd, ["--cursor", "--force"]);
    assert.match(out, /Installed/);
    assert.ok(!fs.existsSync(stray), "stray file removed on force reinstall");
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});

test("--help exits cleanly and prints usage", () => {
  const out = execFileSync("node", [INSTALLER, "--help"], { encoding: "utf8" });
  assert.match(out, /Usage:/);
});

test("--dry-run previews a relative destination without writing files", () => {
  const cwd = makeTempDir();
  try {
    const out = runInstaller(cwd, ["--cursor", "--dry-run"]);
    assert.match(out, /Preview mode/);
    assert.match(out, /Project scope · no files will be written/);
    assert.match(out, /\.cursor\/skills\/react-seo-skills/);
    assert.ok(
      !fs.existsSync(path.join(cwd, ".cursor")),
      "no files are written",
    );
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
});
