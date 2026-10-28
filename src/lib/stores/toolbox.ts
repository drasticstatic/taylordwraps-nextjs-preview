"use client";
import { createPersistedStore, htmlData } from "./createStore";
export type Tool = "none" | "squeegee" | "eraser" | "blade" | "heat" | "film";
export interface ToolboxState { shown: boolean; tool: Tool; film: string }
const DEFAULT: ToolboxState = { shown: false, tool: "none", film: "#a855f7" };
export const toolbox = createPersistedStore<ToolboxState>({
  key: "tw-toolbox",
  server: DEFAULT,
  parse: (raw) => ({ ...DEFAULT, shown: raw === "true" }), // only visibility persists; the tool in hand resets each visit
  serialize: (v) => String(v.shown),
  apply: (v) => { htmlData("toolbox", v.shown ? "on" : "off"); htmlData("tool", v.shown ? v.tool : "none"); },
});
