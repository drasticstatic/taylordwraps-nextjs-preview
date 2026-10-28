"use client";
import { Wallet, Plugs, LockKey, LockKeyOpen, ArrowUpRight, SealCheck } from "@phosphor-icons/react";
import type { Level as LevelT } from "@/data/levels";
import { Level } from "@/components/chrome/Level";
import { RECEIPTS } from "@/data/receipts";
import { VAULT_ITEMS } from "@/data/lab";
import { compliance, credits } from "@/data/business";
import { OriginHashChip } from "@/components/receipts/OriginHashChip";
import { wallet, connectWallet, disconnectWallet, short, chainName } from "@/lib/stores/wallet";
import { toast } from "@/lib/stores/toast";

/** The lab. Two experiments that work today and stay compliant: provenance by hash, and a wallet handshake that opens a door. */
export function Lab({ level }: { level: LevelT }) {
  const w = wallet.use();
  const open = !!w.address;
  return (
    <Level level={level}>
      <p className="lede -mt-2 mb-8">Two experiments from the labs. Both run entirely in your browser. {compliance.noCustody}</p>
      <div className="grid gap-6 pb-16 lg:grid-cols-2">
        <section className="panel p-6" aria-labelledby="exp1">
          <div className="flex items-center gap-2 text-teal"><SealCheck size={22} /><span className="readout">exp. 001, identity</span></div>
          <h3 id="exp1" className="mt-2 text-2xl font-semibold">Wrap Origin certificates</h3>
          <p className="mt-2 text-dim">Every finished asset carries its SHA-256, computed right here, right now, and checked against the manifest this site shipped with. Change one pixel and the fingerprint changes.</p>
          <ul className="mt-5 grid gap-3">
            {RECEIPTS.filter((r) => r.hashFile).map((r) => (
              <li key={r.slug} className="flex items-center justify-between gap-4 bg-panel-2 px-4 py-3"><span className="font-semibold">{r.title}</span><OriginHashChip file={r.hashFile} /></li>
            ))}
          </ul>
          <p className="readout mt-4 text-dim">Hashed in your browser. Anchoring on a chain waits for Taylor&rsquo;s go. Wallet-signed attestations live in the <a href={credits.experimentsUrl.replace("roadmap.html", "provenance.html")} className="text-txt underline underline-offset-2">labs experiments</a>.</p>
        </section>
        <section className="panel p-6" aria-labelledby="exp2">
          <div className="flex items-center gap-2 text-magenta"><Wallet size={22} /><span className="readout">exp. 002, connection</span></div>
          <h3 id="exp2" className="mt-2 text-2xl font-semibold">Wallet of the fleet</h3>
          <p className="mt-2 text-dim">Connect a wallet and the vault opens. If you have no wallet, a demo address stands in and says so. Nothing is signed, sent, or stored.</p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            {!w.address ? (
              <button onClick={() => connectWallet().then(() => { const m = wallet.get(); toast(m.mode === "live" ? "Wallet connected. The vault hears you." : "Demo wallet generated. No real funds, no real rug."); })} className="peel" disabled={w.connecting} data-wallet-connect><Plugs size={18} />{w.connecting ? "Asking your wallet" : "Connect a wallet"}</button>
            ) : (
              <>
                <span className="readout bg-panel-2 px-3 py-2" data-wallet-mode={w.mode}>{short(w.address)} <span className={w.mode === "live" ? "text-teal" : "text-amber"}>{w.mode === "live" ? `live${w.chainId ? `, ${chainName(w.chainId)}` : ""}` : "demo"}</span></span>
                <button onClick={() => { disconnectWallet(); toast("Disconnected."); }} className="peel ghost">Disconnect</button>
              </>
            )}
          </div>
          {w.error && <p className="readout mt-2 text-amber">Your wallet declined, so a demo address stands in.</p>}
          <div className="mt-5" data-vault={open ? "open" : "closed"}>
            <div className="flex items-center gap-2 text-dim">{open ? <LockKeyOpen size={20} className="text-teal" /> : <LockKey size={20} />}<span className="readout">{open ? "vault open" : "vault closed, knock with a wallet"}</span></div>
            <ul className="mt-3 grid gap-2">
              {VAULT_ITEMS.map((v) => (
                <li key={v.title}>
                  {open ? <a href={v.href} className="flex items-center justify-between gap-3 bg-panel-2 px-4 py-3 hover:bg-panel"><span><span className="block font-semibold">{v.title}</span><span className="block text-sm text-dim">{v.detail}</span></span><ArrowUpRight size={18} /></a>
                  : <div className="flex items-center justify-between gap-3 bg-panel-2 px-4 py-3" aria-hidden="true"><span className="grid gap-2"><span className="block h-3 w-40 bg-line" /><span className="block h-2 w-56 bg-line" /></span></div>}
                </li>
              ))}
            </ul>
          </div>
          <p className="readout mt-3 text-dim">Merch lives on the shop&rsquo;s own store, as it should.</p>
        </section>
      </div>
    </Level>
  );
}
