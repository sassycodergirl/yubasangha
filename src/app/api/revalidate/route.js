import { NextResponse } from "next/server";

// Phase 2: the admin panel calls this after saving/publishing content so the
// affected public (ISR) pages rebuild. Guarded by a shared secret token.
//
// Example: POST /api/revalidate  { "path": "/events", "secret": "..." }

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { path, secret } = body ?? {};

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (typeof path !== "string" || !path.startsWith("/")) {
    return NextResponse.json({ error: "`path` must be an absolute path" }, { status: 400 });
  }

  // TODO(Phase 2): revalidatePath(path) once public pages read from the DB.
  return NextResponse.json({ revalidated: false, path, note: "stub" });
}
