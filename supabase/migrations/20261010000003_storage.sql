-- ============================================================================
-- Stockage : deux compartiments
--   public-files  : lecture publique (logos, photos d'équipes, couvertures, PDF publics)
--   private-files : accès contrôlé (documents internes, clauses, pièces des rapports)
-- Convention de chemin du compartiment privé : <user-id>/<fichier> pour les fichiers
-- d'un membre ; documents/<fichier> pour les documents internes (gérés par le contenu).
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('public-files', 'public-files', true, 10485760,
   array['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'application/pdf']),
  ('private-files', 'private-files', false, 15728640,
   array['image/jpeg', 'image/png', 'image/webp', 'application/pdf',
         'application/msword',
         'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- public-files : écriture réservée au contenu
create policy "public-files write" on storage.objects for insert to authenticated
  with check (bucket_id = 'public-files' and public.is_staff());
create policy "public-files update" on storage.objects for update to authenticated
  using (bucket_id = 'public-files' and public.is_staff())
  with check (bucket_id = 'public-files' and public.is_staff());
create policy "public-files delete" on storage.objects for delete to authenticated
  using (bucket_id = 'public-files' and public.is_staff());

-- private-files : dossier personnel, et gestion par le contenu
create policy "private-files own read" on storage.objects for select to authenticated
  using (bucket_id = 'private-files'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff()));
create policy "private-files own write" on storage.objects for insert to authenticated
  with check (bucket_id = 'private-files'
         and ((storage.foldername(name))[1] = auth.uid()::text
              or ((storage.foldername(name))[1] = 'documents' and public.is_staff())));
create policy "private-files own update" on storage.objects for update to authenticated
  using (bucket_id = 'private-files' and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id = 'private-files' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "private-files delete" on storage.objects for delete to authenticated
  using (bucket_id = 'private-files'
         and ((storage.foldername(name))[1] = auth.uid()::text or public.is_staff()));
