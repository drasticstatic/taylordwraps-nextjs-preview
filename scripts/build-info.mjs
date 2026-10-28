#!/usr/bin/env node
// Writes out/build-info.json so the footer can name the commit it was built from.
import { execSync } from "node:child_process";
import { writeFileSync, existsSync, mkdirSync } from "node:fs";
const sh = (c) => { try { return execSync(c, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch { return ""; } };
const info = {
  lane: process.env.NEXT_PUBLIC_LANE || "carport",
  branch: sh("git rev-parse --abbrev-ref HEAD"),
  commit: sh("git rev-parse HEAD"),
  shortCommit: sh("git rev-parse --short HEAD"),
  message: sh("git log -1 --pretty=%s"),
  committedAt: sh("git log -1 --pretty=%cI"),
  builtAt: new Date().toISOString(),
};
if (!existsSync("out")) mkdirSync("out");
writeFileSync("out/build-info.json", JSON.stringify(info, null, 2) + "\n");
console.log(`build-info: ${info.shortCommit || "(no git)"} ${info.message}`);
