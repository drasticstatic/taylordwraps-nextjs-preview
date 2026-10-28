// The film library. Absolute hue + saturation (percent) feed the 2D true-wrap engine; the 3D hero
// derives a base color from the same numbers. `pearl` films are color-flip: PSYCLONE in the hero,
// a mouse-following specular in the booth.
export type FilmId = "psyclone" | "ultraviolet" | "acid" | "tangerine" | "lime" | "teal" | "glacier" | "infrared";
export interface Film {
  id: FilmId;
  name: string;
  brand: string;       // the real film family it stands in for (names belong to their owners, see TRADEMARKS.md)
  hue: number;         // 0..360
  sat: number;         // 0..100
  light: number;       // 0..100, base lightness
  spread: [number, number]; // hue offsets for the gradient's second and third stops
  pearl: boolean;
  swatch: [string, string, string];
  workOrderFilm: "Gloss Laminate" | "Satin / Matte" | "Color-Shift / Iridescent" | "Specialty (Chrome/Carbon)";
}
export const FILMS: Film[] = [
  { id: "psyclone",    name: "Spectra-Psyclone", brand: "color-flip (3M 1080 Satin Flip class)", hue: 275, sat: 85, light: 58, spread: [60, 255], pearl: true,  swatch: ["#a855f7", "#ec4899", "#2dd4bf"], workOrderFilm: "Color-Shift / Iridescent" },
  { id: "ultraviolet", name: "Ultraviolet Rush", brand: "gloss (Avery SW900 class)",             hue: 245, sat: 80, light: 56, spread: [34, 326], pearl: false, swatch: ["#6366f1", "#a855f7", "#3b82f6"], workOrderFilm: "Gloss Laminate" },
  { id: "acid",        name: "Acid Bloom",       brand: "gloss (KPMF K75400 class)",            hue: 340, sat: 85, light: 58, spread: [34, 326], pearl: false, swatch: ["#ec4899", "#f43f5e", "#f97316"], workOrderFilm: "Gloss Laminate" },
  { id: "tangerine",   name: "Tangerine Dream",  brand: "gloss (3M 2080 class)",                hue: 25,  sat: 90, light: 58, spread: [34, 326], pearl: false, swatch: ["#f97316", "#fbbf24", "#ef4444"], workOrderFilm: "Gloss Laminate" },
  { id: "lime",        name: "Lime Riot",        brand: "gloss (Avery SW900 class)",            hue: 85,  sat: 85, light: 56, spread: [34, 326], pearl: false, swatch: ["#facc15", "#84cc16", "#22c55e"], workOrderFilm: "Gloss Laminate" },
  { id: "teal",        name: "Teal Tempest",     brand: "satin (3M 2080 Satin class)",          hue: 175, sat: 75, light: 56, spread: [34, 326], pearl: false, swatch: ["#22c55e", "#2dd4bf", "#0ea5e9"], workOrderFilm: "Satin / Matte" },
  { id: "glacier",     name: "Glacier Shift",    brand: "satin (KPMF K75400 class)",            hue: 205, sat: 45, light: 62, spread: [34, 326], pearl: false, swatch: ["#0ea5e9", "#64748b", "#e2e8f0"], workOrderFilm: "Satin / Matte" },
  { id: "infrared",    name: "Infrared Ghost",   brand: "color-flip (Avery ColorFlow class)",   hue: 355, sat: 80, light: 56, spread: [60, 255], pearl: true,  swatch: ["#ef4444", "#a855f7", "#6366f1"], workOrderFilm: "Color-Shift / Iridescent" },
];
export const filmById = (id: string): Film => FILMS.find((f) => f.id === id) ?? FILMS[0];
export const filmCss = (f: Film) => `linear-gradient(120deg, ${f.swatch[0]}, ${f.swatch[1]}, ${f.swatch[2]})`;
