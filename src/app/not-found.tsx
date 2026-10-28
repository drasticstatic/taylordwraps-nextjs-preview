import type { Metadata } from "next";
import Link from "next/link";
import { Compass, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { LEVELS } from "@/data/levels";
import { credits } from "@/data/business";
import { LevelIcon } from "@/components/chrome/LevelIcon";

export const metadata: Metadata = { title: "This panel isn't wrapped yet", robots: { index: false, follow: true } };

// The lost page doubles as the sitemap, so getting lost is how you find the whole shop.
export default function NotFound() {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-28 pb-24 sm:px-6">
      <script dangerouslySetInnerHTML={{ __html: "window.__notFoundPage=true" }} />
      <div className="flex items-center gap-3 text-teal"><Compass size={28} /><span className="readout">404</span></div>
      <h1 className="display mt-4 text-[clamp(2.6rem,8vw,6.5rem)]">This panel isn&rsquo;t wrapped yet.</h1>
      <p className="lede mt-5">
        Someone came through with the blade and lifted the page you wanted clean off the frame. Nothing is broken; it&rsquo;s bare metal waiting for film. Everything that does exist is below.
      </p>
      <h2 className="mt-14 text-sm font-semibold text-dim">The carport, floor by floor</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        {LEVELS.map((l) => (
          <li key={l.id}>
            <Link href={`/#${l.id}`} className="panel flex items-center gap-4 p-4 hover:bg-panel-2">
              <span className="text-violet"><LevelIcon name={l.icon} size={26} /></span>
              <span className="flex-1">
                <span className="block font-semibold">{l.nav}</span>
                <span className="block text-sm text-dim">{l.title}</span>
              </span>
              <span className="readout text-dim">{l.depth === 0 ? "street" : `-${l.depth}`}</span>
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-12 text-sm font-semibold text-dim">Other doors</h2>
      <ul className="mt-4 grid gap-3 sm:grid-cols-2">
        <li><Link href="/time-machine/" className="panel block p-4 hover:bg-panel-2"><span className="block font-semibold">Time machine</span><span className="block text-sm text-dim">Every era of this build stays visitable.</span></Link></li>
        <li><Link href="/proposal/" className="panel block p-4 hover:bg-panel-2"><span className="block font-semibold">Proposal sheet</span><span className="block text-sm text-dim">The counter&rsquo;s quote sheet, in the shop&rsquo;s colors.</span></Link></li>
        <li><a href={credits.carshowUrl} className="panel block p-4 hover:bg-panel-2"><span className="flex items-center gap-1 font-semibold">The Car Show <ArrowUpRight size={16} /></span><span className="block text-sm text-dim">The hand-built arcade next door: toys, games, experiments.</span></a></li>
        <li><a href={credits.sourceUrl} className="panel block p-4 hover:bg-panel-2"><span className="flex items-center gap-1 font-semibold">Site source <ArrowUpRight size={16} /></span><span className="block text-sm text-dim">This lane on GitHub.</span></a></li>
        <li><a href={credits.labsUrl} className="panel block p-4 hover:bg-panel-2"><span className="flex items-center gap-1 font-semibold">Meet the dev <ArrowUpRight size={16} /></span><span className="block text-sm text-dim">drasticstatic labs.</span></a></li>
      </ul>
      <p className="readout mt-12 text-dim">Tip: the squeegee only works on vinyl. A missing page is a you-problem, not a tool-problem.</p>
    </section>
  );
}
