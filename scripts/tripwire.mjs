#!/usr/bin/env node
// Fails the build if anything private, secret-shaped, priced, or emoji-shaped reached out/.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
const OUT = "out";
const PRIVATE_PATH = /(^|\/)(AGENT-SYNC|logs|proposals|handoffs|imports|backups|setup|specs|graphify-out)(\/|$)|(^|\/)(\.env(\..*)?|.*\.pem|.*\.key|.*\.p12|id_rsa.*|id_ed25519.*|.*rate-?card.*|.*\.local\.(json|ts|js))$/i;
const SECRETS = [/-----BEGIN (RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/, /\bgh[pousr]_[A-Za-z0-9]{30,}\b/, /\bgithub_pat_[A-Za-z0-9_]{40,}\b/, /\bAKIA[0-9A-Z]{16}\b/, /\bxox[abprs]-[A-Za-z0-9-]{10,}\b/, /\bsk-[A-Za-z0-9]{20,}\b/];
const EMOJI = /(?![©®™])\p{Extended_Pictographic}/u; // text symbols like © are fine; pictographs are not
const PRICE = /"(price|rate|amount)"\s*:\s*[1-9]\d{2,}/;
const problems = [];
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name), rel = relative(OUT, p);
    if (PRIVATE_PATH.test(rel)) { problems.push(`private path shipped: ${rel}`); continue; }
    if (statSync(p).isDirectory()) { walk(p); continue; }
    if (/\.(html|js|css|json|txt|xml|svg)$/.test(name)) {
      const txt = readFileSync(p, "utf8");
      for (const re of SECRETS) if (re.test(txt)) problems.push(`secret-shaped string in ${rel}`);
      if (/\.html$/.test(name)) {
        const body = txt.replace(/<title>[\s\S]*?<\/title>/gi, "").replace(/<meta[^>]*>/gi, "");
        const m = EMOJI.exec(body);
        if (m) problems.push(`emoji in ${rel} (${m[0]}) — the carport is icons only`);
      }
      if (/proposal/.test(rel) && PRICE.test(txt)) problems.push(`a price shipped in ${rel}`);
    }
  }
}
walk(OUT);
if (problems.length) { console.error("✗ tripwire:"); problems.forEach((p) => console.error("  - " + p)); process.exit(1); }
console.log("✓ tripwire: out/ is clean");
