import { departments, regions } from "@/content/structure";
import { LEADERSHIP_ROLES, STAFF_ROLES, type AppRole } from "@/lib/roles";

export type FieldType = "text" | "textarea" | "select" | "checkbox" | "datetime" | "date" | "number" | "file" | "slug";

export type Field = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { value: string; label: string }[];
  help?: string;
  readOnly?: boolean;
  maxLength?: number;
  placeholder?: string;
  rows?: number;
  half?: boolean;
  /** file : compartiment cible ; « by-visibility » choisit selon le champ visibility */
  bucket?: "public-files" | "private-files" | "by-visibility";
  folder?: string;
  /** Pour la coordination départementale : valeur imposée côté serveur. */
  lockToDepartment?: boolean;
  /** slug : champ dont on dérive la valeur si elle est vide */
  source?: string;
};

export type Column = { key: string; label: string; kind?: "text" | "date" | "datetime" | "bool" | "badge" };

export type Resource = {
  key: string;
  table: string;
  label: string;
  singular: string;
  description: string;
  titleField: string;
  columns: Column[];
  fields: Field[];
  orderBy: { column: string; ascending: boolean };
  searchColumns: string[];
  read: AppRole[];
  write: AppRole[];
  canCreate: boolean;
  canDelete: boolean;
  createdByColumn?: string;
  defaults?: Record<string, unknown>;
};

export const deptOptions = departments.map((d) => ({ value: d.slug, label: d.name }));
export const regionOptions = regions.map((r) => ({ value: r.name, label: r.name }));
const opts = (...v: string[]) => v.map((x) => ({ value: x, label: x }));

const DEPT_COORD: AppRole[] = ["coord_dept"];

export const resources: Record<string, Resource> = {
  actualites: {
    key: "actualites",
    table: "news_posts",
    label: "Actualités",
    singular: "actualité",
    description: "Communiqués, décrets et comptes rendus publiés sur le site.",
    titleField: "title",
    columns: [
      { key: "title", label: "Titre" },
      { key: "category", label: "Catégorie", kind: "badge" },
      { key: "published", label: "Publié", kind: "bool" },
      { key: "published_at", label: "Date", kind: "date" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, maxLength: 200 },
      { name: "slug", label: "Adresse (slug)", type: "slug", source: "title", maxLength: 80, help: "Laissez vide pour la générer depuis le titre.", half: true },
      { name: "category", label: "Catégorie", type: "select", required: true, half: true, options: opts("Communiqué", "Décret", "Actualité", "Compte rendu", "Événement") },
      { name: "excerpt", label: "Résumé", type: "textarea", rows: 3, maxLength: 400, help: "Affiché dans les listes et le partage." },
      { name: "body", label: "Texte", type: "textarea", rows: 14, maxLength: 20000, help: "Séparez les paragraphes par une ligne vide." },
      { name: "cover_path", label: "Image de couverture", type: "file", bucket: "public-files", folder: "news", half: true },
      { name: "document_path", label: "Document joint (PDF)", type: "file", bucket: "public-files", folder: "news-docs", half: true },
      { name: "department_slug", label: "Département concerné", type: "select", options: deptOptions, half: true, lockToDepartment: true, help: "Vide = actualité nationale." },
      { name: "published_at", label: "Date de publication", type: "datetime", half: true, help: "Vide = maintenant, au moment de la publication." },
      { name: "published", label: "Publié sur le site", type: "checkbox" },
    ],
    orderBy: { column: "created_at", ascending: false },
    searchColumns: ["title", "excerpt"],
    read: [...STAFF_ROLES, ...DEPT_COORD],
    write: [...STAFF_ROLES, ...DEPT_COORD],
    canCreate: true,
    canDelete: true,
    createdByColumn: "author_id",
  },
  evenements: {
    key: "evenements",
    table: "events",
    label: "Événements",
    singular: "événement",
    description: "Assemblées, sessions, formations et rencontres de l'agenda.",
    titleField: "title",
    columns: [
      { key: "title", label: "Titre" },
      { key: "starts_at", label: "Début", kind: "datetime" },
      { key: "kind", label: "Type", kind: "badge" },
      { key: "published", label: "Publié", kind: "bool" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, maxLength: 200 },
      { name: "kind", label: "Type", type: "select", required: true, half: true, options: opts("Assemblée Plénière", "Réunion du BEN", "Formation", "Conférence", "Action sociale", "Événement") },
      { name: "location", label: "Lieu", type: "text", half: true, maxLength: 200 },
      { name: "starts_at", label: "Début", type: "datetime", required: true, half: true },
      { name: "ends_at", label: "Fin", type: "datetime", half: true },
      { name: "department_slug", label: "Département", type: "select", options: deptOptions, half: true, lockToDepartment: true, help: "Vide = événement national." },
      { name: "description", label: "Description", type: "textarea", rows: 6, maxLength: 5000 },
      { name: "registration_open", label: "Inscriptions ouvertes", type: "checkbox", half: true },
      { name: "published", label: "Publié sur le site", type: "checkbox", half: true },
    ],
    orderBy: { column: "starts_at", ascending: false },
    searchColumns: ["title", "location"],
    read: [...STAFF_ROLES, ...DEPT_COORD],
    write: [...STAFF_ROLES, ...DEPT_COORD],
    canCreate: true,
    canDelete: true,
    createdByColumn: "created_by",
  },
  documents: {
    key: "documents",
    table: "documents",
    label: "Documents",
    singular: "document",
    description: "Statuts, délibérations, rapports. La visibilité décide du compartiment de stockage.",
    titleField: "title",
    columns: [
      { key: "title", label: "Titre" },
      { key: "kind", label: "Type", kind: "badge" },
      { key: "visibility", label: "Visibilité", kind: "badge" },
      { key: "doc_date", label: "Date", kind: "date" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, maxLength: 200 },
      { name: "kind", label: "Type", type: "select", required: true, half: true, options: opts("Textes fondamentaux", "Décret", "Délibération", "Rapport", "Règlement", "Autre") },
      { name: "visibility", label: "Visibilité", type: "select", required: true, half: true, options: [
        { value: "public", label: "Public (site)" }, { value: "members", label: "Membres connectés" }, { value: "ben", label: "Bureau Exécutif National" },
      ] },
      { name: "reference", label: "Référence", type: "text", half: true, maxLength: 160, placeholder: "ex. n°001/SJB/2026" },
      { name: "doc_date", label: "Date du document", type: "date", half: true },
      { name: "file_path", label: "Fichier", type: "file", required: true, bucket: "by-visibility", folder: "documents", help: "PDF ou Word, 15 Mo maximum." },
    ],
    orderBy: { column: "created_at", ascending: false },
    searchColumns: ["title", "reference"],
    read: STAFF_ROLES,
    write: STAFF_ROLES,
    canCreate: true,
    canDelete: true,
    createdByColumn: "uploaded_by",
  },
  annonces: {
    key: "annonces",
    table: "announcements",
    label: "Annonces internes",
    singular: "annonce",
    description: "Messages visibles dans l'espace des membres connectés.",
    titleField: "title",
    columns: [
      { key: "title", label: "Titre" },
      { key: "audience", label: "Public", kind: "badge" },
      { key: "published_at", label: "Date", kind: "date" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", required: true, maxLength: 200 },
      { name: "audience", label: "Destinataires", type: "select", required: true, half: true, options: [
        { value: "all", label: "Tous les membres" }, { value: "coordinations", label: "Coordinations et sections" }, { value: "ben", label: "Bureau Exécutif National" },
      ] },
      { name: "published_at", label: "Date", type: "datetime", half: true },
      { name: "body", label: "Message", type: "textarea", rows: 8, maxLength: 5000 },
    ],
    orderBy: { column: "published_at", ascending: false },
    searchColumns: ["title", "body"],
    read: STAFF_ROLES,
    write: STAFF_ROLES,
    canCreate: true,
    canDelete: true,
    createdByColumn: "created_by",
  },
  partenaires: {
    key: "partenaires",
    table: "partners",
    label: "Partenaires",
    singular: "partenaire",
    description: "Partenaires conventionnés affichés sur le site.",
    titleField: "name",
    columns: [
      { key: "name", label: "Nom" },
      { key: "kind", label: "Type", kind: "badge" },
      { key: "published", label: "Publié", kind: "bool" },
      { key: "sort", label: "Ordre" },
    ],
    fields: [
      { name: "name", label: "Nom", type: "text", required: true, maxLength: 160 },
      { name: "kind", label: "Type", type: "select", required: true, half: true, options: opts("Institutionnel", "Technique", "Financier", "Associatif", "Média") },
      { name: "url", label: "Site web", type: "text", half: true, maxLength: 300, placeholder: "https://…" },
      { name: "logo_path", label: "Logo", type: "file", bucket: "public-files", folder: "partners", half: true },
      { name: "sort", label: "Ordre d'affichage", type: "number", half: true },
      { name: "published", label: "Publié sur le site", type: "checkbox" },
    ],
    orderBy: { column: "sort", ascending: true },
    searchColumns: ["name"],
    read: STAFF_ROLES,
    write: STAFF_ROLES,
    canCreate: true,
    canDelete: true,
  },
  equipes: {
    key: "equipes",
    table: "leadership",
    label: "Équipes publiques",
    singular: "responsable",
    description: "Membres du BEN et des coordinations affichés sur les pages publiques.",
    titleField: "full_name",
    columns: [
      { key: "full_name", label: "Nom" },
      { key: "post", label: "Poste" },
      { key: "scope", label: "Périmètre", kind: "badge" },
      { key: "published", label: "Publié", kind: "bool" },
    ],
    fields: [
      { name: "scope", label: "Périmètre", type: "select", required: true, half: true, options: [{ value: "ben", label: "Bureau Exécutif National" }, ...departments.map((d) => ({ value: `dept:${d.slug}`, label: `Coordination ${d.name}` }))] },
      { name: "post", label: "Poste", type: "text", required: true, half: true, maxLength: 120, help: "Ex. Président(e), Secrétaire Général(e)…" },
      { name: "full_name", label: "Prénoms et nom", type: "text", required: true, maxLength: 160 },
      { name: "photo_path", label: "Photo officielle", type: "file", bucket: "public-files", folder: "team", half: true },
      { name: "sort", label: "Ordre d'affichage", type: "number", half: true },
      { name: "bio", label: "Présentation", type: "textarea", rows: 4, maxLength: 1500 },
      { name: "published", label: "Publié sur le site", type: "checkbox" },
    ],
    orderBy: { column: "scope", ascending: true },
    searchColumns: ["full_name", "post"],
    read: [...LEADERSHIP_ROLES, ...DEPT_COORD],
    write: [...LEADERSHIP_ROLES, ...DEPT_COORD],
    canCreate: true,
    canDelete: true,
  },
  rapports: {
    key: "rapports",
    table: "reports",
    label: "Rapports d'activité",
    singular: "rapport",
    description: "Rapports soumis par les membres, coordinations et sections de votre périmètre.",
    titleField: "title",
    columns: [
      { key: "title", label: "Titre" },
      { key: "period_label", label: "Période" },
      { key: "status", label: "Statut", kind: "badge" },
      { key: "submitted_at", label: "Soumis le", kind: "date" },
    ],
    fields: [
      { name: "title", label: "Titre", type: "text", readOnly: true },
      { name: "period_label", label: "Période", type: "text", readOnly: true, half: true },
      { name: "department_slug", label: "Département", type: "select", options: deptOptions, readOnly: true, half: true },
      { name: "content", label: "Contenu", type: "textarea", rows: 10, readOnly: true },
      { name: "status", label: "Statut", type: "select", required: true, half: true, options: [
        { value: "submitted", label: "Soumis" }, { value: "reviewed", label: "Examiné" }, { value: "draft", label: "Brouillon" },
      ] },
      { name: "feedback", label: "Retour au rédacteur", type: "textarea", rows: 4, maxLength: 3000 },
    ],
    orderBy: { column: "created_at", ascending: false },
    searchColumns: ["title", "period_label"],
    read: [...STAFF_ROLES, "coord_region", "coord_dept"],
    write: [...STAFF_ROLES, "coord_region", "coord_dept"],
    canCreate: false,
    canDelete: false,
  },
};

export const resourceList = Object.values(resources);
export const getResource = (key: string) => resources[key] ?? null;
export const canRead = (r: Resource, role: AppRole) => r.read.includes(role);
export const canWrite = (r: Resource, role: AppRole) => r.write.includes(role);
