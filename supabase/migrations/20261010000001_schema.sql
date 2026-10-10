-- ============================================================================
-- Sénat des Jeunes du Bénin : schéma de base de données (Supabase / Postgres)
-- Ordre d'application : 0001 schéma, 0002 sécurité (RLS), 0003 stockage.
-- ============================================================================

-- ---------- Types ----------
create type public.app_role as enum (
  'super_admin',     -- administrateur principal : tout
  'editor',          -- éditeur : actualités, événements, documents, partenaires
  'ben',             -- membre du Bureau Exécutif National
  'coord_region',    -- coordination régionale
  'coord_dept',      -- coordination départementale
  'communal',        -- section communale
  'arrondissement',  -- section d'arrondissement
  'member'           -- membre simple
);
create type public.account_status as enum ('active', 'suspended');
create type public.member_status as enum (
  'candidat', 'adherent_engage', 'benevole_occasionnel', 'sympathisant', 'honneur', 'fondateur'
);
create type public.subgroup as enum ('CCJ', 'CLAP', 'CSM');
create type public.doc_visibility as enum ('public', 'members', 'ben');
create type public.submission_status as enum ('new', 'in_progress', 'done', 'spam');
create type public.report_status as enum ('draft', 'submitted', 'reviewed');

-- ---------- Outils ----------
create or replace function public.set_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- Territoires ----------
create table public.departments (
  slug   text primary key,
  name   text not null,
  seat   text not null,
  region text not null,
  sort   int  not null default 0
);

create table public.communes (
  id               uuid primary key default gen_random_uuid(),
  department_slug  text not null references public.departments(slug) on delete cascade,
  name             text not null,
  unique (department_slug, name)
);

-- ---------- Profils (un par compte Supabase Auth) ----------
create sequence public.member_number_seq start 1;

create table public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  email            text,
  full_name        text not null default '',
  phone            text,
  birth_date       date,
  sex              text check (sex in ('F', 'M')),
  role             public.app_role       not null default 'member',
  status           public.account_status not null default 'active',
  member_status    public.member_status  not null default 'candidat',
  subgroup         public.subgroup,
  member_number    text unique,
  post             text,
  department_slug  text references public.departments(slug) on delete set null,
  commune_id       uuid references public.communes(id) on delete set null,
  region           text,
  photo_path       text,
  bio              text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index profiles_department_idx on public.profiles (department_slug);
create index profiles_role_idx on public.profiles (role);
create trigger profiles_updated before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---------- Contenu éditorial ----------
create table public.news_posts (
  id               uuid primary key default gen_random_uuid(),
  slug             text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title            text not null,
  excerpt          text not null default '',
  body             text not null default '',
  category         text not null default 'Communiqué',
  cover_path       text,
  document_path    text,
  published        boolean not null default false,
  published_at     timestamptz,
  department_slug  text references public.departments(slug) on delete set null,
  author_id        uuid references public.profiles(id) on delete set null,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index news_posts_pub_idx on public.news_posts (published, published_at desc);
create trigger news_posts_updated before update on public.news_posts
  for each row execute function public.set_updated_at();

create table public.events (
  id                 uuid primary key default gen_random_uuid(),
  title              text not null,
  description        text not null default '',
  starts_at          timestamptz not null,
  ends_at            timestamptz,
  location           text,
  kind               text not null default 'Événement',
  department_slug    text references public.departments(slug) on delete set null,
  published          boolean not null default false,
  registration_open  boolean not null default false,
  created_by         uuid references public.profiles(id) on delete set null,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);
create index events_start_idx on public.events (published, starts_at);
create trigger events_updated before update on public.events
  for each row execute function public.set_updated_at();

create table public.documents (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  kind         text not null default 'Document',
  reference    text,
  doc_date     date,
  -- chemin dans le stockage Supabase, ou chemin/URL absolu (ex. /documents/statuts.pdf)
  file_path    text not null,
  visibility   public.doc_visibility not null default 'public',
  uploaded_by  uuid references public.profiles(id) on delete set null,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create trigger documents_updated before update on public.documents
  for each row execute function public.set_updated_at();

create table public.announcements (
  id            uuid primary key default gen_random_uuid(),
  title         text not null,
  body          text not null default '',
  audience      text not null default 'all' check (audience in ('all', 'coordinations', 'ben')),
  published_at  timestamptz not null default now(),
  created_by    uuid references public.profiles(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create trigger announcements_updated before update on public.announcements
  for each row execute function public.set_updated_at();

create table public.partners (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  url         text,
  kind        text not null default 'Institutionnel',
  logo_path   text,
  published   boolean not null default false,
  sort        int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create trigger partners_updated before update on public.partners
  for each row execute function public.set_updated_at();

-- Équipes publiques : « ben » ou « dept:<slug> »
create table public.leadership (
  id          uuid primary key default gen_random_uuid(),
  scope       text not null default 'ben' check (scope = 'ben' or scope ~ '^dept:[a-z]+$'),
  post        text not null,
  full_name   text not null,
  photo_path  text,
  bio         text,
  sort        int not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index leadership_scope_idx on public.leadership (scope, sort);
create trigger leadership_updated before update on public.leadership
  for each row execute function public.set_updated_at();

create table public.site_settings (
  key         text primary key,
  value       jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now(),
  updated_by  uuid references public.profiles(id) on delete set null
);

-- ---------- Vie interne ----------
create table public.reports (
  id               uuid primary key default gen_random_uuid(),
  author_id        uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  title            text not null,
  period_label     text not null default '',
  content          text not null default '',
  status           public.report_status not null default 'draft',
  department_slug  text references public.departments(slug) on delete set null,
  feedback         text,
  reviewed_by      uuid references public.profiles(id) on delete set null,
  submitted_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);
create index reports_author_idx on public.reports (author_id);
create index reports_dept_idx on public.reports (department_slug);
create trigger reports_updated before update on public.reports
  for each row execute function public.set_updated_at();

-- Clause d'engagement de mission, de confidentialité et de réserve (décret 002-08-2026, art. 8)
create table public.clauses (
  profile_id   uuid primary key references public.profiles(id) on delete cascade,
  file_path    text not null,
  signed_on    date,
  uploaded_at  timestamptz not null default now(),
  verified     boolean not null default false,
  verified_by  uuid references public.profiles(id) on delete set null
);

-- ---------- Formulaires publics ----------
create table public.form_submissions (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null check (kind in ('contact', 'engagement', 'adhesion', 'partenaire', 'presse')),
  payload      jsonb not null,
  status       public.submission_status not null default 'new',
  ip_hash      text,
  user_agent   text,
  assigned_to  uuid references public.profiles(id) on delete set null,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);
create index form_submissions_status_idx on public.form_submissions (status, created_at desc);
create index form_submissions_ip_idx on public.form_submissions (ip_hash, created_at);
create trigger form_submissions_updated before update on public.form_submissions
  for each row execute function public.set_updated_at();

create table public.newsletter_subscribers (
  id               uuid primary key default gen_random_uuid(),
  email            text not null,
  source           text not null default 'site',
  ip_hash          text,
  created_at       timestamptz not null default now(),
  unsubscribed_at  timestamptz
);
create unique index newsletter_email_idx on public.newsletter_subscribers (lower(email));

-- ---------- Journal d'audit ----------
create table public.audit_log (
  id           bigint generated always as identity primary key,
  actor_id     uuid,
  actor_email  text,
  action       text not null,
  entity       text not null,
  entity_id    text,
  meta         jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now()
);
create index audit_log_created_idx on public.audit_log (created_at desc);
