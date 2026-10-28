"use client";
import { useSyncExternalStore } from "react";
import { readStorage, writeStorage, type StorageKind } from "../storage";

export interface Store<T> {
  use(): T;
  get(): T;
  set(value: T): void;
  update(fn: (prev: T) => T): void;
  subscribe(listener: () => void): () => void;
}

interface PersistedOptions<T> {
  key: string;
  server: T;
  parse: (raw: string | null) => T;
  serialize: (value: T) => string | null;
  apply?: (value: T) => void;
  storage?: StorageKind;
}

/**
 * Module-level store read through useSyncExternalStore (the fleet's useDaylight pattern).
 * The server snapshot is a stable constant, so hydration never mismatches; the first client render
 * after hydration flips to the stored value and `apply` keeps <html> in step with it.
 */
export function createPersistedStore<T>(o: PersistedOptions<T>): Store<T> {
  const storage = o.storage ?? "local";
  let cached: T | undefined;
  let initialized = false;
  const listeners = new Set<() => void>();
  const read = (): T => {
    if (!initialized) {
      initialized = true;
      cached = o.parse(readStorage(storage, o.key));
    }
    return cached as T;
  };
  const get = () => (typeof window === "undefined" ? o.server : read());
  const set = (value: T) => {
    cached = value;
    initialized = true;
    writeStorage(storage, o.key, o.serialize(value));
    o.apply?.(value);
    listeners.forEach((l) => l());
  };
  const subscribe = (l: () => void) => {
    listeners.add(l);
    return () => void listeners.delete(l);
  };
  return {
    use: () => useSyncExternalStore(subscribe, get, () => o.server),
    get,
    set,
    update: (fn) => set(fn(get())),
    subscribe,
  };
}

/** In-memory store with the same shape; for toasts, scrollspy, wallet, readiness. */
export function createMemoryStore<T>(initial: T): Store<T> {
  let value = initial;
  const listeners = new Set<() => void>();
  const get = () => value;
  const set = (v: T) => { value = v; listeners.forEach((l) => l()); };
  const subscribe = (l: () => void) => { listeners.add(l); return () => void listeners.delete(l); };
  return { use: () => useSyncExternalStore(subscribe, get, () => initial), get, set, update: (fn) => set(fn(value)), subscribe };
}

export const boolParse = (fallback: boolean) => (raw: string | null) => (raw === null ? fallback : raw === "true");
export const boolSerialize = (v: boolean) => String(v);
export const htmlClass = (cls: string, on: boolean) => {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle(cls, on);
};
export const htmlData = (name: string, value: string) => {
  if (typeof document === "undefined") return;
  document.documentElement.dataset[name] = value;
};
