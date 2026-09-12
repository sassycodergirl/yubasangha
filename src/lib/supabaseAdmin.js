import { createClient } from "@supabase/supabase-js";

// Server-only client using the secret key -- bypasses RLS, so this file
// must never be imported from a Client Component or exposed to the browser.
// Used only for admin uploads (src/app/api/admin/upload/route.js).
export const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY,
  { auth: { persistSession: false } }
);

export const MEDIA_BUCKET = "media";
