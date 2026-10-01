"use client";

import { useEffect, useState } from "react";

// Tracks an image's own natural width/height so a container can be sized to
// match it exactly, instead of a fixed guess (a fixed-height box with a
// fluid width, like the Pandal Map viewports used to be, changes aspect
// ratio at every breakpoint -- combined with `object-cover` cropping
// whatever doesn't fit, that meant a pin's x/y percentage pointed at a
// different spot on the image depending on viewport size, and never quite
// matched between the admin editor's own box shape and the public page's).
// Once the container's aspect ratio matches the image's own, `object-contain`
// needs to crop or letterbox nothing, so percentage coordinates always land
// on the same visual point everywhere this is used (admin's interactive pin
// map, and both public map viewports).
export function useNaturalAspectRatio(src) {
  const [ratio, setRatio] = useState(null);

  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const img = new window.Image();
    img.onload = () => {
      if (!cancelled && img.naturalWidth && img.naturalHeight) {
        setRatio(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return ratio;
}
