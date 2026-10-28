import { Van, Receipt, PaintRoller, ClipboardText, Dog, Flask, Door } from "@phosphor-icons/react/dist/ssr";
import type { IconProps } from "@phosphor-icons/react";
import type { Level } from "@/data/levels";
const MAP = { Van, Receipt, PaintRoller, ClipboardText, Dog, Flask, Door } as const;
export function LevelIcon({ name, ...rest }: { name: Level["icon"] } & IconProps) {
  const C = MAP[name as keyof typeof MAP] ?? Van;
  return <C weight="duotone" {...rest} />;
}
