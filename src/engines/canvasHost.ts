// A fixed, pointer-transparent canvas over the page, sized to the viewport at a capped DPR.
export interface Host { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; dpr: number; w: number; h: number; dispose(): void; onResize(fn: () => void): void }
export function createFixedCanvas(z: number, layer: string): Host {
  const canvas = document.createElement("canvas");
  canvas.dataset.layer = layer;
  canvas.setAttribute("aria-hidden", "true");
  Object.assign(canvas.style, { position: "fixed", inset: "0", width: "100%", height: "100%", pointerEvents: "none", zIndex: String(z) });
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d")!;
  const host: Host = { canvas, ctx, dpr: 1, w: 0, h: 0, dispose, onResize };
  const subs: (() => void)[] = [];
  function fit() {
    host.dpr = Math.min(1.5, window.devicePixelRatio || 1);
    host.w = window.innerWidth; host.h = window.innerHeight;
    canvas.width = Math.round(host.w * host.dpr); canvas.height = Math.round(host.h * host.dpr);
    ctx.setTransform(host.dpr, 0, 0, host.dpr, 0, 0);
    subs.forEach((f) => f());
  }
  function onResize(fn: () => void) { subs.push(fn); }
  function dispose() { window.removeEventListener("resize", fit); canvas.remove(); }
  window.addEventListener("resize", fit);
  fit();
  return host;
}
export const INTERACTIVE = "a,button,input,textarea,select,label,[role=toolbar],[role=dialog],[role=slider],canvas[data-engine],[data-stage]";
export function overInteractive(target: EventTarget | null): boolean {
  return !!(target as Element | null)?.closest?.(INTERACTIVE);
}
export function readAccent(): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue("--color-violet").trim();
  return v || "#a855f7";
}
