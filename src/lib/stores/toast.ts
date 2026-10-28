"use client";
import { createMemoryStore } from "./createStore";
export interface Toast { id: number; text: string; until: number }
export const toasts = createMemoryStore<Toast[]>([]);
let seq = 0;
export function toast(text: string, ms = 2600) {
  const id = ++seq;
  toasts.update((list) => [...list.slice(-2), { id, text, until: Date.now() + ms }]);
  setTimeout(() => toasts.update((list) => list.filter((t) => t.id !== id)), ms);
}
