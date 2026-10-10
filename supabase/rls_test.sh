#!/bin/bash
P="psql -h /tmp -p 54329 -U pgtest -d sjbtest -X -t -A"
ADMIN=00000000-0000-0000-0000-000000000001; EDITOR=00000000-0000-0000-0000-000000000002; BEN=00000000-0000-0000-0000-000000000003
DEPT=00000000-0000-0000-0000-000000000004; DEPT2=00000000-0000-0000-0000-000000000005; MEMBER=00000000-0000-0000-0000-000000000006; SUSP=00000000-0000-0000-0000-000000000007
$P -v ON_ERROR_STOP=1 <<SQL
truncate auth.users cascade; truncate public.newsletter_subscribers, storage.objects; alter sequence public.member_number_seq restart; truncate public.reports, public.audit_log, public.form_submissions, public.documents restart identity cascade;
insert into auth.users (id,email) values ('$ADMIN','admin@x.bj'),('$EDITOR','editor@x.bj'),('$BEN','ben@x.bj'),('$DEPT','dept@x.bj'),('$DEPT2','dept2@x.bj'),('$MEMBER','member@x.bj'),('$SUSP','susp@x.bj');
update public.profiles set role='super_admin' where id='$ADMIN';
update public.profiles set role='editor' where id='$EDITOR';
update public.profiles set role='ben' where id='$BEN';
update public.profiles set role='coord_dept', department_slug='plateau', region='Ouémé-Plateau' where id='$DEPT';
update public.profiles set role='coord_dept', department_slug='borgou', region='Borgou-Alibori' where id='$DEPT2';
update public.profiles set role='member', department_slug='plateau' where id='$MEMBER';
update public.profiles set role='editor', status='suspended' where id='$SUSP';
insert into public.documents (title,file_path,visibility) values ('pub','/a.pdf','public'),('mem','a/b.pdf','members'),('ben','a/c.pdf','ben');
SQL
$P -v ON_ERROR_STOP=1 -f /home/user/hinnoutchigan/supabase/seed.sql >/dev/null
pass=0; fail=0
# usage: t "description" "expected" ROLE USERID "sql"
t() { desc="$1"; exp="$2"; role="$3"; uid="$4"; sql="$5"
  if [ "$role" = "service_role" ]; then pre="set role service_role;"; else pre="set role $role; select set_config('request.jwt.claim.sub','$uid',false);"; fi
  out=$($P -c "$pre" -c "$sql" 2>&1 | grep -v '^SET$' | grep -v '^$' | grep -v '^[0-9a-f-]\{36\}$' | tr '\n' ' ' | sed 's/ *$//')
  if [[ "$out" == *"$exp"* ]]; then pass=$((pass+1)); echo "ok   - $desc"; else fail=$((fail+1)); echo "FAIL - $desc | attendu: [$exp] obtenu: [$out]"; fi; }

echo "== anonyme"
t "anon lit les actualités publiées" "2" anon "" "select count(*) from news_posts"
t "anon ne peut pas insérer d'actualité" "permission denied" anon "" "insert into news_posts(slug,title) values ('x-y','t')"
t "anon ne lit pas les profils" "permission denied" anon "" "select count(*) from profiles"
t "anon ne lit pas les demandes" "permission denied" anon "" "select count(*) from form_submissions"
t "anon ne peut pas insérer une demande" "permission denied" anon "" "insert into form_submissions(kind,payload) values ('contact','{}')"
t "anon lit les réglages" "5" anon "" "select count(*) from site_settings"
t "anon ne voit que les documents publics (2 du seed + 1)" "3" anon "" "select count(*) from documents"
t "anon lit les départements" "12" anon "" "select count(*) from departments"

echo "== membre"
t "membre voit son profil seul" "1" authenticated $MEMBER "select count(*) from profiles"
t "membre modifie son nom" "UPDATE 1" authenticated $MEMBER "update profiles set full_name='Ada' where id='$MEMBER'"
t "membre ne peut pas se promouvoir (rôle ignoré)" "member" authenticated $MEMBER "update profiles set role='super_admin' where id='$MEMBER'; select role from profiles where id='$MEMBER'"
t "membre ne change pas son statut d'adhésion" "candidat" authenticated $MEMBER "update profiles set member_status='fondateur' where id='$MEMBER'; select member_status from profiles where id='$MEMBER'"
t "membre ne peut pas changer son e-mail (colonne non accordée)" "permission denied" authenticated $MEMBER "update profiles set email='z@z.bj' where id='$MEMBER'"
t "membre ne lit aucune demande (RLS)" "0" authenticated $MEMBER "select count(*) from form_submissions" 
t "membre voit docs publics + membres" "4" authenticated $MEMBER "select count(*) from documents"
t "membre ne publie pas d'actualité" "row-level security" authenticated $MEMBER "insert into news_posts(slug,title,published,published_at) values ('m-m','t',true,now())"
t "membre crée un rapport brouillon" "INSERT 0 1" authenticated $MEMBER "insert into reports(title,department_slug) values ('R1','plateau')"
t "membre soumet son rapport" "UPDATE 1" authenticated $MEMBER "update reports set status='submitted', submitted_at=now() where author_id='$MEMBER'"
t "membre ne modifie plus un rapport soumis" "UPDATE 0" authenticated $MEMBER "update reports set content='x' where author_id='$MEMBER'"
t "membre journalise ses actions" "INSERT 0 1" authenticated $MEMBER "insert into audit_log(actor_id,action,entity) values ('$MEMBER','test','x')"
t "membre ne peut pas usurper un acteur d'audit" "row-level security" authenticated $MEMBER "insert into audit_log(actor_id,action,entity) values ('$ADMIN','test','x')"
t "membre ne lit pas le journal" "0" authenticated $MEMBER "select count(*) from audit_log"
t "membre ne supprime pas le journal" "permission denied" authenticated $MEMBER "delete from audit_log"

echo "== éditeur"
t "éditeur crée une actualité" "INSERT 0 1" authenticated $EDITOR "insert into news_posts(slug,title) values ('brouillon-a','t')"
t "éditeur voit les brouillons" "3" authenticated $EDITOR "select count(*) from news_posts"
t "éditeur ne lit pas les demandes" "0" authenticated $EDITOR "select count(*) from form_submissions"
t "éditeur voit tous les documents" "5" authenticated $EDITOR "select count(*) from documents"
t "éditeur ne change pas un statut de membre" "candidat" authenticated $EDITOR "update profiles set member_status='fondateur' where id='$MEMBER'; select member_status from profiles where id='$MEMBER'"
t "éditeur ne modifie pas les réglages" "UPDATE 0" authenticated $EDITOR "update site_settings set value='{}' where key='press'"

echo "== BEN"
t "BEN adhère un membre : numéro attribué" "SJB-2026-00001" authenticated $BEN "update profiles set member_status='adherent_engage' where id='$MEMBER'; select member_number from profiles where id='$MEMBER'"
t "BEN ne change pas un rôle" "member" authenticated $BEN "update profiles set role='super_admin' where id='$MEMBER'; select role from profiles where id='$MEMBER'"
t "BEN modifie les réglages" "UPDATE 1" authenticated $BEN "update site_settings set value='{\"contact\":\"x\"}' where key='press'"
t "BEN voit les rapports" "1" authenticated $BEN "select count(*) from reports"

echo "== administrateur"
t "admin change un rôle" "editor" authenticated $ADMIN "update profiles set role='editor' where id='$MEMBER'; select role from profiles where id='$MEMBER'"
$P -c "update public.profiles set role='member' where id='$MEMBER'" >/dev/null
t "admin lit le journal" "1" authenticated $ADMIN "select count(*) from audit_log where actor_id='$MEMBER'"

echo "== coordination départementale"
t "coord Plateau publie pour Plateau" "INSERT 0 1" authenticated $DEPT "insert into news_posts(slug,title,department_slug,published,published_at) values ('plateau-a','t','plateau',true,now())"
t "coord Plateau ne publie pas pour Borgou" "row-level security" authenticated $DEPT "insert into news_posts(slug,title,department_slug) values ('borgou-a','t','borgou')"
t "coord Plateau ne publie pas au national" "row-level security" authenticated $DEPT "insert into news_posts(slug,title) values ('national-a','t')"
t "coord Plateau voit les profils de son département" "2" authenticated $DEPT "select count(*) from profiles"
t "coord Plateau voit le rapport de son département" "1" authenticated $DEPT "select count(*) from reports"
t "coord Borgou ne voit pas le rapport du Plateau" "0" authenticated $DEPT2 "select count(*) from reports"
t "coord Plateau commente un rapport" "UPDATE 1" authenticated $DEPT "update reports set feedback='ok', status='reviewed' where author_id='$MEMBER'"
t "coord Plateau gère son équipe publique" "INSERT 0 1" authenticated $DEPT "insert into leadership(scope,post,full_name) values ('dept:plateau','Président','A B')"
t "coord Plateau ne gère pas l'équipe du Borgou" "row-level security" authenticated $DEPT "insert into leadership(scope,post,full_name) values ('dept:borgou','Président','A B')"
t "coord Plateau ne lit pas les demandes" "0" authenticated $DEPT "select count(*) from form_submissions"

echo "== compte suspendu"
t "éditeur suspendu ne publie pas" "row-level security" authenticated $SUSP "insert into news_posts(slug,title) values ('susp-a','t')"
t "éditeur suspendu ne voit pas les documents internes" "3" authenticated $SUSP "select count(*) from documents"

echo "== service_role (API serveur)"
t "service_role insère une demande" "INSERT 0 1" service_role "" "insert into form_submissions(kind,payload,ip_hash) values ('contact','{\"a\":1}','h')"
t "service_role inscrit un abonné" "INSERT 0 1" service_role "" "insert into newsletter_subscribers(email) values ('a@b.bj')"
t "doublon d'abonné refusé (insensible à la casse)" "duplicate key" service_role "" "insert into newsletter_subscribers(email) values ('A@B.bj')"
t "BEN lit les demandes" "1" authenticated $BEN "select count(*) from form_submissions"
t "BEN lit les abonnés" "1" authenticated $BEN "select count(*) from newsletter_subscribers"
t "éditeur ne lit pas les abonnés" "0" authenticated $EDITOR "select count(*) from newsletter_subscribers"

echo "== stockage"
t "membre écrit dans son dossier privé" "INSERT 0 1" authenticated $MEMBER "insert into storage.objects(bucket_id,name,owner) values ('private-files','$MEMBER/clause.pdf','$MEMBER')"
t "membre n'écrit pas chez un autre" "row-level security" authenticated $MEMBER "insert into storage.objects(bucket_id,name,owner) values ('private-files','$ADMIN/x.pdf','$MEMBER')"
t "membre n'écrit pas dans documents/" "row-level security" authenticated $MEMBER "insert into storage.objects(bucket_id,name,owner) values ('private-files','documents/x.pdf','$MEMBER')"
t "éditeur écrit dans documents/" "INSERT 0 1" authenticated $EDITOR "insert into storage.objects(bucket_id,name,owner) values ('private-files','documents/x.pdf','$EDITOR')"
t "membre n'écrit pas dans public-files" "row-level security" authenticated $MEMBER "insert into storage.objects(bucket_id,name,owner) values ('public-files','logo.png','$MEMBER')"
t "éditeur écrit dans public-files" "INSERT 0 1" authenticated $EDITOR "insert into storage.objects(bucket_id,name,owner) values ('public-files','logo.png','$EDITOR')"
t "membre lit son fichier privé" "1" authenticated $MEMBER "select count(*) from storage.objects where bucket_id='private-files' and name like '$MEMBER/%'"
t "membre ne lit pas les fichiers des autres" "0" authenticated $DEPT2 "select count(*) from storage.objects where bucket_id='private-files' and name like '$MEMBER/%'"

echo; echo "Résultat : $pass réussis, $fail échecs"
