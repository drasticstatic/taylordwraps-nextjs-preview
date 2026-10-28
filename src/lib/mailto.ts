import { shop } from "@/data/business";
import type { WorkOrderState } from "./stores/workorder";
/** The whole order as plain text: the email body, the clipboard spec, the same words in both. */
export function orderLines(o: WorkOrderState): string {
  return [
    `Work order ${o.ticket ?? ""}`.trim(),
    `Name: ${o.name.trim() || "n/a"}`,
    `Body: ${o.body ?? "n/a"}`,
    `Service: ${o.service ?? "n/a"}`,
    `Film: ${o.film ?? "n/a"}`,
    `Contact: ${o.contact.trim()}`,
    `Notes: ${o.notes.trim() || "n/a"}`,
    "",
    "Sent from the Taylor'd interactive showcase. No payment was taken; this is a request for a conversation.",
  ].join("\n");
}
export function buildWorkOrderMail(o: WorkOrderState): string {
  const subject = `Wrap inquiry ${o.ticket ?? ""}: ${o.body ?? "a ride"}`.replace(/\s+/g, " ").trim();
  return `mailto:${shop.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(orderLines(o))}`;
}
