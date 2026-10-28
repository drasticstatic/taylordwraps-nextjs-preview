"use client";
import { useRef } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import type { Level as LevelT } from "@/data/levels";
import { Level } from "@/components/chrome/Level";
import { RECEIPTS } from "@/data/receipts";
import { BeforeAfter } from "./BeforeAfter";
import { OriginHashChip } from "./OriginHashChip";

/** Case studies as transformations. Two with photos and sliders; four as spec sheets until Taylor's originals arrive. */
export function Receipts({ level }: { level: LevelT }) {
  const rail = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => rail.current?.scrollBy({ left: dir * Math.min(580, rail.current.clientWidth * 0.8), behavior: "smooth" });
  return (
    <Level level={level} bleed>
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 sm:px-6">
        <p className="lede -mt-2">Real trucks, real rivets. Drag the line across each one.</p>
        <div className="flex gap-2">
          <button onClick={() => scroll(-1)} className="panel p-2 hover:bg-panel-2" aria-label="Scroll the receipts left"><CaretLeft size={20} /></button>
          <button onClick={() => scroll(1)} className="panel p-2 hover:bg-panel-2" aria-label="Scroll the receipts right"><CaretRight size={20} /></button>
        </div>
      </div>
      <div ref={rail} className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-16 sm:px-6 [scrollbar-width:thin]" style={{ paddingLeft: "max(1rem, calc((100vw - 72rem) / 2 + 1rem))", scrollPaddingLeft: "max(1rem, calc((100vw - 72rem) / 2 + 1rem))" }}>
        {RECEIPTS.map((r) => (
          <article key={r.slug} className="panel w-[min(86vw,36rem)] shrink-0 snap-start">
            {r.before && r.after ? <BeforeAfter before={r.before} after={r.after} alt={r.title} /> : (
              <div className="primer flex aspect-[3/2] items-end p-4"><span className="readout text-dim">Case file. Photos arrive with the shop&rsquo;s originals.</span></div>
            )}
            <div className="grid gap-3 p-5">
              <div className="flex items-baseline justify-between gap-4"><h3 className="text-xl font-semibold">{r.title}</h3><span className="readout shrink-0 text-dim">{r.tag}</span></div>
              <p className="text-dim">{r.copy}</p>
              <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-sm">
                <dt className="text-dim">Film</dt><dd>{r.film}</dd>
                <dt className="text-dim">Scope</dt><dd>{r.scope}</dd>
                <dt className="text-dim">Origin</dt><dd><OriginHashChip file={r.hashFile} /></dd>
              </dl>
            </div>
          </article>
        ))}
      </div>
    </Level>
  );
}
