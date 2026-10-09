/**
 * Configuration générale du site.
 * Toute valeur à `null` est affichée comme « À compléter » sur le site
 * (voir components/ui/Todo.tsx) et listée dans docs/A_COMPLETER.md.
 */
export const site = {
  name: "Sénat des Jeunes du Bénin",
  short: "SJB",
  motto: "Toujours là, tel le soleil",
  description:
    "Le Sénat des Jeunes du Bénin (SJB) est une association de jeunesse : une école d'engagement, de formation et d'action au service de la jeunesse béninoise.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.example.bj",
  seat: "Parakou, République du Bénin",
  legalRef: "Loi n° 2025-19 du 22 juillet 2025 relative aux associations et aux fondations",
  contact: {
    email: null as string | null,
    phones: [] as string[],
    address: null as string | null,
  },
  social: {
    facebook: null as string | null,
    instagram: null as string | null,
    tiktok: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
    whatsapp: null as string | null,
  },
  credit: null as string | null,
};

export type NavLink = { label: string; href: string; description?: string };
export type NavGroup = { label: string; href?: string; children?: NavLink[] };

export const navigation: NavGroup[] = [
  {
    label: "Le Sénat",
    href: "/le-senat",
    children: [
      { label: "Mission & valeurs", href: "/le-senat", description: "Vision, piliers et devise" },
      { label: "Organisation", href: "/organisation", description: "Organes et chaîne de commandement" },
      { label: "Bureau exécutif national", href: "/bureau-executif", description: "Les sept postes du BEN" },
      { label: "Présidence", href: "/presidence", description: "Le mot du Président" },
      { label: "Sous-groupes", href: "/sous-groupes", description: "CCJ, CLAP et CSM" },
      { label: "Commissions", href: "/commissions", description: "Les cinq commissions techniques" },
    ],
  },
  { label: "Territoires", href: "/territoires" },
  { label: "Actions", href: "/actions" },
  {
    label: "Actualités",
    href: "/actualites",
    children: [
      { label: "Actualités", href: "/actualites", description: "Communiqués et comptes rendus" },
      { label: "Agenda", href: "/agenda", description: "Sessions, assemblées, événements" },
      { label: "Presse", href: "/presse", description: "Kit média et contact" },
    ],
  },
  {
    label: "Transparence",
    href: "/transparence",
    children: [
      { label: "Documents officiels", href: "/documents", description: "Statuts, décrets, délibérations" },
      { label: "Transparence & comptes", href: "/transparence", description: "Reddition de comptes" },
      { label: "Partenaires", href: "/partenaires", description: "Conventions et partenariats" },
    ],
  },
  { label: "Opportunités", href: "/opportunites" },
];

export const footerColumns: { title: string; links: NavLink[] }[] = [
  {
    title: "Le Sénat",
    links: [
      { label: "Mission & valeurs", href: "/le-senat" },
      { label: "Organisation", href: "/organisation" },
      { label: "Bureau exécutif national", href: "/bureau-executif" },
      { label: "Présidence", href: "/presidence" },
      { label: "Sous-groupes", href: "/sous-groupes" },
      { label: "Commissions", href: "/commissions" },
    ],
  },
  {
    title: "Agir",
    links: [
      { label: "Rejoindre le SJB", href: "/rejoindre" },
      { label: "Je veux m'engager", href: "/engagement" },
      { label: "Territoires", href: "/territoires" },
      { label: "Actions & projets", href: "/actions" },
      { label: "Opportunités", href: "/opportunites" },
    ],
  },
  {
    title: "Informer",
    links: [
      { label: "Actualités", href: "/actualites" },
      { label: "Agenda", href: "/agenda" },
      { label: "Documents officiels", href: "/documents" },
      { label: "Transparence", href: "/transparence" },
      { label: "Partenaires", href: "/partenaires" },
      { label: "Presse", href: "/presse" },
      { label: "Contact", href: "/contact" },
    ],
  },
];
