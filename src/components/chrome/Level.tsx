import type { Level as LevelT } from "@/data/levels";
import { LevelIcon } from "./LevelIcon";
interface Props { level: LevelT; children: React.ReactNode; bleed?: boolean; title?: string }
/** One floor of the descent. The seam above is the shop floor's tape line; the heading carries the floor's icon. */
export function Level({ level, children, bleed, title }: Props) {
  return (
    <section id={level.id} data-level={level.depth} className="scroll-mt-20">
      <div className="seam" aria-hidden="true" />
      <div className={bleed ? "" : "mx-auto max-w-6xl px-4 sm:px-6"}>
        <header className={`flex items-end justify-between gap-6 pt-16 pb-8 ${bleed ? "mx-auto max-w-6xl px-4 sm:px-6" : ""}`}>
          <h2 className="display text-[clamp(2.2rem,6vw,4.6rem)]">{title ?? level.title}</h2>
          <span className="flex items-center gap-2 text-dim">
            <LevelIcon name={level.icon} size={28} className="text-violet" />
            <span className="readout">floor -{level.depth}</span>
          </span>
        </header>
        {children}
      </div>
    </section>
  );
}
