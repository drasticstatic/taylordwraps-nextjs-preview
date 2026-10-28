"use client";
import { useRef } from "react";
import { X } from "@phosphor-icons/react";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { Z } from "@/lib/z";
interface Props { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }
/** A dialog with a focus trap, Escape, backdrop click, and focus restore. One cut corner like every panel. */
export function ModalShell({ open, onClose, title, children, wide }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useFocusTrap(ref, open, onClose);
  if (!open) return null;
  return (
    <div className="fixed inset-0 grid place-items-center bg-black/60 p-4" style={{ zIndex: Z.modal }} onClick={onClose}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby="modal-title" className={`panel max-h-[90vh] w-full overflow-y-auto p-6 ${wide ? "max-w-4xl" : "max-w-xl"}`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="display text-3xl">{title}</h2>
          <button onClick={onClose} className="p-2" aria-label="Close" data-autofocus><X size={22} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
