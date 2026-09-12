import Link from "next/link";

// Secondary CTA style used site-wide (Live Darshan, Discover the Story, ...)
// -- a thin gold outline, no fill. Pairs with GoldButton (the filled
// primary style) the same way: renders a <Link> when `href` is given,
// otherwise a <button>.
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full border border-gold/70 px-7 py-3 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:border-gold hover:text-gold";

export default function GhostButton({
  href,
  type = "button",
  className = "",
  children,
  ...props
}) {
  const classes = `${BASE} ${className}`.trim();

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...props}>
      {children}
    </button>
  );
}
