import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { findPage, pageLabel } from "@/lib/admin/pages";
import { findSection, getOtherPagesForSection } from "@/lib/admin/sections";
import AutoForm from "@/components/admin/AutoForm";
import ArtistProcessForm from "@/components/admin/ArtistProcessForm";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

// Sections with a free-form shape the generic AutoForm can't offer a good
// editing UI for get their own hand-built form instead (same reasoning as
// MapForm.jsx on /admin/map) -- keyed by slug, so adding one more just means
// a new entry here plus the component itself.
const CUSTOM_FORMS = {
  "artist-process": ArtistProcessForm,
};

export async function generateMetadata({ params }) {
  const { section: slug } = await params;
  const section = findSection(slug);
  return { title: section?.label ?? "Section" };
}

export default async function AdminSectionEditPage({ params }) {
  const { page: pageSlug, section: slug } = await params;
  const page = findPage(pageSlug);
  const section = findSection(slug);
  if (!page || !section || !section.pages?.includes(pageSlug)) notFound();

  const row = await db.content.findUnique({
    where: { type_slug: { type: section.type, slug } },
  });
  const data = row?.data ?? section.seed;
  const otherPages = getOtherPagesForSection(section, pageSlug);
  const CustomForm = CUSTOM_FORMS[slug];

  return (
    <div>
      <AdminBreadcrumb
        items={[
          { label: "Pages", href: "/admin/pages" },
          { label: page.label, href: `/admin/pages/${pageSlug}` },
          { label: section.label },
        ]}
      />
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">{section.label}</h1>
      {otherPages.length > 0 ? (
        <p className="mt-1 text-sm text-gray-700">
          Shared content — saving here also updates {otherPages.map(pageLabel).join(", ")}.
        </p>
      ) : null}

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        {CustomForm ? <CustomForm slug={slug} initialData={data} /> : <AutoForm slug={slug} initialData={data} />}
      </div>
    </div>
  );
}
