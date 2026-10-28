import { credits } from "./business";
export interface Era {
  id: string;
  name: string;
  when: string;
  what: string;
  href: string;
  state: "now" | "alive" | "archived";
}
export const ERAS: Era[] = [
  { id: "carport", name: "The Carport", when: "2026, in progress", what: "This site. Next.js, a 3D van that wraps itself, the booth, the counter, the lab. The real-site candidate.", href: "/", state: "now" },
  { id: "carshow", name: "The Car Show", when: "2026-10-27, kept alive", what: "The hand-built HTML era turned arcade: the original peel, the toolbox, the preset zoo, the games, the labs' experiments.", href: credits.carshowUrl, state: "alive" },
  { id: "v1_2", name: "The PSYCLONE button", when: "2026-10-27, v1.2", what: "One file, 1.1 MB, every font and photo inlined. The first version Taylor could have opened offline.", href: `${credits.carshowUrl}archive/v1.2.html`, state: "archived" },
  { id: "v1", name: "The first peel", when: "2026-10-27, v1", what: "A ghost capsule of the very first draft. Drag across the van; watch the film lay on.", href: `${credits.carshowUrl}archive/v1.html`, state: "archived" },
];
