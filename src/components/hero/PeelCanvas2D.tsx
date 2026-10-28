"use client";
import { useEffect, useRef } from "react";
import { runPeel2D, type Peel2D } from "@/engines/peel2d";
import { asset } from "@/lib/basePath";
import { markReady } from "@/lib/stores/assetReady";
interface Props { progress: number; onProgress: (p: number) => void; reduced: boolean; autowrap: boolean }
/** The 2D tier: the original peel on the van photos. Also the fallback when WebGL is missing. */
export function PeelCanvas2D({ progress, onProgress, reduced, autowrap }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);
  const engine = useRef<Peel2D | null>(null);
  const drag = useRef(false);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const e = runPeel2D(c, asset("/assets/van_before.jpg"), asset("/assets/van_after.jpg"), {
      reduced, onProgress, onReady: () => { markReady("hero"); if (autowrap) e.autowrap(); },
    });
    engine.current = e;
    return () => { e.dispose(); engine.current = null; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => { const e = engine.current; if (e && Math.abs(e.get() - progress) > 0.002) e.set(progress); }, [progress]);
  const map = (clientX: number) => { const r = ref.current!.getBoundingClientRect(); engine.current?.set((clientX - r.left) / r.width); };
  return (
    <canvas
      ref={ref}
      data-engine="peel2d"
      className="h-full w-full touch-pan-y cursor-ew-resize"
      aria-label="Drag across the van to wrap it"
      onPointerDown={(e) => { if (e.pointerType === "touch") return; drag.current = true; (e.target as Element).setPointerCapture(e.pointerId); map(e.clientX); }}
      onPointerMove={(e) => { if (drag.current) map(e.clientX); }}
      onPointerUp={() => (drag.current = false)}
      onPointerCancel={() => (drag.current = false)}
    />
  );
}
