"use client";
import { createPersistedStore } from "./createStore";
export type Lang = "en" | "es";
export const lang = createPersistedStore<Lang>({
  key: "tw-lang",
  server: "en",
  parse: (raw) => (raw === "es" ? "es" : "en"),
  serialize: (v) => v,
  apply: (v) => {
    if (typeof document === "undefined") return;
    if (!location.pathname.includes("/es/")) document.documentElement.lang = v;
  },
});
