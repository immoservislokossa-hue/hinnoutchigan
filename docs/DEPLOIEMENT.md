# Mise en production : site, back-office et Supabase

Le site public fonctionne seul (contenu statique). Le back-office, l'espace membre et l'envoi des
formulaires s'activent dès que Supabase est relié.

## 1. Créer le projet Supabase

1. Créez un projet sur <https://supabase.com> (région la plus proche, par exemple Europe).
2. **SQL Editor** : exécutez dans l'ordre le contenu de
   - `supabase/migrations/20261010000001_schema.sql`
   - `supabase/migrations/20261010000002_security.sql`
   - `supabase/migrations/20261010000003_storage.sql`
   - `supabase/seed.sql` (départements, communes, actualités et documents initiaux, réglages vides)

   Avec la CLI Supabase : `supabase link --project-ref <ref>` puis `supabase db push` (le seed passe par `supabase db reset` en local).
3. **Project Settings → API** : copiez l'URL, la clé `anon` et la clé `service_role`.

## 2. Configurer l'authentification (Authentication)

| Réglage | Valeur |
|---|---|
| Sign In / Providers → **Allow new users to sign up** | **Désactivé** (comptes créés sur invitation uniquement) |
| Email → Confirm email | Activé |
| Password → longueur minimale | 10 caractères ou plus |
| URL Configuration → Site URL | l'URL publique du site, par exemple `https://www.exemple.bj` |
| URL Configuration → Redirect URLs | `https://www.exemple.bj/auth/callback` et `https://www.exemple.bj/auth/confirm` |
| SMTP | Un SMTP dédié (Resend, Brevo…) : le SMTP par défaut de Supabase est limité et réservé aux tests |

**Modèles d'e-mails** (Authentication → Email Templates) : remplacez le lien par la version `token_hash`,
plus fiable avec les sessions par cookies :

- *Invite user* : `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=invite&next=/auth/nouveau-mot-de-passe`
- *Reset password* : `{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=recovery&next=/auth/nouveau-mot-de-passe`

## 3. Créer le premier administrateur

1. Authentication → Users → **Add user** (e-mail + mot de passe, « Auto confirm » coché).
2. SQL Editor :

```sql
update public.profiles
set role = 'super_admin', full_name = 'Prénoms Nom', member_status = 'fondateur'
where email = 'adresse@exemple.bj';
```

Les comptes suivants se créent depuis **/admin/membres → Inviter un membre**.

## 4. Variables d'environnement (hébergeur : Vercel, Netlify, VPS…)

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique du site |
| `NEXT_PUBLIC_SUPABASE_URL` | URL du projet |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | clé publique (soumise à la RLS) |
| `SUPABASE_SERVICE_ROLE_KEY` | clé de service, **serveur uniquement** |
| `FORMS_HASH_SALT` | sel aléatoire (`openssl rand -hex 24`) pour la limitation de débit |

Les variables `NEXT_PUBLIC_*` sont intégrées au build : redéployez après toute modification.

Vérification : `GET /api/health` doit répondre `{"status":"ok","supabase":true,"serviceRole":true}`.

## 5. Ce que fait chaque rôle

| Rôle | Accès |
|---|---|
| Administrateur principal (`super_admin`) | Tout, y compris les rôles et le journal d'audit |
| Bureau Exécutif National (`ben`) | Contenu, demandes, membres (hors rôles), abonnés, paramètres |
| Éditeur (`editor`) | Actualités, événements, documents, annonces, partenaires |
| Coordination régionale (`coord_region`) | Lecture et examen des rapports des départements de sa région |
| Coordination départementale (`coord_dept`) | Actualités, événements et équipe publique de **son** département ; rapports de son département |
| Section communale, d'arrondissement, membre | Espace membre : profil, carte, documents, annonces, rapports, équipe (sections) |

Ces règles sont appliquées **par la base de données** (Row Level Security) : même en cas de bug dans l'interface,
un compte ne peut pas dépasser ses droits. Elles sont couvertes par `supabase/rls_test.sh` (62 tests).

## 6. Sécurité et exploitation

- Aucune inscription publique ; invitations par e-mail ; compte suspendu = accès coupé immédiatement.
- Les formulaires publics passent par `/api/forms/<type>` : validation Zod, contrôle d'origine, piège à robots, limitation de débit par IP hachée.
- Fichiers : formats vérifiés par signature (JPG, PNG, WebP, PDF, Word), 10 Mo (public) / 15 Mo (privé). Les fichiers privés ne sont servis que par URL signée de 2 minutes.
- Entêtes de sécurité et CSP dans `next.config.ts` ; pages privées en `Cache-Control: no-store`.
- Journal d'audit : création, modification, suppression, invitations.
- **Sauvegardes** : activez les sauvegardes quotidiennes (plan Pro) ou programmez `pg_dump`.
- **Notifications** : pour être prévenu à chaque nouvelle demande, ajoutez un *Database Webhook* Supabase sur `form_submissions` (INSERT) vers votre service d'e-mail.
- **Mises à jour** : `npm audit` régulièrement ; mettre à jour Next.js et Supabase.

## 7. Tests

```bash
npm run check          # typage, lint, tests unitaires
# Tests RLS sur une base Postgres jetable :
createdb sjb_test
psql sjb_test -f supabase/stub_supabase.sql     # uniquement sur Postgres nu (pas sur Supabase)
psql sjb_test -f supabase/migrations/20261010000001_schema.sql
psql sjb_test -f supabase/migrations/20261010000002_security.sql
psql sjb_test -f supabase/migrations/20261010000003_storage.sql
psql sjb_test -f supabase/seed.sql
PGDATABASE=sjb_test ./supabase/rls_test.sh
```
