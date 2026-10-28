#!/usr/bin/env node
// prebuild: every file public/assets/manifest.json names must exist with the same SHA-256, so the
// in-browser Wrap Origin check can never pass on a file the repo quietly swapped.
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
const root = new URL("..", import.meta.url).pathname;
const manPath = join(root, "public/assets/manifest.json");
if (!existsSync(manPath)) { console.error("✗ public/assets/manifest.json missing — run `node scripts/sync-shared.mjs carport` from the repo root"); process.exit(1); }
const man = JSON.parse(readFileSync(manPath, "utf8"));
let bad = 0;
for (const [file, sha] of Object.entries(man.assets)) {
  const p = join(root, "public/assets", file);
  if (!existsSync(p)) { console.error(`✗ missing ${file}`); bad++; continue; }
  const h = createHash("sha256").update(readFileSync(p)).digest("hex");
  if (h !== sha) { console.error(`✗ ${file}: manifest ${sha.slice(0, 12)}… file ${h.slice(0, 12)}…`); bad++; }
}
if (bad) process.exit(1);
console.log(`✓ assets match manifest (${Object.keys(man.assets).length} files)`);
