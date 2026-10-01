// Detects which (if any) of the supported platforms a gallery item's
// `videoUrl` points to, and builds that platform's embeddable iframe src.
// Order matters where GalleryVideo.jsx calls these -- YouTube, then
// Facebook, then Instagram, then (no match) treated as a direct video file
// URL for a plain <video> tag. Anything an admin pastes that isn't one of
// these shapes (a plain Instagram/Facebook profile link, a TikTok link,
// etc.) falls through to that <video> tag and simply won't play -- there's
// no universal fallback for an arbitrary social link, so if a new platform
// needs support it needs its own detector added here.

// Matches youtube.com/watch?v=, youtube.com/shorts/, youtube.com/embed/,
// and youtu.be/ -- any shape of a YouTube link.
export function getYoutubeId(url) {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

// YouTube serves a static poster frame for every video at this fixed URL
// shape -- so a gallery item that's a YouTube link never actually needs an
// admin-uploaded thumbnail; Gallery.jsx falls back to this whenever `src` is
// blank. Facebook and Instagram have no equivalent no-auth thumbnail URL
// (both require an authenticated API call to fetch one), so those two still
// need a manually uploaded poster image.
export function getYoutubeThumbnail(youtubeId) {
  return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
}

// Facebook's "Video Plugin" iframe embed -- works for any public video post
// URL (facebook.com/.../videos/..., /watch/?v=..., /reel/..., or a fb.watch/
// short link) without needing the Facebook JS SDK; Facebook resolves the
// real video server-side from the `href` param, redirects included -- poster
// frame and all, which is also why Gallery.jsx reuses this same embed (with
// `autoplay: false`, never interactive) as the grid tile's thumbnail when no
// photo's been uploaded: unlike YouTube there's no plain image URL to pull
// that poster from, but the plugin itself still renders it. `autoplay: true`
// (Facebook auto-mutes it per the same browser policy that applies to the
// YouTube embed below) is what makes the *lightbox*'s copy of this embed
// start the moment it opens instead of sitting on that same static frame.
export function getFacebookEmbedUrl(url, { autoplay = true } = {}) {
  if (!url) return null;
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return null;
  }
  const isFacebook = /(^|\.)facebook\.com$/.test(hostname) || /(^|\.)fb\.watch$/.test(hostname);
  if (!isFacebook) return null;
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&autoplay=${autoplay}`;
}

// Instagram's plain iframe embed (instagram.com/{p|reel|tv}/{shortcode}/embed)
// -- no JS SDK needed, though unlike YouTube/Facebook it doesn't autoplay:
// Instagram renders its own "view on Instagram" card inside the frame for a
// logged-out viewer, same as it does anywhere else on the web.
export function getInstagramEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/instagram\.com\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
  if (!match) return null;
  const [, type, shortcode] = match;
  return `https://www.instagram.com/${type}/${shortcode}/embed`;
}
