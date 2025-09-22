// src/lib/supabaseServer.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getEnvVar } from "./env";

const SUPABASE_URL = getEnvVar("NEXT_PUBLIC_SUPABASE_URL");
const SUPABASE_ANON_KEY = getEnvVar("NEXT_PUBLIC_SUPABASE_ANON_KEY");

export function createClient() {
  return createSupabaseClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
