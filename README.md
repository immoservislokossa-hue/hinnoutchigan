# Sénat des Jeunes du Bénin : site public

Site institutionnel national du SJB. Next.js 15 (App Router), React 19, Tailwind CSS 4, TypeScript.

## Démarrer

```bash
npm install
cp .env.example .env.local   # puis renseigner les variables
npm run dev                  # http://localhost:3000
npm run build && npm start   # production
npm run lint && npm run typecheck
```

## Variables d'environnement

| Variable | Rôle |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL publique (SEO, sitemap, Open Graph) |
| `NEXT_PUBLIC_FORMS_ENDPOINT` | Endpoint recevant les formulaires (`POST { kind, payload, submittedAt }`) |

## Structure

- `app/` : pages publiques (accueil, Le Sénat, organisation, BEN, présidence, sous-groupes, commissions, territoires, actions, actualités, agenda, documents, transparence, rejoindre, engagement, partenaires, opportunités, contact, presse, pages légales).
- `content/` : tout le contenu éditorial (`site.ts` pour la configuration, `structure.ts` pour les faits issus des statuts et du décret).
- `components/ui/` : système de design (bouton « Sceau », révélation au scroll, compteur, rayons de soleil, ornements).
- `app/globals.css` : tokens (couleurs du logo, polices Cinzel / Cormorant Garamond / Inter) et composants CSS.
- `docs/A_COMPLETER.md` : informations manquantes et décisions à valider.

## Phase suivante

Back-office, espaces sénateurs, connexion des formulaires et module Opportunités.
