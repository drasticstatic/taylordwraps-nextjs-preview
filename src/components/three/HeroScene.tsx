"use client";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { Studio } from "./Studio";
import { ProceduralVan, VAN_X_RANGE } from "./ProceduralVan";
import { DrumKit, DRUMS_X_RANGE } from "./DrumKit";
import { PeelController } from "./PeelController";
import { makeFilmMaterial, breathe } from "./materials/films";
import { filmById } from "@/data/films";
import { finishById } from "@/data/finishes";
import { markReady } from "@/lib/stores/assetReady";
import { theme } from "@/lib/stores/theme";

interface Props {
  progress: number;
  onProgress: (p: number) => void;
  body: "van" | "drums";
  reduced: boolean;
  coarse: boolean;
  psy: boolean;
  autowrap: boolean;
  onFail: () => void;
}

function Rig({ body, psy, progressRef, onProgress, autowrap, reduced, coarse, controls, lite, onSlow }: Omit<Props, "onFail" | "progress"> & { progressRef: React.MutableRefObject<number>; controls: React.RefObject<OrbitControlsImpl | null>; lite: boolean; onSlow: () => void }) {
  const xRange = body === "van" ? VAN_X_RANGE : DRUMS_X_RANGE;
  const { material, uniforms } = useMemo(() => makeFilmMaterial(filmById("psyclone"), finishById("gloss"), xRange), [xRange]);
  useEffect(() => () => material.dispose(), [material]);
  const dragging = useRef(false);
  const { invalidate } = useThree();
  const slow = useRef(0);
  useFrame((state, delta) => {
    uniforms.uProgress.value = progressRef.current;
    // a weak GPU shows itself in the first frames: two slow ones in a row and we go lite (DPR 1, no auto-wrap)
    if (!lite) { slow.current = delta > 0.12 ? slow.current + 1 : 0; if (slow.current >= 2) onSlow(); }
    breathe(material, state.clock.elapsedTime, psy && !lite);
    if (psy && !reduced && !lite) invalidate();
  });
  const grab = (e: THREE.Event & { pointerType?: string; stopPropagation?: () => void }) => {
    if (coarse || e.pointerType === "touch") return;
    e.stopPropagation?.();
    dragging.current = true;
    if (controls.current) controls.current.enabled = false;
  };
  return (
    <>
      {body === "van" ? <ProceduralVan wrap={material} onBodyPointerDown={grab} /> : <DrumKit wrap={material} onBodyPointerDown={grab} />}
      <PeelController progressRef={progressRef} onProgress={onProgress} xRange={xRange} autowrap={autowrap && !lite} lite={lite} controls={controls} dragging={dragging} />
    </>
  );
}

function Ready() {
  useEffect(() => { markReady("hero"); }, []);
  return null;
}

export function HeroScene({ progress, onProgress, body, reduced, coarse, psy, autowrap, onFail }: Props) {
  const progressRef = useRef(progress);
  const controls = useRef<OrbitControlsImpl | null>(null);
  const dark = theme.use() === "dark";
  const [lite, setLite] = useState(false);
  // slider / external changes
  useEffect(() => { if (Math.abs(progressRef.current - progress) > 0.011) progressRef.current = progress; }, [progress]);
  return (
    <Canvas
      frameloop="demand"
      dpr={lite ? 1 : [1, 1.25]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ touchAction: "pan-y" }}
      data-engine="webgl"
      onCreated={({ gl }) => {
        gl.domElement.setAttribute("data-engine", "webgl");
        gl.domElement.dataset.lite = "false";
        gl.domElement.setAttribute("aria-label", "A 3D van you can orbit. Drag the van to wrap it; drag the floor to orbit.");
        gl.domElement.addEventListener("webglcontextlost", (e) => { e.preventDefault(); onFail(); }, { once: true });
      }}
      onError={() => onFail()}
    >
      <PerspectiveCamera makeDefault fov={32} position={[7.5, 2.6, 6.5]} />
      <Suspense fallback={null}>
        <Studio dark={dark} />
        <Rig key={body} body={body} psy={psy} progressRef={progressRef} onProgress={onProgress} autowrap={autowrap} reduced={reduced} coarse={coarse} controls={controls} lite={lite} onSlow={() => setLite(true)} />
        <Ready />
      </Suspense>
      <OrbitControls
        ref={controls}
        makeDefault
        target={[0, 0.9, 0]}
        enablePan={false}
        minDistance={6}
        maxDistance={11}
        minPolarAngle={0.85}
        maxPolarAngle={1.45}
        enableDamping
        dampingFactor={0.08}
        rotateSpeed={0.6}
        zoomSpeed={0.5}
        touches={{ ONE: -1 as unknown as THREE.TOUCH, TWO: THREE.TOUCH.DOLLY_ROTATE }}
      />
    </Canvas>
  );
}
