// scripts/check-hygiene.ts
// Deterministic hygiene gate:
// - No prompt/master-prompt/agent-report/scratch/temp artifact paths
// - No committed env/secret-style files
// - No emoji characters in code or docs
// - No master-prompt style content fingerprints

import * as fs from "node:fs";
import * as path from "node:path";

type IssueType = "banned-path" | "banned-file" | "emoji" | "banned-content";

interface Issue {
  type: IssueType;
  path: string;
  detail: string;
}

const repoRoot = path.resolve(__dirname, "..");

const IGNORED_DIRS = new Set([
  ".git",
  "node_modules",
  ".next",
  "coverage",
  "playwright-report",
  "test-results",
]);

const TEXT_EXTENSIONS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".json",
  ".md",
  ".yml",
  ".yaml",
  ".css",
  ".scss",
  ".html",
  ".txt",
]);

// Directory and path patterns that must never exist in the committed tree
const BANNED_PATH_PATTERNS: RegExp[] = [
  // Prompt / master prompt / agent report style paths
  /(^|\/)(prompts?|prompt-notes?|master[-_ ]?prompt)(\/|$)/i,
  /(^|\/)(agent[-_ ]?reports?|agent[-_ ]?logs?)(\/|$)/i,

  // Scratch / temp / playground
  /(^|\/)(scratch|temp|tmp|playground)(\/|$)/i,

  // Validation / verification artifacts as first-class files
  /(^|\/)(verification[-_ ]?scripts?|validation[-_ ]?artifacts?)(\/|$)/i,
];

// File names that must never be committed (likely secrets or env config)
const BANNED_FILE_NAMES = new Set([
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  ".env.test",
  "id_rsa",
  "id_dsa",
  "id_ecdsa",
  "id_ed25519",
]);

// Template env files that are explicitly allowed
const ALLOWED_FILE_NAMES = new Set([
  ".env.example",
  ".env.local.example",
]);

// Distinct fingerprints for the master prompt style content
const BANNED_CONTENT_PATTERNS: RegExp[] = [
  /UNIVERSAL MASTER PROMPT/i,
  /ZERO-DEVIATION BUILD \+ VERIFICATION DOCTRINE/i,
  /You are the Implementation Agent\. You do the work, verify it live, and report runtime proof only\./i,
  /STANDARD EXECUTION LOOP \(DO THIS EVERY TIME\)/i,
  /MANDATORY OUTPUT FORMAT \(EVERY RESPONSE\)/i,
];

// Unicode property escape that matches emoji-style pictographic characters
const emojiRegex = /\p{Extended_Pictographic}/u;

const issues: Issue[] = [];

function recordIssue(issue: Issue): void {
  issues.push(issue);
}

function walk(dir: string): void {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(repoRoot, fullPath).replace(/\\/g, "/");

    if (entry.isDirectory()) {
      if (IGNORED_DIRS.has(entry.name)) {
        continue;
      }

      for (const pattern of BANNED_PATH_PATTERNS) {
        if (pattern.test(relPath)) {
          recordIssue({
            type: "banned-path",
            path: relPath,
            detail: `Path matches banned pattern ${pattern}`,
          });
          // Continue walking to report every offending file under this path
        }
      }

      walk(fullPath);
      continue;
    }

    // File-level checks
    if (ALLOWED_FILE_NAMES.has(entry.name)) {
      // Explicitly allowed example/template env file
    } else if (BANNED_FILE_NAMES.has(entry.name)) {
      recordIssue({
        type: "banned-file",
        path: relPath,
        detail:
          "File name is not allowed to be committed (likely secrets or env configuration).",
      });
    }

    for (const pattern of BANNED_PATH_PATTERNS) {
      if (pattern.test(relPath)) {
        recordIssue({
          type: "banned-path",
          path: relPath,
          detail: `File path matches banned pattern ${pattern}`,
        });
        break;
      }
    }

    // Skip hygiene check script itself for content patterns (it defines those patterns)
    if (relPath === "scripts/check-hygiene.ts") {
      continue;
    }

    const ext = path.extname(entry.name);
    if (!TEXT_EXTENSIONS.has(ext)) {
      continue;
    }

    const content = fs.readFileSync(fullPath, "utf8");

    if (emojiRegex.test(content)) {
      recordIssue({
        type: "emoji",
        path: relPath,
        detail:
          "File contains emoji characters; remove them from code and documentation.",
      });
    }

    for (const pattern of BANNED_CONTENT_PATTERNS) {
      if (pattern.test(content)) {
        recordIssue({
          type: "banned-content",
          path: relPath,
          detail:
            "File contains disallowed master-prompt style content; remove or move this out of the repository.",
        });
        break;
      }
    }
  }
}

function main(): void {
  walk(repoRoot);

  if (issues.length === 0) {
    // Single deterministic success line for CI log scraping if needed
    console.log(
      "Hygiene check passed: no banned files, paths, emojis, or prompt content detected.",
    );
    return;
  }

  console.error("Hygiene check failed. The following issues were found:");
  for (const issue of issues) {
    console.error(`- [${issue.type}] ${issue.path} — ${issue.detail}`);
  }

  // Non-zero exit ensures CI is red until hygiene is fixed
  process.exit(1);
}

main();
