"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { SITE_URL, isSupabaseConfigured } from "@/lib/env";
import { safeNext } from "@/lib/safe-next";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { error?: string; ok?: string };

const credentials = z.object({
  email: z.string().trim().toLowerCase().email("Adresse e-mail invalide."),
  password: z.string().min(1, "Mot de passe requis.").max(200),
});

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: "L'espace membres n'est pas encore activé." };
  const parsed = credentials.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Données invalides." };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) return { error: "Identifiants incorrects." };

  const { data: profile } = await supabase.from("profiles").select("status").eq("id", data.user.id).maybeSingle();
  if (!profile || profile.status !== "active") {
    await supabase.auth.signOut();
    return { error: "Ce compte est suspendu ou n'est pas encore activé. Contactez le secrétariat." };
  }
  redirect(safeNext(String(formData.get("next") ?? "")));
}

export async function requestResetAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: "L'espace membres n'est pas encore activé." };
  const parsed = z.string().trim().toLowerCase().email().safeParse(formData.get("email"));
  if (!parsed.success) return { error: "Adresse e-mail invalide." };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(parsed.data, {
    redirectTo: `${SITE_URL}/auth/callback?next=/auth/nouveau-mot-de-passe`,
  });
  // Réponse identique que le compte existe ou non (pas d'énumération)
  return { ok: "Si un compte existe pour cette adresse, un lien de réinitialisation vient d'être envoyé." };
}

const newPassword = z
  .object({
    password: z
      .string()
      .min(10, "10 caractères minimum.")
      .max(200)
      .regex(/[a-z]/, "Ajoutez une minuscule.")
      .regex(/[A-Z]/, "Ajoutez une majuscule.")
      .regex(/\d/, "Ajoutez un chiffre."),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, { message: "Les deux mots de passe diffèrent.", path: ["confirm"] });

export async function setPasswordAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) return { error: "L'espace membres n'est pas encore activé." };
  const parsed = newPassword.safeParse({ password: formData.get("password"), confirm: formData.get("confirm") });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Mot de passe invalide." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Lien expiré. Demandez un nouveau lien." };
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return { error: "Impossible de changer le mot de passe. Réessayez." };
  redirect("/espace");
}

export async function signOutAction() {
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/connexion");
}
