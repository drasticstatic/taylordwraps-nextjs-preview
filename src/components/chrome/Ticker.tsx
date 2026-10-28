import { Diamond } from "@phosphor-icons/react/dist/ssr";
import { ticker } from "@/data/business";
import { Z } from "@/lib/z";
/** The strip that never leaves: the motto words on a loop, the credit line beside them. */
export function Ticker() {
  const words = [...ticker.words, ...ticker.words];
  return (
    <div className="ticker fixed inset-x-0 bottom-0 flex h-[46px] items-center overflow-hidden border-t border-line bg-ink no-print" style={{ zIndex: Z.ticker }} aria-hidden="true">
      <div className="ticker-track items-center gap-6 pr-6">
        {words.map((w, i) => (
          <span key={i} className="flex items-center gap-6 whitespace-nowrap text-sm font-semibold uppercase tracking-wide">
            {w}<Diamond size={10} weight="fill" className="text-magenta" />
          </span>
        ))}
      </div>
      <div className="readout hidden shrink-0 border-l border-line px-4 text-dim lg:block">{ticker.credit}</div>
    </div>
  );
}
