import type { Level as LevelT } from "@/data/levels";
import { Level } from "@/components/chrome/Level";
import { shop } from "@/data/business";

/** Why the shop exists, in the shop's own voice, with the four numbers that back it up. */
export function Manifesto({ level }: { level: LevelT }) {
  const years = new Date().getFullYear() - shop.since;
  const stats: [string, string][] = [
    [`${years}+`, "years wrapping"],
    [String(shop.claims.reels), "reels on the feed"],
    [shop.claims.recommend, "would recommend"],
    [String(shop.claims.pink), "pink. Ask about the hoodie."],
  ];
  return (
    <Level level={level}>
      <div className="grid gap-10 pb-20 md:grid-cols-[1.2fr_1fr]">
        <div className="grid gap-5 text-lg leading-relaxed">
          <p>Food trucks. Work vans. The whole damn fleet. A wrap is the one marketing spend that drives itself to the job site, parks in front of the customer, and comes home at night.</p>
          <p>We design it, print it, lay it, and post-heat every edge so it stays. Full color changes, fleet graphics, lettering, marine, brand identity from the logo up. If it has a surface, it can have a second skin.</p>
          <p className="text-dim">Warminster, PA, since {shop.since}. By appointment. The kettle&rsquo;s usually on.</p>
        </div>
        <dl className="grid grid-cols-2 gap-px bg-line">
          {stats.map(([n, l]) => (
            <div key={l} className="bg-ink p-6">
              <dt className="order-2 mt-1 text-sm text-dim">{l}</dt>
              <dd className="display text-5xl">{n}</dd>
            </div>
          ))}
        </dl>
      </div>
    </Level>
  );
}
