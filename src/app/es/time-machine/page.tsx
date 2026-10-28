import type { Metadata } from "next";
import { esMetadata } from "@/i18n/metadata";
export const metadata: Metadata = esMetadata({ title: "Máquina del tiempo", description: "Cada época de esta muestra sigue abierta." }, "/time-machine");
export { default } from "../../time-machine/page";
