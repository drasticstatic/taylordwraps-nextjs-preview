"use client";
import { useCallback } from "react";
import { useKeySequence } from "@/lib/useKeySequence";
import { psyclone } from "@/lib/stores/psyclone";
import { toast } from "@/lib/stores/toast";
const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
/** Power-user keys. The settings drawer offers the same switches to everyone else. */
export function GlobalKeys() {
  const fire = useCallback(() => {
    const on = !psyclone.get();
    psyclone.set(on);
    toast(on ? "Psyclone engaged. No pink. Kidding. All the pink." : "Psyclone disengaged.");
  }, []);
  useKeySequence(KONAMI, fire);
  return null;
}
