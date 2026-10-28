// The work, as transformations. Client names below already appear on the shop's own public portfolio.
// Photos for the case files are pending Taylor's originals; until then they are spec sheets, not galleries.
export interface Receipt {
  slug: string;
  title: string;
  tag: string;
  film: string;
  scope: string;
  before?: string;   // under public/assets
  after?: string;
  hashFile?: string; // the finished asset the certificate hashes
  copy: string;
}
export const RECEIPTS: Receipt[] = [
  { slug: "shop-van", title: "The shop van", tag: "Fleet, full wrap", film: "Color-flip cast film, gloss laminate", scope: "Design, print, install", before: "van_before.jpg", after: "van_after.jpg", hashFile: "van_after.jpg", copy: "White Transit in, rolling billboard out. Every panel laid, every edge post-heated." },
  { slug: "satin-flip-coupe", title: "Satin flip coupe", tag: "Color change, satin", film: "Satin color-flip, ceramic topcoat", scope: "Color change, chrome delete", before: "car_before.jpg", after: "car_after.jpg", hashFile: "car_after.jpg", copy: "Factory white to a satin that reads violet at noon and teal at dusk." },
  { slug: "sullivans-mack", title: "Sullivan's Scrap Metals Mack truck", tag: "Fleet, commercial", film: "Printed cast film, laminated", scope: "Design, print, install, rivet work", copy: "A Mack with rivets to walk, every one of them cut around by hand." },
  { slug: "wild-one", title: "The Wild One powerboat", tag: "Marine", film: "Marine-grade cast film", scope: "Hull graphics, name, stripes", copy: "Salt, sun and trailer straps. Marine film or nothing." },
  { slug: "797-charger", title: "797 Performance Charger livery", tag: "Motorsport", film: "Printed livery, gloss", scope: "Design, print, install", copy: "A race livery that has to read at speed and survive the pits." },
  { slug: "barrio-street-eats", title: "Barrio Street Eats food truck", tag: "Food truck, conversion", film: "Printed cast film, laminated", scope: "Brand, design, print, install", copy: "The menu on the side, the line out front. Foot traffic in vinyl." },
];
