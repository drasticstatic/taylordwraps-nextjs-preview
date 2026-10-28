// The film trail: slow movement lays translucent vinyl behind the cursor; a fast swipe squeegees it clean
// with a small "shhhk". Fades slowly so it never ghosts forever. Fine pointers only; honors reduced motion,
// the drawer's switch (html[data-trail]) and steps aside while a paint tool is in hand (html[data-tool]).
import { createFixedCanvas, type Host } from "./canvasHost";
import { Z } from "@/lib/z";

export function runFilmTrail(): () => void {
  let host: Host | null = null;
  let last: { x: number; y: number; t: number } | null = null;
  let hue = 0, lastShh = 0, fade = 0, idle = true;
  const shh = document.createElement("span");
  shh.textContent = "shhhk";
  Object.assign(shh.style, { position: "fixed", pointerEvents: "none", zIndex: String(Z.trail + 1), fontFamily: "var(--font-mono)", fontSize: "11px", letterSpacing: ".08em", color: "var(--color-teal)", opacity: "0", transition: "opacity .2s, transform .9s", transform: "translate(-50%,-50%)" });
  document.body.appendChild(shh);
  const html = document.documentElement;
  const enabled = () => html.dataset.trail !== "off" && (html.dataset.tool ?? "none") === "none" && html.dataset.motion !== "reduce" && !document.hidden && matchMedia("(pointer: fine)").matches;
  const colors = () => {
    const cs = getComputedStyle(html);
    return [cs.getPropertyValue("--color-violet"), cs.getPropertyValue("--color-magenta"), cs.getPropertyValue("--color-teal")].map((c) => c.trim() || "#a855f7");
  };
  function ensure() { if (!host) { host = createFixedCanvas(Z.trail, "trail"); host.canvas.style.mixBlendMode = html.classList.contains("dark") ? "screen" : "multiply"; } return host; }
  function onMove(e: PointerEvent) {
    if (e.pointerType !== "mouse" || !enabled()) { last = null; return; }
    const h = ensure();
    const now = performance.now();
    if (last) {
      const dx = e.clientX - last.x, dy = e.clientY - last.y, dt = Math.max(1, now - last.t);
      const speed = Math.hypot(dx, dy) / dt;
      const { ctx } = h;
      if (speed > 2) {
        ctx.save(); ctx.globalCompositeOperation = "destination-out"; ctx.lineCap = "round"; ctx.lineWidth = 110; ctx.strokeStyle = "rgba(0,0,0,1)";
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(e.clientX, e.clientY); ctx.stroke(); ctx.restore();
        if (now - lastShh > 1400) { lastShh = now; shh.style.left = `${e.clientX}px`; shh.style.top = `${e.clientY - 18}px`; shh.style.opacity = "1"; shh.style.transform = "translate(-50%,-50%) translateY(0)"; requestAnimationFrame(() => { shh.style.transform = "translate(-50%,-50%) translateY(-26px)"; shh.style.opacity = "0"; }); }
      } else {
        hue = (hue + 1) % 3;
        ctx.save(); ctx.globalAlpha = 0.16; ctx.lineCap = "round"; ctx.lineWidth = 26; ctx.strokeStyle = colors()[hue];
        ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(e.clientX, e.clientY); ctx.stroke();
        ctx.globalAlpha = 0.35; ctx.lineWidth = 4; ctx.strokeStyle = "#fff"; ctx.beginPath(); ctx.moveTo(last.x - 6, last.y - 6); ctx.lineTo(e.clientX - 6, e.clientY - 6); ctx.stroke();
        ctx.restore();
        idle = false;
      }
    }
    last = { x: e.clientX, y: e.clientY, t: now };
  }
  function cure() { if (host && !idle) { host.ctx.save(); host.ctx.globalCompositeOperation = "destination-out"; host.ctx.globalAlpha = 0.03; host.ctx.fillStyle = "#000"; host.ctx.fillRect(0, 0, host.w, host.h); host.ctx.restore(); } }
  const onTheme = new MutationObserver(() => { if (host) host.canvas.style.mixBlendMode = html.classList.contains("dark") ? "screen" : "multiply"; });
  onTheme.observe(html, { attributes: true, attributeFilter: ["class"] });
  window.addEventListener("pointermove", onMove, { passive: true });
  fade = window.setInterval(cure, 2000);
  return () => { window.removeEventListener("pointermove", onMove); clearInterval(fade); onTheme.disconnect(); shh.remove(); host?.dispose(); };
}
