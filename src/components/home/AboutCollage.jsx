import Image from "next/image";
import CornerFrame from "@/components/ui/CornerFrame";
import { ImageIcon } from "@/components/ui/icons";

function CollagePhoto({ image, className }) {
  return (
    <div
      className={`absolute overflow-hidden rounded-lg border-2 border-gold/70 bg-ink-soft shadow-2xl ${className}`}
    >
      {image ? (
        <Image src={image} alt="" fill unoptimized sizes="(min-width: 1024px) 26rem, 70vw" className="object-cover" />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
          <ImageIcon className="size-8 text-gold/60" />
        </div>
      )}
    </div>
  );
}

// Two-photo collage used in place of the milestone timeline when About
// renders with `showTimeline={false}` (the About Us page, which has its own
// dedicated full timeline section elsewhere on that page instead).
export default function AboutCollage({ images = [] }) {
  const [first, second] = images;

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-xl">
      <CollagePhoto image={first} className="left-0 top-0 aspect-[4/5] w-[58%]" />
      <CollagePhoto
        image={second}
        className="bottom-0 right-0 aspect-[4/3] w-[54%] "
      />
      <CornerFrame tone="border-gold/50" />
    </div>
  );
}
