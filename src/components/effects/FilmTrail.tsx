"use client";
import { useEffect } from "react";
import { runFilmTrail } from "@/engines/trailEngine";
export function FilmTrail() {
  useEffect(() => runFilmTrail(), []);
  return null;
}
