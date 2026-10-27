const doors = [
  { icon: "ph ph-van", title: "THE CURRENT PREVIEW", desc: "The Peel, the toolbox, the arrival kit \u2014 the hand-built HTML era, live now.", href: "https://drasticstatic.github.io/taylordwraps-public-preview/", cta: "ENTER \u2192", now: true },
  { icon: "ph ph-paint-roller", title: "THE VISUALIZER", desc: "Wrap anything: vans, mowers, RC trucks, jet skis. Pick a film, type your lettering.", href: "https://drasticstatic.github.io/taylordwraps-public-preview/#visualizer", cta: "WRAP SOMETHING \u2192", now: true },
  { icon: "ph ph-clock-clockwise", title: "THE TIME MACHINE", desc: "Step back in time \u2014 every era of this build stays visitable.", href: "https://drasticstatic.github.io/taylordwraps-public-preview/time-machine.html", cta: "STEP BACK \u2192", now: true },
  { icon: "ph ph-portal", title: "THE RABBIT HOLE", desc: "A Next.js wonderland is under construction down this corridor. You just found the door.", href: "#", cta: "COMING SOON", now: false },
];

export default function Home() {
  return (
    <main className="era">
      <p className="kicker">TAYLOR&apos;D WRAPS \u00d7 DRASTICSTATIC LABS</p>
      <h1>
        THE <span className="grad">v1 ERA</span>
      </h1>
      <p className="sub">
        A wrap shop&apos;s website that transforms itself. This page is the new Next.js
        foundation \u2014 simple for now, a rabbit hole soon. The hand-built HTML era lives
        one door over.
      </p>
      <div className="doors">
        {doors.map((d) => (
          <a key={d.title} className={"door" + (d.now ? "" : " soon")} href={d.href}>
            <i className={d.icon} aria-hidden="true" />
            <b>{d.title}</b>
            <span>{d.desc}</span>
            <em>{d.cta}</em>
          </a>
        ))}
      </div>
      <footer>
        \u00a9 2026 TAYLOR&apos;D WRAPS \u00b7 DESIGN \u00b7 PRINT \u00b7 INSTALL \u00b7 BRAND \u00b7 HANDCRAFTED IN DRASTICSTATIC LABS
      </footer>
    </main>
  );
}
