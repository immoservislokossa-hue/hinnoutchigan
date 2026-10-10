# Tests de bout en bout avec un faux Supabase

`mock-supabase.mjs` simule l'API d'authentification et de données (sans base réelle) pour vérifier le rendu
et les parcours du back-office et de l'espace membre. Il **ne remplace pas** un test sur un vrai projet Supabase.

```bash
# 1. Faux Supabase (port 54321, journal des requêtes sur 54322)
node tests/e2e/mock-supabase.mjs &

# 2. Build et serveur pointant vers le faux Supabase
export NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key NEXT_PUBLIC_SITE_URL=http://localhost:3102
npm run build
SUPABASE_SERVICE_ROLE_KEY=service-key FORMS_HASH_SALT=t npx next start -p 3102 &

# 3. Playwright installé globalement (PW = chemin du module)
PW=$(npm root -g)/playwright node tests/e2e/pages-by-role.cjs ./captures   # chaque page, par rôle, sur mobile
PW=$(npm root -g)/playwright node tests/e2e/flows.cjs                       # parcours : connexion, formulaires, CRUD, invitation…
```

Les chemins du navigateur dans les scripts (`/opt/pw-browsers/chromium-1194/...`) sont à adapter à votre machine.
