import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin, MEDIA_BUCKET } from "@/lib/supabaseAdmin";

// Extension is derived from this map (the validated MIME type), never from
// the client-supplied filename -- an admin-only endpoint, but no reason to
// let an arbitrary filename (which can contain "..", "/", or anything else)
// flow into the storage path at all.
const ALLOWED_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};
const MAX_BYTES = 5 * 1024 * 1024;

let bucketReady = false;

async function ensureBucket() {
  if (bucketReady) return;
  const { data: buckets } = await supabaseAdmin.storage.listBuckets();
  if (!buckets?.some((b) => b.name === MEDIA_BUCKET)) {
    await supabaseAdmin.storage.createBucket(MEDIA_BUCKET, { public: true });
  }
  bucketReady = true;
}

export async function POST(request) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing `file`" }, { status: 400 });
  }
  const ext = ALLOWED_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Unsupported image type" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "Image must be 5MB or smaller" }, { status: 400 });
  }

  await ensureBucket();

  const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error } = await supabaseAdmin.storage
    .from(MEDIA_BUCKET)
    .upload(path, file, { contentType: file.type });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const { data } = supabaseAdmin.storage.from(MEDIA_BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: data.publicUrl });
}
