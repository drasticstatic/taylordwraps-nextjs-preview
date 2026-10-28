import { Dog, TShirt, Timer, Wrench, InstagramLogo, FacebookLogo } from "@phosphor-icons/react/dist/ssr";
import type { Level as LevelT } from "@/data/levels";
import { Level } from "@/components/chrome/Level";
import { SHOP_FEED } from "@/data/shopFeed";
import { shop } from "@/data/business";
const ICONS = { Dog, TShirt, Timer, Wrench };
/** The break room. The personality that earns the reviews, without inventing numbers for it. */
export function ShopFeed({ level }: { level: LevelT }) {
  return (
    <Level level={level}>
      <p className="lede -mt-2 mb-8">The shop dog, the hoodie, the timelapses. The real feed is on the shop&rsquo;s own accounts; this is the lore.</p>
      <div className="grid gap-4 pb-6 sm:grid-cols-2">
        {SHOP_FEED.map((p) => { const I = ICONS[p.icon]; return (
          <article key={p.id} className="panel flex gap-4 p-5">
            <span className="text-magenta"><I size={30} weight="duotone" /></span>
            <div><span className="readout text-dim">{p.kind}</span><h3 className="mt-1 text-lg font-semibold">{p.title}</h3><p className="mt-1 text-dim">{p.body}</p></div>
          </article>); })}
      </div>
      <p className="flex flex-wrap gap-4 pb-16 text-sm">
        <a href={shop.instagram} className="flex items-center gap-2 hover:text-teal"><InstagramLogo size={20} />{shop.handle} on Instagram</a>
        <a href={shop.facebook} className="flex items-center gap-2 hover:text-teal"><FacebookLogo size={20} />{shop.claims.reels} reels on Facebook</a>
      </p>
    </Level>
  );
}
