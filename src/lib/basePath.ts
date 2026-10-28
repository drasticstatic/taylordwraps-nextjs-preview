// Static export on a GitHub Pages subpath: next/link and next/font prefix themselves, but plain <img src>,
// fetch() and metadata icons do not. Route every public/ URL through asset().
export function getBasePath(): string {
  return process.env.NEXT_PUBLIC_BASE_PATH ?? "";
}
export function asset(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${getBasePath()}${p}`;
}
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://drasticstatic.github.io";
export const LANE = process.env.NEXT_PUBLIC_LANE ?? "carport";
