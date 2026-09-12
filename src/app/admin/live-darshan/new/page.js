import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import LiveVideoForm from "@/components/admin/LiveVideoForm";

export const metadata = { title: "New Video" };

export default function NewLiveVideoPage() {
  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Live Darshan", href: "/admin/live-darshan" }, { label: "New" }]} />
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">New Video</h1>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        <LiveVideoForm />
      </div>
    </div>
  );
}
