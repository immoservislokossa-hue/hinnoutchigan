const { chromium } = require(process.env.PW);
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (sub) => `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub, role: "authenticated", aud: "authenticated", exp: 4102444800 })}.sig`;
const U = { admin: "00000000-0000-0000-0000-000000000001", editor: "00000000-0000-0000-0000-000000000002", ben: "00000000-0000-0000-0000-000000000003", dept: "00000000-0000-0000-0000-000000000004", member: "00000000-0000-0000-0000-000000000006" };
const session = (uid) => ({ access_token: jwt(uid), token_type: "bearer", expires_in: 3600, expires_at: 4102444800, refresh_token: "r", user: { id: uid, aud: "authenticated", role: "authenticated", email: "x@x.bj", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" } });
const ID = (n) => `10000000-0000-0000-0000-${String(n).padStart(12, "0")}`;
const plan = {
  admin: ["/admin", "/admin/actualites", "/admin/actualites/new", `/admin/actualites/${ID(1)}`, "/admin/evenements", `/admin/evenements/${ID(3)}`, "/admin/documents", "/admin/documents/new", "/admin/annonces", "/admin/partenaires/new", "/admin/equipes", "/admin/equipes/new", "/admin/rapports", `/admin/rapports/${ID(9)}`, "/admin/demandes", `/admin/demandes/${ID(5)}`, "/admin/membres", `/admin/membres/${U.member}`, "/admin/membres/inviter", "/admin/abonnes", "/admin/parametres", "/admin/journal", "/espace", "/espace/profil", "/espace/carte", "/espace/documents", "/espace/annonces", "/espace/rapports", "/espace/rapports/nouveau", "/espace/equipe", "/espace/clause"],
  editor: ["/admin", "/admin/actualites", "/admin/demandes", "/admin/membres", "/admin/parametres", "/admin/journal"],
  dept: ["/admin", "/admin/actualites", "/admin/actualites/new", "/admin/evenements", "/admin/equipes/new", "/admin/documents", "/admin/rapports", "/espace/equipe", "/espace/clause"],
  member: ["/admin", "/espace", "/espace/profil", "/espace/carte", "/espace/documents", "/espace/rapports/nouveau", "/espace/equipe", "/espace/clause"],
};
(async () => {
  const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
  const out = process.argv[2]; let bad = 0;
  for (const [who, pages] of Object.entries(plan)) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 800 }, isMobile: true });
    await ctx.addCookies([{ name: "sb-127-auth-token", value: "base64-" + b64(session(U[who])), url: "http://localhost:3102" }]);
    const p = await ctx.newPage(); const errs = [];
    p.on("pageerror", (e) => errs.push("pageerror " + e.message)); p.on("console", (m) => m.type() === "error" && !/Failed to load resource/.test(m.text()) && errs.push("console " + m.text().slice(0, 140)));
    for (const path of pages) {
      errs.length = 0;
      const r = await p.goto("http://localhost:3102" + path, { waitUntil: "networkidle" });
      const final = new URL(p.url()).pathname; const overflow = await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      const txt = (await p.locator("body").innerText()).slice(0, 4000);
      const err500 = /Application error|Internal Server Error|digest/i.test(txt);
      const flag = r.status() >= 400 || err500 || errs.length || overflow;
      if (flag) bad++;
      console.log(`${flag ? "!!" : "ok"} ${who.padEnd(6)} ${path.slice(0, 48).padEnd(48)} ${r.status()} ${final !== path ? "→ " + final : ""}${overflow ? " OVERFLOW" : ""}${err500 ? " ERR" : ""} ${errs.join(" | ")}`);
      if (["admin", "dept", "member"].includes(who) && ["/admin", "/admin/actualites/new", "/admin/demandes", `/admin/demandes/${ID(5)}`, "/admin/parametres", "/espace", "/espace/carte", "/admin/membres"].includes(path)) await p.screenshot({ path: `${out}/e2e-${who}-${path.replace(/[\/]/g, "_")}.png`, fullPage: true });
    }
    await ctx.close();
  }
  await b.close(); console.log("problèmes:", bad);
})();
