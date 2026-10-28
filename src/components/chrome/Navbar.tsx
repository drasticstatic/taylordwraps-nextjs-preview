"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GearSix, List, X, ArrowUpRight } from "@phosphor-icons/react";
import { LEVELS } from "@/data/levels";
import { shop, credits } from "@/data/business";
import { asset } from "@/lib/basePath";
import { scrollspy } from "@/lib/stores/scrollspy";
import { ui } from "@/lib/stores/ui";
import { DoodleLink } from "./DoodleLink";
import { useScrollSpy } from "./useScrollSpy";
import { Z } from "@/lib/z";
import { T, useT } from "@/i18n/client";
import { eggs } from "@/lib/stores/eggs";

export function Navbar() {
  useScrollSpy();
  const spy = scrollspy.use();
  const path = usePathname();
  const onHome = path === "/" || path === "/es/" || path === "/es";
  const [menu, setMenu] = useState(false);
  const tr = useT();
  const clicks = useRef<{ n: number; t: number }>({ n: 0, t: 0 });
  const logoClick = () => { const now = Date.now(); clicks.current = now - clicks.current.t < 900 ? { n: clicks.current.n + 1, t: now } : { n: 1, t: now }; if (clicks.current.n >= 3) { clicks.current = { n: 0, t: 0 }; eggs.update((s) => ({ dogRuns: s.dogRuns + 1 })); } };
  return (
    <nav className="fixed inset-x-0 top-0 no-print" style={{ zIndex: Z.nav }} aria-label="Primary">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-3 sm:px-6" style={{ background: "color-mix(in oklab, var(--ink) 82%, transparent)", backdropFilter: "blur(14px)" }}>
        <Link href="/" onClick={logoClick} className="display flex items-baseline gap-2 text-2xl leading-none">
          <span>{shop.display}</span>
          <span className="film-text">{shop.displayTail}</span>
        </Link>
        <div className="hidden items-center gap-6 min-[900px]:flex">
          {LEVELS.filter((l) => l.depth > 0).map((l, i) => (
            <DoodleLink key={l.id} href={`/#${l.id}`} index={i} here={onHome && spy.activeId === l.id}><T>{l.nav}</T></DoodleLink>
          ))}
          <a href={asset("/404.html")} className="text-sm font-semibold text-dim hover:text-txt"><T>Lost?</T></a>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => ui.update((s) => ({ ...s, drawerOpen: true }))} className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-dim hover:text-txt" aria-label={tr("Settings")} aria-haspopup="dialog" aria-controls="settings-drawer">
            <GearSix size={20} /><span className="hidden sm:inline"><T>Settings</T></span>
          </button>
          <button onClick={() => setMenu(true)} className="p-2 min-[900px]:hidden" aria-label={tr("Open menu")} aria-expanded={menu} aria-controls="mobile-menu"><List size={24} /></button>
        </div>
      </div>
      {menu && (
        <div id="mobile-menu" role="dialog" aria-modal="true" aria-label="Menu" className="fixed inset-0 flex flex-col bg-ink p-6" style={{ zIndex: Z.drawer }}>
          <div className="flex items-center justify-between">
            <span className="display text-2xl">{shop.display}</span>
            <button onClick={() => setMenu(false)} className="p-2" aria-label={tr("Close menu")} data-autofocus><X size={26} /></button>
          </div>
          <ul className="mt-10 grid gap-5">
            {LEVELS.map((l) => (
              <li key={l.id}><a href={`${asset("/")}#${l.id}`} onClick={() => setMenu(false)} className="display text-4xl"><T>{l.nav}</T></a></li>
            ))}
            <li><Link href="/time-machine/" onClick={() => setMenu(false)} className="display text-4xl"><T>Time machine</T></Link></li>
            <li><a href={credits.carshowUrl} className="display flex items-center gap-2 text-4xl"><T>The Car Show</T> <ArrowUpRight size={28} /></a></li>
          </ul>
        </div>
      )}
    </nav>
  );
}
