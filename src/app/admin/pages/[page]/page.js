import { notFound } from "next/navigation";
import { findPage, pageLabel } from "@/lib/admin/pages";
import { getSectionsForPage, getOtherPagesForSection } from "@/lib/admin/sections";
import AdminListLink from "@/components/admin/AdminListLink";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export async function generateMetadata({ params }) {
  const { page: pageSlug } = await params;
  const page = findPage(pageSlug);
  return { title: page?.label ?? "Page" };
}

export default async function AdminPageSectionsPage({ params }) {
  const { page: pageSlug } = await params;
  const page = findPage(pageSlug);
  if (!page) notFound();

  const pageSections = getSectionsForPage(pageSlug);

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Pages", href: "/admin/pages" }, { label: page.label }]} />
      <h1 className="font-display text-xl font-semibold text-ink">{page.label}</h1>
      <p className="mt-1 text-sm text-gray-700">
        Sections shown on this page, top to bottom.
      </p>

      <div className="mt-6 space-y-3">
        {pageSections.map((section, index) => {
          const otherPages = getOtherPagesForSection(section, pageSlug);
          return (
            <AdminListLink
              key={section.slug}
              href={`/admin/pages/${pageSlug}/${section.slug}`}
              title={section.label}
              subtitle={otherPages.length > 0 ? `Shared with ${otherPages.map(pageLabel).join(", ")}` : undefined}
              meta={`#${index + 1}`}
            />
          );
        })}
      </div>
    </div>
  );
}
