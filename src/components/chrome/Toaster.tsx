"use client";
import { toasts } from "@/lib/stores/toast";
import { Z } from "@/lib/z";
export function Toaster() {
  const list = toasts.use();
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-16 flex flex-col items-center gap-2 px-4" style={{ zIndex: Z.toast }} role="status" aria-live="polite">
      {list.map((t) => (
        <div key={t.id} className="panel bg-txt px-4 py-2 text-sm font-semibold text-ink">{t.text}</div>
      ))}
    </div>
  );
}
