import type { Metadata } from "next";
import { getBasePath, SITE_URL } from "@/lib/basePath";
import { translate, type Locale } from "./config";
const SITE = `${SITE_URL.replace(/\/$/, "")}${getBasePath()}`;
export function pageUrl(route: string, locale: Locale): string {
  const path = route === "/" ? "/" : `${route}/`;
  return `${SITE}${locale === "es" ? `/es${path}` : path}`;
}
export function alternatesFor(route: string, locale: Locale): Metadata["alternates"] {
  return { canonical: pageUrl(route, locale), languages: { en: pageUrl(route, "en"), es: pageUrl(route, "es"), "x-default": pageUrl(route, "en") } };
}
/** The Spanish twin's metadata, derived from the English page's. */
export function esMetadata(en: Metadata, route: string): Metadata {
  const title = typeof en.title === "string" ? translate("es", en.title) : en.title;
  const description = en.description ? translate("es", en.description) : en.description;
  return { ...en, title, description, alternates: alternatesFor(route, "es"), openGraph: { ...(en.openGraph ?? {}), locale: "es_ES", url: pageUrl(route, "es") } };
}
