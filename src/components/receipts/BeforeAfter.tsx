"use client";
import { useRef, useState } from "react";
import { asset } from "@/lib/basePath";
/** The transformation as a slider. Drag anywhere; the range input is the keyboard handle. */
export function BeforeAfter({ before, after, alt }: { before: string; after: string; alt: string }) {
  const [split, setSplit] = useState(42);
  const box = useRef<HTMLDivElement>(null);
  const drag = useRef(false);
  const at = (clientX: number) => { const r = box.current!.getBoundingClientRect(); setSplit(Math.max(4, Math.min(96, ((clientX - r.left) / r.width) * 100))); };
  return (
    <div ref={box} className="relative aspect-[3/2] w-full select-none overflow-hidden" style={{ ["--split" as string]: `${split}%` }}
      onPointerDown={(e) => { drag.current = true; (e.currentTarget as Element).setPointerCapture(e.pointerId); at(e.clientX); }}
      onPointerMove={(e) => drag.current && at(e.clientX)} onPointerUp={() => (drag.current = false)} onPointerCancel={() => (drag.current = false)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(`/assets/${before}`)} alt={`${alt}, before`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" draggable={false} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={asset(`/assets/${after}`)} alt={`${alt}, after`} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: "inset(0 0 0 var(--split))" }} loading="lazy" draggable={false} />
      <div className="absolute inset-y-0 w-[2px] bg-white shadow-[0_0_12px_var(--color-violet)]" style={{ left: "var(--split)" }} aria-hidden="true" />
      <span className="readout absolute left-3 top-3 bg-ink/80 px-2 py-1 text-txt">before</span>
      <span className="readout absolute right-3 top-3 bg-ink/80 px-2 py-1 text-txt">after</span>
      <input type="range" min={4} max={96} value={split} onChange={(e) => setSplit(Number(e.target.value))} aria-label={`${alt}: reveal before or after`} className="absolute inset-x-0 bottom-3 mx-auto w-1/2 accent-[var(--color-teal)] opacity-0 focus-visible:opacity-100" />
    </div>
  );
}
