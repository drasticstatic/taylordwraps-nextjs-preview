"use client";
import { useRef, useState } from "react";
import { UploadSimple, Info } from "@phosphor-icons/react";
import { setCustomImage } from "@/lib/stores/visualizer";
import { toast } from "@/lib/stores/toast";
import { ui } from "@/lib/stores/ui";
/** Drop a photo on the stage or pick one. Cancelling the picker never loops. */
export function UploadZone({ big, overlay }: { big?: boolean; overlay?: boolean }) {
  const input = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);
  const take = (f?: File | null) => { if (!f) return; if (!f.type.startsWith("image/")) { toast("That isn't an image."); return; } setCustomImage(f); toast("Ride loaded. Pick a film, then drag your lettering on."); };
  const dropProps = {
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); setOver(true); },
    onDragLeave: () => setOver(false),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files[0]); },
  };
  if (overlay) {
    return (
      <div {...dropProps} className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity ${over ? "pointer-events-auto bg-ink/70 opacity-100" : "opacity-0"}`} aria-hidden={!over}>
        <span className="readout bg-teal px-3 py-2 text-ink">Drop it. We&rsquo;ll wrap it.</span>
      </div>
    );
  }
  return (
    <div {...dropProps} className={`flex h-full w-full flex-col items-center justify-center gap-3 p-6 text-center ${over ? "bg-panel" : ""}`}>
      <input ref={input} id="wrap-file" type="file" accept="image/*" className="sr-only" onChange={(e) => { take(e.target.files?.[0]); e.target.value = ""; }} />
      <UploadSimple size={big ? 40 : 24} className="text-teal" />
      <p className="max-w-[32ch] text-dim">Drop a photo of your ride here, or</p>
      <div className="flex flex-wrap justify-center gap-2">
        <button onClick={() => input.current?.click()} className="peel">Upload a photo</button>
        <button onClick={() => ui.update((u) => ({ ...u, momOpen: true }))} className="peel ghost"><Info size={16} />Prep your photo first</button>
      </div>
      <p className="readout text-dim">White or neutral paint wraps cleanest.</p>
    </div>
  );
}
