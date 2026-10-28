"use client";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
/** Two layers drift at different depths as the street level scrolls away. Still under reduced motion. */
export function HeroParallax({ copy, stage }: { copy: React.ReactNode; stage: React.ReactNode }) {
  const { scrollY } = useScroll();
  const reduced = useReducedMotion();
  const yCopy = useTransform(scrollY, [0, 600], [0, reduced ? 0 : -40]);
  const yStage = useTransform(scrollY, [0, 600], [0, reduced ? 0 : 50]);
  return (
    <>
      <motion.div style={{ y: yCopy }}>{copy}</motion.div>
      <motion.div style={{ y: yStage }}>{stage}</motion.div>
    </>
  );
}
