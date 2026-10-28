// THE HOLE: the home page is a descent. Each level is a <section id>; the depth meter counts floors downward.
export interface Level {
  id: string;
  depth: number;
  floor: string;      // the depth meter's one-word name for the floor
  nav: string;        // navbar label (sentence case)
  title: string;      // display headline
  icon: "Van" | "Receipt" | "PaintRoller" | "ClipboardText" | "Dog" | "Flask" | "Door";
}
export const LEVELS: Level[] = [
  { id: "hero",       depth: 0, floor: "Street",   nav: "The carport",   title: "Custom is good. Taylor'd is better.", icon: "Van" },
  { id: "manifesto",  depth: 1, floor: "Floor",    nav: "Why",           title: "A wrap is not a decal. It's a second skin.", icon: "Receipt" },
  { id: "receipts",   depth: 2, floor: "Receipts", nav: "The receipts",  title: "Before. After. Receipts.", icon: "Receipt" },
  { id: "visualizer", depth: 3, floor: "Booth",    nav: "Visualizer",    title: "Wrap anything.", icon: "PaintRoller" },
  { id: "quote",      depth: 4, floor: "Counter",  nav: "Start yours",   title: "Start your transformation.", icon: "ClipboardText" },
  { id: "shop",       depth: 5, floor: "Break",    nav: "The shop",      title: "From the shop.", icon: "Dog" },
  { id: "lab",        depth: 6, floor: "Lab",      nav: "The lab",       title: "The lab.", icon: "Flask" },
  { id: "arrival",    depth: 7, floor: "Door",     nav: "Arrival kit",   title: "Welcome. Bienvenidos.", icon: "Door" },
];
export const levelById = (id: string) => LEVELS.find((l) => l.id === id);
