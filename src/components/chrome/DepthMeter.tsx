"use client";
import { usePathname } from "next/navigation";
import { LEVELS } from "@/data/levels";
import { scrollspy } from "@/lib/stores/scrollspy";
/** The right-edge rail that counts floors as you descend. Only on the home descent, only with room to spare. */
export function DepthMeter() {
  const spy = scrollspy.use();
  const path = usePathname();
  if (!(path === "/" || path === "/es/" || path === "/es")) return null;
  return (
    <div className="no-print fixed right-3 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-2 min-[1100px]:flex" aria-hidden="true">
      {LEVELS.map((l) => {
        const here = spy.activeId === l.id;
        return (
          <a key={l.id} href={`#${l.id}`} className="group flex items-center gap-2" tabIndex={-1}>
            <span className={`readout origin-right text-[0.62rem] transition-opacity ${here ? "text-teal opacity-100" : "text-dim opacity-0 group-hover:opacity-100"}`}>{l.floor}</span>
            <span className={`block h-[2px] transition-all ${here ? "w-6 bg-teal" : "w-3 bg-line"}`} />
          </a>
        );
      })}
    </div>
  );
}
