import { Geist, Geist_Mono, Cinzel } from "next/font/google";
import "./globals.css";
import { getContent } from "@/lib/getContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Display serif used for large headings (hero title, countdown numbers).
const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

// Site-wide SEO defaults + favicon, all admin-editable from Settings >
// Branding (see the "branding" block in src/lib/admin/sections.js) --
// individual pages can still set their own `metadata.title` to override
// just the title (Next merges it into this same `template`), same as
// before this was wired up to the CMS.
export async function generateMetadata() {
  const { favicon, seo = {} } = await getContent("branding");
  const title = seo.title || "Yuba Sangha";

  return {
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description: seo.description || "Yuba Sangha community and Durga Puja website.",
    keywords: seo.keywords
      ? seo.keywords.split(",").map((keyword) => keyword.trim()).filter(Boolean)
      : undefined,
    icons: favicon ? { icon: favicon } : undefined,
    openGraph: seo.ogImage ? { images: [{ url: seo.ogImage }] } : undefined,
  };
}

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
