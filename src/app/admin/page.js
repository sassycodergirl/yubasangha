import Link from "next/link";
import { db } from "@/lib/db";
import { dashboardBanner } from "@/lib/admin/dashboardBanner";
import { findSection } from "@/lib/admin/sections";
import { GearIcon, ArrowRightIcon } from "@/components/ui/icons";

export default async function AdminDashboardPage() {
  const bannerSection = dashboardBanner;
  const brandingSection = findSection("branding");

  const [bannerRow, brandingRow] = await Promise.all([
    db.content.findUnique({ where: { type_slug: { type: bannerSection.type, slug: bannerSection.slug } } }),
    db.content.findUnique({ where: { type_slug: { type: brandingSection.type, slug: brandingSection.slug } } }),
  ]);

  const { image, caption } = bannerRow?.data ?? bannerSection.seed;
  const { iconImage } = brandingRow?.data ?? brandingSection.seed;

  return (
    <div>
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-700">Welcome back.</p>
        {iconImage ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded icon
          <img src={iconImage} alt="" className="absolute right-0 top-[60px] w-[55px] lg:top-0 lg:w-[120px]" />
        ) : null}
      </div>

      <div className="relative mt-6 overflow-hidden rounded-2xl shadow-md">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element -- admin-chosen path/URL, same convention as the public site's banner
          <img
            src={image}
            alt=""
            className="h-72 w-full object-cover sm:h-80"
          />
        ) : (
          <div className="flex h-72 w-full items-center justify-center bg-ink sm:h-80">
            <p className="text-sm text-white/40">No dashboard image set yet</p>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />

        <Link
          href="/admin/dashboard/banner"
          className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:border-gold/70 hover:text-gold-soft"
        >
          <GearIcon className="size-3.5" />
          Change image
        </Link>

        {caption ? (
          <p className="absolute inset-x-6 bottom-5 font-display text-lg text-white sm:text-xl">
            {caption}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/pages"
          className="group flex items-center justify-between rounded-2xl border border-gold bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/5 hover:shadow-md"
        >
          <div>
            <p className="font-medium text-ink">Edit pages</p>
            <p className="mt-0.5 text-sm text-gray-700">Homepage, About Us, Theme 2026, and more</p>
          </div>
          <ArrowRightIcon className="size-4 text-gray-600 transition-colors group-hover:text-maroon" />
        </Link>

        <Link
          href="/admin/settings"
          className="group flex items-center justify-between rounded-2xl border border-gold bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold/40 hover:bg-gold/5 hover:shadow-md"
        >
          <div>
            <p className="font-medium text-ink">Site settings</p>
            <p className="mt-0.5 text-sm text-gray-700">Manage global content</p>
          </div>
          <ArrowRightIcon className="size-4 text-gray-600 transition-colors group-hover:text-maroon" />
        </Link>
      </div>
    </div>
  );
}
