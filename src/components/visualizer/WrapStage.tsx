"use client";
import { useEffect, useRef, useState } from "react";
import { createWrapRenderer, type WrapRenderer } from "@/engines/wrapEngine";
import { visualizer } from "@/lib/stores/visualizer";
import { bodyById } from "@/data/bodies";
import { filmById } from "@/data/films";
import { finishById } from "@/data/finishes";
import { asset } from "@/lib/basePath";
import { Lettering } from "./Lettering";
import { UploadZone } from "./UploadZone";

/** The booth's stage: the photo, the film on its shell, the lettering on top. Aspect follows the photo (portraits stay portraits). */
export function WrapStage() {
  const s = visualizer.use();
  const body = bodyById(s.body), film = filmById(s.film), finish = finishById(s.finish);
  const src = s.body === "custom" ? s.customUrl : body.src ? asset("/" + body.src) : null;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const renderer = useRef<WrapRenderer | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const light = useRef<{ x: number; y: number } | null>(null);
  const raf = useRef(0);
  const [aspect, setAspect] = useState(1.5);
  const [loaded, setLoaded] = useState(false);

  const schedule = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => {
      const img = imgRef.current, c = canvasRef.current;
      if (!img || !c || !renderer.current || !img.naturalWidth) return;
      renderer.current.render({ img, film, finish, light: light.current, mode: s.body === "custom" ? "custom" : "preset", mask: s.body === "custom" ? undefined : body.mask });
    });
  };

  useEffect(() => { if (canvasRef.current) renderer.current = createWrapRenderer(canvasRef.current); return () => renderer.current?.dispose(); }, []);
  useEffect(() => {
    if (!src) { setLoaded(false); return; }
    let alive = true;
    const img = new Image();
    img.onload = () => { if (!alive) return; imgRef.current = img; setAspect(Math.max(0.75, Math.min(2, img.naturalWidth / img.naturalHeight))); setLoaded(true); schedule(); };
    img.src = src;
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { schedule(); }, [film, finish, loaded, aspect]);
  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const ro = new ResizeObserver(() => schedule()); ro.observe(el);
    let last = 0;
    const onMove = (e: PointerEvent) => {
      if (!film.pearl) return;
      const now = performance.now(); if (now - last < 33) return; last = now;
      const r = el.getBoundingClientRect(); light.current = { x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }; schedule();
    };
    const onLeave = () => { light.current = null; schedule(); };
    el.addEventListener("pointermove", onMove); el.addEventListener("pointerleave", onLeave);
    return () => { ro.disconnect(); el.removeEventListener("pointermove", onMove); el.removeEventListener("pointerleave", onLeave); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [film.pearl]);

  const chip = s.body === "custom" ? "Upload mode: hue-wash only. White or neutral paint wraps cleanest; true cut lines need the shop's eye." : body.note ? body.note : film.pearl ? "Pearlescent: move your light (the mouse) across the shell." : "Studio preset: the film reads the body, not the backdrop.";
  return (
    <div ref={stageRef} className="panel relative w-full overflow-hidden bg-panel-2" style={{ aspectRatio: String(aspect) }} data-stage>
      {src ? <canvas ref={canvasRef} className="h-full w-full" aria-label={`${body.display} wrapped in ${film.name}, ${finish.name.toLowerCase()}`} data-layer="wrap" /> : <UploadZone big />}
      {src && <Lettering stageRef={stageRef} />}
      {src && <p className="readout absolute left-3 top-3 max-w-[70%] bg-ink/85 px-2 py-1 text-dim" data-mode-chip>{chip}</p>}
      {src && <UploadZone overlay />}
    </div>
  );
}
