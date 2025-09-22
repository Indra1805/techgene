// // src/lib/supabaseClient.ts
// import { createClient } from "@supabase/supabase-js";

// const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// // Client-side Supabase client
// export const supabase = createClient(url, anonKey);


import { createClient } from "@supabase/supabase-js";

// Client-side only keys (safe to expose in browser)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
