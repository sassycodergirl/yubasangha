import { getSettingsSections } from "@/lib/admin/sections";
import AdminListLink from "@/components/admin/AdminListLink";

export const metadata = { title: "Settings" };

export default function AdminSettingsListPage() {
  const settingsSections = getSettingsSections();

  return (
    <div>
      <h1 className="font-display text-xl font-semibold text-ink">Settings</h1>
      <p className="mt-1 text-sm text-gray-700">
        Site-wide content shown on every page, not tied to one page.
      </p>

      <div className="mt-6 space-y-3">
        {settingsSections.map((section) => (
          <AdminListLink
            key={section.slug}
            href={`/admin/settings/${section.slug}`}
            title={section.label}
          />
        ))}
      </div>
    </div>
  );
}
