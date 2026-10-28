"use client";
import { useEffect, useState } from "react";
import { assetReady, markReady } from "@/lib/stores/assetReady";
import { useReducedMotion } from "@/lib/media";
import { Z } from "@/lib/z";
/** "Warming the laminator." Tied to real readiness (fonts, the hero, the first receipts), min 400 ms, hard cap 4 s. */
export function Preloader() {
  const ready = assetReady.use();
  const reduced = useReducedMotion();
  const [gone, setGone] = useState(false);
  const [minElapsed, setMinElapsed] = useState(false);
  useEffect(() => {
    document.fonts?.ready.then(() => markReady("fonts")).catch(() => markReady("fonts"));
    const min = setTimeout(() => setMinElapsed(true), reduced ? 0 : 400);
    const cap = setTimeout(() => setGone(true), 4000);
    return () => { clearTimeout(min); clearTimeout(cap); };
  }, [reduced]);
  const all = ready.fonts && ready.hero;
  useEffect(() => { if (all && minElapsed) { const t = setTimeout(() => setGone(true), 180); return () => clearTimeout(t); } }, [all, minElapsed]);
  const n = Object.values(ready).filter(Boolean).length, total = Object.keys(ready).length;
  if (gone) return null;
  return (
    <div className="fixed inset-0 grid place-items-center bg-ink" style={{ zIndex: Z.preloader }} role="status" aria-label="Loading">
      <div className="w-64">
        <div className="display text-5xl">Taylor<span className="film-text">&rsquo;d</span></div>
        <div className="mt-4 h-[3px] w-full bg-panel-2"><div className="h-full bg-teal transition-[width] duration-300" style={{ width: `${Math.max(12, (n / total) * 100)}%` }} /></div>
        <div className="readout mt-2 text-dim">Warming the laminator</div>
      </div>
    </div>
  );
}
