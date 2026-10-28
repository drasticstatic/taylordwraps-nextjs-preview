"use client";
import { useEffect } from "react";
import { decodeBuild } from "@/lib/wrapSpec";
import { visualizer, DEFAULT_BUILD } from "@/lib/stores/visualizer";
import { toast } from "@/lib/stores/toast";
/** Opens the booth to a build carried in the URL fragment (from a share link or from THE CAR SHOW). */
export function useBuildLink() {
  useEffect(() => {
    const apply = () => {
      const spec = decodeBuild(location.hash);
      if (!spec) return;
      visualizer.set({ ...DEFAULT_BUILD, ...visualizer.get(), body: spec.body, film: spec.film, finish: spec.finish, text: spec.text ?? "", textPos: spec.textPos ?? DEFAULT_BUILD.textPos, customUrl: null, customName: null });
      document.getElementById("visualizer")?.scrollIntoView({ block: "start" });
      toast(spec.from === "carshow" ? "Build arrived from the Car Show." : "Build loaded from your link.");
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);
}
