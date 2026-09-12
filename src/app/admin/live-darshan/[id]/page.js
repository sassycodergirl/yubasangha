import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";
import LiveVideoForm from "@/components/admin/LiveVideoForm";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const video = await db.content.findUnique({ where: { id } });
  return { title: video?.title ?? "Video" };
}

export default async function EditLiveVideoPage({ params }) {
  const { id } = await params;
  const video = await db.content.findUnique({ where: { id } });
  if (!video || video.type !== "live-video") notFound();

  return (
    <div>
      <AdminBreadcrumb items={[{ label: "Live Darshan", href: "/admin/live-darshan" }, { label: video.title }]} />
      <h1 className="mt-2 font-display text-xl font-semibold text-ink">{video.title}</h1>

      <div className="mt-6 rounded-2xl border border-gold bg-white p-6 shadow-sm">
        <LiveVideoForm id={video.id} initialData={video.data} published={video.published} />
      </div>
    </div>
  );
}
