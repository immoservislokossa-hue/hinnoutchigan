import { Flash, PageHeader } from "@/components/admin/ui";
import { SettingsForm, type Section } from "@/components/admin/SettingsForm";
import { requireRoles } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { LEADERSHIP_ROLES } from "@/lib/roles";
import { publicFileUrl } from "@/lib/data";
import { saveSettingsAction } from "@/lib/admin/special-actions";

export const metadata = { title: "Paramètres du site" };

type Obj = Record<string, unknown>;
const s = (v: unknown) => (typeof v === "string" ? v : "");

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ ok?: string; error?: string }> }) {
  const sp = await searchParams;
  await requireRoles(LEADERSHIP_ROLES);
  const supabase = await createClient();
  const { data } = await supabase.from("site_settings").select("key,value");
  const map = Object.fromEntries((data ?? []).map((r) => [r.key as string, (r.value ?? {}) as Obj]));
  const c = map.contact ?? {};
  const so = map.social ?? {};
  const p = map.president ?? {};
  const l = map.legal ?? {};
  const phones = Array.isArray(c.phones) ? (c.phones as string[]).join("\n") : "";

  const initial: Record<string, string> = {
    contact_email: s(c.email), contact_phones: phones, contact_address: s(c.address),
    facebook: s(so.facebook), instagram: s(so.instagram), tiktok: s(so.tiktok), linkedin: s(so.linkedin), youtube: s(so.youtube), whatsapp: s(so.whatsapp),
    president_name: s(p.name), president_message: s(p.message), president_vision: s(p.vision), president_priorities: s(p.priorities),
    president_actions: s(p.actions), president_commitments: s(p.commitments),
    press_contact: s((map.press ?? {}).contact),
    legal_registry_number: s(l.registry_number), legal_publication_director: s(l.publication_director), legal_host: s(l.host), legal_retention: s(l.retention),
  };

  const sections: Section[] = [
    { title: "Coordonnées officielles", description: "Affichées dans le pied de page, la page Contact et les mentions légales.", fields: [
      { name: "contact_email", label: "Courriel officiel", type: "text", half: true, maxLength: 254 },
      { name: "contact_address", label: "Adresse physique", type: "text", half: true, maxLength: 300 },
      { name: "contact_phones", label: "Téléphones (un par ligne)", type: "textarea", rows: 3, maxLength: 400 },
    ] },
    { title: "Réseaux sociaux", description: "Liens complets (https://…). Laissez vide pour ne pas afficher.", fields: [
      { name: "facebook", label: "Facebook", type: "text", half: true, maxLength: 300 },
      { name: "instagram", label: "Instagram", type: "text", half: true, maxLength: 300 },
      { name: "tiktok", label: "TikTok", type: "text", half: true, maxLength: 300 },
      { name: "linkedin", label: "LinkedIn", type: "text", half: true, maxLength: 300 },
      { name: "youtube", label: "YouTube", type: "text", half: true, maxLength: 300 },
      { name: "whatsapp", label: "WhatsApp (lien)", type: "text", half: true, maxLength: 300 },
    ] },
    { title: "Page Présidence", fields: [
      { name: "president_name", label: "Prénoms et nom du Président", type: "text", maxLength: 160 },
      { name: "president_photo", label: "Photo officielle", type: "file", bucket: "public-files" },
      { name: "president_message", label: "Mot du Président", type: "textarea", rows: 8, maxLength: 4000 },
      { name: "president_vision", label: "Vision pour la jeunesse", type: "textarea", rows: 4, maxLength: 3000 },
      { name: "president_priorities", label: "Priorités du mandat", type: "textarea", rows: 4, maxLength: 3000 },
      { name: "president_actions", label: "Actions réalisées", type: "textarea", rows: 4, maxLength: 3000 },
      { name: "president_commitments", label: "Engagements", type: "textarea", rows: 4, maxLength: 3000 },
    ] },
    { title: "Presse", fields: [{ name: "press_contact", label: "Contact presse (nom, courriel, téléphone)", type: "text", maxLength: 400 }] },
    { title: "Informations légales", fields: [
      { name: "legal_registry_number", label: "Identifiant au Registre des Associations et Fondations", type: "text", half: true, maxLength: 120 },
      { name: "legal_publication_director", label: "Directeur de la publication", type: "text", half: true, maxLength: 160 },
      { name: "legal_host", label: "Hébergeur (nom et adresse)", type: "text", maxLength: 300 },
      { name: "legal_retention", label: "Durée de conservation des données", type: "text", maxLength: 300, help: "Ex. 3 ans après le dernier contact." },
    ] },
  ];
  const photo = publicFileUrl(s(p.photo_path) || null);
  return (
    <>
      <PageHeader title="Paramètres du site" description="Ces informations remplacent les mentions « À compléter » sur le site public." />
      <Flash ok={sp.ok} error={sp.error} />
      <div className="max-w-3xl">
        <SettingsForm
          sections={sections}
          initial={initial}
          action={saveSettingsAction}
          photoHint={photo ? <p className="mt-1.5 text-xs text-ink-mute">Photo actuelle : <a href={photo} target="_blank" rel="noopener noreferrer" className="font-medium text-green-800 underline">ouvrir</a>. Choisissez un fichier pour la remplacer.</p> : undefined}
        />
      </div>
    </>
  );
}
