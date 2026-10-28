"use client";
import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

interface Props {
  progressRef: React.MutableRefObject<number>;
  onProgress: (p: number) => void;
  xRange: [number, number];
  autowrap: boolean;
  lite: boolean;
  controls: React.RefObject<OrbitControlsImpl | null>;
  /** called by the body mesh's onPointerDown */
  dragging: React.MutableRefObject<boolean>;
}
const vA = new THREE.Vector3(), vB = new THREE.Vector3();

/**
 * Turns pointer x into wrap progress by projecting the body's x-extremes to screen space every frame,
 * so dragging works from any orbit angle. Also runs the one orchestrated moment: the auto-wrap on load.
 */
export function PeelController({ progressRef, onProgress, xRange, autowrap, lite, controls, dragging }: Props) {
  const { camera, gl, invalidate } = useThree();
  const anim = useRef<{ t0: number; from: number; to: number; ms: number; then?: () => void } | null>(null);
  const lastPct = useRef(-1);
  const touched = useRef(false);

  // lite: finish whatever is animating right now, settle, and stop asking for frames
  useEffect(() => {
    if (!lite) return;
    anim.current = null; progressRef.current = 0.82; onProgress(0.82); invalidate();
    gl.domElement.dataset.lite = "true";
  }, [lite, gl, invalidate, onProgress, progressRef]);
  useEffect(() => {
    if (!autowrap) { if (!lite) { progressRef.current = 1; onProgress(1); invalidate(); } return; }
    anim.current = { t0: performance.now(), from: 0.1, to: 0.99, ms: 2600, then: () => {
      setTimeout(() => { if (!touched.current) { anim.current = { t0: performance.now(), from: 0.99, to: 0.22, ms: 1400 }; invalidate(); } }, 1500);
    } };
    invalidate();
  }, [autowrap, invalidate, onProgress, progressRef]);

  useEffect(() => {
    const el = gl.domElement;
    const mapX = (clientX: number) => {
      const r = el.getBoundingClientRect();
      const ndc = ((clientX - r.left) / r.width) * 2 - 1;
      vA.set(xRange[0], 1, 0).project(camera); vB.set(xRange[1], 1, 0).project(camera);
      const lo = Math.min(vA.x, vB.x), hi = Math.max(vA.x, vB.x);
      const raw = (ndc - lo) / Math.max(0.05, hi - lo);
      return vA.x < vB.x ? raw : 1 - raw;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging.current) return;
      anim.current = null; touched.current = true;
      progressRef.current = Math.max(0, Math.min(1, mapX(e.clientX)));
      invalidate();
    };
    const onUp = () => { if (dragging.current) { dragging.current = false; if (controls.current) controls.current.enabled = true; } };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => { window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerup", onUp); window.removeEventListener("pointercancel", onUp); };
  }, [camera, gl, xRange, controls, dragging, invalidate, progressRef]);

  useFrame(() => {
    const a = anim.current;
    if (a) {
      const k = Math.min(1, (performance.now() - a.t0) / a.ms);
      const e = 1 - Math.pow(1 - k, 3);
      progressRef.current = a.from + (a.to - a.from) * e;
      if (k >= 1) { anim.current = null; a.then?.(); } else invalidate();
    }
    const pct = Math.round(progressRef.current * 100);
    if (pct !== lastPct.current) { lastPct.current = pct; onProgress(progressRef.current); }
  });
  return null;
}
