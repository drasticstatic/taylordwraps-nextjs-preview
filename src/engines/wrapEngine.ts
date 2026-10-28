// The true-wrap compositor: film on the paint, not the backdrop.
// 1. cover-crop the photo (finish filter on this draw only)  2. per-pixel mask of the white/neutral shell, cached per image+size
// 3. feather the cut line  4. gradient film from the film's absolute hue/sat, clipped to the mask
// 5. composite with `color` then `multiply` so creases and shadows survive  6. pearl films: a specular that follows the light
import type { Film } from "@/data/films";
import type { Finish } from "@/data/finishes";

export interface MaskTune { lumA: number; lumB: number; chromaK: number; box?: [number, number, number, number] }
export interface WrapInput { img: HTMLImageElement; film: Film; finish: Finish; light: { x: number; y: number } | null; mode: "preset" | "custom"; mask?: MaskTune }
const CUSTOM_TUNE: MaskTune = { lumA: 0.22, lumB: 0.48, chromaK: 2.2 };
export interface WrapRenderer { render(input: WrapInput): void; dispose(): void }

function cover(W: number, H: number, iw: number, ih: number) {
  const s = Math.max(W / iw, H / ih); const w = iw * s, h = ih * s;
  return { x: (W - w) / 2, y: (H - h) / 2, w, h };
}
const smooth = (v: number, a: number, b: number) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

export function createWrapRenderer(canvas: HTMLCanvasElement): WrapRenderer {
  let maskKey = "";
  let mask: HTMLCanvasElement | null = null;
  const film = document.createElement("canvas");

  function buildMask(img: HTMLImageElement, cw: number, ch: number, tune: MaskTune) {
    const raw = document.createElement("canvas"); raw.width = cw; raw.height = ch;
    const rx = raw.getContext("2d", { willReadFrequently: true })!;
    const c = cover(cw, ch, img.naturalWidth, img.naturalHeight);
    rx.drawImage(img, c.x, c.y, c.w, c.h);
    const id = rx.getImageData(0, 0, cw, ch), q = id.data;
    // presets have defined shells; uploads get a looser wash so neutral paint still catches film.
    // The focus box keeps film off sky, walls and trees at the frame edges, with a soft 12% feather.
    const { chromaK, lumA, lumB } = tune;
    const box = tune.box ?? [0, 0, 1, 1];
    const fx0 = box[0] * cw, fy0 = box[1] * ch, fx1 = box[2] * cw, fy1 = box[3] * ch, feather = 0.12 * Math.min(cw, ch);
    for (let i = 0; i < q.length; i += 4) {
      const px = (i >> 2) % cw, py = (i >> 2) / cw | 0;
      const inX = Math.min(px - fx0, fx1 - px), inY = Math.min(py - fy0, fy1 - py);
      const boxW = Math.max(0, Math.min(1, Math.min(inX, inY) / feather));
      if (boxW === 0) { q[i + 3] = 0; continue; }
      const r = q[i] / 255, g = q[i + 1] / 255, b = q[i + 2] / 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      let w = (1 - Math.min(1, (mx - mn) * chromaK)) * smooth(lum, lumA, lumB) * boxW;
      if (lum < 0.15) w = 0;
      q[i] = q[i + 1] = q[i + 2] = 255; q[i + 3] = (w * 255) | 0;
    }
    rx.putImageData(id, 0, 0);
    const soft = document.createElement("canvas"); soft.width = cw; soft.height = ch;
    const sx = soft.getContext("2d")!;
    sx.filter = `blur(${Math.max(2, cw / 300)}px)`; sx.drawImage(raw, 0, 0);
    return soft;
  }

  return {
    render({ img, film: f, finish, light, mode, mask: tune }) {
      const t = tune ?? CUSTOM_TUNE;
      if (!img.naturalWidth) return;
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      let cw = Math.round(r.width * dpr), ch = Math.round(r.height * dpr);
      if (cw > 1400) { ch = Math.round(ch * 1400 / cw); cw = 1400; }
      if (cw < 2 || ch < 2) return;
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; }
      const cx = canvas.getContext("2d")!;
      const c = cover(cw, ch, img.naturalWidth, img.naturalHeight);
      cx.clearRect(0, 0, cw, ch);
      cx.save(); cx.filter = finish.canvasFilter; cx.drawImage(img, c.x, c.y, c.w, c.h); cx.restore();

      const key = `${img.src}|${cw}x${ch}|${mode}|${t.lumA},${t.lumB},${t.chromaK},${(t.box ?? []).join(",")}`;
      if (key !== maskKey || !mask) { mask = buildMask(img, cw, ch, t); maskKey = key; }

      film.width = cw; film.height = ch;
      const fx = film.getContext("2d")!;
      const hue = f.hue, sat = f.sat, L = f.light;
      const grad = fx.createLinearGradient(0, 0, cw, ch);
      grad.addColorStop(0, `hsl(${hue} ${sat}% ${L}%)`);
      grad.addColorStop(0.45, `hsl(${(hue + f.spread[0]) % 360} ${sat}% ${f.pearl ? L - 16 : L - 12}%)`);
      grad.addColorStop(1, `hsl(${(hue + f.spread[1]) % 360} ${sat}% ${L - 6}%)`);
      fx.globalCompositeOperation = "source-over"; fx.globalAlpha = 1;
      fx.fillStyle = grad; fx.fillRect(0, 0, cw, ch);
      // a faint weave so it reads as material, not a color fill
      fx.globalAlpha = 0.1; fx.strokeStyle = "#000"; fx.lineWidth = Math.max(1, cw / 500); fx.beginPath();
      for (let x = -ch; x < cw + ch; x += Math.max(7, cw / 160)) { fx.moveTo(x, 0); fx.lineTo(x + ch, ch); }
      fx.stroke(); fx.globalAlpha = 1;
      fx.globalCompositeOperation = "destination-in"; fx.drawImage(mask, 0, 0); fx.globalCompositeOperation = "source-over";

      cx.save();
      cx.globalCompositeOperation = "color"; cx.drawImage(film, 0, 0);
      cx.globalCompositeOperation = "multiply"; cx.globalAlpha = 0.3; cx.drawImage(film, 0, 0);
      cx.restore();

      if (f.pearl && light) {
        const lx = light.x * cw, ly = light.y * ch;
        cx.save(); cx.globalCompositeOperation = "screen";
        const sh = cx.createRadialGradient(lx, ly, 0, lx, ly, cw * 0.45);
        sh.addColorStop(0, "rgba(255,255,255,.5)"); sh.addColorStop(0.35, "rgba(255,255,255,.12)"); sh.addColorStop(1, "rgba(255,255,255,0)");
        cx.fillStyle = sh;
        // only on the shell: clip by the mask
        const clip = document.createElement("canvas"); clip.width = cw; clip.height = ch;
        const kx = clip.getContext("2d")!; kx.fillStyle = sh; kx.fillRect(0, 0, cw, ch);
        kx.globalCompositeOperation = "destination-in"; kx.drawImage(mask, 0, 0);
        cx.drawImage(clip, 0, 0);
        cx.restore();
      }
    },
    dispose() { mask = null; maskKey = ""; },
  };
}
