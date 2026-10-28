"use client";
import { useMemo } from "react";
import * as THREE from "three";

export const VAN_X_RANGE: [number, number] = [-2.52, 2.52];

/** A stylized cargo van from primitives: an extruded side profile for the body, boxes and cylinders for the rest. */
export function ProceduralVan({ wrap, onBodyPointerDown }: { wrap: THREE.Material; onBodyPointerDown?: (e: THREE.Event & { clientX?: number }) => void }) {
  const body = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-2.45, 0.45);
    s.lineTo(-2.45, 1.95); s.quadraticCurveTo(-2.45, 2.05, -2.35, 2.05);
    s.lineTo(0.85, 2.05);
    s.lineTo(1.55, 1.42);
    s.lineTo(2.3, 1.08);
    s.quadraticCurveTo(2.45, 1.0, 2.45, 0.85);
    s.lineTo(2.45, 0.55);
    s.lineTo(2.2, 0.45);
    s.closePath();
    const g = new THREE.ExtrudeGeometry(s, { depth: 1.95, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 3, curveSegments: 10 });
    g.translate(0, 0, -0.975);
    g.computeVertexNormals();
    return g;
  }, []);
  const dark = useMemo(() => new THREE.MeshStandardMaterial({ color: "#15151b", roughness: 0.6, metalness: 0.2 }), []);
  const glass = useMemo(() => new THREE.MeshPhysicalMaterial({ color: "#0b0f16", roughness: 0.05, metalness: 0.1, clearcoat: 1, envMapIntensity: 1.4 }), []);
  const tire = useMemo(() => new THREE.MeshStandardMaterial({ color: "#0e0e12", roughness: 0.95 }), []);
  const rim = useMemo(() => new THREE.MeshStandardMaterial({ color: "#c9ccd6", roughness: 0.3, metalness: 0.9 }), []);
  const lampF = useMemo(() => new THREE.MeshStandardMaterial({ color: "#f5f5ff", emissive: "#ffffff", emissiveIntensity: 0.7, roughness: 0.2 }), []);
  const lampR = useMemo(() => new THREE.MeshStandardMaterial({ color: "#ff3b3b", emissive: "#ff1f1f", emissiveIntensity: 0.6, roughness: 0.3 }), []);
  const wheels: [number, number][] = [[1.55, 1.0], [1.55, -1.0], [-1.55, 1.0], [-1.55, -1.0]];
  return (
    <group name="van">
      <mesh geometry={body} material={wrap} castShadow onPointerDown={onBodyPointerDown as never} />
      {/* windshield on the slope between (0.85,2.05) and (1.55,1.42) */}
      <mesh position={[1.22, 1.75, 0]} rotation={[0, 0, -0.73]} material={glass}><boxGeometry args={[0.92, 0.03, 1.6]} /></mesh>
      {/* front door windows */}
      {[1.045, -1.045].map((z) => <mesh key={z} position={[0.2, 1.62, z]} material={glass}><boxGeometry args={[0.8, 0.48, 0.03]} /></mesh>)}
      {/* rear door windows */}
      {[0.5, -0.5].map((z) => <mesh key={z} position={[-2.52, 1.6, z]} material={glass}><boxGeometry args={[0.03, 0.5, 0.74]} /></mesh>)}
      {/* bumpers, grille, rockers */}
      <mesh position={[2.52, 0.5, 0]} material={dark}><boxGeometry args={[0.26, 0.3, 2.0]} /></mesh>
      <mesh position={[-2.52, 0.5, 0]} material={dark}><boxGeometry args={[0.2, 0.3, 2.0]} /></mesh>
      <mesh position={[2.48, 0.86, 0]} material={dark}><boxGeometry args={[0.06, 0.34, 1.1]} /></mesh>
      {[0, 1, 2, 3, 4].map((i) => <mesh key={i} position={[2.52, 0.74 + i * 0.06, 0]} material={rim}><boxGeometry args={[0.02, 0.015, 1.0]} /></mesh>)}
      {[1.0, -1.0].map((z) => <mesh key={z} position={[0, 0.42, z]} material={dark}><boxGeometry args={[4.6, 0.08, 0.1]} /></mesh>)}
      {/* lamps */}
      {[0.72, -0.72].map((z) => <mesh key={z} position={[2.5, 1.0, z]} material={lampF}><boxGeometry args={[0.06, 0.16, 0.34]} /></mesh>)}
      {[0.86, -0.86].map((z) => <mesh key={z} position={[-2.5, 1.25, z]} material={lampR}><boxGeometry args={[0.04, 0.5, 0.16]} /></mesh>)}
      {/* mirrors */}
      {[1.2, -1.2].map((z) => (
        <group key={z} position={[1.45, 1.55, z]}>
          <mesh material={dark}><boxGeometry args={[0.12, 0.2, 0.09]} /></mesh>
          <mesh position={[0, 0, z > 0 ? -0.12 : 0.12]} material={dark}><boxGeometry args={[0.04, 0.04, 0.16]} /></mesh>
        </group>
      ))}
      {/* roof rails */}
      {[0.7, -0.7].map((z) => <mesh key={z} position={[-0.7, 2.14, z]} material={dark}><boxGeometry args={[2.8, 0.06, 0.06]} /></mesh>)}
      {/* wheels */}
      {wheels.map(([x, z]) => (
        <group key={`${x}${z}`} position={[x, 0.42, z]} rotation={[Math.PI / 2, 0, 0]}>
          <mesh material={tire}><cylinderGeometry args={[0.42, 0.42, 0.28, 32]} /></mesh>
          <mesh material={rim}><cylinderGeometry args={[0.26, 0.26, 0.3, 16]} /></mesh>
          <mesh material={dark} position={[0, z > 0 ? 0.16 : -0.16, 0]}><cylinderGeometry args={[0.08, 0.08, 0.02, 12]} /></mesh>
        </group>
      ))}
    </group>
  );
}
