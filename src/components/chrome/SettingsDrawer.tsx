"use client";
import { useCallback, useRef } from "react";
import Link from "next/link";
import { X, Moon, Sun, ArrowUpRight } from "@phosphor-icons/react";
import { ui } from "@/lib/stores/ui";
import { theme } from "@/lib/stores/theme";
import { psyclone } from "@/lib/stores/psyclone";
import { trail } from "@/lib/stores/trail";
import { toolbox } from "@/lib/stores/toolbox";
import { lang } from "@/lib/stores/lang";
import { toast } from "@/lib/stores/toast";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { credits } from "@/data/business";
import { Switch } from "@/components/ui/Switch";
import { Segmented } from "@/components/ui/Segmented";
import { Z } from "@/lib/z";
import { T, useT } from "@/i18n/client";

export function SettingsDrawer() {
  const { drawerOpen } = ui.use();
  const t = theme.use(); const psy = psyclone.use(); const tr = trail.use(); const tb = toolbox.use(); const lg = lang.use();
  const ref = useRef<HTMLElement>(null);
  const tx = useT();
  const close = useCallback(() => ui.update((s) => ({ ...s, drawerOpen: false })), []);
  useFocusTrap(ref, drawerOpen, close);
  if (!drawerOpen) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50" style={{ zIndex: Z.drawer - 1 }} onClick={close} aria-hidden="true" />
      <aside id="settings-drawer" ref={ref} role="dialog" aria-modal="true" aria-labelledby="settings-title" className="fixed inset-y-0 right-0 w-[min(26rem,100%)] overflow-y-auto bg-panel p-6 shadow-2xl" style={{ zIndex: Z.drawer }}>
        <div className="flex items-center justify-between">
          <h2 id="settings-title" className="display text-3xl"><T>Settings</T></h2>
          <button onClick={close} className="p-2" aria-label={tx("Close settings")} data-autofocus><X size={24} /></button>
        </div>
        <div className="mt-6 divide-y divide-line">
          <div className="flex items-center justify-between py-3">
            <span><span className="block font-semibold"><T>Theme</T></span><span className="block text-sm text-dim"><T>Dark is the shop at night. Light is primer.</T></span></span>
            <Segmented label="Theme" value={t} onChange={theme.set} options={[{ value: "dark", label: <><Moon size={16} /><T>Dark</T></> }, { value: "light", label: <><Sun size={16} /><T>Light</T></> }]} />
          </div>
          <Switch id="s-psy" label="Psyclone mode" hint="The whole palette turns like color-flip film. Also on the keyboard: up up down down left right left right B A." checked={psy} onChange={(v) => { psyclone.set(v); toast(v ? "Psyclone engaged. No pink. Kidding. All the pink." : "Psyclone disengaged."); }} />
          <Switch id="s-trail" label="Film trail" hint="Your cursor lays vinyl. Swipe fast to squeegee it clean." checked={tr} onChange={trail.set} />
          <Switch id="s-tb" label="Toolbox" hint="Squeegee, eraser, blade, heat gun, film swatches. Paint on the site itself." checked={tb.shown} onChange={(v) => toolbox.set({ ...tb, shown: v })} />
          <div className="flex items-center justify-between py-3">
            <span><span className="block font-semibold"><T>Language</T></span><span className="block text-sm text-dim"><T>Idioma de la bienvenida.</T></span></span>
            <Segmented label="Language" value={lg} onChange={lang.set} options={[{ value: "en", label: "English" }, { value: "es", label: "Español" }]} />
          </div>
          <div className="grid gap-3 py-4">
            <Link href="/time-machine/" onClick={close} className="flex items-center justify-between font-semibold"><T>Time machine</T> <span className="text-sm text-dim"><T>every era, one door each</T></span></Link>
            <a href={credits.carshowUrl} className="flex items-center justify-between font-semibold"><T>The Car Show</T> <ArrowUpRight size={18} /></a>
          </div>
        </div>
      </aside>
    </>
  );
}
