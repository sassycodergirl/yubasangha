// Server-only: scrapes the Open Graph image off a public Instagram post/reel
// page as a stand-in thumbnail, since Instagram's real oEmbed API now
// requires a Meta Graph API app token (see src/lib/videoEmbeds.js's
// getInstagramEmbedUrl comment). A plain fetch gets served a stripped-down
// shell page with no og:image at all -- Instagram only includes it for
// request shapes it recognizes as a link-preview crawler, so this spoofs
// Meta's own crawler's User-Agent (the one Facebook/WhatsApp link previews
// of Instagram content rely on, which Instagram has to allow-list for its
// own previews to work). This is an unofficial technique, not a documented
// API: Instagram can change this HTML, or start blocking this User-Agent,
// at any time without warning -- getGalleryContent (src/lib/gallery.js)
// treats a failure here as "no thumbnail yet", not an error, for exactly
// that reason.
const CRAWLER_USER_AGENT = "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)";

export async function getInstagramThumbnail(url) {
  let html;
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": CRAWLER_USER_AGENT },
      next: { revalidate: 86400 }, // 24h -- the CDN image URL itself is signed/time-limited, not permanent
    });
    if (!response.ok) return null;
    html = await response.text();
  } catch {
    return null;
  }

  const match = html.match(/<meta property="og:image" content="([^"]+)"/);
  if (!match) return null;
  return match[1].replace(/&amp;/g, "&");
}
