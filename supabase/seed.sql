-- Données initiales. Généré par scripts/generate-seed.mjs : ne pas modifier à la main.
begin;

-- Départements
insert into public.departments (slug, name, seat, region, sort) values
  ('alibori', 'Alibori', 'Kandi', 'Borgou-Alibori', 0),
  ('atacora', 'Atacora', 'Natitingou', 'Atacora-Donga', 1),
  ('atlantique', 'Atlantique', 'Allada', 'Atlantique-Littoral', 2),
  ('borgou', 'Borgou', 'Parakou', 'Borgou-Alibori', 3),
  ('collines', 'Collines', 'Dassa-Zoumè', 'Zou-Collines', 4),
  ('couffo', 'Couffo', 'Aplahoué', 'Mono-Couffo', 5),
  ('donga', 'Donga', 'Djougou', 'Atacora-Donga', 6),
  ('littoral', 'Littoral', 'Cotonou', 'Atlantique-Littoral', 7),
  ('mono', 'Mono', 'Lokossa', 'Mono-Couffo', 8),
  ('oueme', 'Ouémé', 'Porto-Novo', 'Ouémé-Plateau', 9),
  ('plateau', 'Plateau', 'Pobè', 'Ouémé-Plateau', 10),
  ('zou', 'Zou', 'Abomey', 'Zou-Collines', 11)
on conflict (slug) do update set name = excluded.name, seat = excluded.seat, region = excluded.region, sort = excluded.sort;

-- Communes
insert into public.communes (department_slug, name) values
  ('alibori', 'Banikoara'),
  ('alibori', 'Gogounou'),
  ('alibori', 'Kandi'),
  ('alibori', 'Karimama'),
  ('alibori', 'Malanville'),
  ('alibori', 'Ségbana'),
  ('atacora', 'Boukoumbé'),
  ('atacora', 'Cobly'),
  ('atacora', 'Kérou'),
  ('atacora', 'Kouandé'),
  ('atacora', 'Matéri'),
  ('atacora', 'Natitingou'),
  ('atacora', 'Pehonco'),
  ('atacora', 'Tanguiéta'),
  ('atacora', 'Toucountouna'),
  ('atlantique', 'Abomey-Calavi'),
  ('atlantique', 'Allada'),
  ('atlantique', 'Kpomassè'),
  ('atlantique', 'Ouidah'),
  ('atlantique', 'Sô-Ava'),
  ('atlantique', 'Toffo'),
  ('atlantique', 'Tori-Bossito'),
  ('atlantique', 'Zè'),
  ('borgou', 'Bembèrèkè'),
  ('borgou', 'Kalalé'),
  ('borgou', 'N''Dali'),
  ('borgou', 'Nikki'),
  ('borgou', 'Parakou'),
  ('borgou', 'Pèrèrè'),
  ('borgou', 'Sinendé'),
  ('borgou', 'Tchaourou'),
  ('collines', 'Bantè'),
  ('collines', 'Dassa-Zoumè'),
  ('collines', 'Glazoué'),
  ('collines', 'Ouèssè'),
  ('collines', 'Savalou'),
  ('collines', 'Savè'),
  ('couffo', 'Aplahoué'),
  ('couffo', 'Djakotomey'),
  ('couffo', 'Dogbo'),
  ('couffo', 'Klouékanmè'),
  ('couffo', 'Lalo'),
  ('couffo', 'Toviklin'),
  ('donga', 'Bassila'),
  ('donga', 'Copargo'),
  ('donga', 'Djougou'),
  ('donga', 'Ouaké'),
  ('littoral', 'Cotonou'),
  ('mono', 'Athiémé'),
  ('mono', 'Bopa'),
  ('mono', 'Comè'),
  ('mono', 'Grand-Popo'),
  ('mono', 'Houéyogbé'),
  ('mono', 'Lokossa'),
  ('oueme', 'Adjarra'),
  ('oueme', 'Adjohoun'),
  ('oueme', 'Aguégués'),
  ('oueme', 'Akpro-Missérété'),
  ('oueme', 'Avrankou'),
  ('oueme', 'Bonou'),
  ('oueme', 'Dangbo'),
  ('oueme', 'Porto-Novo'),
  ('oueme', 'Sèmè-Podji'),
  ('plateau', 'Adja-Ouèrè'),
  ('plateau', 'Ifangni'),
  ('plateau', 'Kétou'),
  ('plateau', 'Pobè'),
  ('plateau', 'Sakété'),
  ('zou', 'Abomey'),
  ('zou', 'Agbangnizoun'),
  ('zou', 'Bohicon'),
  ('zou', 'Covè'),
  ('zou', 'Djidja'),
  ('zou', 'Ouinhi'),
  ('zou', 'Za-Kpota'),
  ('zou', 'Zagnanado'),
  ('zou', 'Zogbodomey')
on conflict (department_slug, name) do nothing;

-- Actualités initiales
insert into public.news_posts (slug, title, excerpt, body, category, document_path, published, published_at) values
  ('decret-instances-deconcentrees-2026', 'Révision des instances déconcentrées : le décret n°002-08-2026', 'Le Président du Bureau Exécutif National harmonise l''organisation des coordinations régionales, départementales, communales et des sections d''arrondissement.', 'Par le décret présidentiel n°002-08-2026/SGN-BEN-SJB du 17 août 2026, le Bureau Exécutif National révise et harmonise l''organisation et le fonctionnement des instances déconcentrées du Sénat des Jeunes du Bénin.

Le texte précise la chaîne de commandement : les sections d''arrondissement (3 postes) rendent compte aux sections communales (9 postes), qui rendent compte aux coordinations départementales (9 postes), elles-mêmes sous l''autorité des six coordinations régionales (3 postes), qui rendent compte au Bureau Exécutif National.

Il fixe aussi un cadre clair pour les sections d''arrondissement, échelon le plus proche des populations, et prévoit pour chaque responsable déconcentré la signature d''une clause d''engagement de mission, de confidentialité et de réserve.', 'Décret', '/documents/decret-002-08-2026-sjb.pdf', true, '2026-08-17T08:00:00+01:00'),
  ('statuts-refondation-2026', 'Les statuts de refondation adoptés à Parakou', 'L''Assemblée Générale Extraordinaire de refondation adopte les textes fondamentaux du SJB, conformes à la loi n° 2025-19 relative aux associations et aux fondations.', 'Réuni en Assemblée Générale Extraordinaire de refondation à Parakou, le Sénat des Jeunes du Bénin a adopté ses statuts le 31 mars 2026, en conformité avec la loi n° 2025-19 du 22 juillet 2025 et son décret d''application n° 2025-575 du 24 septembre 2025.

Les statuts fondent l''association sur trois piliers : la démocratie participative, le développement humain intégral et le panafricanisme civique. Ils organisent la gouvernance autour de l''Assemblée Plénière, du Bureau Exécutif National, de trois sous-groupes (CCJ, CLAP, CSM), de cinq commissions techniques et d''instances déconcentrées.

Les statuts sont publiés dans leur intégralité et téléchargeables sur ce site.', 'Communiqué', '/documents/statuts-sjb-2026.pdf', true, '2026-03-31T08:00:00+01:00')
on conflict (slug) do nothing;

-- Documents officiels
insert into public.documents (title, kind, reference, doc_date, file_path, visibility)
select v.title, v.kind, v.reference, v.doc_date::date, v.file_path, 'public'::public.doc_visibility from (values
  ('Statuts du Sénat des Jeunes du Bénin', 'Textes fondamentaux', 'Version définitive 2026 · Loi n° 2025-19', '2026-03-31', '/documents/statuts-sjb-2026.pdf'),
  ('Décret présidentiel n°002-08-2026/SGN-BEN-SJB', 'Décret', 'Révision et harmonisation des instances déconcentrées', '2026-08-17', '/documents/decret-002-08-2026-sjb.pdf')
) as v(title, kind, reference, doc_date, file_path)
where not exists (select 1 from public.documents x where x.file_path = v.file_path);

-- Réglages du site : valeurs vides, à renseigner depuis le back-office (/admin/parametres)
insert into public.site_settings (key, value) values
  ('contact', '{"email":"","phones":[],"address":""}'::jsonb),
  ('social', '{"facebook":"","instagram":"","tiktok":"","linkedin":"","youtube":"","whatsapp":""}'::jsonb),
  ('president', '{"name":"","message":"","vision":"","priorities":"","actions":"","commitments":"","photo_path":""}'::jsonb),
  ('press', '{"contact":""}'::jsonb),
  ('legal', '{"registry_number":"","publication_director":"","host":"","retention":""}'::jsonb)
on conflict (key) do nothing;

commit;
