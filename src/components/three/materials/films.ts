import * as THREE from "three";
import { type Film } from "@/data/films";
import { type Finish } from "@/data/finishes";
import { applyWrap, type WrapUniforms } from "./wrapChunk";

export interface WrappedMaterial { material: THREE.MeshPhysicalMaterial; uniforms: WrapUniforms }

/**
 * One material per (film, finish). Standard films are clearcoated paint. Pearl films (PSYCLONE) are real
 * thin-film interference: three's physically based iridescence, so the hue flips with the view angle the
 * way color-flip vinyl does under the shop lights. Decided here over a hand-written interference shader
 * because three's model is the same physics with the environment lighting already wired in.
 */
export function makeFilmMaterial(film: Film, finish: Finish, xRange: [number, number]): WrappedMaterial {
  const base = new THREE.Color().setHSL(film.hue / 360, film.sat / 100, film.light / 100 * 0.75);
  const material = new THREE.MeshPhysicalMaterial({
    color: base,
    roughness: finish.three.roughness,
    metalness: film.pearl ? 0.35 : 0.1,
    clearcoat: finish.three.clearcoat,
    clearcoatRoughness: finish.three.clearcoatRoughness,
    envMapIntensity: 1.1,
  });
  if (film.pearl) {
    material.iridescence = 1;
    material.iridescenceIOR = 1.45;
    material.iridescenceThicknessRange = [180, 620];
    material.sheen = 0.35;
    material.sheenColor = new THREE.Color().setHSL(((film.hue + film.spread[1]) % 360) / 360, 0.8, 0.6);
  }
  const uniforms = applyWrap(material, xRange);
  uniforms.uEdgeGlow.value.setHSL(((film.hue + film.spread[0]) % 360) / 360, 0.9, 0.62);
  uniforms.uFilmB.value.set(film.swatch[1]).multiplyScalar(0.8);
  uniforms.uFilmC.value.set(film.swatch[2]).multiplyScalar(0.8);
  return { material, uniforms };
}

/** PSYCLONE breathing: the film's thickness drifts so the flip never sits still. */
export function breathe(m: THREE.MeshPhysicalMaterial, t: number, on: boolean) {
  if (!m.iridescence) return;
  const k = on ? Math.sin(t * 0.6) * 70 : 0;
  m.iridescenceThicknessRange = [180 + k, 620 + k];
}
