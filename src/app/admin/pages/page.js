import { pages } from "@/lib/admin/pages";
import { getSectionsForPage } from "@/lib/admin/sections";
import AdminListLink from "@/components/admin/AdminListLink";

export const metadata = { title: "Pages" };

export default function AdminPagesListPage() {
  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-ink">Pages</h1>
      <p className="mt-1 text-sm text-gray-700">
        Public pages managed from the CMS.
      </p>

      <div className="mt-6 space-y-3">
        {pages.map((page) => {
          const sectionCount = getSectionsForPage(page.slug).length;
          return (
            <AdminListLink
              key={page.slug}
              href={`/admin/pages/${page.slug}`}
              title={page.label}
              subtitle={page.description}
              meta={`${sectionCount} sections`}
            />
          );
        })}
      </div>
    </div>
  );
}
