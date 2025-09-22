// // src/lib/supabaseServer.ts
// import { createClient } from "@supabase/supabase-js";

// const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server only

// // Server-side Supabase client
// export const supabaseServer = createClient(url, serviceKey);


import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Server-side only key (do NOT expose this in client code)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export function createClient() {
  return createSupabaseClient(supabaseUrl, supabaseServiceKey);
}
