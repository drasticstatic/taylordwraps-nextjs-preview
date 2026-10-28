"use client";
import { useEffect, useState } from "react";
import { Broom, Eraser, Knife, Fire, Drop } from "@phosphor-icons/react";
import { toolbox } from "@/lib/stores/toolbox";
import { overInteractive } from "@/engines/canvasHost";
import { useFinePointer } from "@/lib/media";
import { Z } from "@/lib/z";
const ICONS = { squeegee: Broom, eraser: Eraser, blade: Knife, heat: Fire, film: Drop, none: null } as const;
/** When a tool is in hand, the cursor becomes the tool, until it hovers anything you could click. */
export function ToolCursor() {
  const tb = toolbox.use();
  const fine = useFinePointer();
  const [pos, setPos] = useState<{ x: number; y: number; hide: boolean } | null>(null);
  const active = tb.shown && tb.tool !== "none" && fine;
  useEffect(() => {
    if (!active) { setPos(null); return; }
    const onMove = (e: PointerEvent) => setPos({ x: e.clientX, y: e.clientY, hide: overInteractive(e.target) });
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [active]);
  if (!active || !pos || pos.hide) return null;
  const Icon = ICONS[tb.tool];
  if (!Icon) return null;
  return (
    <div className="pointer-events-none fixed" style={{ left: pos.x, top: pos.y, zIndex: Z.toolCursor, transform: "translate(-30%,-70%)", color: tb.tool === "film" ? tb.film : "var(--color-teal)" }} aria-hidden="true">
      <Icon size={28} weight="duotone" />
    </div>
  );
}
