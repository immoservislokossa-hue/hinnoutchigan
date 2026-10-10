# Informations à compléter

Chaque information manquante est affichée sur le site par un marqueur pointillé **« À compléter »** (composant `components/ui/Todo.tsx`).
Pour retrouver tous les marqueurs : `grep -rn "<Todo" app components`.

## À trancher en priorité (contradictions entre documents)

| Sujet | Constat | Où cela se corrige |
|---|---|---|
| Président national | Statuts (31 mars 2026) signés par *Gbèhodé Gildas Blaise Agbokpéla* ; décret du 17 août 2026 signé par *Marius Dayou* | `app/presidence/page.tsx`, `app/bureau-executif/page.tsx` |
| Barème d'adhésion | Statuts art. 26 : 500 à 5 000 F selon l'âge ; décret art. 4.2 : « frais d'adhésion (5.000 F) » | tableau dans `content/structure.ts` (`feeTable`) et `app/rejoindre/page.tsx` |
| Courriel officiel | Décret : `senateursdubenin@yahoo.com` (en-tête) et `@gmail.com` (art. 8) | `content/site.ts` → `contact.email` |
| Dates fondatrices | Décret cite le congrès constitutif du 5 août 2012 et l'association du 5 juin 2013 ; statuts de 2026 parlent d'une refondation | `timeline` dans `content/structure.ts` |

## Contenus

- **Identité** : prénoms et noms des 7 membres du BEN + photos officielles (`Portrait`).
- **Présidence** : mot du Président, vision, priorités, actions réalisées, engagements.
- **Départements** : responsables de chaque coordination, actualités et activités locales (12 pages).
- **Coordonnées** (`content/site.ts`) : courriel, téléphones, adresse physique, réseaux sociaux.
- **Actualités, agenda, rapports** : premiers articles, prochaines dates, rapport annuel et rapports financiers certifiés.
- **Documents** : règlement intérieur, registre des délibérations, rapports d'activités.
- **Partenaires** : logos et noms des partenaires conventionnés.
- **Presse** : nom et contact du responsable communication.
- **Mentions légales / confidentialité** : numéro d'enregistrement au Registre, directeur de la publication, hébergeur, durées de conservation, relecture juridique.

## Décisions à valider

- Les statuts et le décret n°002-08-2026 sont publiés dans `public/documents/` : retirer ce qui ne doit pas être public.
- Le décret mentionne des numéros de téléphone dans son en-tête ; ils n'ont pas été repris dans `content/site.ts`.
- La page **Opportunités** est volontairement un espace réservé (module à venir).
- Les formulaires ne transmettent rien tant que `NEXT_PUBLIC_FORMS_ENDPOINT` n'est pas défini ; l'interface l'indique honnêtement aux visiteurs.
- Le **back-office** et l'**espace membres** (`/connexion`) sont laissés pour la phase suivante.
