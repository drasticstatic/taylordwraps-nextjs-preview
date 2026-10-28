"use client";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useState } from "react";
import { HeroHud } from "./HeroHud";
import { Reticle } from "./Reticle";
import { HeroStill } from "./HeroStill";
import { PeelCanvas2D } from "./PeelCanvas2D";
import { useReducedMotion, useCoarsePointer, useFinePointer } from "@/lib/media";
import { psyclone } from "@/lib/stores/psyclone";
import { markReady } from "@/lib/stores/assetReady";

const HeroScene = dynamic(() => import("@/components/three/HeroScene").then((m) => m.HeroScene), { ssr: false, loading: () => null });

export type Tier = "webgl" | "peel2d" | "still";
/** What this device can do. */
function capability(): Tier {
  try {
    const c = document.createElement("canvas");
    if (c.getContext("webgl2") || c.getContext("webgl")) return "webgl";
    if (c.getContext("2d")) return "peel2d";
  } catch { /* fall through */ }
  return "still";
}
/**
 * What this device should start with. Phones, low-memory devices and data-saver get the 2D peel by default
 * (the 3D lab is one tap away); the 3D chunk is heavy and its shader compile would block a mid-range phone
 * for seconds right when the page is trying to paint.
 */
function preferred(cap: Tier, coarse: boolean): Tier {
  if (cap !== "webgl") return cap;
  const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
  if (coarse || (nav.deviceMemory !== undefined && nav.deviceMemory < 4) || nav.connection?.saveData) return "peel2d";
  return "webgl";
}

/** Street level's stage. Ladder: WebGL scene → 2D peel canvas → still. Each failure demotes one rung. */
export function HeroStage() {
  const [tier, setTier] = useState<Tier | null>(null);
  const [cap, setCap] = useState<Tier>("still");
  const [progress, setProgress] = useState(0);
  const [body, setBody] = useState<"van" | "drums">("van");
  const reduced = useReducedMotion();
  const coarse = useCoarsePointer();
  const fine = useFinePointer();
  const psy = psyclone.use();
  useEffect(() => {
    const c = capability(); setCap(c);
    const want = preferred(c, matchMedia("(pointer: coarse)").matches);
    if (want !== "webgl") { setTier(want); return; }
    // the 3D lab waits for the page to be idle so the headline and copy paint first
    let done = false;
    const go = () => { if (!done) { done = true; setTier("webgl"); } };
    const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }).requestIdleCallback;
    if (document.readyState === "complete") { if (idle) idle(go, { timeout: 1500 }); else setTimeout(go, 300); }
    else window.addEventListener("load", () => { if (idle) idle(go, { timeout: 1500 }); else setTimeout(go, 300); }, { once: true });
    setTier("peel2d"); // 2D first; it is the fallback anyway and paints at once
  }, []);
  useEffect(() => { if (tier === "still") markReady("hero"); }, [tier]);
  const demote = useCallback(() => setTier((t) => (t === "webgl" ? "peel2d" : "still")), []);
  const filmId = psy ? "psyclone" : "psyclone";
  return (
    <div className="panel relative aspect-[4/3] w-full overflow-hidden bg-panel-2 sm:aspect-[3/2]" data-tier={tier ?? "pending"}>
      {tier === "webgl" && <HeroScene progress={progress} onProgress={setProgress} body={body} reduced={reduced} coarse={coarse} psy={psy} onFail={demote} autowrap={!reduced} />}
      {tier === "peel2d" && <PeelCanvas2D progress={progress} onProgress={setProgress} reduced={reduced} autowrap={!reduced} />}
      {(tier === "still" || tier === null) && <HeroStill />}
      {tier === "webgl" && <Reticle active={fine && !reduced} />}
      {tier && <HeroHud progress={tier === "still" ? 1 : progress} onProgress={setProgress} filmId={filmId} tier={tier} body={body} onBody={setBody} coarse={coarse} can3d={cap === "webgl" && tier === "peel2d"} on3d={() => setTier("webgl")} />}
    </div>
  );
}
