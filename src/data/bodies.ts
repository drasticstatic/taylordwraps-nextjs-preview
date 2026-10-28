// Everything the booth can wrap. Preset photos are AI-generated stand-ins except rc.jpg (a real RC truck,
// used with permission). White or neutral shells wrap cleanest, which is why the van and coupe use their
// unwrapped "before" photos here.
export type BodyId = "van" | "car" | "mower" | "toolbox" | "rc" | "rcReal" | "rcOld" | "boards" | "rv" | "bus" | "drums" | "atv" | "jetski" | "snow" | "custom";
export interface Body {
  id: BodyId;
  label: string;         // picker label
  display: string;       // spec line
  src: string | null;    // under public/assets
  skewDeg: number;       // lettering skew to sit on the panel
  anchor: { x: number; y: number }; // default lettering anchor, fractions of the stage
  group: "road" | "work" | "toys" | "water" | "stage" | "yours";
  workOrderBody: string;
  /** mask tuning: luminance window the shell must clear, chroma gate, and a soft focus box (fractions) outside which film never lands */
  mask?: { lumA: number; lumB: number; chromaK: number; box?: [number, number, number, number] };
  /** the honest line the stage shows for this body, when the default one would overclaim */
  note?: string;
}
const WHITE_SHELL = { lumA: 0.46, lumB: 0.76, chromaK: 4.2, box: [0.04, 0.12, 0.96, 0.92] as [number, number, number, number] };
const NEUTRAL_SHELL = { lumA: 0.36, lumB: 0.64, chromaK: 3.4, box: [0.06, 0.1, 0.94, 0.94] as [number, number, number, number] };
export const BODIES: Body[] = [
  { id: "van",     label: "Work van",      display: "Work van",               src: "assets/van_before.jpg", skewDeg: -14, anchor: { x: 0.34, y: 0.52 }, group: "road",  workOrderBody: "Work Van / Transit", mask: WHITE_SHELL },
  { id: "car",     label: "Sport coupe",   display: "Sport coupe",            src: "assets/car_before.jpg", skewDeg: -8,  anchor: { x: 0.34, y: 0.6 },  group: "road",  workOrderBody: "Car / Coupe", mask: WHITE_SHELL },
  { id: "bus",     label: "School bus",    display: "White school bus",       src: "assets/bus.jpg",        skewDeg: -4,  anchor: { x: 0.3, y: 0.5 },   group: "road",  workOrderBody: "Box Truck", mask: WHITE_SHELL },
  { id: "rv",      label: "Vintage RV",    display: "Vintage RV",             src: "assets/rv.jpg",         skewDeg: -10, anchor: { x: 0.3, y: 0.5 },   group: "road",  workOrderBody: "Box Truck", mask: NEUTRAL_SHELL },
  { id: "mower",   label: "Mower",         display: "Zero-turn mower",        src: "assets/mower.jpg",      skewDeg: -6,  anchor: { x: 0.36, y: 0.58 }, group: "work",  workOrderBody: "Something Else", mask: NEUTRAL_SHELL },
  { id: "toolbox", label: "Tool chest",    display: "Tool chest",             src: "assets/toolbox.jpg",    skewDeg: -10, anchor: { x: 0.36, y: 0.55 }, group: "work",  workOrderBody: "Something Else", mask: NEUTRAL_SHELL },
  { id: "rc",      label: "RC truck",      display: "RC truck, fresh shell",  src: "assets/rc-white.jpg",   skewDeg: -8,  anchor: { x: 0.36, y: 0.5 },  group: "toys",  workOrderBody: "Something Else", mask: WHITE_SHELL },
  { id: "rcReal",  label: "RC original",   display: "RC truck, Mom's build",  src: "assets/rc.jpg",         skewDeg: -8,  anchor: { x: 0.36, y: 0.5 },  group: "toys",  workOrderBody: "Something Else", mask: { lumA: 0.3, lumB: 0.6, chromaK: 2.4, box: [0.18, 0.2, 0.82, 0.78] }, note: "Mom's original, dark paint: film can only wash it. The fresh shell next to it shows why white wraps clean." },
  { id: "rcOld",   label: "RC classic",    display: "RC crawler, classic",    src: "assets/rc-old.jpg",     skewDeg: -8,  anchor: { x: 0.36, y: 0.5 },  group: "toys",  workOrderBody: "Something Else", mask: NEUTRAL_SHELL },
  { id: "atv",     label: "ATV",           display: "ATV quad",               src: "assets/atv.jpg",        skewDeg: -10, anchor: { x: 0.36, y: 0.52 }, group: "toys",  workOrderBody: "Something Else", mask: NEUTRAL_SHELL },
  { id: "snow",    label: "Snowmobile",    display: "Snowmobile",             src: "assets/snowmobile.jpg", skewDeg: -8,  anchor: { x: 0.36, y: 0.52 }, group: "toys",  workOrderBody: "Something Else", mask: NEUTRAL_SHELL },
  { id: "boards",  label: "Boards",        display: "Skate and snow decks",   src: "assets/boards.jpg",     skewDeg: -4,  anchor: { x: 0.36, y: 0.5 },  group: "toys",  workOrderBody: "Something Else", mask: NEUTRAL_SHELL },
  { id: "jetski",  label: "Jet ski",       display: "Jet ski",                src: "assets/jetski.jpg",     skewDeg: -6,  anchor: { x: 0.36, y: 0.52 }, group: "water", workOrderBody: "Boat / Marine", mask: NEUTRAL_SHELL },
  { id: "drums",   label: "Drum kit",      display: "Drum kit",               src: "assets/drums.jpg",      skewDeg: -6,  anchor: { x: 0.4, y: 0.55 },  group: "stage", workOrderBody: "Something Else", mask: NEUTRAL_SHELL },
  { id: "custom",  label: "Your ride",     display: "Your ride",              src: null,                    skewDeg: -8,  anchor: { x: 0.5, y: 0.5 },   group: "yours", workOrderBody: "Something Else" },
];
export const bodyById = (id: string): Body => BODIES.find((b) => b.id === id) ?? BODIES[0];
