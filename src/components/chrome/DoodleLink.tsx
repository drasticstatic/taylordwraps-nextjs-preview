"use client";
import clsx from "clsx";
import Link from "next/link";
const SQUIGGLES = [
  "M2 7 C 18 1, 34 11, 50 6 S 82 2, 98 7",
  "M2 6 C 22 10, 30 1, 52 6 S 78 10, 98 4",
  "M2 5 C 14 9, 40 1, 58 7 S 84 9, 98 5",
];
interface Props { href: string; children: React.ReactNode; here?: boolean; index?: number; onClick?: () => void; className?: string }
/** A nav link with a hand-drawn teal underline that draws itself on hover and stays while its section is in view. */
export function DoodleLink({ href, children, here, index = 0, onClick, className }: Props) {
  const d = SQUIGGLES[index % SQUIGGLES.length];
  const inner = (
    <>
      {children}
      <svg viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d={d} pathLength={1} /></svg>
    </>
  );
  const cls = clsx("doodle text-sm font-semibold text-dim hover:text-txt", here && "here", className);
  return href.startsWith("/") && !href.includes(".html")
    ? <Link href={href} className={cls} aria-current={here ? "location" : undefined} onClick={onClick}>{inner}</Link>
    : <a href={href} className={cls} onClick={onClick}>{inner}</a>;
}
