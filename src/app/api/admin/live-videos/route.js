import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

// The Live Darshan video collection's list + create endpoint. Each video is
// a Content row (type "live-video"); see src/lib/liveVideos.js for how the
// public site reads them back out. Mirrors /api/admin/events.
export async function GET() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const videos = await db.content.findMany({
    where: { type: "live-video" },
    orderBy: { order: "asc" },
  });
  return NextResponse.json({ videos });
}

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { data } = body ?? {};
  if (typeof data !== "object" || data === null || Array.isArray(data)) {
    return NextResponse.json({ error: "`data` must be an object" }, { status: 400 });
  }
  if (!data.title?.trim()) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  if (!data.youtubeVideoId?.trim()) {
    return NextResponse.json({ error: "YouTube video ID is required" }, { status: 400 });
  }

  const last = await db.content.findFirst({
    where: { type: "live-video" },
    orderBy: { order: "desc" },
  });

  const video = await db.content.create({
    data: {
      type: "live-video",
      slug: randomUUID(),
      title: data.title,
      data,
      order: (last?.order ?? -1) + 1,
      published: true,
    },
  });

  return NextResponse.json({ video });
}
