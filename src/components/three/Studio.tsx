"use client";
import { ContactShadows, Environment, Grid, Lightformer } from "@react-three/drei";
/** The design lab: a procedural light box (no HDR file), a contact shadow, and the CAD grid. Background stays transparent. */
export function Studio({ dark }: { dark: boolean }) {
  return (
    <>
      <Environment resolution={64} frames={1} background={false}>
        <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 5, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[7, 1.6, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#dcd8ff" position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={1.0} color="#cffcf5" position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} scale={[4, 2, 1]} />
        <Lightformer form="rect" intensity={0.7} color="#ec4899" position={[2, 0.6, 5]} rotation={[0, Math.PI, 0]} scale={[3, 1, 1]} />
        <Lightformer form="ring" intensity={0.5} color="#a855f7" position={[-3, 3, -4]} scale={[2, 2, 1]} />
      </Environment>
      <hemisphereLight args={[dark ? "#c9c4ff" : "#ffffff", dark ? "#101017" : "#cfcbc3", 0.5]} />
      <directionalLight position={[4, 6, 3]} intensity={1.4} />
      <ContactShadows position={[0, 0.005, 0]} opacity={dark ? 0.6 : 0.4} scale={12} blur={2.4} far={3} frames={1} />
      <Grid infiniteGrid cellSize={0.5} sectionSize={2.5} cellThickness={0.6} sectionThickness={1.1} cellColor={dark ? "#1e2a2a" : "#c9d9d5"} sectionColor={dark ? "#2dd4bf" : "#14b8a6"} fadeDistance={18} fadeStrength={1.4} position={[0, 0, 0]} />
    </>
  );
}
