"use client";
import { CheckCircle, Hand, ArrowsOutCardinal, Cube } from "@phosphor-icons/react";
import { FILMS } from "@/data/films";
interface Props {
  progress: number;           // 0..1
  onProgress?: (p: number) => void;
  filmId: string;
  tier: "webgl" | "peel2d" | "still";
  body?: "van" | "drums";
  onBody?: (b: "van" | "drums") => void;
  coarse?: boolean;
  can3d?: boolean;
  on3d?: () => void;
}
/** The readouts over the stage. The slider is the keyboard and touch way to wrap; dragging the van is the mouse way. */
export function HeroHud({ progress, onProgress, filmId, tier, body = "van", onBody, coarse, can3d, on3d }: Props) {
  const pct = Math.round(progress * 100);
  const done = progress >= 0.985;
  const film = FILMS.find((f) => f.id === filmId) ?? FILMS[0];
  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-3 flex flex-wrap items-end justify-between gap-3">
      <div className="pointer-events-auto grid gap-2">
        <div className={`readout flex items-center gap-2 px-3 py-2 ${done ? "bg-teal text-ink" : "bg-ink/95 text-txt"}`} aria-live="polite">
          {done ? <><CheckCircle size={16} weight="fill" />Wrapped. Get Taylor&rsquo;d.</> : <><Hand size={16} />{coarse || tier === "still" ? "Slide to wrap" : "Drag the van to wrap"} {pct}%</>}
        </div>
        {tier !== "still" && (
          <label className="readout flex items-center gap-3 bg-ink/95 px-3 py-2 text-dim">
            <span className="sr-only">Wrap progress</span>
            <input type="range" min={0} max={100} value={pct} onChange={(e) => onProgress?.(Number(e.target.value) / 100)} aria-label="Wrap progress" className="w-36 accent-[var(--color-teal)]" />
            <span className="tabular-nums">{pct}%</span>
          </label>
        )}
      </div>
      <div className="pointer-events-auto flex flex-wrap items-center gap-2">
        {tier === "webgl" && onBody && (
          <div role="group" aria-label="Body" className="readout flex bg-ink/95">
            {(["van", "drums"] as const).map((b) => (
              <button key={b} aria-pressed={body === b} onClick={() => onBody(b)} className={`px-3 py-2 ${body === b ? "bg-txt text-ink" : "text-dim hover:text-txt"}`}>{b === "van" ? "Van" : "Drum kit"}</button>
            ))}
          </div>
        )}
        {can3d && on3d && <button onClick={on3d} className="readout flex items-center gap-2 bg-ink/95 px-3 py-2 text-txt hover:bg-panel-2"><Cube size={14} />Open the 3D lab</button>}
        <div className="readout bg-ink/95 px-3 py-2 text-dim">Film: <span className="text-txt">{film.name}</span></div>
        {tier === "webgl" && <div className="readout hidden items-center gap-2 bg-ink/95 px-3 py-2 text-dim sm:flex"><ArrowsOutCardinal size={14} />{coarse ? "Two fingers to orbit" : "Drag empty space to orbit"}</div>}
      </div>
    </div>
  );
}
