import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// In demo mode these are placeholders — the client is created but never called
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
