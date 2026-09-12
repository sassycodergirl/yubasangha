import Image from "next/image";
import GoldButton from "@/components/ui/GoldButton";
import {
  ArrowRightIcon,
  FacebookIcon,
  ImageIcon,
  InstagramIcon,
  MailIcon,
  PhoneIcon,
  PinIcon,
  XIcon,
  YoutubeIcon,
} from "@/components/ui/icons";

// Maps the `id` stored per social link (the "footer" content block) to its
// glyph -- same set Footer.jsx uses.
const SOCIAL_ICONS = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  x: XIcon,
};

function InfoCard({ icon: Icon, label, children }) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-white/70 p-5 shadow-sm">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-maroon text-white">
        <Icon className="size-5" />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-[0.2em] text-maroon">{label}</p>
        <div className="mt-1 text-sm leading-relaxed text-ink/75">{children}</div>
      </div>
    </div>
  );
}

// Contact page's own section -- no form (deliberately, per request):
// address/phone/email/social straight from the shared "footer" content
// block, plus a "Find Us" photo linking through to the full interactive Map
// page. Everything's directly actionable (tel:/mailto: links, a map CTA)
// instead of routing through a form first.
export default function ContactInfo({ intro, contact, social, findUs }) {
  return (
    <section className="relative overflow-hidden bg-[#d3d1d1] py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-16">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[11px] uppercase tracking-[0.35em] text-maroon">{intro.subtitle}</p>
          <h2 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-ink sm:text-4xl">
            {intro.title[0]}
            <span className="block text-maroon">{intro.title[1]}</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink/70">{intro.description}</p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:items-start">
          {/* Left: info cards + social */}
          <div className="space-y-4">
            <InfoCard icon={PinIcon} label="Address">
              {contact.addressLines[0]}
              <br />
              {contact.addressLines[1]}
            </InfoCard>

            <InfoCard icon={PhoneIcon} label="Phone">
              <a
                href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                className="transition-colors hover:text-maroon"
              >
                {contact.phone}
              </a>
            </InfoCard>

            <InfoCard icon={MailIcon} label="Email">
              <a href={`mailto:${contact.email}`} className="transition-colors hover:text-maroon">
                {contact.email}
              </a>
            </InfoCard>

            <div className="flex items-center gap-4 pt-2">
              <p className="text-[11px] uppercase tracking-[0.2em] text-maroon">
                {contact.socialNote}
              </p>
              <div className="flex gap-2.5">
                {social.map((s) => {
                  const Icon = SOCIAL_ICONS[s.id];
                  return (
                    <a
                      key={s.id}
                      href={s.href}
                      aria-label={s.label}
                      target="_blank"
                      rel="noreferrer"
                      className="flex size-10 items-center justify-center rounded-full bg-white/70 text-maroon shadow-sm transition-colors hover:bg-maroon hover:text-white"
                    >
                      <Icon className="size-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right: find us / photo */}
          <div className="overflow-hidden rounded-2xl border-2 border-maroon/20 bg-ink shadow-xl">
            <div className="relative h-64 w-full sm:h-72">
              {findUs.image ? (
                <Image
                  src={findUs.image}
                  alt={findUs.imageAlt}
                  fill
                  unoptimized
                  sizes="(min-width: 1024px) 45vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(circle_at_50%_30%,#3a1a12_0%,#1a100b_60%,#0b0705_100%)]">
                  <ImageIcon className="size-10 text-gold/60" />
                  <p className="text-[11px] uppercase tracking-[0.3em] text-white/40">
                    Photo coming soon
                  </p>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            </div>
            <div className="p-6 sm:p-7">
              <p className="text-[11px] uppercase tracking-[0.25em] text-gold">Find Us</p>
              <p className="mt-2 text-sm text-white/70">
                {contact.addressLines[0]}, {contact.addressLines[1]}
              </p>
              <GoldButton href={findUs.cta.href} className="mt-5">
                {findUs.cta.label}
                <ArrowRightIcon className="size-4" />
              </GoldButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
