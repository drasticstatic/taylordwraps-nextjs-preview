"use client";
import { useSyncExternalStore } from "react";

function mediaStore(query: string) {
  const subscribe = (cb: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", cb);
    return () => mq.removeEventListener("change", cb);
  };
  const get = () => window.matchMedia(query).matches;
  return () => useSyncExternalStore(subscribe, get, () => false);
}
export const useReducedMotion = mediaStore("(prefers-reduced-motion: reduce)");
export const useCoarsePointer = mediaStore("(pointer: coarse)");
export const useFinePointer = mediaStore("(pointer: fine)");
export const useNarrow = mediaStore("(max-width: 900px)");
