import type { Metadata } from "next";
import { ProposalStudio } from "@/components/proposal/ProposalStudio";
export const metadata: Metadata = { title: "Proposal sheet", description: "The counter's proposal and quote sheet. Prices are the shop's own and never leave this device.", robots: { index: false, follow: false } };
export default function ProposalPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6">
      <div className="no-print">
        <p className="readout text-teal">For the counter</p>
        <h1 className="display mt-3 text-[clamp(2.4rem,7vw,5rem)]">Proposal sheet.</h1>
        <p className="lede mt-4 mb-10">Fill it in, tick the services, type your prices, print or save as PDF. The sheet wears the shop&rsquo;s own colors. Your prices live in your browser only, if you ask it to remember them.</p>
      </div>
      <ProposalStudio />
    </section>
  );
}
