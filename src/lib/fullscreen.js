// Opens a YouTube video directly on youtube.com -- the fallback used when
// the Fullscreen API isn't available at all (some older iOS Safari
// versions don't support it even on an iframe) or a fullscreen request
// fails, so "Open in Fullscreen" still does something useful everywhere.
export function openOnYoutube(youtubeVideoId) {
  if (!youtubeVideoId) return;
  window.open(`https://www.youtube.com/watch?v=${youtubeVideoId}`, "_blank", "noopener,noreferrer");
}
