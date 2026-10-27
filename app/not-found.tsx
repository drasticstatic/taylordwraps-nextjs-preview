import Link from "next/link";

export default function NotFound() {
  return (
    <main className="lost">
      <i className="ph ph-compass" aria-hidden="true" />
      <div className="lost-code">404</div>
      <h1>THIS PANEL ISN&apos;T WRAPPED YET.</h1>
      <p>
        Someone came through with the blade and lifted the page you were looking
        for clean off the frame. Happens to the best of us — even us. Nothing
        here is broken; it&apos;s just bare metal waiting for film.
      </p>
      <div className="lost-row">
        <Link className="btn" href="/">BACK TO THE SHOP</Link>
        <a className="btn ghost" href="https://drasticstatic.github.io/taylordwraps-public-preview/">THE HAND-BUILT ERA</a>
      </div>
      <p className="lost-tip">
        TIP: THE SQUEEGEE ONLY WORKS ON VINYL. A MISSING PAGE IS A YOU-PROBLEM,
        NOT A TOOL-PROBLEM.
      </p>
    </main>
  );
}
