import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { findSection } from "@/lib/admin/sections";
import { dashboardBanner } from "@/lib/admin/dashboardBanner";

// Public-site content blocks (sections.js) plus admin-only ones (e.g. the
// dashboard banner) share this one generic Content-backed API.
function findBlock(slug) {
  return findSection(slug) ?? (slug === dashboardBanner.slug ? dashboardBanner : undefined);
}

export async function GET(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const section = findBlock(slug);
  if (!section) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
  }

  const row = await db.content.findUnique({
    where: { type_slug: { type: section.type, slug } },
  });

  return NextResponse.json({ data: row?.data ?? section.seed });
}

export async function PUT(request, { params }) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const section = findBlock(slug);
  if (!section) {
    return NextResponse.json({ error: "Unknown section" }, { status: 404 });
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

  const row = await db.content.upsert({
    where: { type_slug: { type: section.type, slug } },
    update: { data, title: section.label },
    create: { type: section.type, slug, title: section.label, data },
  });

  return NextResponse.json({ data: row.data });
}
