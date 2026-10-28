export type FinishId = "gloss" | "satin" | "matte";
export interface Finish {
  id: FinishId;
  name: string;
  canvasFilter: string;          // applied to the base photo draw in the 2D engine
  three: { roughness: number; clearcoat: number; clearcoatRoughness: number };
  note: string;
}
export const FINISHES: Finish[] = [
  { id: "gloss", name: "Gloss", canvasFilter: "saturate(1.15) contrast(1.07) brightness(1.02)", three: { roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.06 }, note: "Wet-look depth. Shows every reflection, hides nothing." },
  { id: "satin", name: "Satin", canvasFilter: "saturate(0.92) contrast(1.02) brightness(0.97)", three: { roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.3 }, note: "Soft sheen. The one most people mean when they say matte." },
  { id: "matte", name: "Matte", canvasFilter: "saturate(0.78) contrast(0.98) brightness(0.9)",  three: { roughness: 0.78, clearcoat: 0, clearcoatRoughness: 0 },      note: "Flat and quiet. Reads as a color, not a coating." },
];
export const finishById = (id: string): Finish => FINISHES.find((f) => f.id === id) ?? FINISHES[0];
