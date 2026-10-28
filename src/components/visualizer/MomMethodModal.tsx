"use client";
import { useState } from "react";
import { ModalShell } from "@/components/ui/ModalShell";
import { ui } from "@/lib/stores/ui";
import { asset } from "@/lib/basePath";
import { setCustomImage } from "@/lib/stores/visualizer";
import { toast } from "@/lib/stores/toast";

const PROMPT = "Repaint only the body shell of this vehicle a clean flat white, keeping every edge, panel line, shadow and reflection exactly where it is. Do not touch the wheels, tires, glass, lights, chrome, suspension, background or lighting. No logos, no text, no decals. Output the same photo, same angle, same size.";

/** The Mom Method: a real RC truck → its prepped white shell → a prompt you can hand your own AI tool → upload. */
export function MomMethodModal() {
  const { momOpen } = ui.use();
  const close = () => ui.update((u) => ({ ...u, momOpen: false }));
  const [copied, setCopied] = useState(false);
  return (
    <ModalShell open={!!momOpen} onClose={close} title="The Mom Method" wide>
      <p className="mt-2 max-w-[60ch] text-dim">How to get a wrap-ready photo, the way Mom&rsquo;s truck did it. The booth lays film on white and neutral paint; everything else stays itself.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {[["rc.jpg", "Mom's build, the real thing"], ["rc-white.jpg", "Prepped shell, what uploads love"]].map(([f, cap]) => (
          <figure key={f} className="panel overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset(`/assets/${f}`)} alt={cap} className="aspect-[3/4] w-full object-cover" loading="lazy" />
            <figcaption className="readout p-3 text-dim">{cap}</figcaption>
          </figure>
        ))}
      </div>
      <ol className="mt-6 grid gap-3">
        <li className="flex gap-3"><span className="readout mt-1 text-teal">1</span><span>Take the photo in daylight, side-on, nothing in front of the body.</span></li>
        <li className="flex gap-3"><span className="readout mt-1 text-teal">2</span><span>Hand your own AI image tool this prompt. It repaints the shell white and leaves the rest alone.</span></li>
        <li className="flex gap-3"><span className="readout mt-1 text-teal">3</span><span>Upload the result here. Now the film has a shell to land on.</span></li>
      </ol>
      <pre className="panel panel-2 mt-4 whitespace-pre-wrap p-4 text-sm leading-relaxed">{PROMPT}</pre>
      <div className="mt-4 flex flex-wrap gap-2">
        <button className="peel" onClick={() => navigator.clipboard.writeText(PROMPT).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); })}>{copied ? "Copied" : "Copy the prompt"}</button>
        <label className="peel ghost cursor-pointer">
          Upload my prepped photo
          <input type="file" accept="image/*" className="sr-only" onChange={(e) => { const f = e.target.files?.[0]; if (f) { setCustomImage(f); close(); toast("Ride loaded. Pick a film."); } e.target.value = ""; }} />
        </label>
      </div>
      <p className="readout mt-4 text-dim">Why white: film is translucent at the edges. On white it reads true; on dark paint it reads muddy, in the booth and in real life.</p>
    </ModalShell>
  );
}
