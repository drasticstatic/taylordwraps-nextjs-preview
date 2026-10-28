"use client";
import { createPersistedStore } from "./createStore";
import type { WrapSpec } from "../wrapSpec";

export interface VisualizerState extends WrapSpec {
  /** object URL of the visitor's own photo; lives in memory only and is revoked on replace */
  customUrl: string | null;
  customName: string | null;
}
export const DEFAULT_BUILD: VisualizerState = {
  v: 1, body: "van", film: "psyclone", finish: "gloss", text: "", textPos: { x: 0.36, y: 0.52 }, customUrl: null, customName: null,
};
export const visualizer = createPersistedStore<VisualizerState>({
  key: "tw-viz",
  storage: "session",
  server: DEFAULT_BUILD,
  parse: (raw) => {
    if (!raw) return DEFAULT_BUILD;
    try { const j = JSON.parse(raw); return { ...DEFAULT_BUILD, ...j, customUrl: null, customName: null }; } catch { return DEFAULT_BUILD; }
  },
  serialize: (v) => JSON.stringify({ v: 1, body: v.body, film: v.film, finish: v.finish, text: v.text, textPos: v.textPos }),
});
export function setCustomImage(file: File | null) {
  const prev = visualizer.get();
  if (prev.customUrl) { try { URL.revokeObjectURL(prev.customUrl); } catch { /* already gone */ } }
  if (!file) { visualizer.set({ ...prev, customUrl: null, customName: null }); return; }
  visualizer.set({ ...prev, body: "custom", customUrl: URL.createObjectURL(file), customName: file.name });
}
