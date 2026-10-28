"use client";
import { createMemoryStore } from "./createStore";

// Minimal EIP-1193 surface (the fleet's useWallet pattern): connect, read, listen. No SDK; nothing to sign or send.
interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (event: string, handler: (...args: unknown[]) => void) => void;
  removeListener?: (event: string, handler: (...args: unknown[]) => void) => void;
}
declare global { interface Window { ethereum?: EthereumProvider } }

export interface WalletState { address: string | null; chainId: string | null; mode: "live" | "demo" | null; connecting: boolean; error: string | null }
export const wallet = createMemoryStore<WalletState>({ address: null, chainId: null, mode: null, connecting: false, error: null });
const CHAINS: Record<string, string> = { "0x1": "Ethereum", "0x89": "Polygon", "0xa4b1": "Arbitrum", "0xa": "Optimism", "0x2105": "Base", "0xaa36a7": "Sepolia" };
export const chainName = (id: string | null) => (id ? CHAINS[id] ?? `chain ${id}` : null);
export const short = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`;
let listening = false;

function listen() {
  if (listening || !window.ethereum?.on) return;
  listening = true;
  window.ethereum.on("accountsChanged", (...args: unknown[]) => {
    const accounts = args[0] as string[];
    wallet.update((s) => ({ ...s, address: accounts[0] ?? null, mode: accounts[0] ? "live" : null }));
  });
  window.ethereum.on("chainChanged", (...args: unknown[]) => wallet.update((s) => ({ ...s, chainId: args[0] as string })));
}
/** A real wallet when one exists and the visitor says yes; a demo address otherwise, labelled as such. */
export async function connectWallet() {
  const cur = wallet.get();
  if (cur.connecting) return;
  if (window.ethereum) {
    wallet.set({ ...cur, connecting: true, error: null });
    try {
      const accounts = (await window.ethereum.request({ method: "eth_requestAccounts" })) as string[];
      const chainId = (await window.ethereum.request({ method: "eth_chainId" })) as string;
      listen();
      wallet.set({ address: accounts[0] ?? null, chainId, mode: accounts[0] ? "live" : null, connecting: false, error: null });
      return;
    } catch (e) {
      // declined: fall through to demo, and say so
      wallet.set({ ...cur, connecting: false, error: e instanceof Error ? e.message : "Connection declined" });
    }
  }
  const bytes = new Uint8Array(20); crypto.getRandomValues(bytes);
  const demo = "0x" + [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  wallet.set({ address: demo, chainId: null, mode: "demo", connecting: false, error: null });
}
export function disconnectWallet() { wallet.set({ address: null, chainId: null, mode: null, connecting: false, error: null }); }
