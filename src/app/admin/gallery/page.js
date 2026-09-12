import { db } from "@/lib/db";
import { findSection } from "@/lib/admin/sections";
import AutoForm from "@/components/admin/AutoForm";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Gallery" };

// Top-level nav item, not nested under Pages -- same treatment as Events and
// Puja Schedule: this is one shared content block (the photo list), reused
// by both the Homepage's Gallery section and the Gallery page, so it
// doesn't really belong to either page alone.
export default async function AdminGalleryPage() {
  const section = findSection("gallery");
  const row = await db.content.findUnique({
    where: { type_slug: { type: section.type, slug: section.slug } },
  });
  const data = row?.data ?? section.seed;

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Gallery" }]} />
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">Gallery</h1>
      <p className="mt-1 text-sm text-gray-700">
        Shared content — used by both the Homepage&apos;s Gallery section and the Gallery page.
      </p>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        <AutoForm slug={section.slug} initialData={data} />
      </div>
    </div>
  );
}
