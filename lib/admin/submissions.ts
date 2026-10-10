export const KIND_LABELS: Record<string, string> = {
  adhesion: "Adhésion",
  engagement: "Engagement",
  partenaire: "Partenariat",
  contact: "Contact",
  presse: "Presse",
};

export const STATUS_LABELS: Record<string, string> = {
  new: "Nouvelle",
  in_progress: "En cours",
  done: "Traitée",
  spam: "Indésirable",
};

export const STATUS_TONES: Record<string, "neutral" | "green" | "gold" | "red"> = {
  new: "gold",
  in_progress: "neutral",
  done: "green",
  spam: "red",
};

export const FIELD_LABELS: Record<string, string> = {
  nom: "Nom", prenom: "Prénoms", email: "E-mail", telephone: "Téléphone", objet: "Objet", message: "Message",
  departement: "Département", commune: "Commune", age: "Âge", type: "Type", competences: "Compétences",
  disponibilite: "Disponibilité", naissance: "Date de naissance", sexe: "Sexe", profession: "Profession ou études",
  commission: "Commission souhaitée", motivation: "Lettre de motivation", organisation: "Organisation",
  contact: "Personne de contact", domaine: "Domaine", proposition: "Proposition", media: "Média", demande: "Demande",
};

export function summarize(kind: string, p: Record<string, string>) {
  const name = [p.prenom, p.nom].filter(Boolean).join(" ") || p.organisation || p.contact || p.media || "Sans nom";
  switch (kind) {
    case "adhesion":
      return { title: name, subtitle: [p.departement, p.commune].filter(Boolean).join(" · ") };
    case "engagement":
      return { title: name, subtitle: [p.type, p.departement, p.commune].filter(Boolean).join(" · ") };
    case "partenaire":
      return { title: p.organisation ?? name, subtitle: [p.type, p.domaine].filter(Boolean).join(" · ") };
    case "presse":
      return { title: name, subtitle: [p.media, p.demande].filter(Boolean).join(" · ") };
    default:
      return { title: name, subtitle: [p.objet, p.message].filter(Boolean).join(" · ") };
  }
}
