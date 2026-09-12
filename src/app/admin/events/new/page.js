import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import EventForm from "@/components/admin/EventForm";

export const metadata = { title: "New Event" };

export default function NewEventPage() {
  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Events", href: "/admin/events" }, { label: "New" }]} />
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">New Event</h1>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        <EventForm />
      </div>
    </div>
  );
}
