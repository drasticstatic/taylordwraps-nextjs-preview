"use client";
import clsx from "clsx";
import { BODIES } from "@/data/bodies";
import { FILMS, filmCss } from "@/data/films";
import { FINISHES } from "@/data/finishes";
import { visualizer } from "@/lib/stores/visualizer";

const GROUPS: Record<string, string> = { road: "Road", work: "Work", toys: "Toys", water: "Water", stage: "Stage", yours: "Yours" };

export function BodyPicker() {
  const s = visualizer.use();
  return (
    <div role="group" aria-label="Body">
      <div className="flex items-baseline justify-between"><h3 className="font-semibold">Body</h3><span className="text-sm text-dim">{BODIES.find((b) => b.id === s.body)?.display}</span></div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {BODIES.map((b) => (
          <button key={b.id} aria-pressed={s.body === b.id} title={`${GROUPS[b.group]}: ${b.display}`} onClick={() => { if (b.id === "custom" && !s.customUrl) { document.getElementById("wrap-file")?.click(); return; } visualizer.set({ ...s, body: b.id, textPos: b.anchor }); }}
            className={clsx("px-3 py-1.5 text-sm font-semibold transition-colors", s.body === b.id ? "bg-txt text-ink" : "bg-panel-2 text-dim hover:text-txt")}>
            {b.label}
          </button>
        ))}
      </div>
    </div>
  );
}
export function FilmSwatches() {
  const s = visualizer.use();
  return (
    <div role="group" aria-label="Film">
      <div className="flex items-baseline justify-between"><h3 className="font-semibold">Film</h3><span className="text-sm text-dim">{FILMS.find((f) => f.id === s.film)?.name}</span></div>
      <div className="mt-2 flex flex-wrap gap-2">
        {FILMS.map((f) => (
          <button key={f.id} aria-pressed={s.film === f.id} aria-label={`Film: ${f.name}`} title={`${f.name} (${f.brand})`} onClick={() => visualizer.set({ ...s, film: f.id })}
            className={clsx("h-9 w-12 transition-transform", s.film === f.id ? "scale-110 shadow-[0_0_0_2px_var(--ink),0_0_0_4px_var(--color-teal)]" : "hover:scale-105")} style={{ background: filmCss(f), clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 0 100%)" }} />
        ))}
      </div>
    </div>
  );
}
export function FinishPicker() {
  const s = visualizer.use();
  return (
    <div role="group" aria-label="Finish">
      <div className="flex items-baseline justify-between"><h3 className="font-semibold">Finish</h3><span className="text-sm text-dim">{FINISHES.find((f) => f.id === s.finish)?.note}</span></div>
      <div className="mt-2 inline-flex p-1 shadow-[inset_0_0_0_1px_var(--line)]">
        {FINISHES.map((f) => (
          <button key={f.id} aria-pressed={s.finish === f.id} onClick={() => visualizer.set({ ...s, finish: f.id })} className={clsx("px-4 py-1.5 text-sm font-semibold", s.finish === f.id ? "bg-txt text-ink" : "text-dim hover:text-txt")}>{f.name}</button>
        ))}
      </div>
    </div>
  );
}
export function LetteringInput() {
  const s = visualizer.use();
  return (
    <div>
      <label htmlFor="lettering" className="flex items-baseline justify-between"><span className="font-semibold">Your lettering</span><span className="text-sm text-dim">up to 18 characters</span></label>
      <input id="lettering" value={s.text ?? ""} maxLength={18} placeholder="MOM" onChange={(e) => visualizer.set({ ...s, text: e.target.value })} className="mt-2 w-full bg-panel-2 px-3 py-2 font-semibold uppercase placeholder:text-dim/60 focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-teal)]" />
      <p className="mt-1 text-sm text-dim">It appears on the panel as you type. Drag it onto the ride, or move it with the arrow keys.</p>
    </div>
  );
}
