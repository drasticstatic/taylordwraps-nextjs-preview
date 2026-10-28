"use client";
import { useEffect, useState } from "react";
import { Fingerprint, SealCheck, Warning } from "@phosphor-icons/react";
import { hashAsset, loadManifest } from "@/lib/hashAsset";
import { toast } from "@/lib/stores/toast";
/** Wrap Origin: the finished asset's SHA-256, computed in your browser and checked against the shipped manifest. */
export function OriginHashChip({ file }: { file?: string }) {
  const [state, setState] = useState<{ hash?: string; ok?: boolean | null; err?: string }>({});
  useEffect(() => {
    if (!file) return;
    let alive = true;
    (async () => {
      try {
        const [hash, man] = await Promise.all([hashAsset(file), loadManifest()]);
        if (alive) setState({ hash, ok: man[file] ? man[file] === hash : null });
      } catch { if (alive) setState({ err: "offline" }); }
    })();
    return () => { alive = false; };
  }, [file]);
  if (!file) return <span className="readout inline-flex items-center gap-1 text-dim"><Fingerprint size={14} />photo pending, hash on intake</span>;
  if (state.err) return <span className="readout text-dim">hash unavailable offline</span>;
  if (!state.hash) return <span className="readout text-dim">hashing in your browser</span>;
  return (
    <button onClick={() => navigator.clipboard.writeText(state.hash!).then(() => toast("Full hash copied."))} className="readout inline-flex items-center gap-1 text-left hover:text-txt" title={`SHA-256 ${state.hash}. Click to copy.`} data-hash-state={state.ok === true ? "verified" : state.ok === false ? "mismatch" : "unlisted"}>
      {state.ok === true ? <SealCheck size={14} className="text-teal" /> : state.ok === false ? <Warning size={14} className="text-amber" /> : <Fingerprint size={14} />}
      sha-256 {state.hash.slice(0, 16)}&hellip; {state.ok === true ? "verified" : state.ok === false ? "mismatch" : ""}
    </button>
  );
}
