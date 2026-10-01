import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin, MEDIA_BUCKET } from "@/lib/supabaseAdmin";

// Extension is derived from these maps (the validated MIME type), never
// from the client-supplied filename -- an admin-only endpoint, but no
// reason to let an arbitrary filename (which can contain "..", "/", or
// anything else) flow into the storage path at all.
const ALLOWED_IMAGE_TYPES = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
};
// Video uploads exist for Pujo Sangbad's "upload your own" option (see
// VideoUploadField.jsx) -- an external link (YouTube/Facebook/Instagram) is
// what every other video feature on the site uses and costs nothing in
// storage, so this is deliberately the exception, not the default; it gets
// a much larger cap than an image but is still bounded, same reasoning as
// the admin-facing storage warning next to the upload button itself.
const ALLOWED_VIDEO_TYPES = {
  "video/mp4": "mp4",
  "video/webm": "webm",
  "video/quicktime": "mov",
};
const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MAX_VIDEO_BYTES = 80 * 1024 * 1024;

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
  const isVideo = file.type in ALLOWED_VIDEO_TYPES;
  const ext = ALLOWED_IMAGE_TYPES[file.type] ?? ALLOWED_VIDEO_TYPES[file.type];
  if (!ext) {
    return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
  }
  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `${isVideo ? "Video" : "Image"} must be ${maxBytes / (1024 * 1024)}MB or smaller` },
      { status: 400 }
    );
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
