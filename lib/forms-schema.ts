import { z } from "zod";

const s = (min: number, max: number) => z.string().trim().min(min).max(max);
const opt = (max: number) => z.string().trim().max(max).optional().default("");
const email = z.string().trim().toLowerCase().max(254).regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "e-mail invalide");
const phone = z.string().trim().max(30).refine((v) => v.replace(/\D/g, "").length >= 8, "téléphone invalide");

export const formSchemas = {
  contact: z.object({
    nom: s(2, 120),
    email,
    telephone: opt(30),
    objet: s(2, 80),
    message: s(10, 5000),
  }),
  engagement: z.object({
    nom: s(2, 80), prenom: s(2, 80), departement: s(3, 40), commune: s(2, 80),
    age: z.string().trim().regex(/^\d{1,2}$/, "âge invalide"),
    telephone: phone, email: opt(254), type: s(2, 60), competences: opt(200), disponibilite: opt(200), message: opt(3000),
  }),
  adhesion: z.object({
    nom: s(2, 80), prenom: s(2, 80), naissance: s(6, 20), sexe: s(1, 20), departement: s(3, 40), commune: s(2, 80),
    telephone: phone, email, profession: opt(200), commission: opt(120), motivation: s(10, 5000),
  }),
  partenaire: z.object({
    organisation: s(2, 160), contact: s(2, 120), telephone: phone, email, type: s(2, 60), domaine: s(2, 160), proposition: s(10, 5000),
  }),
  presse: z.object({
    nom: s(2, 120), media: s(2, 160), email, telephone: opt(30), demande: s(10, 5000),
  }),
  newsletter: z.object({ email }),
} as const;

export type FormKind = keyof typeof formSchemas;
export const isFormKind = (k: string): k is FormKind => k in formSchemas;
