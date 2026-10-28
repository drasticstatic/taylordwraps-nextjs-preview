import { asset } from "@/lib/basePath";
export function HeroStill() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={asset("/assets/van_after.jpg")} alt="A work van wrapped edge to edge in color-flip film, violet turning to teal" className="h-full w-full object-cover" loading="eager" fetchPriority="high" />
  );
}
