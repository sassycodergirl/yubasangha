import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getContent } from "@/lib/getContent";

export default async function PublicLayout({ children }) {
  const [header, branding, footer] = await Promise.all([
    getContent("header"),
    getContent("branding"),
    getContent("footer"),
  ]);

  return (
    <div className="flex min-h-full flex-col">
      {/* Header and Footer both reuse the one logo uploaded on "branding". */}
      <Header data={header} logo={branding.logo} />
      <main className="flex-1">{children}</main>
      <Footer data={footer} branding={branding} logo={branding.logo} donate={header.donate} />
    </div>
  );
}
