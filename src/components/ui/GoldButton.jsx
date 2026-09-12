import Link from "next/link";

// The one primary call-to-action style used site-wide (Donate, Explore the
// Theme, Our Journey, ...). Renders a <Link> when `href` is given, otherwise
// a <button> -- keep every primary CTA on this component so the look stays
// identical everywhere instead of drifting per-section.
const BASE =
  "inline-flex items-center justify-center gap-2 rounded-full border border-gold/70 bg-maroon bg-[radial-gradient(circle_at_50%_33%,#d9ac5247_0%,#d9ac5200_45%)] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-white transition-[filter] hover:brightness-110";

export default function GoldButton({
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
