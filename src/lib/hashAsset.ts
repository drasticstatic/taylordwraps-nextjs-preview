"use client";
import { asset } from "./basePath";
let manifestP: Promise<Record<string, string>> | null = null;
export function loadManifest(): Promise<Record<string, string>> {
  if (!manifestP) manifestP = fetch(asset("/assets/manifest.json")).then((r) => (r.ok ? r.json() : { assets: {} })).then((j) => j.assets ?? {}).catch(() => ({}));
  return manifestP;
}
/** SHA-256 of a same-origin asset, computed in this browser. */
export async function hashAsset(file: string): Promise<string> {
  const buf = await (await fetch(asset(`/assets/${file}`))).arrayBuffer();
  const h = await crypto.subtle.digest("SHA-256", buf);
  return [...new Uint8Array(h)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
