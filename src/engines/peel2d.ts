// The original Peel, as an engine: two photos, a wavy vinyl edge that sweeps across, a glow on the edge.
// Framework-free; the component owns pointer mapping and the HUD.
export interface Peel2D { set(p: number): void; get(): number; autowrap(): void; dispose(): void }

export function runPeel2D(canvas: HTMLCanvasElement, beforeSrc: string, afterSrc: string, opts: { onProgress?: (p: number) => void; onReady?: () => void; reduced?: boolean; edge?: string } = {}): Peel2D {
  const ctx = canvas.getContext("2d");
  let p = 0, raf = 0, t0 = 0, anim: null | { from: number; to: number; ms: number } = null, disposed = false;
  const before = new Image(), after = new Image();
  let loaded = 0;
  const ready = () => { loaded++; if (loaded === 2) { fit(); draw(); opts.onReady?.(); } };
  before.onload = ready; after.onload = ready;
  before.src = beforeSrc; after.src = afterSrc;

  function fit() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.round(r.width * dpr));
    canvas.height = Math.max(1, Math.round(r.height * dpr));
  }
  function cover(img: HTMLImageElement) {
    const W = canvas.width, H = canvas.height, s = Math.max(W / img.naturalWidth, H / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    return { x: (W - w) / 2, y: (H - h) / 2, w, h };
  }
  function edgeX(y: number, W: number, H: number) {
    const base = -W * 0.08 + p * W * 1.16;
    return base + Math.sin(y / H * 6.5 + p * 4) * W * 0.012 + Math.sin(y / H * 19) * W * 0.004;
  }
  function draw() {
    if (!ctx || loaded < 2) return;
    const W = canvas.width, H = canvas.height;
    ctx.clearRect(0, 0, W, H);
    const b = cover(before), a = cover(after);
    ctx.drawImage(before, b.x, b.y, b.w, b.h);
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, 0);
    const steps = 28;
    for (let i = 0; i <= steps; i++) { const y = (H * i) / steps; ctx.lineTo(edgeX(y, W, H), y); }
    ctx.lineTo(0, H); ctx.closePath(); ctx.clip();
    ctx.drawImage(after, a.x, a.y, a.w, a.h);
    ctx.restore();
    if (p > 0.005 && p < 0.995) {
      ctx.save();
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) { const y = (H * i) / steps; const x = edgeX(y, W, H); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.lineWidth = Math.max(2, W / 400);
      ctx.strokeStyle = "rgba(255,255,255,.9)";
      ctx.shadowColor = opts.edge ?? "#a855f7"; ctx.shadowBlur = W / 40;
      ctx.stroke();
      ctx.restore();
    }
  }
  function tick(now: number) {
    if (disposed) return;
    if (anim) {
      if (!t0) t0 = now;
      const k = Math.min(1, (now - t0) / anim.ms);
      const e = 1 - Math.pow(1 - k, 3);
      p = anim.from + (anim.to - anim.from) * e;
      draw(); opts.onProgress?.(p);
      if (k < 1) { raf = requestAnimationFrame(tick); return; }
      anim = null; t0 = 0;
    }
  }
  const ro = new ResizeObserver(() => { fit(); draw(); });
  ro.observe(canvas);
  return {
    set(v) { anim = null; p = Math.max(0, Math.min(1, v)); draw(); opts.onProgress?.(p); },
    get: () => p,
    autowrap() {
      if (opts.reduced) { this.set(1); return; }
      anim = { from: 0.12, to: 0.99, ms: 2600 }; t0 = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(tick);
    },
    dispose() { disposed = true; cancelAnimationFrame(raf); ro.disconnect(); },
  };
}
