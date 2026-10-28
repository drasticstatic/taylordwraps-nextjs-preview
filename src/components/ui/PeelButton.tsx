import Link from "next/link";
import clsx from "clsx";
interface Props {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  /** the message under the film, revealed while hovered */
  peel: string;
  ghost?: boolean;
  className?: string;
  type?: "button" | "submit";
  external?: boolean;
}
/** The primary action. A vinyl corner lifts while hovered and uncovers a message. The message survives label changes because it is its own element. */
export function PeelButton({ href, onClick, children, peel, ghost, className, type = "button", external }: Props) {
  const cls = clsx("peel", ghost && "ghost", className);
  const inner = (
    <>
      <span className="peel-label">{children}</span>
      <span className="peel-msg" aria-hidden="true">{peel}</span>
    </>
  );
  if (href && external) return <a href={href} className={cls} target="_blank" rel="noopener">{inner}</a>;
  if (href) return <Link href={href} className={cls}>{inner}</Link>;
  return <button type={type} onClick={onClick} className={cls}>{inner}</button>;
}
