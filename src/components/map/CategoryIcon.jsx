import Image from "next/image";
import { StarIcon } from "@/components/ui/icons";

// A category's `icon` (src/lib/map.js) is either one of the caller's fixed
// glyph keys (PandalMap.jsx's or PandalMapExplorer.jsx's own ICONS map --
// each passed in as `icons` since the two happen to be separate objects) or
// a custom image URL an admin uploaded instead (see MapForm.jsx's "Custom
// (upload image)" option) -- this picks the right one to render, in one
// place shared by both the homepage map and the full /map page, instead of
// each guessing from the string's shape on its own.
export default function CategoryIcon({ category, icons, className }) {
  const Icon = icons[category.icon];
  if (Icon) return <Icon className={className} />;

  if (category.icon) {
    return (
      <span className={`relative block shrink-0 overflow-hidden rounded-full ${className}`}>
        <Image src={category.icon} alt="" fill unoptimized sizes="40px" className="object-cover" />
      </span>
    );
  }

  return <StarIcon className={className} />;
}
