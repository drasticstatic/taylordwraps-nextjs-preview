"use client";
import { useEffect, useMemo, useState } from "react";
import { Printer, FloppyDisk, Export, DownloadSimple } from "@phosphor-icons/react";
import { PROPOSAL_SERVICES, DEFAULT_TERMS, RATECARD_KEY } from "@/data/proposal";
import { shop } from "@/data/business";
import { readStorage, writeStorage } from "@/lib/storage";
import { toast } from "@/lib/stores/toast";
import { useMounted } from "@/lib/useMounted";
import "./proposal.css";

interface Line { name: string; on: boolean; price: string }
interface Form { client: string; contact: string; asset: string; date: string; valid: string; notes: string; terms: string }
const money = (n: number) => n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

/** The counter's proposal sheet. Everything stays on this device; nothing is sent or stored by the site. */
export function ProposalStudio() {
  const mounted = useMounted();
  const [lines, setLines] = useState<Line[]>(PROPOSAL_SERVICES.map((name) => ({ name, on: false, price: "" })));
  const [form, setForm] = useState<Form>({ client: "", contact: "", asset: "", date: "", valid: "30", notes: "", terms: DEFAULT_TERMS });
  const [remember, setRemember] = useState(false);
  const [no, setNo] = useState("");
  useEffect(() => {
    const a = new Uint16Array(1); crypto.getRandomValues(a); setNo(`#TW-${1000 + (a[0] % 9000)}`);
    setForm((f) => ({ ...f, date: new Date().toISOString().slice(0, 10) }));
    const raw = readStorage("local", RATECARD_KEY);
    if (raw) { try { const j = JSON.parse(raw); if (j?.lines) { setLines((cur) => cur.map((l) => ({ ...l, price: j.lines[l.name] ?? "" }))); setRemember(true); if (j.terms) setForm((f) => ({ ...f, terms: j.terms })); } } catch { /* ignore */ } }
  }, []);
  const total = useMemo(() => lines.filter((l) => l.on).reduce((s, l) => s + (parseFloat(l.price) || 0), 0), [lines]);
  const rateCard = () => ({ v: 1, lines: Object.fromEntries(lines.map((l) => [l.name, l.price])), terms: form.terms });
  useEffect(() => { if (!mounted) return; if (remember) writeStorage("local", RATECARD_KEY, JSON.stringify(rateCard())); else writeStorage("local", RATECARD_KEY, null); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remember, lines, form.terms, mounted]);
  const exportCard = () => { const blob = new Blob([JSON.stringify(rateCard(), null, 2)], { type: "application/json" }); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "taylord-rate-card.json"; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); toast("Rate card exported."); };
  const importCard = (f?: File | null) => { if (!f) return; f.text().then((t) => { try { const j = JSON.parse(t); setLines((cur) => cur.map((l) => ({ ...l, price: j.lines?.[l.name] ?? l.price }))); if (j.terms) setForm((x) => ({ ...x, terms: j.terms })); toast("Rate card loaded."); } catch { toast("That file isn't a rate card."); } }); };
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });
  const input = "w-full bg-panel-2 px-3 py-2 focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-teal)]";
  return (
    <div className="grid gap-8 lg:grid-cols-[22rem_1fr]">
      <form className="proposal-form grid content-start gap-4 no-print" onSubmit={(e) => e.preventDefault()}>
        <label className="grid gap-1 text-sm"><span className="text-dim">Client</span><input value={form.client} onChange={set("client")} className={input} placeholder="Sullivan's Scrap Metals" /></label>
        <label className="grid gap-1 text-sm"><span className="text-dim">Contact</span><input value={form.contact} onChange={set("contact")} className={input} /></label>
        <label className="grid gap-1 text-sm"><span className="text-dim">Vehicle or asset</span><input value={form.asset} onChange={set("asset")} className={input} placeholder="2024 Transit 350, white" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1 text-sm"><span className="text-dim">Date</span><input type="date" value={form.date} onChange={set("date")} className={input} /></label>
          <label className="grid gap-1 text-sm"><span className="text-dim">Valid for (days)</span><input type="number" min={1} value={form.valid} onChange={set("valid")} className={input} /></label>
        </div>
        <fieldset className="grid gap-2">
          <legend className="text-sm text-dim">Services and your prices</legend>
          {lines.map((l, i) => (
            <div key={l.name} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={l.on} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, on: e.target.checked } : x)))} aria-label={l.name} className="accent-[var(--color-teal)]" />
              <span className="flex-1">{l.name}</span>
              <input type="number" min={0} step={25} inputMode="decimal" placeholder="$" value={l.price} onChange={(e) => setLines(lines.map((x, j) => (j === i ? { ...x, price: e.target.value } : x)))} aria-label={`${l.name} price`} className="w-24 bg-panel-2 px-2 py-1 text-right focus:outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--color-teal)]" />
            </div>
          ))}
        </fieldset>
        <label className="grid gap-1 text-sm"><span className="text-dim">Notes</span><textarea rows={3} value={form.notes} onChange={set("notes")} className={input} /></label>
        <label className="grid gap-1 text-sm"><span className="text-dim">Terms</span><textarea rows={4} value={form.terms} onChange={set("terms")} className={input} /></label>
        <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="mt-1 accent-[var(--color-teal)]" /><span>Remember my prices and terms on this device<span className="block text-dim">Stored in this browser only. Never in the site, never in git.</span></span></label>
        <div className="flex flex-wrap gap-2">
          <button className="peel" onClick={() => window.print()}><Printer size={18} />Print or save as PDF</button>
          <button className="peel ghost" onClick={exportCard}><Export size={16} />Export rate card</button>
          <label className="peel ghost cursor-pointer"><DownloadSimple size={16} />Import rate card<input type="file" accept="application/json" className="sr-only" onChange={(e) => { importCard(e.target.files?.[0]); e.target.value = ""; }} /></label>
        </div>
      </form>
      <div className="sheet" data-sheet>
        <div className="bar"><b>TAYLOR&rsquo;D WRAPS</b><span>{shop.address.street}, {shop.address.city}, {shop.address.state} {shop.address.zip} · {shop.phone}</span></div>
        <div className="meta" style={{ marginTop: 18 }}>
          <div><b>Proposal</b> {no}</div>
          <div><b>Date</b> {form.date ? new Date(form.date + "T12:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : ""}</div>
          <div><b>Client</b> {form.client || "—"}</div>
          <div><b>Contact</b> {form.contact || "—"}</div>
          <div style={{ gridColumn: "1 / -1" }}><b>Subject</b> {form.asset || "—"}</div>
        </div>
        <h2>Scope and pricing</h2>
        <table>
          <tbody>
            {lines.filter((l) => l.on).map((l) => (<tr key={l.name}><td>{l.name}</td><td className="amt">{l.price ? money(parseFloat(l.price) || 0) : "quote"}</td></tr>))}
            {lines.every((l) => !l.on) && <tr><td colSpan={2} style={{ color: "#777" }}>Tick the services on the left.</td></tr>}
            <tr className="tot"><td>Total</td><td className="amt">{money(total)}</td></tr>
          </tbody>
        </table>
        {form.notes && <><h2>Notes</h2><p className="terms">{form.notes}</p></>}
        <h2>Terms</h2>
        <p className="terms">{form.terms.replace("30 days", `${form.valid || 30} days`)}</p>
        <div className="sig"><div>Client signature / date</div><div>Taylor&rsquo;d Wraps / date</div></div>
        <p className="foot">{shop.name} · {shop.email} · {shop.web}. Prepared on the Taylor&rsquo;d counter sheet; nothing on this page was sent or stored by the website.</p>
      </div>
    </div>
  );
}
