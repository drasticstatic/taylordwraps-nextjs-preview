export type StorageKind = "local" | "session";
export function readStorage(kind: StorageKind, key: string): string | null {
  try {
    return (kind === "local" ? window.localStorage : window.sessionStorage).getItem(key);
  } catch {
    return null;
  }
}
export function writeStorage(kind: StorageKind, key: string, value: string | null): void {
  try {
    const s = kind === "local" ? window.localStorage : window.sessionStorage;
    if (value === null) s.removeItem(key);
    else s.setItem(key, value);
  } catch {
    /* private mode, blocked storage: the page still works, it just forgets */
  }
}
