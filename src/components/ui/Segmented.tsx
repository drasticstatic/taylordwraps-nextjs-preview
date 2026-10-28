"use client";
import clsx from "clsx";
interface Opt<T extends string> { value: T; label: React.ReactNode }
interface Props<T extends string> { value: T; onChange: (v: T) => void; options: Opt<T>[]; label: string }
export function Segmented<T extends string>({ value, onChange, options, label }: Props<T>) {
  return (
    <div role="group" aria-label={label} className="inline-flex p-1 shadow-[inset_0_0_0_1px_var(--line)]">
      {options.map((o) => (
        <button
          key={o.value}
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={clsx("flex items-center gap-2 px-3 py-1.5 text-sm font-semibold transition-colors", value === o.value ? "bg-txt text-ink" : "text-dim hover:text-txt")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
