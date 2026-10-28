import type { VisualizerState } from "@/lib/stores/visualizer";
import { bodyById } from "./bodies";
import { filmById } from "./films";
import { finishById } from "./finishes";

export type IconName = "Van" | "Truck" | "CarProfile" | "ForkKnife" | "Boat" | "TrainRegional" | "Toolbox" | "PaintBrushBroad" | "Rainbow" | "Wrench" | "PencilLine" | "Waves" | "Lightning" | "Sparkle" | "MoonStars" | "Butterfly" | "DiscoBall" | "Compass";
export interface Option { value: string; label: string; detail: string; icon: IconName }

export const BODY_OPTIONS: Option[] = [
  { value: "Work Van / Transit", label: "Work van", detail: "Transit, Sprinter, Express", icon: "Van" },
  { value: "Box Truck", label: "Box truck", detail: "16 ft and up", icon: "Truck" },
  { value: "Car / Coupe", label: "Car", detail: "Daily, show, livery", icon: "CarProfile" },
  { value: "Food Truck", label: "Food truck", detail: "Mobile hunger machines", icon: "ForkKnife" },
  { value: "Boat / Marine", label: "Boat", detail: "Marine grade", icon: "Boat" },
  { value: "Trailer / Fleet", label: "Trailer or fleet", detail: "Multi-unit pricing", icon: "TrainRegional" },
  { value: "Something Else", label: "Something else", detail: "Mowers, RC, drums, you name it", icon: "Toolbox" },
];
export const SERVICE_OPTIONS: Option[] = [
  { value: "Full Custom Wrap", label: "Full custom wrap", detail: "Design, print, install", icon: "PaintBrushBroad" },
  { value: "Color Change", label: "Color change", detail: "Factory paint to anything", icon: "Rainbow" },
  { value: "Fleet Graphics", label: "Fleet graphics", detail: "Consistent across every unit", icon: "Wrench" },
  { value: "Lettering / Decals", label: "Lettering and decals", detail: "Cut vinyl, DOT numbers, logos", icon: "PencilLine" },
  { value: "Marine Graphics", label: "Marine graphics", detail: "Hull names, stripes, full wraps", icon: "Waves" },
  { value: "Brand Identity", label: "Brand identity", detail: "Logo up, then the wrap", icon: "Lightning" },
];
export const FILM_OPTIONS: Option[] = [
  { value: "Gloss Laminate", label: "Gloss", detail: "Wet-look depth", icon: "Sparkle" },
  { value: "Satin / Matte", label: "Satin or matte", detail: "Soft sheen to flat", icon: "MoonStars" },
  { value: "Color-Shift / Iridescent", label: "Color-shift", detail: "Flips hue as it drives by", icon: "Butterfly" },
  { value: "Specialty (Chrome/Carbon)", label: "Specialty", detail: "Chrome, carbon, textures", icon: "DiscoBall" },
  { value: "Not Sure — Advise Me", label: "Not sure, advise me", detail: "We'll talk it through", icon: "Compass" },
];

/** Pure mapping from a booth build to the counter's choices. */
export function mapBuildToOrder(b: VisualizerState) {
  const body = bodyById(b.body), film = filmById(b.film), finish = finishById(b.finish);
  const text = (b.text ?? "").trim();
  const bodyOpt = body.workOrderBody;
  const service = ["van", "bus", "rv"].includes(body.id) ? "Full Custom Wrap" : text ? "Lettering / Decals" : "Color Change";
  const filmOpt = film.pearl ? "Color-Shift / Iridescent" : finish.id === "gloss" ? "Gloss Laminate" : "Satin / Matte";
  const buildSpec = `Visualizer build: ${body.id === "custom" ? (b.customName ? `your photo (${b.customName})` : "your photo") : body.display} / ${film.name}, ${finish.name.toLowerCase()}${text ? ` / lettering "${text}"` : ""}`;
  return { body: bodyOpt, service, film: filmOpt, buildSpec };
}
