import Link from "next/link";
import { listLiveVideoRows } from "@/lib/liveVideos";
import LiveVideosListClient from "@/components/admin/LiveVideosListClient";
import { PlusIcon } from "@/components/ui/icons";

export const metadata = { title: "Live Darshan" };

export default async function AdminLiveDarshanPage() {
  const videos = await listLiveVideoRows();

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Live Darshan</h1>
          <p className="mt-1 text-sm text-gray-700">
            The featured video here is the one shown on the homepage. The Live Darshan page shows
            that same video, plus every other published one underneath it to switch to.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/admin/pages/home/live-darshan"
            className="rounded-xl border border-gold px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-gold/5"
          >
            Edit section settings
          </Link>
          <Link
            href="/admin/live-darshan/new"
            className="inline-flex items-center gap-1.5 rounded-xl bg-maroon px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-maroon-dark hover:shadow-md"
          >
            <PlusIcon className="size-4" />
            Add video
          </Link>
        </div>
      </div>

      <div className="mt-6">
        <LiveVideosListClient videos={videos} />
      </div>
    </div>
  );
}
