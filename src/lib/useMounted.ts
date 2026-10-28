"use client";
import { useSyncExternalStore } from "react";
const noop = () => () => {};
/** false during SSR and hydration, true after. Gate anything random, time- or storage-derived behind it. */
export function useMounted(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
