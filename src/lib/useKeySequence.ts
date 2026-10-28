"use client";
import { useEffect } from "react";

/** Fires when the keys are typed in order anywhere on the page except inside form fields. */
export function useKeySequence(sequence: string[], onMatch: () => void) {
  useEffect(() => {
    let idx = 0;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      idx = k === sequence[idx] ? idx + 1 : k === sequence[0] ? 1 : 0;
      if (idx === sequence.length) { idx = 0; onMatch(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sequence, onMatch]);
}
