import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Read environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Fail fast if env vars are missing
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase environment variables! " +
      "Make sure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set in .env.local"
  );
}

// ✅ Tell TS: these are now guaranteed strings
export function createClient() {
  return createSupabaseClient(
    SUPABASE_URL as string,
    SUPABASE_ANON_KEY as string
  );
}
