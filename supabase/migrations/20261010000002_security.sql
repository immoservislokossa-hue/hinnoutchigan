-- ============================================================================
-- Sécurité : fonctions d'aide, déclencheurs, Row Level Security, privilèges
-- ============================================================================

-- ---------- Fonctions d'aide (SECURITY DEFINER : évitent la récursion RLS) ----------
create or replace function public.my_role() returns public.app_role
language sql stable security definer set search_path = '' as $$
  select p.role from public.profiles p where p.id = auth.uid() and p.status = 'active'
$$;

create or replace function public.my_department() returns text
language sql stable security definer set search_path = '' as $$
  select p.department_slug from public.profiles p where p.id = auth.uid() and p.status = 'active'
$$;

create or replace function public.my_region() returns text
language sql stable security definer set search_path = '' as $$
  select p.region from public.profiles p where p.id = auth.uid() and p.status = 'active'
$$;

create or replace function public.is_active_member() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.status = 'active')
$$;

-- Contenu : administrateur, éditeur, BEN
create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() in ('super_admin', 'editor', 'ben'), false)
$$;

-- Direction : membres, demandes, réglages (administrateur, BEN)
create or replace function public.is_leadership() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() in ('super_admin', 'ben'), false)
$$;

create or replace function public.is_super_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce(public.my_role() = 'super_admin', false)
$$;

create or replace function public.department_region(dept text) returns text
language sql stable security definer set search_path = '' as $$
  select d.region from public.departments d where d.slug = dept
$$;

-- Le département est-il dans le périmètre de l'utilisateur ?
create or replace function public.in_my_scope(dept text) returns boolean
language sql stable security definer set search_path = '' as $$
  select case public.my_role()
    when 'super_admin' then true
    when 'ben' then true
    when 'coord_region' then dept is not null and public.department_region(dept) = public.my_region()
    when 'coord_dept' then dept is not null and dept = public.my_department()
    when 'communal' then dept is not null and dept = public.my_department()
    when 'arrondissement' then dept is not null and dept = public.my_department()
    else false
  end
$$;

-- ---------- Création automatique du profil ----------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- Garde-fou sur les profils ----------
-- Un utilisateur ne peut pas s'attribuer de rôle ni de statut ; seule la
-- direction gère les données d'adhésion ; seul l'administrateur change les rôles.
-- Les appels sans JWT (service_role, migrations) ne sont pas restreints.
create or replace function public.guard_profile() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if tg_op = 'UPDATE' and auth.uid() is not null then
    if not public.is_super_admin() then
      new.role := old.role;
    end if;
    if not public.is_leadership() then
      new.status          := old.status;
      new.member_status   := old.member_status;
      new.subgroup        := old.subgroup;
      new.member_number   := old.member_number;
      new.post            := old.post;
      new.department_slug := old.department_slug;
      new.commune_id      := old.commune_id;
      new.region          := old.region;
      new.email           := old.email;
    end if;
  end if;

  -- numéro de membre attribué à l'adhésion effective
  if new.member_status in ('adherent_engage', 'fondateur', 'honneur') and new.member_number is null then
    new.member_number := 'SJB-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('public.member_number_seq')::text, 5, '0');
  end if;
  return new;
end $$;

create trigger profiles_guard
  before insert or update on public.profiles
  for each row execute function public.guard_profile();

-- ---------- Row Level Security ----------
alter table public.departments            enable row level security;
alter table public.communes               enable row level security;
alter table public.profiles               enable row level security;
alter table public.news_posts             enable row level security;
alter table public.events                 enable row level security;
alter table public.documents              enable row level security;
alter table public.announcements          enable row level security;
alter table public.partners               enable row level security;
alter table public.leadership             enable row level security;
alter table public.site_settings          enable row level security;
alter table public.reports                enable row level security;
alter table public.clauses                enable row level security;
alter table public.form_submissions       enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.audit_log              enable row level security;

-- Territoires : lecture publique, écriture administrateur
create policy departments_read on public.departments for select to anon, authenticated using (true);
create policy departments_write on public.departments for all to authenticated
  using (public.is_super_admin()) with check (public.is_super_admin());
create policy communes_read on public.communes for select to anon, authenticated using (true);
create policy communes_write on public.communes for all to authenticated
  using (public.is_super_admin()) with check (public.is_super_admin());

-- Profils
create policy profiles_select on public.profiles for select to authenticated using (
  id = auth.uid()
  or public.is_staff()
  or (public.my_role() in ('coord_region', 'coord_dept', 'communal', 'arrondissement')
      and public.in_my_scope(department_slug))
);
create policy profiles_update on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_leadership())
  with check (id = auth.uid() or public.is_leadership());
-- pas d'insertion ni de suppression par les utilisateurs : déclencheur et service_role seulement

-- Actualités : publiées pour tous ; gestion par le contenu, ou la coordination du département
create policy news_read on public.news_posts for select to anon, authenticated using (
  (published and published_at is not null and published_at <= now()) or public.is_staff()
  or (public.my_role() = 'coord_dept' and department_slug = public.my_department())
);
create policy news_insert on public.news_posts for insert to authenticated with check (
  public.is_staff() or (public.my_role() = 'coord_dept' and department_slug = public.my_department())
);
create policy news_update on public.news_posts for update to authenticated
  using (public.is_staff() or (public.my_role() = 'coord_dept' and department_slug = public.my_department()))
  with check (public.is_staff() or (public.my_role() = 'coord_dept' and department_slug = public.my_department()));
create policy news_delete on public.news_posts for delete to authenticated using (
  public.is_staff() or (public.my_role() = 'coord_dept' and department_slug = public.my_department())
);

-- Événements : même logique
create policy events_read on public.events for select to anon, authenticated using (
  published or public.is_staff()
  or (public.my_role() = 'coord_dept' and department_slug = public.my_department())
);
create policy events_insert on public.events for insert to authenticated with check (
  public.is_staff() or (public.my_role() = 'coord_dept' and department_slug = public.my_department())
);
create policy events_update on public.events for update to authenticated
  using (public.is_staff() or (public.my_role() = 'coord_dept' and department_slug = public.my_department()))
  with check (public.is_staff() or (public.my_role() = 'coord_dept' and department_slug = public.my_department()));
create policy events_delete on public.events for delete to authenticated using (
  public.is_staff() or (public.my_role() = 'coord_dept' and department_slug = public.my_department())
);

-- Documents : selon la visibilité
create policy documents_read on public.documents for select to anon, authenticated using (
  visibility = 'public'
  or (visibility = 'members' and public.is_active_member())
  or public.is_staff()
);
create policy documents_write on public.documents for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- Annonces internes
create policy announcements_read on public.announcements for select to authenticated using (
  public.is_staff()
  or (public.is_active_member() and (
        audience = 'all'
        or (audience = 'coordinations' and public.my_role() in ('coord_region', 'coord_dept', 'communal', 'arrondissement'))
  ))
);
create policy announcements_write on public.announcements for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- Partenaires
create policy partners_read on public.partners for select to anon, authenticated using (published or public.is_staff());
create policy partners_write on public.partners for all to authenticated
  using (public.is_staff()) with check (public.is_staff());

-- Équipes publiques
create policy leadership_read on public.leadership for select to anon, authenticated using (
  published or public.is_staff()
  or (public.my_role() = 'coord_dept' and scope = 'dept:' || public.my_department())
);
create policy leadership_write on public.leadership for all to authenticated
  using (public.is_leadership()
         or (public.my_role() = 'coord_dept' and scope = 'dept:' || public.my_department()))
  with check (public.is_leadership()
         or (public.my_role() = 'coord_dept' and scope = 'dept:' || public.my_department()));

-- Réglages du site
create policy settings_read on public.site_settings for select to anon, authenticated using (true);
create policy settings_write on public.site_settings for all to authenticated
  using (public.is_leadership()) with check (public.is_leadership());

-- Rapports d'activité
create policy reports_select on public.reports for select to authenticated using (
  author_id = auth.uid() or public.is_staff()
  or (public.my_role() in ('coord_region', 'coord_dept') and public.in_my_scope(department_slug))
);
create policy reports_insert on public.reports for insert to authenticated with check (
  author_id = auth.uid() and public.is_active_member()
);
create policy reports_update_own on public.reports for update to authenticated
  using (author_id = auth.uid() and status = 'draft')
  with check (author_id = auth.uid() and status in ('draft', 'submitted'));
create policy reports_review on public.reports for update to authenticated
  using (public.is_staff()
         or (public.my_role() in ('coord_region', 'coord_dept') and public.in_my_scope(department_slug)))
  with check (public.is_staff()
         or (public.my_role() in ('coord_region', 'coord_dept') and public.in_my_scope(department_slug)));
create policy reports_delete_own on public.reports for delete to authenticated using (
  author_id = auth.uid() and status = 'draft'
);

-- Clauses d'engagement
create policy clauses_select on public.clauses for select to authenticated using (
  profile_id = auth.uid() or public.is_leadership()
);
create policy clauses_insert on public.clauses for insert to authenticated with check (profile_id = auth.uid());
create policy clauses_update on public.clauses for update to authenticated
  using ((profile_id = auth.uid() and not verified) or public.is_leadership())
  with check ((profile_id = auth.uid() and not verified) or public.is_leadership());

-- Formulaires et abonnés : direction seulement (insertion par service_role)
create policy submissions_read on public.form_submissions for select to authenticated using (public.is_leadership());
create policy submissions_update on public.form_submissions for update to authenticated
  using (public.is_leadership()) with check (public.is_leadership());
create policy submissions_delete on public.form_submissions for delete to authenticated using (public.is_super_admin());

create policy subscribers_read on public.newsletter_subscribers for select to authenticated using (public.is_leadership());
create policy subscribers_update on public.newsletter_subscribers for update to authenticated
  using (public.is_leadership()) with check (public.is_leadership());
create policy subscribers_delete on public.newsletter_subscribers for delete to authenticated using (public.is_leadership());

-- Journal d'audit
create policy audit_read on public.audit_log for select to authenticated using (public.is_super_admin());
create policy audit_insert on public.audit_log for insert to authenticated with check (
  public.is_active_member() and actor_id = auth.uid()
);

-- ---------- Privilèges explicites (ne pas dépendre des valeurs par défaut) ----------
grant usage on schema public to anon, authenticated, service_role;

grant select on public.departments, public.communes, public.news_posts, public.events,
                public.documents, public.partners, public.leadership, public.site_settings
  to anon;

grant select, insert, update, delete on all tables in schema public to authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to authenticated, service_role;

revoke insert, update, delete on public.profiles from authenticated;
grant update (full_name, phone, birth_date, sex, bio, photo_path, role, status, member_status, subgroup,
              member_number, post, department_slug, commune_id, region)
  on public.profiles to authenticated;
revoke delete on public.audit_log from authenticated;
revoke update on public.audit_log from authenticated;

grant execute on all functions in schema public to anon, authenticated, service_role;
