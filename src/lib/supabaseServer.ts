// src/lib/supabaseServer.ts
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server only

// Server-side Supabase client
export const supabaseServer = createClient(url, serviceKey);
