const { chromium } = require(process.env.PW);
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (sub) => `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub, role: "authenticated", aud: "authenticated", exp: 4102444800 })}.sig`;
const session = (uid) => ({ access_token: jwt(uid), token_type: "bearer", expires_in: 3600, expires_at: 4102444800, refresh_token: "r", user: { id: uid, aud: "authenticated", role: "authenticated", email: "x@x.bj", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" } });
const U = { admin: "00000000-0000-0000-0000-000000000001", dept: "00000000-0000-0000-0000-000000000004", member: "00000000-0000-0000-0000-000000000006" };
const BASE = "http://localhost:3102";
const mlog = async () => (await (await fetch("http://127.0.0.1:54322")).text()).split("\n");
let fails = 0;
const ok = (c, m) => { console.log((c ? "ok   " : "FAIL ") + m); if (!c) fails++; };
const text = async (p) => p.locator("body").innerText();

(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
  const mk = async (who) => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 900 } });
    if (who) await ctx.addCookies([{ name: "sb-127-auth-token", value: "base64-" + b64(session(U[who])), url: BASE }]);
    return ctx;
  };

  // 1. Connexion par formulaire
  {
    const ctx = await mk(null); const p = await ctx.newPage();
    await p.goto(BASE + "/espace");
    ok(p.url().includes("/connexion?next=%2Fespace"), "visiteur sur /espace redirigé vers /connexion?next");
    await p.fill("#email", "inconnu@x.bj"); await p.fill("#password", "x"); await p.click("main button[type=submit]"); await p.waitForTimeout(1200);
    ok((await text(p)).includes("Identifiants incorrects"), "mauvais identifiants : message générique");
    await p.fill("#email", "member@sjb.bj"); await p.fill("#password", "motdepasse"); await p.click("main button[type=submit]");
    await p.waitForURL("**/espace", { timeout: 8000 }).catch(() => {});
    ok(new URL(p.url()).pathname === "/espace", "bonne connexion : arrivée sur /espace (" + new URL(p.url()).pathname + ")");
    await p.goto(BASE + "/connexion?next=//evil.com"); await p.waitForTimeout(500);
    ok(!p.url().includes("evil.com"), "redirection externe bloquée");
    await ctx.close();
  }

  // 2. Formulaire public de contact
  {
    const ctx = await mk(null); const p = await ctx.newPage(); await p.goto(BASE + "/contact", { waitUntil: "networkidle" });
    await p.click("main button[type=submit]"); await p.waitForTimeout(300);
    ok((await text(p)).includes("Ce champ est obligatoire"), "contact : validation côté client");
    await p.fill("input[name=nom]", "Ada Lovelace"); await p.fill("input[name=email]", "ada@example.bj"); await p.selectOption("select[name=objet]", "Adhésion");
    await p.fill("textarea[name=message]", "Bonjour, je souhaite adhérer au SJB."); await p.check("input[name=consent]"); await p.click("main button[type=submit]"); await p.waitForTimeout(1500);
    ok((await text(p)).includes("Merci pour votre message"), "contact : message de succès");
    ok((await mlog()).some((l) => l.startsWith("POST form_submissions") && l.includes("Ada Lovelace")), "contact : ligne insérée dans form_submissions");
    await ctx.close();
  }

  // 3. Coordination départementale : actualité forcée sur son département
  {
    const ctx = await mk("dept"); const p = await ctx.newPage(); await p.goto(BASE + "/admin/actualites/new", { waitUntil: "networkidle" });
    ok((await p.locator("select[name=department_slug]").count()) === 0, "coord_dept : champ département absent du formulaire");
    await p.fill("input[name=title]", "Journée de salubrité à Pobè"); await p.selectOption("select[name=category]", "Communiqué"); await p.check("input[name=published]");
    await p.fill("textarea[name=body]", "Premier paragraphe.\n\nSecond paragraphe."); await p.click("main button[type=submit]");
    await p.waitForURL("**/admin/actualites?ok=saved", { timeout: 8000 }).catch(() => {});
    ok(p.url().includes("ok=saved"), "création d'actualité : redirection avec confirmation");
    const line = (await mlog()).filter((l) => l.startsWith("POST news_posts")).pop() ?? "";
    ok(line.includes('"department_slug":"plateau"'), "département imposé côté serveur (plateau)");
    ok(line.includes('"slug":"journee-de-salubrite-a-pobe"'), "slug généré depuis le titre");
    ok(line.includes('"author_id":"' + U.dept + '"'), "auteur = utilisateur connecté");
    ok(/"published_at":"20\d\d-/.test(line), "date de publication horodatée");
    await ctx.close();
  }

  // 4. Administrateur : invitation, paramètres, suppression
  {
    const ctx = await mk("admin"); const p = await ctx.newPage();
    await p.goto(BASE + "/admin/membres/inviter", { waitUntil: "networkidle" });
    await p.fill("input[name=full_name]", "Nouveau Coordonnateur"); await p.fill("input[name=email]", "nouveau@example.bj"); await p.selectOption("select[name=role]", "coord_dept"); await p.click("main button[type=submit]"); await p.waitForTimeout(1000);
    ok((await text(p)).includes("exige un département"), "invitation coord_dept sans département refusée");
    await p.waitForTimeout(500); await p.selectOption("select[name=department_slug]", "borgou"); await p.click("main button[type=submit]");
    await p.waitForURL(/ok=invited/, { timeout: 8000 }).catch(() => {});
    const l = await mlog();
    ok(l.some((x) => x.startsWith("INVITE") && x.includes("nouveau@example.bj")), "invitation envoyée via l'API d'administration");
    ok(l.some((x) => x.startsWith("PATCH profiles") && x.includes('"role":"coord_dept"') && x.includes('"department_slug":"borgou"') && x.includes('"region":"Borgou-Alibori"')), "profil complété (rôle, département, région déduite)");

    await p.goto(BASE + "/admin/parametres", { waitUntil: "networkidle" });
    await p.fill("input[name=contact_email]", "pas-un-email"); await p.click("main button[type=submit]"); await p.waitForTimeout(1000);
    ok((await text(p)).includes("Courriel invalide"), "paramètres : courriel invalide refusé");
    await p.fill("input[name=contact_email]", "contact@sjb.bj"); await p.fill("input[name=facebook]", "javascript:alert(1)"); await p.click("main button[type=submit]"); await p.waitForTimeout(1000);
    ok((await text(p)).includes("https://"), "paramètres : lien non https refusé");
    await p.fill("input[name=facebook]", "https://facebook.com/sjb"); await p.click("main button[type=submit]");
    await p.waitForURL("**/admin/parametres?ok=saved", { timeout: 8000 }).catch(() => {});
    ok(p.url().includes("ok=saved"), "paramètres enregistrés");
    ok((await mlog()).some((x) => x.startsWith("POST site_settings") && x.includes("contact@sjb.bj")), "upsert de site_settings");

    await p.goto(BASE + "/admin/actualites/10000000-0000-0000-0000-000000000001", { waitUntil: "networkidle" });
    p.once("dialog", (d) => d.accept()); await p.click("text=Supprimer");
    await p.waitForURL("**/admin/actualites?ok=deleted", { timeout: 8000 }).catch(() => {});
    ok(p.url().includes("ok=deleted"), "suppression confirmée puis redirigée");
    await ctx.close();
  }

  // 5. Membre : rapport
  {
    const ctx = await mk("member"); const p = await ctx.newPage(); await p.goto(BASE + "/espace/rapports/nouveau", { waitUntil: "networkidle" });
    await p.fill("input[name=title]", "Rapport"); await p.fill("input[name=period_label]", "Octobre 2026"); await p.fill("textarea[name=content]", "trop court"); await p.click("main button[type=submit]"); await p.waitForTimeout(1000);
    ok((await text(p)).includes("20 caractères minimum"), "rapport : validation serveur");
    ok((await p.inputValue("input[name=title]")) === "Rapport", "rapport : saisie conservée après erreur");
    await p.fill("textarea[name=content]", "Activités menées : sensibilisation, réunions, bilan du mois."); await p.selectOption("select[name=intent]", "submit"); await p.click("main button[type=submit]");
    await p.waitForURL("**/espace/rapports?ok=submitted", { timeout: 8000 }).catch(() => {});
    ok(p.url().includes("ok=submitted"), "rapport soumis");
    ok((await mlog()).some((x) => x.startsWith("POST reports") && x.includes('"status":"submitted"') && x.includes(U.member)), "rapport inséré avec statut soumis et auteur");
    await ctx.close();
  }

  await b.close();
  console.log(fails ? `ÉCHECS : ${fails}` : "TOUS LES SCÉNARIOS PASSENT");
})();
