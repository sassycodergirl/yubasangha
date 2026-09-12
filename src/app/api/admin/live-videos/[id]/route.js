import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { setFeaturedLiveVideo } from "@/lib/liveVideos";

async function findVideo(id) {
  const video = await db.content.findUnique({ where: { id } });
  return video?.type === "live-video" ? video : null;
}

export async function GET(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const video = await findVideo(id);
  if (!video) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ video });
}

// Also used by the admin list's publish-toggle, reorder (up/down), and
// "feature on homepage" controls — any subset of { data, published, order }
// can be sent.
export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await findVideo(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const update = {};
  if (body.data !== undefined) {
    if (typeof body.data !== "object" || body.data === null || Array.isArray(body.data)) {
      return NextResponse.json({ error: "`data` must be an object" }, { status: 400 });
    }
    if (!body.data.title?.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 });
    }
    if (!body.data.youtubeVideoId?.trim()) {
      return NextResponse.json({ error: "YouTube video ID is required" }, { status: 400 });
    }
    update.data = body.data;
    update.title = body.data.title;
  }
  if (typeof body.published === "boolean") update.published = body.published;
  if (typeof body.order === "number") update.order = body.order;

  const video = await db.content.update({ where: { id }, data: update });

  // Exactly one video can be featured on the homepage at a time -- picking
  // a new one here un-picks whichever was featured before.
  if (update.data?.featured === true) await setFeaturedLiveVideo(id);

  return NextResponse.json({ video });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await findVideo(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.content.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
