"use client";
import { boolParse, boolSerialize, createPersistedStore, htmlClass } from "./createStore";
/** PSYCLONE mode rotates the palette hue on <html>. The pearlescent film in the hero and visualizer reads the same flag. */
export const psyclone = createPersistedStore<boolean>({
  key: "tw-psyclone",
  server: false,
  parse: boolParse(false),
  serialize: boolSerialize,
  apply: (on) => htmlClass("psyclone", on),
});
