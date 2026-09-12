import Image from "next/image";

// Standard section background, used across every homepage/content section:
// shows `image` (with a dark scrim for text legibility) when one's set,
// otherwise falls back to the site's ambient gradient -- so sections can be
// built ahead of their real photography and just start showing it once an
// admin adds one (see CLAUDE.md "Section backgrounds"). Pass
// `fallback="none"` to opt a specific section out of the gradient and keep
// its plain `bg-ink` when there's no image (About does this deliberately).
// Pass `scrim={false}` to skip the default dark overlay -- Theme does this
// since it layers its own color-mix tint over the image instead.
export default function SectionBackground({ image, alt = "", fallback = "gradient", scrim = true }) {
  if (image) {
    return (
      <>
        {/* `unoptimized`: `image` is admin-uploaded and can be on any host
            (Supabase Storage, etc.), same reasoning as Hero/Gallery/PandalMap. */}
        <Image src={image} alt={alt} fill unoptimized sizes="100vw" className="object-cover" />
        {scrim ? <div className="absolute inset-0 bg-ink/70" /> : null}
      </>
    );
  }

  if (fallback === "none") return null;

  return (
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,#3a1a12_0%,#1a100b_55%,#0b0705_100%)]" />
  );
}
