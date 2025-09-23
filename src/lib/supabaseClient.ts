// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Client-side Supabase instance (anon key). This file is safe to import in
 * client components (pages that run in the browser).
 *
 * We do not throw here because this module is imported during build-time in some
 * environments — instead we warn if envs are missing.
 */
const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

if (!url || !anonKey) {
  // Warn — do not throw (avoids build crashes when imported on the server during static analysis)
  // But your application will fail to talk to Supabase if these are not set at runtime.
  // Set these in Vercel as NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
  // eslint-disable-next-line no-console
  console.warn(
    "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. Supabase client may not work in the browser."
  );
}

export const supabase = createClient(url, anonKey);
