import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ✅ Read env vars
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// ✅ Runtime guard
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase environment variables! " +
      "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local or Vercel dashboard"
  );
}

// ✅ TypeScript assertion: these are definitely strings now
export function createClient() {
  return createSupabaseClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);
}
