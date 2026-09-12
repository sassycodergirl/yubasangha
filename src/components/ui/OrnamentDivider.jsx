// Decorative gold divider graphic (public/icons/divider.svg) used in place of
// plain line bars / dash characters wherever the design calls for a
// traditional ornamental rule (hero motif line, tagline, location line, etc).
// It's a fixed-color raster asset, so unlike an inline SVG icon it can't be
// re-tinted with currentColor -- size it with `className` (height + width),
// keeping the ~20:1 aspect ratio of the source graphic.
export default function OrnamentDivider({ className = "" }) {
  return (
    <img
      src="/icons/divider.svg"
      alt=""
      draggable={false}
      className={`object-contain ${className}`}
    />
  );
}
