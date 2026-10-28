"use client";
import { createMemoryStore } from "./createStore";
export const eggs = createMemoryStore<{ dogRuns: number }>({ dogRuns: 0 });
