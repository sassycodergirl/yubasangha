import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { findSection } from "@/lib/admin/sections";
import AutoForm from "@/components/admin/AutoForm";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const section = findSection(slug);
  return { title: section?.label ?? "Setting" };
}

export default async function AdminSettingEditPage({ params }) {
  const { slug } = await params;
  const section = findSection(slug);
  if (!section || section.pages !== null) notFound();

  const row = await db.content.findUnique({
    where: { type_slug: { type: section.type, slug } },
  });
  const data = row?.data ?? section.seed;

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Settings", href: "/admin/settings" }, { label: section.label }]} />
      <h1 className="font-display text-xl font-semibold text-ink">{section.label}</h1>
      <p className="mt-1 text-sm text-gray-700">Shown on every page of the site.</p>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        <AutoForm slug={slug} initialData={data} />
      </div>
    </div>
  );
}
