"use client";
import clsx from "clsx";
import { SprayBottle, Path, Wrench, MapPin, Phone, Envelope } from "@phosphor-icons/react";
import type { Level as LevelT } from "@/data/levels";
import { Level } from "@/components/chrome/Level";
import { ARRIVAL_CARDS } from "@/data/arrivalKit";
import { shop } from "@/data/business";
import { lang } from "@/lib/stores/lang";
import { T, useLocale, useT } from "@/i18n/client";
import { REVIEWED_ES } from "@/i18n/review";
const ICONS = { SprayBottle, Path, Wrench, MapPin };

/** The door. A welcome in your language: two doors, one promise, four cards, and the honesty mark. */
export function ArrivalKit({ level }: { level: LevelT }) {
  const locale = useLocale();
  const tr = useT();
  const reviewed = REVIEWED_ES.includes("/");
  return (
    <Level level={level} title={locale === "es" ? "Bienvenidos. Welcome." : "Welcome. Bienvenidos."}>
      <div role="group" aria-label="Language" className="flex flex-wrap gap-3">
        {([["en", "English", "Welcome"], ["es", "Español", "Bienvenidos"]] as const).map(([code, name, word]) => (
          <button key={code} aria-pressed={locale === code} lang={code} onClick={() => lang.set(code)} className={clsx("panel px-6 py-5 text-left transition-colors", locale === code ? "bg-txt text-ink" : "hover:bg-panel-2")}>
            <span className="display block text-4xl">{word}</span>
            <span className={clsx("block text-sm", locale === code ? "text-ink/70" : "text-dim")}>{name}</span>
          </button>
        ))}
      </div>
      <p className="lede mt-6"><T>A wrap shop in Warminster, PA. We design it, print it, lay it, and post-heat every edge so it stays.</T></p>
      {locale === "es" && !reviewed && <p className="readout mt-3 max-w-[70ch] text-amber"><T>Translation in review. Spot something off? Tell the shop and we’ll fix it before the vinyl prints.</T></p>}
      <ol className="mt-8 grid gap-4 pb-10 sm:grid-cols-2">
        {ARRIVAL_CARDS.map((c, i) => { const I = ICONS[c.icon]; return (
          <li key={c.title} className="panel p-5">
            <div className="flex items-center gap-3"><span className="text-teal"><I size={26} weight="duotone" /></span><span className="readout text-dim">{String(i + 1).padStart(2, "0")}</span><h3 className="text-lg font-semibold"><T>{c.title}</T></h3></div>
            <p className="mt-3 text-dim"><T>{c.body}</T></p>
          </li>); })}
      </ol>
      <div className="flex flex-wrap gap-2 pb-16">
        <a href={shop.phoneHref} className="peel"><Phone size={18} />{tr("Call the shop")}</a>
        <a href={`mailto:${shop.email}`} className="peel ghost"><Envelope size={18} />{tr("Email the shop")}</a>
        <a href={shop.mapsHref} className="peel ghost"><MapPin size={18} />{tr("Open in Maps")}</a>
      </div>
    </Level>
  );
}
