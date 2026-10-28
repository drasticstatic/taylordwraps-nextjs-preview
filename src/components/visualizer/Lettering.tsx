"use client";
import { useEffect, useRef, useState, type RefObject } from "react";
import { visualizer } from "@/lib/stores/visualizer";
import { bodyById } from "@/data/bodies";
/** Your lettering, laid on the panel. Drag it, or move it with the arrow keys. Position is saved as fractions of the stage. */
export function Lettering({ stageRef }: { stageRef: RefObject<HTMLDivElement | null> }) {
  const s = visualizer.use();
  const body = bodyById(s.body);
  const text = (s.text ?? "").trim();
  const drag = useRef<{ dx: number; dy: number } | null>(null);
  const [hint, setHint] = useState(false);
  const prevText = useRef(text);
  useEffect(() => { if (text && !prevText.current) { setHint(true); const t = setTimeout(() => setHint(false), 2600); return () => clearTimeout(t); } prevText.current = text; }, [text]);
  if (!text) return null;
  const pos = s.textPos ?? body.anchor;
  const setPos = (x: number, y: number) => visualizer.set({ ...visualizer.get(), textPos: { x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) } });
  return (
    <>
      <div
        role="img"
        aria-label={`Lettering: ${text}. Drag to move, or use the arrow keys.`}
        tabIndex={0}
        className="display absolute cursor-grab select-none text-[clamp(1.4rem,6cqw,3.2rem)] uppercase text-white [text-shadow:0_2px_0_rgba(0,0,0,.45),0_0_18px_rgba(0,0,0,.35)] [-webkit-text-stroke:1px_rgba(0,0,0,.35)] active:cursor-grabbing"
        style={{ left: `${pos.x * 100}%`, top: `${pos.y * 100}%`, transform: `translate(-50%,-50%) skewX(${body.skewDeg}deg)` }}
        onPointerDown={(e) => { const r = stageRef.current!.getBoundingClientRect(); drag.current = { dx: e.clientX - r.left - pos.x * r.width, dy: e.clientY - r.top - pos.y * r.height }; (e.target as Element).setPointerCapture(e.pointerId); }}
        onPointerMove={(e) => { if (!drag.current) return; const r = stageRef.current!.getBoundingClientRect(); setPos((e.clientX - r.left - drag.current.dx) / r.width, (e.clientY - r.top - drag.current.dy) / r.height); }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
        onKeyDown={(e) => { const d = e.shiftKey ? 0.05 : 0.01; if (e.key === "ArrowLeft") setPos(pos.x - d, pos.y); else if (e.key === "ArrowRight") setPos(pos.x + d, pos.y); else if (e.key === "ArrowUp") setPos(pos.x, pos.y - d); else if (e.key === "ArrowDown") setPos(pos.x, pos.y + d); else return; e.preventDefault(); }}
      >
        {text}
      </div>
      {hint && <div className="readout pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 bg-teal px-3 py-1 text-ink">Drag it onto the ride</div>}
    </>
  );
}
