import type { Metadata } from "next";
import { esMetadata } from "@/i18n/metadata";
import { shop } from "@/data/business";
export const metadata: Metadata = esMetadata({ title: `${shop.name} | ${shop.motto}`, description: "Un taller de vinilo en Warminster, PA. Una muestra de drasticstatic labs." }, "/");
export default function EsLayout({ children }: { children: React.ReactNode }) { return children; }
