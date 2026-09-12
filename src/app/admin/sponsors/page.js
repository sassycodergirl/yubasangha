import { db } from "@/lib/db";
import { findSection } from "@/lib/admin/sections";
import AutoForm from "@/components/admin/AutoForm";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Sponsors" };

// Top-level nav item, not nested under Pages -- same treatment as Events,
// Puja Schedule, Gallery, Live Darshan, and Pandal Map: this is one shared
// content block (the sponsor list), reused by both the Homepage's Sponsors
// section and the Sponsors page, so it doesn't really belong to either page
// alone.
export default async function AdminSponsorsPage() {
  const section = findSection("sponsors");
  const row = await db.content.findUnique({
    where: { type_slug: { type: section.type, slug: section.slug } },
  });
  const data = row?.data ?? section.seed;

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Sponsors" }]} />
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">Sponsors</h1>
      <p className="mt-1 text-sm text-gray-700">
        Shared content — used by both the Homepage&apos;s Sponsors section and the Sponsors page.
      </p>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        <AutoForm slug={section.slug} initialData={data} />
      </div>
    </div>
  );
}
