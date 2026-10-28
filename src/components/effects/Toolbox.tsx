"use client";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Broom, Eraser, Knife, Fire, ArrowUUpLeft, Trash, Toolbox as ToolboxIcon, X, PaintBrush } from "@phosphor-icons/react";
import { toolbox, type Tool } from "@/lib/stores/toolbox";
import { createPaintStudio, type PaintStudio } from "@/engines/paintEngine";
import { toast } from "@/lib/stores/toast";
import { useCoarsePointer } from "@/lib/media";
import { Z } from "@/lib/z";

const TOOLS: { id: Tool; label: string; hint: string; Icon: typeof Broom }[] = [
  { id: "squeegee", label: "Squeegee", hint: "Wipes film clean. Double-click for a full sweep.", Icon: Broom },
  { id: "eraser", label: "Eraser", hint: "Lifts a patch of film.", Icon: Eraser },
  { id: "blade", label: "Blade", hint: "Scores a cut line.", Icon: Knife },
  { id: "heat", label: "Heat gun", hint: "Softens and feathers the edge.", Icon: Fire },
];
const SWATCHES = ["#a855f7", "#ec4899", "#2dd4bf", "#fbbf24", "#3b82f6", "#22c55e", "#e5e7eb", "#111118"];

/** The vinyl toolbox. A left rail on desktop, a floating button and bottom sheet on phones. Paints on the page itself. */
export function Toolbox() {
  const tb = toolbox.use();
  const coarse = useCoarsePointer();
  const [sheet, setSheet] = useState(false);
  const studio = useRef<PaintStudio | null>(null);
  useEffect(() => {
    if (!tb.shown) return;
    const s = createPaintStudio({ onSweep: () => toast("Shhhk. Clean.") });
    studio.current = s;
    return () => { s.dispose(); studio.current = null; };
  }, [tb.shown]);
  useEffect(() => { studio.current?.setTool(tb.shown ? tb.tool : "none"); studio.current?.setFilm(tb.film); }, [tb]);
  if (!tb.shown) return null;
  const pick = (tool: Tool) => toolbox.set({ ...tb, tool: tb.tool === tool ? "none" : tool });
  const body = (
    <div role="toolbar" aria-label="Vinyl toolbox" aria-orientation={coarse ? "horizontal" : "vertical"} className={clsx("flex gap-1", coarse ? "flex-row flex-wrap items-center" : "flex-col items-stretch")}>
      {TOOLS.map(({ id, label, hint, Icon }) => (
        <button key={id} aria-pressed={tb.tool === id} title={hint} aria-label={label} onClick={() => pick(id)} className={clsx("flex items-center gap-2 px-3 py-2 text-sm font-semibold", tb.tool === id ? "bg-txt text-ink" : "text-dim hover:text-txt")}><Icon size={20} /><span className={coarse ? "sr-only" : ""}>{label}</span></button>
      ))}
      <div className={clsx("flex gap-1", coarse ? "" : "mt-2 flex-wrap")} role="group" aria-label="Film swatches">
        {SWATCHES.map((c) => (
          <button key={c} aria-pressed={tb.tool === "film" && tb.film === c} aria-label={`Film ${c}`} onClick={() => toolbox.set({ ...tb, tool: "film", film: c })} className={clsx("h-7 w-7", tb.tool === "film" && tb.film === c ? "shadow-[0_0_0_2px_var(--ink),0_0_0_4px_var(--color-teal)]" : "")} style={{ background: c, clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%)" }} />
        ))}
      </div>
      <div className={clsx("flex gap-1", coarse ? "" : "mt-2 border-t border-line pt-2")}>
        <button onClick={() => studio.current?.undo()} className="flex items-center gap-2 px-3 py-2 text-sm text-dim hover:text-txt" aria-label="Undo last stroke"><ArrowUUpLeft size={18} /></button>
        <button onClick={() => studio.current?.clear()} className="flex items-center gap-2 px-3 py-2 text-sm text-dim hover:text-txt" aria-label="Clear the canvas"><Trash size={18} /></button>
        <button onClick={() => toolbox.set({ ...tb, shown: false })} className="flex items-center gap-2 px-3 py-2 text-sm text-dim hover:text-txt" aria-label="Close the toolbox"><X size={18} /></button>
      </div>
    </div>
  );
  if (coarse) {
    return (
      <>
        <button onClick={() => setSheet((v) => !v)} className="peel fixed bottom-16 right-4 px-3 py-3 no-print" style={{ zIndex: Z.toolbox }} aria-expanded={sheet} aria-label="Open the toolbox"><ToolboxIcon size={22} /></button>
        {sheet && <div className="panel fixed inset-x-2 bottom-28 p-3 no-print" style={{ zIndex: Z.toolbox }}>{body}</div>}
      </>
    );
  }
  return (
    <aside className="panel fixed left-3 top-1/2 hidden -translate-y-1/2 p-2 no-print min-[900px]:block" style={{ zIndex: Z.toolbox }}>
      <div className="readout mb-2 flex items-center gap-2 px-2 text-dim"><PaintBrush size={14} />toolbox</div>
      {body}
    </aside>
  );
}
