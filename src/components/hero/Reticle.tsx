"use client";
import { useEffect, useRef, useState } from "react";
const TAGS = ["film: loaded", "panel: h2, edge: wrapped", "heat: 104°F, squeegee: ready", "psyclone: pearl shift on", "cut path: clean, zero bubbles", "post-heat: edges sealed"];
/** The design-lab crosshair over the stage. Reads the pointer; the readouts cycle on a fixed clock, never randomly. */
export function Reticle({ active }: { active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [tag, setTag] = useState(0);
  useEffect(() => {
    if (!active) return;
    const el = ref.current?.parentElement; if (!el) return;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--rx", `${(x * 100).toFixed(2)}%`); el.style.setProperty("--ry", `${(y * 100).toFixed(2)}%`);
      el.style.setProperty("--rxv", x.toFixed(2)); el.style.setProperty("--ryv", y.toFixed(2));
    };
    el.addEventListener("pointermove", onMove);
    const t = setInterval(() => setTag((i) => (i + 1) % TAGS.length), 1600);
    return () => { el.removeEventListener("pointermove", onMove); clearInterval(t); };
  }, [active]);
  if (!active) return null;
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-y-0 w-px bg-teal/40" style={{ left: "var(--rx, 50%)" }} />
      <div className="absolute inset-x-0 h-px bg-teal/40" style={{ top: "var(--ry, 50%)" }} />
      <div className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-teal" style={{ left: "var(--rx, 50%)", top: "var(--ry, 50%)" }} />
      <div className="readout absolute left-3 top-3 bg-ink/80 px-2 py-1 text-teal">x <span className="text-txt">{" "}</span>{TAGS[tag]}</div>
    </div>
  );
}
