"use client";
import { createMemoryStore, htmlData } from "./createStore";
export interface SpyState { activeId: string; depth: number }
export const scrollspy = createMemoryStore<SpyState>({ activeId: "hero", depth: 0 });
export function setActiveLevel(id: string, depth: number) {
  if (scrollspy.get().activeId === id) return;
  scrollspy.set({ activeId: id, depth });
  htmlData("level", String(depth));
}
