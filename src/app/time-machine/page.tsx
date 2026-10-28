import type { Metadata } from "next";
import Link from "next/link";
import { ClockCounterClockwise, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { ERAS } from "@/data/eras";

export const metadata: Metadata = { title: "Time machine", description: "Every era of the Taylor'd Wraps showcase stays visitable." };

export default function TimeMachine() {
  return (
    <section className="mx-auto max-w-5xl px-4 pt-28 pb-24 sm:px-6">
      <div className="flex items-center gap-3 text-teal"><ClockCounterClockwise size={28} /><span className="readout">time machine</span></div>
      <h1 className="display mt-4 text-[clamp(2.6rem,8vw,6rem)]">Step back in time.</h1>
      <p className="lede mt-5">Every era of this build stays visitable. Nothing gets torn down; it gets a door.</p>
      <ol className="mt-12 grid gap-4">
        {ERAS.map((e) => {
          const inner = (
            <>
              <span className="readout text-dim">{e.when}</span>
              <span className="mt-1 flex items-center gap-2 text-xl font-semibold">{e.name}{e.state !== "now" && <ArrowUpRight size={18} />}</span>
              <span className="mt-2 block text-dim">{e.what}</span>
              {e.state === "now" && <span className="readout mt-3 inline-block text-teal">you are here</span>}
            </>
          );
          return (
            <li key={e.id} className={`panel p-6 ${e.state === "now" ? "" : "hover:bg-panel-2"}`}>
              {e.state === "now" ? <Link href="/" className="block">{inner}</Link> : <a href={e.href} className="block">{inner}</a>}
            </li>
          );
        })}
      </ol>
      <p className="mt-10"><Link href="/" className="doodle">Back to the present</Link></p>
    </section>
  );
}
