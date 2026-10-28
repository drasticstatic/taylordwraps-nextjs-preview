// The toolbox: paint vinyl strokes on the page itself. Its own canvas (never shared with the trail).
// Paints only while a pointer is down and a tool is in hand; stroke groups close on pointerup; undo pops a
// group and replays; the squeegee's double-click runs a full-screen wiper sweep.
import { createFixedCanvas, overInteractive, type Host } from "./canvasHost";
import { Z } from "@/lib/z";
import type { Tool } from "@/lib/stores/toolbox";

interface Op { tool: Tool; film: string; x0: number; y0: number; x1: number; y1: number }
export interface PaintStudio { setTool(t: Tool): void; setFilm(c: string): void; undo(): void; clear(): void; sweep(): void; dispose(): void; readonly groups: number }

export function createPaintStudio(opts: { onSweep?: () => void } = {}): PaintStudio {
  const host: Host = createFixedCanvas(Z.paint, "paint");
  let tool: Tool = "none", film = "#a855f7", down = false, last: { x: number; y: number } | null = null;
  const groups: Op[][] = []; let current: Op[] | null = null;
  const MAX_GROUPS = 400;

  function seg(op: Op) {
    const { ctx } = host;
    ctx.save(); ctx.lineCap = "round"; ctx.lineJoin = "round";
    const line = (w: number, style: string, alpha = 1, comp: GlobalCompositeOperation = "source-over", blur = 0) => {
      ctx.globalCompositeOperation = comp; ctx.globalAlpha = alpha; ctx.lineWidth = w; ctx.strokeStyle = style; ctx.filter = blur ? `blur(${blur}px)` : "none";
      ctx.beginPath(); ctx.moveTo(op.x0, op.y0); ctx.lineTo(op.x1, op.y1); ctx.stroke();
    };
    switch (op.tool) {
      case "squeegee": line(110, "#000", 1, "destination-out"); line(3, "rgba(255,255,255,.5)"); break;
      case "eraser": line(60, "#000", 1, "destination-out"); break;
      case "blade": line(2, "rgba(255,255,255,.85)", 1, "source-over", 0); line(6, "rgba(255,255,255,.25)", 1, "source-over", 4); break;
      case "heat": line(90, "#000", 0.18, "destination-out"); line(112, "#000", 0.18, "destination-out"); line(134, "#000", 0.18, "destination-out"); break;
      case "film": line(30, op.film); line(5, "rgba(255,255,255,.35)"); break;
      default: break;
    }
    ctx.restore();
  }
  function replay() { host.ctx.clearRect(0, 0, host.w, host.h); for (const g of groups) for (const op of g) seg(op); }
  host.onResize(replay);

  function onDown(e: PointerEvent) {
    if (tool === "none" || overInteractive(e.target) || e.button !== 0) return;
    e.preventDefault(); window.getSelection?.()?.removeAllRanges();
    down = true; last = { x: e.clientX, y: e.clientY }; current = []; groups.push(current); if (groups.length > MAX_GROUPS) groups.shift();
  }
  function onMove(e: PointerEvent) {
    if (!down || !last || !current) return;
    const op: Op = { tool, film, x0: last.x, y0: last.y, x1: e.clientX, y1: e.clientY };
    current.push(op); seg(op); last = { x: e.clientX, y: e.clientY };
  }
  function onUp() { if (down) { down = false; last = null; if (current && current.length === 0) groups.pop(); current = null; } }
  function onDbl(e: MouseEvent) { if (tool === "squeegee" && !overInteractive(e.target)) sweep(); }
  function sweep() {
    const blade = document.createElement("div");
    Object.assign(blade.style, { position: "fixed", top: "0", bottom: "0", left: "-6px", width: "6px", background: "var(--color-teal)", boxShadow: "0 0 24px var(--color-teal)", zIndex: String(Z.paint + 1), pointerEvents: "none" });
    document.body.appendChild(blade);
    const t0 = performance.now(), ms = 750; let lastX = 0;
    const step = (now: number) => {
      const k = Math.min(1, (now - t0) / ms); const x = k * host.w;
      blade.style.left = `${x - 6}px`;
      host.ctx.save(); host.ctx.globalCompositeOperation = "destination-out"; host.ctx.fillStyle = "#000"; host.ctx.fillRect(lastX, 0, x - lastX + 2, host.h); host.ctx.restore(); lastX = x;
      if (k < 1) requestAnimationFrame(step); else { blade.remove(); groups.length = 0; opts.onSweep?.(); }
    };
    requestAnimationFrame(step);
  }
  window.addEventListener("pointerdown", onDown); window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerup", onUp); window.addEventListener("pointercancel", onUp); window.addEventListener("blur", onUp); window.addEventListener("dblclick", onDbl);
  return {
    setTool: (t) => { tool = t; }, setFilm: (c) => { film = c; },
    undo: () => { groups.pop(); replay(); }, clear: () => { groups.length = 0; replay(); }, sweep,
    get groups() { return groups.length; },
    dispose: () => { window.removeEventListener("pointerdown", onDown); window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp); window.removeEventListener("blur", onUp); window.removeEventListener("dblclick", onDbl); host.dispose(); },
  };
}
