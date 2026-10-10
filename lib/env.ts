/** Configuration Supabase : le site fonctionne sans (contenu statique), le back-office non. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.bj").replace(/\/$/, "");
