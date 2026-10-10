# Sénat des Jeunes du Bénin : site public

Site institutionnel national du SJB. Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript.

## Démarrer

```bash
npm install
cp .env.example .env.local   # renseigner les variables (voir docs/DEPLOIEMENT.md)
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run check                # typage + lint + tests
```

Le site public fonctionne sans Supabase. Pour activer le back-office, l'espace membre et les formulaires :
suivre **[docs/DEPLOIEMENT.md](docs/DEPLOIEMENT.md)**.

## Architecture

- `app/(site)/` : pages publiques (ISR, régénérées toutes les 5 minutes ou à chaque modification).
- `app/(app)/admin/` : **back-office** (rôles `super_admin`, `editor`, `ben`, `coord_region`, `coord_dept`).
- `app/(app)/espace/` : **espace membre** (profil, carte, documents, annonces, rapports, équipe, clause d'engagement).
- `app/api/forms/[kind]` : réception sécurisée des formulaires publics ; `app/api/health` : sonde.
- `app/auth/` : retours des e-mails d'invitation et de récupération.
- `content/` : contenu éditorial de repli (statuts, décret) ; `lib/data.ts` lit Supabase avec repli sur ce contenu.
- `lib/admin/resources.ts` : description des ressources du back-office (champs, rôles, colonnes) ; un seul CRUD générique.
- `supabase/` : migrations (schéma, RLS, stockage), `seed.sql`, tests RLS.
- `components/ui/` : système de design (bouton « Verre », révélation au scroll, compteur, orbites, carte interactive, section épinglée).
- `app/globals.css` : tokens (couleurs du logo, Space Grotesk / Poppins).
- `docs/A_COMPLETER.md` : informations à renseigner depuis **/admin/parametres**.
