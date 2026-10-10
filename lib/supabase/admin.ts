import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "@/lib/env";

/**
 * Client « service_role » : contourne la RLS. Réservé au code serveur
 * (API des formulaires, invitations, URL signées). Ne jamais l'exposer au navigateur.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !key) throw new Error("SUPABASE_SERVICE_ROLE_KEY ou NEXT_PUBLIC_SUPABASE_URL manquant");
  return createClient(SUPABASE_URL, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export const hasServiceRole = () => Boolean(SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
