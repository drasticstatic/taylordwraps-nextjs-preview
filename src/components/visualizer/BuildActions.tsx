"use client";
import { useState } from "react";
import { ArrowUpRight, LinkSimple } from "@phosphor-icons/react";
import { visualizer } from "@/lib/stores/visualizer";
import { mapBuildToOrder } from "@/data/workorder";
import { prefillFromVisualizer } from "@/lib/stores/workorder";
import { toast } from "@/lib/stores/toast";
import { encodeBuild, carshowLink } from "@/lib/wrapSpec";
import { PeelButton } from "@/components/ui/PeelButton";

export function BuildActions() {
  const s = visualizer.use();
  const [copied, setCopied] = useState(false);
  const send = () => {
    prefillFromVisualizer(mapBuildToOrder(s));
    document.getElementById("quote")?.scrollIntoView({ behavior: "smooth", block: "start" });
    toast("Build loaded into the work order.");
  };
  const share = () => {
    const url = `${location.origin}${location.pathname}#visualizer&build=${encodeBuild(s)}`;
    navigator.clipboard.writeText(url).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1800); toast("Link copied. It opens the booth to this build."); }, () => toast("Couldn't copy. Your browser blocked the clipboard."));
  };
  return (
    <div className="flex flex-wrap items-center gap-2">
      <PeelButton onClick={send} peel="No payment here. We call you.">Send this build to the shop</PeelButton>
      <button onClick={share} className="peel ghost" disabled={s.body === "custom"} title={s.body === "custom" ? "Your own photo stays on your device, so it can't travel in a link" : "Copy a link to this build"}><LinkSimple size={16} />{copied ? "Copied" : "Copy build link"}</button>
      <a href={carshowLink(s)} className="peel ghost" target="_blank" rel="noopener" aria-disabled={s.body === "custom"} onClick={(e) => { if (s.body === "custom") { e.preventDefault(); toast("Your own photo can't travel between lanes."); } }}>Open in the Car Show <ArrowUpRight size={16} /></a>
    </div>
  );
}
