import { db } from "@/lib/db";
import { findSection } from "@/lib/admin/sections";
import AutoForm from "@/components/admin/AutoForm";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Pujo Sangbad" };

// Top-level nav item, not nested under Pages -- same treatment as Events,
// Puja Schedule, and Gallery: this is one shared content block (the news
// video list), reused by both the Homepage's Puja Spotlight section and the
// Pujo Sangbad page, so it doesn't really belong to either page alone.
export default async function AdminPujoSangbadPage() {
  const section = findSection("pujo-sangbad-videos");
  const row = await db.content.findUnique({
    where: { type_slug: { type: section.type, slug: section.slug } },
  });
  const data = row?.data ?? section.seed;

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Pujo Sangbad" }]} />
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">Pujo Sangbad</h1>
      <p className="mt-1 text-sm text-gray-700">
        Shared content — used by both the Homepage&apos;s Puja Spotlight section and the Pujo
        Sangbad page. Each video needs either a Video URL (a YouTube, Facebook, or Instagram link)
        or an uploaded video — a link is strongly preferred, since an upload uses this site&apos;s
        own storage.
      </p>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        <AutoForm slug={section.slug} initialData={data} />
      </div>
    </div>
  );
}
