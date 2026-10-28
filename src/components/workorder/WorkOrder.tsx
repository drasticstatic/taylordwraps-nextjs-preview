"use client";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { Envelope, Copy, ArrowCounterClockwise, Ticket as TicketIcon } from "@phosphor-icons/react";
import type { Level as LevelT } from "@/data/levels";
import { Level } from "@/components/chrome/Level";
import { BODY_OPTIONS, SERVICE_OPTIONS, FILM_OPTIONS, type Option } from "@/data/workorder";
import { workorder, ensureTicket, resetOrder, type WorkOrderState } from "@/lib/stores/workorder";
import { buildWorkOrderMail, orderLines } from "@/lib/mailto";
import { toast } from "@/lib/stores/toast";
import { compliance, shop } from "@/data/business";
import { OptionIcon } from "./OptionIcon";
import { PeelButton } from "@/components/ui/PeelButton";

const STEPS = ["Body", "Service", "Film", "Contact"] as const;
type Key = "body" | "service" | "film";

function OptionGrid({ options, value, onPick, label }: { options: Option[]; value: string | null; onPick: (v: string) => void; label: string }) {
  return (
    <div role="group" aria-label={label} className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((o) => (
        <button key={o.value} aria-pressed={value === o.value} onClick={() => onPick(o.value)} className={clsx("panel flex items-center gap-3 p-4 text-left transition-colors", value === o.value ? "bg-txt text-ink" : "hover:bg-panel-2")}>
          <span className={value === o.value ? "text-ink" : "text-violet"}><OptionIcon name={o.icon} /></span>
          <span><span className="block font-semibold">{o.label}</span><span className={clsx("block text-sm", value === o.value ? "text-ink/70" : "text-dim")}>{o.detail}</span></span>
        </button>
      ))}
    </div>
  );
}

/** The counter. Four questions, a numbered ticket, an email to the shop. It ends in a phone call, never a card. */
export function WorkOrder({ level }: { level: LevelT }) {
  const o = workorder.use();
  const top = useRef<HTMLDivElement>(null);
  const set = (patch: Partial<WorkOrderState>) => workorder.set({ ...workorder.get(), ...patch });
  const pick = (key: Key, v: string) => { set({ [key]: v } as Partial<WorkOrderState>); const s = o.step; if (s < 4) setTimeout(() => set({ step: (s + 1) as WorkOrderState["step"] }), 280); };
  const missing = () => (o.step === 1 && !o.body ? "Pick a body first. What are we wrapping?" : o.step === 2 && !o.service ? "Pick a service. How deep does this go?" : o.step === 3 && !o.film ? "Pick a film, or ask us to advise." : o.step === 4 && !o.contact.trim() ? "We need a phone or email to call you back." : null);
  const next = () => { const m = missing(); if (m) { toast(m); return; } if (o.step === 4) { ensureTicket(); toast("Ticket ready. Email it to the shop, or copy the spec."); } else set({ step: (o.step + 1) as WorkOrderState["step"] }); };
  const back = () => set({ step: Math.max(1, o.step - 1) as WorkOrderState["step"] });
  useEffect(() => { if (o.source === "visualizer" && o.step === 4) top.current?.scrollIntoView({ block: "nearest" }); }, [o.source, o.step]);
  const progress = o.step === 5 ? "Ticket ready" : `Step ${o.step} of 4`;
  return (
    <Level level={level}>
      <div ref={top} className="grid gap-8 pb-16 lg:grid-cols-[14rem_1fr]">
        <ol className="flex gap-2 lg:flex-col lg:gap-3" aria-label="Steps">
          {STEPS.map((s, i) => { const n = i + 1; const done = o.step > n; const here = o.step === n; return (
            <li key={s} className={clsx("flex items-center gap-3 text-sm", here ? "text-txt" : done ? "text-teal" : "text-dim")} aria-current={here ? "step" : undefined}>
              <span className={clsx("grid h-7 w-7 place-items-center font-semibold", here ? "bg-txt text-ink" : done ? "bg-teal text-ink" : "shadow-[inset_0_0_0_1px_var(--line)]")}>{n}</span><span className="hidden sm:inline">{s}</span>
            </li>); })}
          <li className={clsx("flex items-center gap-3 text-sm", o.step === 5 ? "text-txt" : "text-dim")}><span className={clsx("grid h-7 w-7 place-items-center", o.step === 5 ? "bg-magenta text-ink" : "shadow-[inset_0_0_0_1px_var(--line)]")}><TicketIcon size={16} /></span><span className="hidden sm:inline">Ticket</span></li>
        </ol>
        <div className="min-w-0">
          {o.source === "visualizer" && o.step < 5 && <p className="readout mb-4 bg-panel-2 px-3 py-2 text-dim">Your booth build is loaded: {o.buildSpec}</p>}
          {o.step === 1 && <><h3 className="mb-4 text-xl font-semibold">What are we wrapping?</h3><OptionGrid label="Body" options={BODY_OPTIONS} value={o.body} onPick={(v) => pick("body", v)} /></>}
          {o.step === 2 && <><h3 className="mb-4 text-xl font-semibold">How deep does this go?</h3><OptionGrid label="Service" options={SERVICE_OPTIONS} value={o.service} onPick={(v) => pick("service", v)} /></>}
          {o.step === 3 && <><h3 className="mb-4 text-xl font-semibold">What should it feel like?</h3><OptionGrid label="Film" options={FILM_OPTIONS} value={o.film} onPick={(v) => pick("film", v)} /></>}
          {o.step === 4 && (
            <div className="grid max-w-xl gap-4">
              <h3 className="text-xl font-semibold">How do we reach you?</h3>
              <label className="grid gap-1 text-sm"><span className="text-dim">Your name</span><input value={o.name} onChange={(e) => set({ name: e.target.value })} autoComplete="name" className="bg-panel-2 px-3 py-2 text-base focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-teal)]" /></label>
              <label className="grid gap-1 text-sm"><span className="text-dim">Phone or email</span><input value={o.contact} onChange={(e) => set({ contact: e.target.value })} required autoComplete="tel" placeholder="(215) ..." className="bg-panel-2 px-3 py-2 text-base focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-teal)]" /></label>
              <label className="grid gap-1 text-sm"><span className="text-dim">Notes: year, make, model, deadline, the idea</span><textarea value={o.notes} onChange={(e) => set({ notes: e.target.value })} rows={4} className="bg-panel-2 px-3 py-2 text-base focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-teal)]" /></label>
            </div>
          )}
          {o.step === 5 && (
            <div className="panel panel-2 grid max-w-2xl gap-4 p-6" data-ticket>
              <div className="flex items-baseline justify-between"><span className="readout text-dim">Work order</span><span className="display text-4xl">{o.ticket}</span></div>
              <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-2">
                <dt className="text-dim">Body</dt><dd>{o.body}</dd>
                <dt className="text-dim">Service</dt><dd>{o.service}</dd>
                <dt className="text-dim">Film</dt><dd>{o.film}</dd>
                <dt className="text-dim">Contact</dt><dd>{o.name.trim() ? `${o.name.trim()}, ` : ""}{o.contact}</dd>
                <dt className="text-dim">Notes</dt><dd className="whitespace-pre-wrap">{o.notes.trim() || "none"}</dd>
              </dl>
              <div className="flex flex-wrap gap-2">
                <PeelButton href={buildWorkOrderMail(o)} external peel="We read every one. Then we call.">
                  <Envelope size={18} />Email it to the shop
                </PeelButton>
                <button className="peel ghost" onClick={() => navigator.clipboard.writeText(orderLines(o)).then(() => toast("Spec copied."), () => toast("Couldn't copy. Select it by hand."))}><Copy size={16} />Copy the spec</button>
                <button className="peel ghost" onClick={() => { resetOrder(); toast("Cleared. Start again whenever."); }}><ArrowCounterClockwise size={16} />Start over</button>
              </div>
              <p className="text-sm text-dim">Or just call: <a href={shop.phoneHref} className="text-txt">{shop.phone}</a>.</p>
            </div>
          )}
          {o.step < 5 && (
            <div className="mt-6 flex items-center justify-between gap-4">
              <span className="readout text-dim" data-progress>{progress}</span>
              <div className="flex gap-2">
                {o.step > 1 && <button onClick={back} className="peel ghost">Back</button>}
                <PeelButton onClick={next} peel="No payment here. We call you.">{o.step === 4 ? "Build the work order" : "Next"}</PeelButton>
              </div>
            </div>
          )}
          <p className="readout mt-6 max-w-[60ch] text-dim">{compliance.noPayment}</p>
        </div>
      </div>
    </Level>
  );
}
