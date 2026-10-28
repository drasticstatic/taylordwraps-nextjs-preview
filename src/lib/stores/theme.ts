"use client";
import { createPersistedStore, htmlClass } from "./createStore";
export type Theme = "dark" | "light";
export const theme = createPersistedStore<Theme>({
  key: "tw-theme",
  server: "dark",
  parse: (raw) => (raw === "light" ? "light" : "dark"),
  serialize: (v) => v,
  apply: (v) => htmlClass("dark", v === "dark"),
});
