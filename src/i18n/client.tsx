"use client";
import { useCallback, useEffect, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { localeFromPath, translate, type Locale } from "./config";
import { lang } from "@/lib/stores/lang";

const subscribeNever = () => () => {};

/**
 * /es/ pages are Spanish. Everywhere else the visitor's stored choice wins (the drawer's switch, or the
 * arrival kit's doors). The server snapshot is English, so hydration never mismatches; the stored choice
 * applies on the first client render after it. The one 404 page hydrates in English regardless.
 */
export function useLocale(): Locale {
  const fromPath = localeFromPath(usePathname());
  const stored = lang.use();
  const hydrating = useSyncExternalStore(subscribeNever, () => false, () => true);
  const notFound = typeof window !== "undefined" && (window as { __notFoundPage?: boolean }).__notFoundPage === true;
  if (notFound && hydrating) return "en";
  return fromPath === "es" ? "es" : stored;
}
export function T({ children }: { children?: ReactNode }) {
  const locale = useLocale();
  return <>{typeof children === "string" ? translate(locale, children) : children}</>;
}
export function useT() {
  const locale = useLocale();
  return useCallback(<S extends string | undefined>(text: S): S => (typeof text === "string" ? translate(locale, text) : text) as S, [locale]);
}
/** Keeps <html lang> right as the choice changes; the head script sets it for first paint. */
export function HtmlLang() {
  const locale = useLocale();
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  return null;
}
