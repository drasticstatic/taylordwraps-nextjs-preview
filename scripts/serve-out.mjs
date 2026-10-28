#!/usr/bin/env node
// Serves out/ the way GitHub Pages does: under the base path, directories → index.html, unknown → 404.html with a 404.
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { createGzip } from "node:zlib";
import { join, extname, normalize } from "node:path";
const port = Number(process.argv[2] || process.env.PORT || 4173);
const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const OUT = join(process.cwd(), "out");
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".woff2": "font/woff2", ".txt": "text/plain", ".xml": "application/xml", ".ico": "image/x-icon" };
let gzipOk = false;
function send(res, file, status = 200) {
  const type = TYPES[extname(file)] || "application/octet-stream";
  const text = /^(text\/|application\/(json|javascript|xml))/.test(type);
  if (gzipOk && text) { res.writeHead(status, { "content-type": type, "content-encoding": "gzip", "cache-control": "public, max-age=600" }); createReadStream(file).pipe(createGzip()).pipe(res); return; }
  res.writeHead(status, { "content-type": type, "cache-control": "public, max-age=600" });
  createReadStream(file).pipe(res);
}
createServer((req, res) => {
  gzipOk = /\bgzip\b/.test(req.headers["accept-encoding"] || "");
  const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
  const notFound = () => (existsSync(join(OUT, "404.html")) ? send(res, join(OUT, "404.html"), 404) : (res.writeHead(404), res.end("404")));
  if (base && !url.startsWith(base + "/") && url !== base) return notFound();
  let rel = normalize(url.slice(base.length)).replace(/^(\.\.[/\\])+/, "");
  let file = join(OUT, rel);
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  else if (!existsSync(file) && existsSync(file + ".html")) file = file + ".html";
  if (!existsSync(file) || statSync(file).isDirectory()) return notFound();
  send(res, file);
}).listen(port, "127.0.0.1", () => console.log(`serving out/ at http://127.0.0.1:${port}${base}/`));
