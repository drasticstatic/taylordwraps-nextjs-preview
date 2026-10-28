"use client";
import { IconContext } from "@phosphor-icons/react";
/** Every Phosphor icon in the carport is duotone. The secondary layer picks up the level's film via CSS (see .ico). */
export function IconProvider({ children }: { children: React.ReactNode }) {
  return <IconContext.Provider value={{ weight: "duotone", size: 20, mirrored: false }}>{children}</IconContext.Provider>;
}
