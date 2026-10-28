import type { Level as LevelT } from "@/data/levels";
import { shop } from "@/data/business";
import { PeelButton } from "@/components/ui/PeelButton";
import { HeroStage } from "./HeroStage";
import { Preloader } from "./Preloader";
import { HeroParallax } from "./HeroParallax";

/** Street level. The copy and the stage: a van that wraps itself while you orbit it. */
export function HeroSection({ level }: { level: LevelT }) {
  return (
    <section id={level.id} data-level={0} className="relative min-h-[100svh] overflow-hidden pt-24">
      <Preloader />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-60 [background:radial-gradient(60%_50%_at_75%_60%,color-mix(in_oklab,var(--color-violet)_22%,transparent),transparent_70%)]" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl items-end gap-10 px-4 pb-16 sm:px-6 lg:grid-cols-[1fr_1.1fr]">
        <HeroParallax copy={<div>
          <p className="readout text-teal">Warminster, PA. Vinyl transformation studio.</p>
          <h1 className="display mt-4 text-[clamp(3.2rem,10vw,8.5rem)]">
            Custom is good.<br /><span className="film-text">Taylor&rsquo;d</span> is better.
          </h1>
          <p className="lede mt-6">{shop.promise} We design, print, install, and build the brand that rides on it. Since {shop.since}.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <PeelButton href="/#quote" peel="Zero bubbles. Guaranteed.">Start your transformation</PeelButton>
            <PeelButton href="/#receipts" ghost peel="Real trucks. Real rivets.">See the receipts</PeelButton>
          </div>
        </div>} stage={<HeroStage />} />
      </div>
    </section>
  );
}
