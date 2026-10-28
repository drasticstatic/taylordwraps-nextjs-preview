"use client";
import { createMemoryStore } from "./createStore";
/** The preloader waits on these. Each engine marks its task done when it has something to show. */
export type ReadyTask = "fonts" | "hero" | "receipts";
export const assetReady = createMemoryStore<Record<ReadyTask, boolean>>({ fonts: false, hero: false, receipts: false });
export function markReady(task: ReadyTask) { assetReady.update((s) => (s[task] ? s : { ...s, [task]: true })); }
