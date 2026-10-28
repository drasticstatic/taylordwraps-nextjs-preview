"use client";
import { createMemoryStore } from "./createStore";
export const ui = createMemoryStore<{ drawerOpen: boolean; momOpen?: boolean }>({ drawerOpen: false, momOpen: false });
