import Link from "next/link";
import { Phone, Envelope, MapPin, InstagramLogo, FacebookLogo, Storefront, GithubLogo, ArrowUpRight, Flask } from "@phosphor-icons/react/dist/ssr";
import { shop, credits } from "@/data/business";
import { Tx } from "./FooterClient";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-line">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <p className="display text-4xl"><Tx>{shop.getTaylord}</Tx></p>
          <ul className="mt-6 grid gap-3 text-dim">
            <li><a href={shop.phoneHref} className="flex items-center gap-3 hover:text-txt"><Phone size={20} className="text-teal" />{shop.phone}</a></li>
            <li><a href={`mailto:${shop.email}`} className="flex items-center gap-3 hover:text-txt"><Envelope size={20} className="text-teal" />{shop.email}</a></li>
            <li><a href={shop.mapsHref} className="flex items-start gap-3 hover:text-txt"><MapPin size={20} className="mt-1 shrink-0 text-teal" /><span>{shop.address.street}<br />{shop.address.city}, {shop.address.state} {shop.address.zip}</span></a></li>
          </ul>
          <p className="mt-4 text-sm text-dim"><Tx>{shop.hours}</Tx></p>
        </div>
        <FooterCol title="Explore" items={[["/#receipts", "The receipts"], ["/#visualizer", "Visualizer"], ["/#quote", "Start yours"], ["/time-machine/", "Time machine"], ["/proposal/", "Proposal sheet"]]} />
        <div>
          <h3 className="text-sm font-semibold text-dim"><Tx>Elsewhere</Tx></h3>
          <ul className="mt-4 grid gap-2">
            <li><a href={shop.instagram} className="flex items-center gap-2 hover:text-teal"><InstagramLogo size={20} />Instagram</a></li>
            <li><a href={shop.facebook} className="flex items-center gap-2 hover:text-teal"><FacebookLogo size={20} />Facebook</a></li>
            <li><a href={shop.web} className="flex items-center gap-2 hover:text-teal"><Storefront size={20} /><Tx>The shop’s own site</Tx></a></li>
          </ul>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-dim"><Tx>The dev</Tx></h3>
          <ul className="mt-4 grid gap-2">
            <li><a href={credits.labsUrl} className="flex items-center gap-2 hover:text-teal"><Tx>Meet the dev</Tx> <ArrowUpRight size={16} /></a></li>
            <li><a href={credits.sourceUrl} className="flex items-center gap-2 hover:text-teal"><GithubLogo size={20} /><Tx>Site source</Tx></a></li>
            <li><a href={credits.carshowUrl} className="flex items-center gap-2 hover:text-teal"><Tx>The Car Show</Tx> <ArrowUpRight size={16} /></a></li>
            <li><a href={credits.experimentsUrl} className="flex items-center gap-2 hover:text-teal"><Flask size={20} /><Tx>Labs experiments</Tx></a></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-10 text-sm text-dim sm:px-6">
        <p><Tx>A drasticstatic labs showcase, built as a gift. Not the shop’s live site; nothing here implies endorsement until the shop says so. Vehicles shown are placeholder renders except the RC truck, a real photo used with permission.</Tx></p>
      </div>
    </footer>
  );
}
function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-dim"><Tx>{title}</Tx></h3>
      <ul className="mt-4 grid gap-2">{items.map(([href, label]) => <li key={href}><Link href={href} className="hover:text-teal"><Tx>{label}</Tx></Link></li>)}</ul>
    </div>
  );
}
