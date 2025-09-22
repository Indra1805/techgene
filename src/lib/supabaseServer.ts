// src/lib/supabaseServer.ts
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { env } from "./env";

export const supabaseServer = createSupabaseClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
