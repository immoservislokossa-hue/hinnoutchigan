/** Faits issus des Statuts 2026 et du Décret n°002-08-2026/SGN-BEN-SJB. */

export const pillars = [
  {
    title: "Démocratie participative",
    text: "Chaque jeune a une voix : le SJB fonctionne par assemblées, commissions et délibérations ouvertes à ses membres.",
  },
  {
    title: "Développement humain intégral",
    text: "Former la personne dans toutes ses dimensions : civique, professionnelle, culturelle, sociale et environnementale.",
  },
  {
    title: "Panafricanisme civique",
    text: "Inscrire l'engagement de la jeunesse béninoise dans une solidarité africaine, membre fondateur du Sénat des Jeunes d'Afrique.",
  },
];

export const objectives = [
  "Exprimer les idéaux et les préoccupations de la jeunesse béninoise",
  "Promouvoir l'excellence, la citoyenneté et le leadership chez les jeunes",
  "Servir d'école d'engagement civique, associatif et politique",
  "Promouvoir les valeurs culturelles endogènes et le brassage intergénérationnel",
  "Contribuer au développement économique et social du Bénin",
  "Se saisir des questions d'intérêt général, nationales et internationales",
  "S'intéresser à la santé, à l'environnement, au numérique et à la formation",
  "Favoriser l'inclusion des jeunes dans les processus décisionnels",
];

export const keyFigures = [
  { value: 6, label: "Régions", note: "coordinations régionales" },
  { value: 12, label: "Départements", note: "coordinations départementales" },
  { value: 77, label: "Communes", note: "sections communales" },
  { value: 546, label: "Arrondissements", note: "sections d'arrondissement" },
];

export type BenPost = {
  slug: string;
  title: string;
  origin: string;
  duties: string[];
};

export const benPosts: BenPost[] = [
  {
    slug: "president",
    title: "Président(e)",
    origin: "Moins de 30 ans au moment de l'élection",
    duties: [
      "Premier(e) responsable de l'association",
      "Signe toutes les correspondances, convoque et dirige les réunions",
      "Assure l'exécution des activités et représente l'association",
      "Négocie les partenariats et promeut l'association",
    ],
  },
  {
    slug: "vp1",
    title: "1er Vice-Président(e)",
    origin: "Issu(e) du CCJ (18-25 ans)",
    duties: [
      "Supplée le Président et assure son intérim",
      "Relations avec les institutions partenaires",
      "Coordination du CCJ au sein du BEN",
    ],
  },
  {
    slug: "vp2",
    title: "2ème Vice-Président(e)",
    origin: "Issu(e) du CLAP (26-34 ans)",
    duties: [
      "Supplée le 1er Vice-Président",
      "Coordonne les projets de l'association",
      "Représente le CLAP au sein du BEN",
    ],
  },
  {
    slug: "sg",
    title: "Secrétaire Général(e)",
    origin: "Issu(e) du CLAP",
    duties: [
      "Responsable de l'administration du secrétariat",
      "Prépare les décisions du BEN et rend compte à l'Assemblée Plénière",
      "Coordonne les projets",
    ],
  },
  {
    slug: "sga",
    title: "Secrétaire Général(e) Adjoint(e)",
    origin: "Issu(e) du CCJ (18-25 ans)",
    duties: [
      "Assure la communication de l'association",
      "Rédige les procès-verbaux",
      "Assiste le Secrétaire Général",
    ],
  },
  {
    slug: "tg",
    title: "Trésorier(ère) Général(e)",
    origin: "Issu(e) du CLAP",
    duties: [
      "Comptable de l'association",
      "Mobilisation des ressources financières",
      "Décaissements sur ordre du Président, tenue de la comptabilité",
    ],
  },
  {
    slug: "tga",
    title: "Trésorier(ère) Général(e) Adjoint(e)",
    origin: "Issu(e) du CCJ (18-25 ans)",
    duties: [
      "Garde les pièces comptables",
      "Organise les activités et manifestations",
      "Assiste le Trésorier Général",
    ],
  },
];

export const subGroups = [
  {
    code: "CCJ",
    name: "Conseil Consultatif des Jeunes",
    ages: "Moins de 25 ans",
    text: "La voix collective des jeunes en phase d'apprentissage et d'engagement initial. Premier échelon de l'école d'engagement du SJB, il favorise l'expression des besoins spécifiques des jeunes.",
    levels: ["Niveau 0 : moins de 15 ans", "Niveau 1 : 15 à 18 ans", "Niveau 2 : 18 à 25 ans"],
    lead: "Un(e) Coordonnateur(trice) désigné(e) par les membres du CCJ",
  },
  {
    code: "CLAP",
    name: "Comité de Leadership Associatif et Politique",
    ages: "26 à 34 ans",
    text: "Il structure et professionnalise l'action associative, renforce le leadership et favorise l'émergence de projets durables. Son Président représente le comité auprès des autres instances.",
    levels: ["Membres de 26 à 34 ans"],
    lead: "Un(e) Président(e) élu(e) par les membres du CLAP",
  },
  {
    code: "CSM",
    name: "Conseil des Séniors et Mentors",
    ages: "35 ans et plus",
    text: "Organe consultatif permanent qui assure la stabilité, la transmission des savoirs et la gouvernance éthique. Il accompagne les jeunes générations et garantit la pérennité des valeurs du SJB.",
    levels: ["Membres de 35 ans et plus"],
    lead: "Un(e) Président(e) élu(e) en son sein, qui supervise les processus de gouvernance",
  },
];

export const commissions = [
  { n: "I", name: "Commission des Lois et des Droits humains" },
  { n: "II", name: "Commission des Finances et des Questions économiques" },
  { n: "III", name: "Commission de l'Emploi, de l'Entrepreneuriat et des Affaires sociales" },
  { n: "IV", name: "Commission de l'Éducation, de la Culture et des Sports" },
  { n: "V", name: "Commission des Relations Extérieures, de la Coopération et du Panafricanisme" },
];

export const organs = [
  {
    code: "AP",
    name: "Assemblée Plénière",
    text: "Organe souverain et supérieur de décision. Elle réunit tous les membres adhérents engagés à jour de leurs obligations, au moins deux fois par an. Elle amende les textes fondamentaux, renouvelle les instances et se prononce sur les rapports d'activités et financiers.",
  },
  {
    code: "BEN",
    name: "Bureau Exécutif National",
    text: "Organe exécutif de l'association : sept membres élus pour deux ans, renouvelables une fois, avec au moins 40 % de femmes. Il se réunit au moins une fois par trimestre.",
  },
  {
    code: "CCJ · CLAP · CSM",
    name: "Instances des sous-groupes",
    text: "Trois instances par tranche d'âge qui donnent à chaque génération un rôle spécifique dans la gouvernance.",
  },
  {
    code: "CTP",
    name: "Commissions Techniques Permanentes",
    text: "Cinq commissions nommées par le BEN. L'inscription à une commission est obligatoire pour les membres adhérents engagés.",
  },
  {
    code: "ID",
    name: "Instances déconcentrées",
    text: "Coordinations régionales et départementales, sections communales et d'arrondissement : le SJB au plus près des populations, de 18 à 35 ans, avec au moins 40 % de femmes.",
  },
  {
    code: "CAC",
    name: "Commissariat aux Comptes",
    text: "Organe de contrôle externe composé de trois membres élus par l'Assemblée Plénière, indépendants du BEN. Il audite la gestion financière et matérielle.",
  },
];

export const chain = [
  { level: "Section d'arrondissement", posts: "3 postes", count: 546, text: "Échelon le plus proche des populations : Président, Secrétaire, Trésorier." },
  { level: "Section communale", posts: "9 postes", count: 77, text: "Équipe de neuf responsables rendant compte à la coordination départementale." },
  { level: "Coordination départementale", posts: "9 postes", count: 12, text: "Le visage du SJB dans le département, sous l'autorité de la coordination régionale." },
  { level: "Coordination régionale", posts: "3 postes", count: 6, text: "Coordonnateur, adjoint et Secrétaire Général régional, sous l'autorité du BEN." },
  { level: "Bureau Exécutif National", posts: "7 postes", count: 1, text: "L'organe exécutif national, devant l'Assemblée Plénière." },
];

export const teamPosts = [
  "Président(e)",
  "Vice-Président(e)",
  "Secrétaire Général(e)",
  "Trésorier(ère) Général(e)",
  "Chargé(e) à l'Organisation et à la Mobilisation",
  "Chargé(e) à la Communication et aux Relations Publiques",
  "Chargé(e) aux Projets et Partenariats",
  "Chargé(e) à l'Éducation et à l'Emploi Jeune",
  "Chargé(e) à la Santé et aux Actions Sociales",
];

export const actions = [
  {
    slug: "academie-citoyenne",
    title: "Académie Citoyenne de Leadership",
    tag: "Projet national",
    text: "Projet national de formation à la citoyenneté et au leadership, suivi dans chaque département par le Chargé aux Projets et Partenariats et le Chargé à l'Éducation et à l'Emploi Jeune, point focal du projet.",
  },
  {
    slug: "paix-cohesion",
    title: "Comités de Paix et de Cohésion",
    tag: "Projet national",
    text: "Des comités locaux qui portent la paix, le vivre-ensemble et la bonne gouvernance, valeurs au cœur de la mission du SJB.",
  },
  {
    slug: "education-emploi",
    title: "Éducation & Emploi Jeune",
    tag: "Action territoriale",
    text: "Séances de coaching, d'orientation et d'information sur les bourses et les dispositifs d'insertion professionnelle ; formations pratiques : rédaction de CV, entrepreneuriat.",
  },
  {
    slug: "sante-social",
    title: "Santé & Actions sociales",
    tag: "Action territoriale",
    text: "Campagnes de sensibilisation (santé, hygiène), journées de salubrité, dons, soutien aux orphelinats et solidarité entre membres.",
  },
  {
    slug: "projets-partenariats",
    title: "Projets & Partenariats locaux",
    tag: "Action territoriale",
    text: "Cartographie des ONG et structures présentes, rédaction de micro-projets, dossiers de partenariat avec les institutions locales et les entreprises.",
  },
  {
    slug: "plaidoyer",
    title: "Débats & plaidoyer de la jeunesse",
    tag: "Mission statutaire",
    text: "Association de débats, de propositions et d'échanges sur tous les sujets d'intérêt commun, sans prise de position partisane.",
  },
];

export const memberCategories = [
  { title: "Membre adhérent engagé", text: "Demande d'adhésion adressée au Président, validée en Assemblée Plénière. Voix délibérative et éligibilité aux responsabilités." },
  { title: "Membre fondateur", text: "Jeune béninois(e) ayant participé à la création de l'association." },
  { title: "Membre bénévole occasionnel", text: "Ancien adhérent ne remplissant plus tous les critères de l'Indice d'Engagement. Peut être accompagné pour retrouver son statut." },
  { title: "Membre sympathisant", text: "Personne physique ou morale qui approuve et soutient les objectifs du SJB sans en être adhérente." },
  { title: "Membre d'honneur", text: "Titre conféré par l'Assemblée Plénière en reconnaissance de services éminents." },
];

export const feeTable = [
  { ages: "Moins de 15 ans", group: "CCJ niveau 0", join: "Gratuit", monthly: "Gratuit", yearly: "Gratuit" },
  { ages: "15 à 18 ans", group: "CCJ niveau 1", join: "500", monthly: "125", yearly: "1 500" },
  { ages: "18 à 25 ans", group: "CCJ niveau 2", join: "1 000", monthly: "250", yearly: "3 000" },
  { ages: "26 à 34 ans", group: "CLAP", join: "2 000", monthly: "500", yearly: "6 000" },
  { ages: "35 ans et plus", group: "CSM", join: "5 000", monthly: "1 000", yearly: "12 000" },
];

export const engagementIndex = [
  "La régularité du paiement des cotisations",
  "La participation effective aux réunions, sessions plénières et activités",
  "L'engagement dans des actions concrètes et vérifiables au nom de l'association",
];

export const timeline = [
  { date: "5 août 2012", title: "Congrès constitutif", text: "Référence citée dans le décret du 17 août 2026." },
  { date: "5 juin 2013", title: "Association de droit béninois", text: "Date portée en en-tête officiel du Bureau Exécutif National." },
  { date: "4 avril 2022", title: "Décret n°001-04-2022", text: "Création et organisation des instances déconcentrées." },
  { date: "22 juillet 2025", title: "Loi n° 2025-19", text: "Nouveau cadre légal des associations et fondations en République du Bénin." },
  { date: "31 mars 2026", title: "Statuts de refondation", text: "Adoptés par l'Assemblée Générale Extraordinaire de refondation, à Parakou." },
  { date: "17 août 2026", title: "Décret n°002-08-2026", text: "Révision et harmonisation des instances déconcentrées." },
];

export type Department = {
  slug: string;
  name: string;
  of: string;
  seat: string;
  region: string;
  communes: string[];
};

export const regions = [
  { name: "Atacora-Donga", departments: ["atacora", "donga"] },
  { name: "Borgou-Alibori", departments: ["borgou", "alibori"] },
  { name: "Zou-Collines", departments: ["zou", "collines"] },
  { name: "Ouémé-Plateau", departments: ["oueme", "plateau"] },
  { name: "Atlantique-Littoral", departments: ["atlantique", "littoral"] },
  { name: "Mono-Couffo", departments: ["mono", "couffo"] },
];

export const departments: Department[] = [
  { slug: "alibori", of: "de l'Alibori", name: "Alibori", seat: "Kandi", region: "Borgou-Alibori", communes: ["Banikoara", "Gogounou", "Kandi", "Karimama", "Malanville", "Ségbana"] },
  { slug: "atacora", of: "de l'Atacora", name: "Atacora", seat: "Natitingou", region: "Atacora-Donga", communes: ["Boukoumbé", "Cobly", "Kérou", "Kouandé", "Matéri", "Natitingou", "Pehonco", "Tanguiéta", "Toucountouna"] },
  { slug: "atlantique", of: "de l'Atlantique", name: "Atlantique", seat: "Allada", region: "Atlantique-Littoral", communes: ["Abomey-Calavi", "Allada", "Kpomassè", "Ouidah", "Sô-Ava", "Toffo", "Tori-Bossito", "Zè"] },
  { slug: "borgou", of: "du Borgou", name: "Borgou", seat: "Parakou", region: "Borgou-Alibori", communes: ["Bembèrèkè", "Kalalé", "N'Dali", "Nikki", "Parakou", "Pèrèrè", "Sinendé", "Tchaourou"] },
  { slug: "collines", of: "des Collines", name: "Collines", seat: "Dassa-Zoumè", region: "Zou-Collines", communes: ["Bantè", "Dassa-Zoumè", "Glazoué", "Ouèssè", "Savalou", "Savè"] },
  { slug: "couffo", of: "du Couffo", name: "Couffo", seat: "Aplahoué", region: "Mono-Couffo", communes: ["Aplahoué", "Djakotomey", "Dogbo", "Klouékanmè", "Lalo", "Toviklin"] },
  { slug: "donga", of: "de la Donga", name: "Donga", seat: "Djougou", region: "Atacora-Donga", communes: ["Bassila", "Copargo", "Djougou", "Ouaké"] },
  { slug: "littoral", of: "du Littoral", name: "Littoral", seat: "Cotonou", region: "Atlantique-Littoral", communes: ["Cotonou"] },
  { slug: "mono", of: "du Mono", name: "Mono", seat: "Lokossa", region: "Mono-Couffo", communes: ["Athiémé", "Bopa", "Comè", "Grand-Popo", "Houéyogbé", "Lokossa"] },
  { slug: "oueme", of: "de l'Ouémé", name: "Ouémé", seat: "Porto-Novo", region: "Ouémé-Plateau", communes: ["Adjarra", "Adjohoun", "Aguégués", "Akpro-Missérété", "Avrankou", "Bonou", "Dangbo", "Porto-Novo", "Sèmè-Podji"] },
  { slug: "plateau", of: "du Plateau", name: "Plateau", seat: "Pobè", region: "Ouémé-Plateau", communes: ["Adja-Ouèrè", "Ifangni", "Kétou", "Pobè", "Sakété"] },
  { slug: "zou", of: "du Zou", name: "Zou", seat: "Abomey", region: "Zou-Collines", communes: ["Abomey", "Agbangnizoun", "Bohicon", "Covè", "Djidja", "Ouinhi", "Za-Kpota", "Zagnanado", "Zogbodomey"] },
];

export const documents = [
  {
    slug: "statuts-2026",
    title: "Statuts du Sénat des Jeunes du Bénin",
    kind: "Textes fondamentaux",
    date: "31 mars 2026",
    ref: "Version définitive 2026 · Loi n° 2025-19",
    file: "/documents/statuts-sjb-2026.pdf",
    size: "375 Ko",
  },
  {
    slug: "decret-002-08-2026",
    title: "Décret présidentiel n°002-08-2026/SGN-BEN-SJB",
    kind: "Décret",
    date: "17 août 2026",
    ref: "Révision et harmonisation des instances déconcentrées",
    file: "/documents/decret-002-08-2026-sjb.pdf",
    size: "227 Ko",
  },
];

export type NewsItem = {
  slug: string;
  title: string;
  date: string;
  iso: string;
  category: string;
  excerpt: string;
  body: string[];
  doc?: string;
};

export const news: NewsItem[] = [
  {
    slug: "decret-instances-deconcentrees-2026",
    title: "Révision des instances déconcentrées : le décret n°002-08-2026",
    date: "17 août 2026",
    iso: "2026-08-17",
    category: "Décret",
    excerpt:
      "Le Président du Bureau Exécutif National harmonise l'organisation des coordinations régionales, départementales, communales et des sections d'arrondissement.",
    body: [
      "Par le décret présidentiel n°002-08-2026/SGN-BEN-SJB du 17 août 2026, le Bureau Exécutif National révise et harmonise l'organisation et le fonctionnement des instances déconcentrées du Sénat des Jeunes du Bénin.",
      "Le texte précise la chaîne de commandement : les sections d'arrondissement (3 postes) rendent compte aux sections communales (9 postes), qui rendent compte aux coordinations départementales (9 postes), elles-mêmes sous l'autorité des six coordinations régionales (3 postes), qui rendent compte au Bureau Exécutif National.",
      "Il fixe aussi un cadre clair pour les sections d'arrondissement, échelon le plus proche des populations, et prévoit pour chaque responsable déconcentré la signature d'une clause d'engagement de mission, de confidentialité et de réserve.",
    ],
    doc: "/documents/decret-002-08-2026-sjb.pdf",
  },
  {
    slug: "statuts-refondation-2026",
    title: "Les statuts de refondation adoptés à Parakou",
    date: "31 mars 2026",
    iso: "2026-03-31",
    category: "Communiqué",
    excerpt:
      "L'Assemblée Générale Extraordinaire de refondation adopte les textes fondamentaux du SJB, conformes à la loi n° 2025-19 relative aux associations et aux fondations.",
    body: [
      "Réuni en Assemblée Générale Extraordinaire de refondation à Parakou, le Sénat des Jeunes du Bénin a adopté ses statuts le 31 mars 2026, en conformité avec la loi n° 2025-19 du 22 juillet 2025 et son décret d'application n° 2025-575 du 24 septembre 2025.",
      "Les statuts fondent l'association sur trois piliers : la démocratie participative, le développement humain intégral et le panafricanisme civique. Ils organisent la gouvernance autour de l'Assemblée Plénière, du Bureau Exécutif National, de trois sous-groupes (CCJ, CLAP, CSM), de cinq commissions techniques et d'instances déconcentrées.",
      "Les statuts sont publiés dans leur intégralité et téléchargeables sur ce site.",
    ],
    doc: "/documents/statuts-sjb-2026.pdf",
  },
];

export const statutoryCalendar = [
  { title: "Assemblée Plénière ordinaire", freq: "Deux fois par an", text: "Convocation vingt jours avant la session, avec l'ordre du jour. Quorum : moitié plus un des membres adhérents engagés." },
  { title: "Bureau Exécutif National", freq: "Chaque trimestre", text: "Réunion au moins une fois par trimestre sur convocation du Président." },
  { title: "Évaluation de l'Indice d'Engagement", freq: "Chaque trimestre", text: "Suivi de la participation active de chaque membre adhérent." },
  { title: "Rapports des coordinations régionales", freq: "Chaque trimestre", text: "Rapports administratifs, moraux et financiers remis au BEN." },
  { title: "Assemblées générales régionales", freq: "Avant l'assemblée nationale", text: "Restitution des propositions au BEN au moins quatre semaines avant les assemblées nationales." },
  { title: "Rapport général annuel", freq: "Avant le 30 avril", text: "Publié chaque année dans le journal du Registre des Associations et Fondations." },
  { title: "Prise de fonction du nouveau BEN", freq: "1er janvier", text: "Le BEN élu prend ses responsabilités le 1er janvier suivant son élection." },
];
