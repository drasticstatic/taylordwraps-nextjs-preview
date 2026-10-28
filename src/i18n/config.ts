import { es } from "./es";
export type Locale = "en" | "es";
/** Routes with a Spanish twin under /es/ ("/" is home). Add a route once its page is translated. */
export const ES_ROUTES: string[] = ["/", "/time-machine"];
export function localeFromPath(path: string | null | undefined): Locale {
  return path === "/es" || path?.startsWith("/es/") ? "es" : "en";
}
export function translate(locale: Locale, text: string): string {
  return locale === "es" ? es[text] ?? text : text;
}
export function localizeHref(locale: Locale, href: string): string {
  if (locale !== "es" || !href.startsWith("/") || href.startsWith("//") || href.startsWith("/es")) return href;
  const [path, rest = ""] = href.split(/(?=[?#])/);
  const route = path.replace(/\/+$/, "") || "/";
  if (!ES_ROUTES.includes(route)) return href;
  return `/es${route === "/" ? "/" : `${route}/`}${rest}`;
}
export function delocalizeHref(href: string): string {
  return href.replace(/^\/es(?=\/|$)/, "") || "/";
}
