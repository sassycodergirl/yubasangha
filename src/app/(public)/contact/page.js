import PageBanner from "@/components/ui/PageBanner";
import ContactInfo from "@/components/contact/ContactInfo";
import { getContent } from "@/lib/getContent";

export const metadata = { title: "Contact" };

export default async function ContactPage() {
  // Address/phone/email/social come from the shared "footer" content block,
  // so this page and the site footer always stay in sync from one admin
  // screen.
  const [banner, intro, findUs, footer] = await Promise.all([
    getContent("contact-banner"),
    getContent("contact-intro"),
    getContent("find-us"),
    getContent("footer"),
  ]);

  return (
    <>
      <PageBanner content={banner} />
      <ContactInfo
        intro={intro}
        contact={footer.contact}
        social={footer.social}
        findUs={findUs}
      />
    </>
  );
}
