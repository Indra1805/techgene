// src/lib/supabaseServer.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Server-side factory to create a Supabase client using your SERVICE ROLE key.
 * This checks at runtime that the required environment variables are present.
 *
 * Usage in server code/APIs:
 *   const supabase = createClient();
 */
export function createClient() {
  const SUPABASE_URL = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_KEY;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "Missing Supabase server environment variables. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  // Now TS knows these are strings (after the check above).
  return createSupabaseClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
}
