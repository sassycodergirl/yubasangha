import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// The "Publish Changes" button (see PublishChangesButton.jsx) calls this.
// Public pages are statically cached (no per-request DB hit) and only ever
// refresh when this runs -- one call invalidates the whole site at once
// (every page under the root layout), which is simpler and more robust than
// tracking which specific slug an admin just edited affects which specific
// page(s).
export async function POST() {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/", "layout");
  return NextResponse.json({ published: true });
}
