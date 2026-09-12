// A soft fade from the shared `ink` tone at the very top of a section, into
// transparent -- so the seam where one section ends and the next begins
// blends instead of cutting hard, while the rest of the section is free to
// use its own gradient/tone below that band. Place right after
// SectionBackground, before any section-specific overlays.
export default function SectionBlend() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-ink to-transparent sm:h-32" />
  );
}
