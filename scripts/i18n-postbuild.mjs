#!/usr/bin/env node
// Static export writes lang="en" everywhere; the Spanish twins under out/es/ get lang="es".
import { readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";
const dir = "out/es";
let n = 0;
function walk(d) { try { for (const f of readdirSync(d)) { const p = join(d, f); if (statSync(p).isDirectory()) walk(p); else if (f.endsWith(".html")) { const s = readFileSync(p, "utf8"); const t = s.replace(/<html([^>]*)\slang="en"/, '<html$1 lang="es"'); if (t !== s) { writeFileSync(p, t); n++; } } } } catch { /* no es/ yet */ } }
walk(dir);
console.log(`i18n-postbuild: ${n} Spanish page(s) marked lang="es"`);
