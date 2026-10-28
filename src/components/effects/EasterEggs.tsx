"use client";
import { useCallback, useEffect, useState } from "react";
import { Dog } from "@phosphor-icons/react";
import { useKeySequence } from "@/lib/useKeySequence";
import { toast } from "@/lib/stores/toast";
import { readStorage, writeStorage } from "@/lib/storage";
import { MYSTERY_QUEUE } from "@/data/eggs";
import { useReducedMotion } from "@/lib/media";
import { Z } from "@/lib/z";
import { eggs } from "@/lib/stores/eggs";

/** The pink incident, the shop dog on QC, and the returning-visitor mystery queue. All after mount; nothing random during render. */
export function EasterEggs() {
  const [pink, setPink] = useState(false);
  const { dogRuns } = eggs.use();
  const reduced = useReducedMotion();
  const runPink = useCallback(() => { setPink(true); toast("No pink. Okay, fine. Ten seconds. Then we never speak of it."); setTimeout(() => setPink(false), 10_000); }, []);
  const runDog = useCallback(() => eggs.update((s) => ({ dogRuns: s.dogRuns + 1 })), []);
  useKeySequence(["p", "i", "n", "k"], runPink);
  useKeySequence(["d", "o", "g"], runDog);
  useEffect(() => { if (dogRuns) toast("QC inspection underway. Stand clear of the shop dog."); }, [dogRuns]);
  useEffect(() => {
    const n = Number(readStorage("local", "tw-visits") ?? "0") + 1;
    writeStorage("local", "tw-visits", String(n));
    if (n > 1) { const item = MYSTERY_QUEUE[Math.floor(Date.now() / 86_400_000) % MYSTERY_QUEUE.length]; const t = setTimeout(() => toast(`Welcome back, visit ${n}. Today's mystery queue: ${item}`, 4200), 5200); return () => clearTimeout(t); }
  }, []);
  return (
    <>
      {pink && <div className="pointer-events-none fixed inset-0" style={{ zIndex: Z.toast - 1, background: "#ff2d95", opacity: 0.22 }} aria-hidden="true" />}
      {dogRuns > 0 && (
        <div key={dogRuns} className="pointer-events-none fixed bottom-14 left-0 text-magenta" style={{ zIndex: Z.toast - 2, animation: reduced ? "none" : "dog-run 2.6s linear forwards" }} aria-hidden="true">
          <Dog size={56} weight="duotone" />
        </div>
      )}
      <style>{`@keyframes dog-run { from { transform: translateX(-80px); } to { transform: translateX(calc(100vw + 80px)); } }`}</style>
    </>
  );
}
