import { createClient } from "@supabase/supabase-js";

// Supports both the Vercel Supabase integration's names (SUPABASE_URL /
// SUPABASE_PUBLISHABLE_KEY) and the manually-set NEXT_PUBLIC_ names used in
// local dev. This client only ever runs server-side (in server components),
// so neither variable needs the NEXT_PUBLIC_ prefix in production.
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey =
  process.env.SUPABASE_PUBLISHABLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
