// The cross-lane contract (shared/wrap-spec.schema.json): a visualizer build as a URL fragment, #build=<base64url JSON>.
// Both THE CAR SHOW and THE CARPORT decode it on load. No personal data, no prices, no payment fields, ever.
import type { BodyId } from "@/data/bodies";
import type { FilmId } from "@/data/films";
import type { FinishId } from "@/data/finishes";

export interface WrapSpec {
  v: 1;
  body: BodyId;
  film: FilmId;
  finish: FinishId;
  text?: string;
  textPos?: { x: number; y: number };
  from?: "carshow" | "carport";
}

const b64url = {
  enc: (s: string) => btoa(unescape(encodeURIComponent(s))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""),
  dec: (s: string) => decodeURIComponent(escape(atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4)))),
};

export function encodeBuild(spec: WrapSpec): string {
  const clean: WrapSpec = { v: 1, body: spec.body, film: spec.film, finish: spec.finish, from: "carport" };
  if (spec.text?.trim()) clean.text = spec.text.trim().slice(0, 18);
  if (spec.textPos) clean.textPos = { x: +spec.textPos.x.toFixed(3), y: +spec.textPos.y.toFixed(3) };
  return b64url.enc(JSON.stringify(clean));
}

export function decodeBuild(fragment: string): WrapSpec | null {
  const m = /(?:^|[#&])build=([A-Za-z0-9_-]+)/.exec(fragment);
  if (!m) return null;
  try {
    const j = JSON.parse(b64url.dec(m[1]));
    if (j?.v !== 1 || typeof j.body !== "string" || typeof j.film !== "string" || typeof j.finish !== "string") return null;
    return j as WrapSpec;
  } catch {
    return null;
  }
}

export const CARSHOW_URL = "https://drasticstatic.github.io/taylordwraps-public-preview/";
export function carshowLink(spec: WrapSpec) { return `${CARSHOW_URL}#visualizer&build=${encodeBuild(spec)}`; }
