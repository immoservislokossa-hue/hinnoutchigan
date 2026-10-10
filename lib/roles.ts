export type AppRole =
  | "super_admin"
  | "editor"
  | "ben"
  | "coord_region"
  | "coord_dept"
  | "communal"
  | "arrondissement"
  | "member";

export const ROLE_LABELS: Record<AppRole, string> = {
  super_admin: "Administrateur principal",
  editor: "Éditeur",
  ben: "Bureau Exécutif National",
  coord_region: "Coordination régionale",
  coord_dept: "Coordination départementale",
  communal: "Section communale",
  arrondissement: "Section d'arrondissement",
  member: "Membre",
};

export const ALL_ROLES = Object.keys(ROLE_LABELS) as AppRole[];

/** Rôles autorisés à entrer dans le back-office. */
export const ADMIN_ROLES: AppRole[] = ["super_admin", "editor", "ben", "coord_region", "coord_dept"];
/** Contenu : actualités, événements, documents, annonces, partenaires. */
export const STAFF_ROLES: AppRole[] = ["super_admin", "editor", "ben"];
/** Direction : membres, demandes, réglages. */
export const LEADERSHIP_ROLES: AppRole[] = ["super_admin", "ben"];

export const isAdminRole = (r?: AppRole | null) => !!r && ADMIN_ROLES.includes(r);
export const isStaffRole = (r?: AppRole | null) => !!r && STAFF_ROLES.includes(r);
export const isLeadershipRole = (r?: AppRole | null) => !!r && LEADERSHIP_ROLES.includes(r);
export const isCoordinator = (r?: AppRole | null) =>
  !!r && ["coord_region", "coord_dept", "communal", "arrondissement"].includes(r);

export const MEMBER_STATUS_LABELS: Record<string, string> = {
  candidat: "Candidat",
  adherent_engage: "Membre adhérent engagé",
  benevole_occasionnel: "Membre bénévole occasionnel",
  sympathisant: "Membre sympathisant",
  honneur: "Membre d'honneur",
  fondateur: "Membre fondateur",
};
