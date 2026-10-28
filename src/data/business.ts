// Every business fact in one place. Copy that claims something about the shop lives here so it can be
// approved (or struck) by Taylor in one pass.
export const shop = {
  name: "Taylor'd Wraps",
  display: "TAYLOR'D",
  displayTail: "WRAPS",
  tagline: "Custom is good. Taylor'd is better.",
  motto: "Design. Print. Install. Brand.",
  mottoWords: ["Design", "Print", "Install", "Brand"],
  getTaylord: "Get Taylor'd.",
  promise: "A wrap is not a decal. It's a second skin.",
  since: 2016,
  phone: "(215) 771-1419",
  phoneHref: "tel:+12157711419",
  email: "info@taylordwraps.com",
  address: { street: "126 Industrial Dr", city: "Warminster", state: "PA", zip: "18974", region: "Bucks County" },
  mapsHref: "https://maps.google.com/?q=126+Industrial+Dr+Warminster+PA+18974",
  hours: "By appointment. Call first; the kettle's usually on.",
  web: "https://taylordwraps.com",
  instagram: "https://www.instagram.com/taylordwraps/",
  facebook: "https://www.facebook.com/taylordwraps",
  handle: "@taylordwraps",
  services: [
    "Full custom advertisement wraps",
    "Full color-change wraps",
    "Fleet graphics",
    "Truck lettering",
    "Custom decals, stickers, signs",
    "Marine graphics",
    "Logo and brand identity",
  ],
  // Claims below come from the shop's own public pages. Mark anything Taylor wants struck.
  claims: { reels: 431, recommend: "100%", reviews: 7, pink: 0 },
} as const;

export const credits = {
  labs: "drasticstatic labs",
  labsUrl: "https://drasticstatic.github.io/",
  littlebird: "Littlebird",
  littlebirdUrl: "https://littlebird.ai",
  sourceUrl: "https://github.com/drasticstatic/taylordwraps-nextjs-preview",
  carshowUrl: "https://drasticstatic.github.io/taylordwraps-public-preview/",
  carshowRepo: "https://github.com/drasticstatic/taylordwraps-public-preview",
  experimentsUrl: "https://drasticstatic.github.io/taylordwraps-public-preview/roadmap.html",
  year: 2026,
} as const;

export const ticker = {
  words: ["Design", "Print", "Install", "Brand", "Get Taylor'd", "No pink", "Wrap everything"],
  credit: `© ${credits.year} Taylor'd Wraps. Design, print, install, brand. Handcrafted in drasticstatic labs. THE CARPORT v2.0.`,
} as const;

export const compliance = {
  noPayment: "No payment here. This orders a conversation, not a card charge. Commerce stays on the shop's own site.",
  noCustody: "No payments, no custody, no tokens. Merch lives on the shop's own store.",
  placeholderImagery: "Vehicles shown are placeholder renders, not the shop's work. The RC truck is a real photo, used with permission.",
} as const;
