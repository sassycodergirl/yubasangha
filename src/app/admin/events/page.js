import Link from "next/link";
import { listEventRows } from "@/lib/events";
import EventsListClient from "@/components/admin/EventsListClient";
import { PlusIcon } from "@/components/ui/icons";

export const metadata = { title: "Events" };

export default async function AdminEventsPage() {
  const events = await listEventRows();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Events</h1>
          <p className="mt-1 text-sm text-gray-700">
            The top event here is the one featured on the homepage teaser.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/admin/pages/events/events-banner"
            className="rounded-xl border border-gold px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold/5"
          >
            Edit page banner
          </Link>
          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-maroon px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-maroon-dark hover:shadow-md"
          >
            <PlusIcon className="size-4" />
            Add event
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <EventsListClient events={events} />
      </div>
    </div>
  );
}
