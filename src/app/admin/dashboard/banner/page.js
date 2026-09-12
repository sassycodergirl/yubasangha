import { db } from "@/lib/db";
import { dashboardBanner } from "@/lib/admin/dashboardBanner";
import AutoForm from "@/components/admin/AutoForm";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export const metadata = { title: "Dashboard Banner" };

export default async function AdminDashboardBannerPage() {
  const row = await db.content.findUnique({
    where: { type_slug: { type: dashboardBanner.type, slug: dashboardBanner.slug } },
  });
  const data = row?.data ?? dashboardBanner.seed;

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Banner" }]} />
      <h1 className="font-display text-xl font-semibold text-ink">Dashboard Banner</h1>
      <p className="mt-1 text-sm text-gray-700">
        Just for you — shown on your dashboard, not on the public site.
      </p>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6">
        <AutoForm slug={dashboardBanner.slug} initialData={data} />
      </div>
    </div>
  );
}
