import "server-only";
import { SUPABASE_URL } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { site } from "@/content/site";
import { documents as staticDocuments, news as staticNews, type NewsItem } from "@/content/structure";

/* -------------------------------------------------------------------------- */
/* Utilitaires                                                                */
/* -------------------------------------------------------------------------- */

const TZ = "Africa/Porto-Novo";

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: TZ }).format(new Date(iso));

export const formatDateTime = (iso: string) =>
  new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short", timeZone: TZ }).format(new Date(iso));

/** URL publique d'un fichier : chemin du site (/documents/x.pdf), URL absolue ou chemin du compartiment public. */
export function publicFileUrl(path: string | null | undefined, bucket = "public-files"): string | null {
  if (!path) return null;
  if (path.startsWith("/") || /^https?:\/\//.test(path)) return path;
  return `${SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

const nz = (v: unknown): string | null => (typeof v === "string" && v.trim() ? v.trim() : null);

export { normalizePost } from "@/lib/text";

/* -------------------------------------------------------------------------- */
/* Actualités                                                                 */
/* -------------------------------------------------------------------------- */

export type NewsView = Omit<NewsItem, "doc"> & { doc?: string; cover?: string; department?: string | null };

type NewsRow = {
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  cover_path: string | null;
  document_path: string | null;
  published_at: string;
  department_slug: string | null;
};

function toNewsView(r: NewsRow): NewsView {
  return {
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    body: r.body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean),
    category: r.category,
    iso: r.published_at.slice(0, 10),
    date: formatDate(r.published_at),
    doc: publicFileUrl(r.document_path) ?? undefined,
    cover: publicFileUrl(r.cover_path) ?? undefined,
    department: r.department_slug,
  };
}

const NEWS_COLUMNS = "slug,title,excerpt,body,category,cover_path,document_path,published_at,department_slug";

export async function getNews(opts: { department?: string | null; limit?: number } = {}): Promise<NewsView[]> {
  const db = createPublicClient();
  if (!db) return opts.department ? [] : staticNews.slice(0, opts.limit ?? 100);
  let q = db
    .from("news_posts")
    .select(NEWS_COLUMNS)
    .eq("published", true)
    .lte("published_at", new Date().toISOString())
    .order("published_at", { ascending: false })
    .limit(opts.limit ?? 100);
  if (opts.department) q = q.eq("department_slug", opts.department);
  const { data, error } = await q;
  if (error) return opts.department ? [] : staticNews.slice(0, opts.limit ?? 100);
  return (data as NewsRow[]).filter((r) => r.published_at).map(toNewsView);
}

export async function getNewsBySlug(slug: string): Promise<NewsView | null> {
  const db = createPublicClient();
  if (!db) return staticNews.find((n) => n.slug === slug) ?? null;
  const { data, error } = await db
    .from("news_posts")
    .select(NEWS_COLUMNS)
    .eq("slug", slug)
    .eq("published", true)
    .lte("published_at", new Date().toISOString())
    .maybeSingle();
  if (error) return staticNews.find((n) => n.slug === slug) ?? null;
  return data && (data as NewsRow).published_at ? toNewsView(data as NewsRow) : null;
}

/* -------------------------------------------------------------------------- */
/* Événements                                                                 */
/* -------------------------------------------------------------------------- */

export type EventView = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string | null;
  when: string;
  location: string | null;
  kind: string;
  department: string | null;
};

export async function getEvents(opts: { department?: string | null; upcomingOnly?: boolean } = {}): Promise<EventView[]> {
  const db = createPublicClient();
  if (!db) return [];
  let q = db
    .from("events")
    .select("id,title,description,starts_at,ends_at,location,kind,department_slug")
    .eq("published", true)
    .order("starts_at", { ascending: true })
    .limit(100);
  if (opts.department) q = q.eq("department_slug", opts.department);
  if (opts.upcomingOnly) q = q.gte("starts_at", new Date(Date.now() - 6 * 3600_000).toISOString());
  const { data, error } = await q;
  if (error || !data) return [];
  return data.map((e) => ({
    id: e.id as string,
    title: e.title as string,
    description: e.description as string,
    startsAt: e.starts_at as string,
    endsAt: (e.ends_at as string | null) ?? null,
    when: formatDateTime(e.starts_at as string),
    location: (e.location as string | null) ?? null,
    kind: e.kind as string,
    department: (e.department_slug as string | null) ?? null,
  }));
}

/* -------------------------------------------------------------------------- */
/* Documents publics                                                          */
/* -------------------------------------------------------------------------- */

export type DocumentView = { slug: string; title: string; kind: string; date: string; ref: string; file: string };

export async function getPublicDocuments(): Promise<DocumentView[]> {
  const db = createPublicClient();
  const fallback = () =>
    staticDocuments.map((d) => ({ slug: d.slug, title: d.title, kind: d.kind, date: d.date, ref: d.ref, file: d.file }));
  if (!db) return fallback();
  const { data, error } = await db
    .from("documents")
    .select("id,title,kind,reference,doc_date,file_path")
    .eq("visibility", "public")
    .order("doc_date", { ascending: false, nullsFirst: false });
  if (error || !data) return fallback();
  return data.map((d) => ({
    slug: d.id as string,
    title: d.title as string,
    kind: d.kind as string,
    date: d.doc_date ? formatDate(d.doc_date as string) : "",
    ref: (d.reference as string | null) ?? "",
    file: publicFileUrl(d.file_path as string) ?? "#",
  }));
}

/* -------------------------------------------------------------------------- */
/* Équipes, partenaires                                                       */
/* -------------------------------------------------------------------------- */

export type LeaderView = { id: string; post: string; name: string; photo: string | null; bio: string | null };

export async function getLeadership(scope: string): Promise<LeaderView[]> {
  const db = createPublicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("leadership")
    .select("id,post,full_name,photo_path,bio")
    .eq("scope", scope)
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error || !data) return [];
  return data.map((l) => ({
    id: l.id as string,
    post: l.post as string,
    name: l.full_name as string,
    photo: publicFileUrl(l.photo_path as string | null),
    bio: (l.bio as string | null) ?? null,
  }));
}

export type PartnerView = { id: string; name: string; url: string | null; kind: string; logo: string | null };

export async function getPartners(): Promise<PartnerView[]> {
  const db = createPublicClient();
  if (!db) return [];
  const { data, error } = await db
    .from("partners")
    .select("id,name,url,kind,logo_path")
    .eq("published", true)
    .order("sort", { ascending: true });
  if (error || !data) return [];
  return data.map((p) => ({
    id: p.id as string,
    name: p.name as string,
    url: (p.url as string | null) ?? null,
    kind: p.kind as string,
    logo: publicFileUrl(p.logo_path as string | null),
  }));
}

/* -------------------------------------------------------------------------- */
/* Réglages du site (modifiables depuis /admin/parametres)                     */
/* -------------------------------------------------------------------------- */

export type SiteSettings = {
  contact: { email: string | null; phones: string[]; address: string | null };
  social: Record<"facebook" | "instagram" | "tiktok" | "linkedin" | "youtube" | "whatsapp", string | null>;
  president: {
    name: string | null;
    photo: string | null;
    message: string | null;
    vision: string | null;
    priorities: string | null;
    actions: string | null;
    commitments: string | null;
  };
  press: { contact: string | null };
  legal: { registry_number: string | null; publication_director: string | null; host: string | null; retention: string | null };
};

const defaults = (): SiteSettings => ({
  contact: { email: site.contact.email, phones: site.contact.phones, address: site.contact.address },
  social: { ...site.social },
  president: { name: null, photo: null, message: null, vision: null, priorities: null, actions: null, commitments: null },
  press: { contact: null },
  legal: { registry_number: null, publication_director: null, host: null, retention: null },
});

export async function getSiteSettings(): Promise<SiteSettings> {
  const base = defaults();
  const db = createPublicClient();
  if (!db) return base;
  const { data, error } = await db.from("site_settings").select("key,value");
  if (error || !data) return base;
  const map = Object.fromEntries(data.map((r) => [r.key as string, (r.value ?? {}) as Record<string, unknown>]));
  const c = map.contact ?? {};
  const phones = Array.isArray(c.phones) ? (c.phones as unknown[]).map(nz).filter((x): x is string => !!x) : [];
  const s = map.social ?? {};
  const p = map.president ?? {};
  const l = map.legal ?? {};
  return {
    contact: { email: nz(c.email) ?? base.contact.email, phones: phones.length ? phones : base.contact.phones, address: nz(c.address) ?? base.contact.address },
    social: {
      facebook: nz(s.facebook), instagram: nz(s.instagram), tiktok: nz(s.tiktok),
      linkedin: nz(s.linkedin), youtube: nz(s.youtube), whatsapp: nz(s.whatsapp),
    },
    president: {
      name: nz(p.name), photo: publicFileUrl(nz(p.photo_path)), message: nz(p.message), vision: nz(p.vision),
      priorities: nz(p.priorities), actions: nz(p.actions), commitments: nz(p.commitments),
    },
    press: { contact: nz((map.press ?? {}).contact) },
    legal: { registry_number: nz(l.registry_number), publication_director: nz(l.publication_director), host: nz(l.host), retention: nz(l.retention) },
  };
}
