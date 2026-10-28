"use client";
import { createPersistedStore } from "./createStore";

export interface WorkOrderState {
  step: 1 | 2 | 3 | 4 | 5;
  body: string | null;
  service: string | null;
  film: string | null;
  name: string;
  contact: string;
  notes: string;
  source: "manual" | "visualizer";
  buildSpec: string;
  ticket: string | null;
}
export const EMPTY_ORDER: WorkOrderState = {
  step: 1, body: null, service: null, film: null, name: "", contact: "", notes: "", source: "manual", buildSpec: "", ticket: null,
};
export const workorder = createPersistedStore<WorkOrderState>({
  key: "tw-workorder",
  storage: "session",
  server: EMPTY_ORDER,
  parse: (raw) => { if (!raw) return EMPTY_ORDER; try { return { ...EMPTY_ORDER, ...JSON.parse(raw) }; } catch { return EMPTY_ORDER; } },
  serialize: (v) => JSON.stringify(v),
});

/** Mint the ticket once, on the visitor's action, never during render. */
export function ensureTicket(): string {
  const cur = workorder.get();
  if (cur.ticket) return cur.ticket;
  const a = new Uint16Array(1);
  crypto.getRandomValues(a);
  const ticket = `#TW-${1000 + (a[0] % 9000)}`;
  workorder.set({ ...cur, ticket, step: 5 });
  return ticket;
}
export function resetOrder() { workorder.set(EMPTY_ORDER); }

/** The booth's "Send this build": real state, not CSS; jumps to the contact step. */
export function prefillFromVisualizer(mapped: { body: string; service: string; film: string; buildSpec: string }) {
  const cur = workorder.get();
  const notes = cur.notes.includes("Visualizer build:") ? cur.notes.replace(/Visualizer build:[^\n]*/, mapped.buildSpec) : (cur.notes ? cur.notes + "\n" : "") + mapped.buildSpec;
  workorder.set({ ...cur, body: mapped.body, service: mapped.service, film: mapped.film, buildSpec: mapped.buildSpec, notes, source: "visualizer", step: 4, ticket: null });
}
