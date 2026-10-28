"use client";
import { useEffect } from "react";
import { setActiveLevel } from "@/lib/stores/scrollspy";
/** Watches every [data-level] section and keeps the scrollspy store (and html[data-level]) current. */
export function useScrollSpy() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("section[data-level]"));
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActiveLevel(e.target.id, Number((e.target as HTMLElement).dataset.level));
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);
}
