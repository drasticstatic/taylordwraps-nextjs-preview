"use client";
import { useMemo } from "react";
import * as THREE from "three";

export const DRUMS_X_RANGE: [number, number] = [-1.4, 1.4];

/** A drum kit from cylinders. Shells take the wrap; heads, cymbals and hardware do not. The kick head faces the crowd (+z). */
export function DrumKit({ wrap, onBodyPointerDown }: { wrap: THREE.Material; onBodyPointerDown?: (e: THREE.Event) => void }) {
  const head = useMemo(() => new THREE.MeshStandardMaterial({ color: "#efe9dc", roughness: 0.85 }), []);
  const hoop = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d9dbe3", roughness: 0.3, metalness: 0.9 }), []);
  const brass = useMemo(() => new THREE.MeshStandardMaterial({ color: "#d4a84b", roughness: 0.25, metalness: 1 }), []);
  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: "#9aa0ad", roughness: 0.35, metalness: 0.9 }), []);
  const Shell = ({ r, h, pos, rot = [0, 0, 0] as [number, number, number] }: { r: number; h: number; pos: [number, number, number]; rot?: [number, number, number] }) => (
    <group position={pos} rotation={rot}>
      <mesh material={wrap} castShadow onPointerDown={onBodyPointerDown as never}><cylinderGeometry args={[r, r, h, 48, 1, true]} /></mesh>
      <mesh material={head} position={[0, h / 2 + 0.004, 0]}><circleGeometry args={[r * 0.98, 48]} /></mesh>
      <mesh material={head} position={[0, -h / 2 - 0.004, 0]} rotation={[Math.PI, 0, 0]}><circleGeometry args={[r * 0.98, 48]} /></mesh>
      {[h / 2, -h / 2].map((y) => <mesh key={y} material={hoop} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[r, 0.018, 8, 48]} /></mesh>)}
    </group>
  );
  const Cymbal = ({ r, pos, tilt = 0.12 }: { r: number; pos: [number, number, number]; tilt?: number }) => (
    <group position={pos} rotation={[tilt, 0, tilt * 0.6]}>
      <mesh material={brass}><cylinderGeometry args={[r, r, 0.008, 64]} /></mesh>
      <mesh material={brass} position={[0, 0.02, 0]}><cylinderGeometry args={[r * 0.18, r * 0.22, 0.04, 32]} /></mesh>
      <mesh material={steel} position={[0, -pos[1] / 2, 0]}><cylinderGeometry args={[0.015, 0.015, pos[1], 8]} /></mesh>
    </group>
  );
  return (
    <group name="drums">
      {/* kick, on its side, head facing +z */}
      <Shell r={0.56} h={0.46} pos={[0, 0.56, 0]} rot={[Math.PI / 2, 0, 0]} />
      <Shell r={0.35} h={0.16} pos={[-0.75, 0.82, 0.55]} />
      <Shell r={0.3} h={0.26} pos={[-0.32, 1.3, -0.1]} rot={[0.3, 0, 0.1]} />
      <Shell r={0.33} h={0.28} pos={[0.36, 1.32, -0.1]} rot={[0.3, 0, -0.1]} />
      <Shell r={0.4} h={0.42} pos={[0.95, 0.6, 0.5]} />
      <Cymbal r={0.36} pos={[-1.15, 1.25, 0.1]} />
      <Cymbal r={0.42} pos={[-0.95, 1.75, -0.65]} />
      <Cymbal r={0.5} pos={[1.15, 1.55, -0.55]} />
      {/* kick pedal + spurs + throne hint */}
      <mesh material={steel} position={[0, 0.03, 0.78]}><boxGeometry args={[0.12, 0.02, 0.3]} /></mesh>
      {[-0.5, 0.5].map((x) => <mesh key={x} material={steel} position={[x, 0.15, 0.25]} rotation={[0.5, 0, x > 0 ? -0.4 : 0.4]}><cylinderGeometry args={[0.012, 0.012, 0.5, 8]} /></mesh>)}
    </group>
  );
}
