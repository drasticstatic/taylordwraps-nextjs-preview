"use client";
import { boolParse, boolSerialize, createPersistedStore, htmlData } from "./createStore";
/** The film-trail cursor. Default on; fine pointers only; the engine also honors reduced motion. */
export const trail = createPersistedStore<boolean>({
  key: "tw-trail",
  server: true,
  parse: boolParse(true),
  serialize: boolSerialize,
  apply: (on) => htmlData("trail", on ? "on" : "off"),
});
