import { db } from "@/lib/db";
import { findSection } from "@/lib/admin/sections";
import AutoForm from "@/components/admin/AutoForm";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Pandal Map" };

// Top-level nav item, not nested under Pages -- same treatment as Events,
// Puja Schedule, and Gallery: this is one shared content block (the pins +
// categories), reused by both the Homepage's Pandal Map section and the Map
// page, so it doesn't really belong to either page alone.
export default async function AdminMapPage() {
  const section = findSection("map");
  const row = await db.content.findUnique({
    where: { type_slug: { type: section.type, slug: section.slug } },
  });
  const data = row?.data ?? section.seed;

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Pandal Map" }]} />
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">Pandal Map</h1>
      <p className="mt-1 text-sm text-gray-700">
        Shared content — used by both the Homepage&apos;s Pandal Map section and the Map page.
      </p>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        <AutoForm slug={section.slug} initialData={data} />
      </div>
    </div>
  );
}
