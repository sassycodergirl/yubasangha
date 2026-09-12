import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { setFeaturedEvent } from "@/lib/events";

async function findEvent(id) {
  const event = await db.content.findUnique({ where: { id } });
  return event?.type === "event" ? event : null;
}

export async function GET(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const event = await findEvent(id);
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ event });
}

// Also used by the admin list's publish-toggle and reorder (up/down)
// controls — any subset of { data, published, order } can be sent.
export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await findEvent(id);
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
    update.data = body.data;
    update.title = body.data.title;
  }
  if (typeof body.published === "boolean") update.published = body.published;
  if (typeof body.order === "number") update.order = body.order;

  const event = await db.content.update({ where: { id }, data: update });

  // Exactly one event can be featured on the homepage teaser at a time --
  // picking a new one here un-picks whichever was featured before.
  if (update.data?.featured === true) await setFeaturedEvent(id);

  return NextResponse.json({ event });
}

export async function DELETE(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await findEvent(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.content.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
