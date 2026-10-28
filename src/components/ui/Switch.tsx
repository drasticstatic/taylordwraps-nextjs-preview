"use client";
import clsx from "clsx";
interface Props { checked: boolean; onChange: (v: boolean) => void; label: string; hint?: string; id: string }
export function Switch({ checked, onChange, label, hint, id }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <label htmlFor={id} className="flex-1 cursor-pointer">
        <span className="block font-semibold">{label}</span>
        {hint && <span className="block text-sm text-dim">{hint}</span>}
      </label>
      <button
        id={id}
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={clsx("relative mt-1 h-7 w-12 shrink-0 rounded-full transition-colors", checked ? "bg-teal" : "bg-panel-2 shadow-[inset_0_0_0_1px_var(--line)]")}
      >
        <span className={clsx("absolute top-1 h-5 w-5 rounded-full bg-ink transition-transform", checked ? "translate-x-6" : "translate-x-1")} />
      </button>
    </div>
  );
}
