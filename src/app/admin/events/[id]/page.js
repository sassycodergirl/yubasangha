import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import EventForm from "@/components/admin/EventForm";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const event = await db.content.findUnique({ where: { id } });
  return { title: event?.title ?? "Event" };
}

export default async function EditEventPage({ params }) {
  const { id } = await params;
  const event = await db.content.findUnique({ where: { id } });
  if (!event || event.type !== "event") notFound();

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Events", href: "/admin/events" }, { label: event.title }]} />
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">{event.title}</h1>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        <EventForm id={event.id} initialData={event.data} published={event.published} />
      </div>
    </div>
  );
}
