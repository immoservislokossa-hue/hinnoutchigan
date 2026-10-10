// Faux Supabase (GoTrue + PostgREST minimal) pour tester le rendu du back-office. Aucune donnée réelle.
import http from "node:http";
import crypto from "node:crypto";

const PORT = 54321;
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
export const jwt = (sub, role = "authenticated") => `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub, role, aud: "authenticated", exp: 4102444800, iat: 1700000000 })}.sig`;

const users = {
  admin: { id: "00000000-0000-0000-0000-000000000001", email: "admin@sjb.bj", role: "super_admin", full_name: "Aïcha Admin" },
  editor: { id: "00000000-0000-0000-0000-000000000002", email: "editor@sjb.bj", role: "editor", full_name: "Edgar Éditeur" },
  ben: { id: "00000000-0000-0000-0000-000000000003", email: "ben@sjb.bj", role: "ben", full_name: "Bénédicte BEN" },
  dept: { id: "00000000-0000-0000-0000-000000000004", email: "dept@sjb.bj", role: "coord_dept", full_name: "Didier Plateau", department_slug: "plateau", region: "Ouémé-Plateau" },
  member: { id: "00000000-0000-0000-0000-000000000006", email: "member@sjb.bj", role: "member", full_name: "Marie Membre" },
};
const profileOf = (u) => ({ id: u.id, email: u.email, full_name: u.full_name, phone: "+229 01 53 75 40 43", birth_date: "2000-05-01", sex: "F", role: u.role, status: "active", member_status: "adherent_engage", subgroup: "CCJ", member_number: "SJB-2026-00001", post: u.role === "coord_dept" ? "Président(e)" : null, department_slug: u.department_slug ?? null, commune_id: null, region: u.region ?? null, photo_path: null, bio: "Bio d'exemple", created_at: "2026-09-01T10:00:00Z" });

const id = (n) => `10000000-0000-0000-0000-${String(n).padStart(12, "0")}`;
const store = {
  profiles: Object.values(users).map(profileOf),
  news_posts: [
    { id: id(1), slug: "premier-communique", title: "Premier communiqué du Bureau Exécutif National", excerpt: "Résumé.", body: "Corps\n\nSuite", category: "Communiqué", published: true, published_at: "2026-10-01T08:00:00Z", department_slug: null, created_at: "2026-10-01T08:00:00Z" },
    { id: id(2), slug: "brouillon", title: "Brouillon d'actualité", excerpt: "", body: "", category: "Actualité", published: false, published_at: null, department_slug: "plateau", created_at: "2026-10-02T08:00:00Z" },
  ],
  events: [{ id: id(3), title: "Assemblée Plénière ordinaire", kind: "Assemblée Plénière", starts_at: "2026-11-15T09:00:00Z", published: true, department_slug: null, description: "", location: "Parakou", created_at: "2026-10-01T08:00:00Z" }],
  documents: [{ id: id(4), title: "Statuts 2026", kind: "Textes fondamentaux", visibility: "public", doc_date: "2026-03-31", file_path: "/documents/statuts-sjb-2026.pdf", reference: null, created_at: "2026-10-01T08:00:00Z" }],
  form_submissions: [
    { id: id(5), kind: "adhesion", status: "new", payload: { nom: "Dossou", prenom: "Koffi", email: "koffi@example.bj", telephone: "0153754043", departement: "Plateau", commune: "Pobè", motivation: "Je souhaite servir ma commune." }, created_at: "2026-10-05T10:00:00Z", notes: null },
    { id: id(6), kind: "contact", status: "done", payload: { nom: "Ada", email: "ada@example.bj", objet: "Information générale", message: "Bonjour, quelles sont vos activités ?" }, created_at: "2026-10-04T10:00:00Z", notes: "Répondu" },
  ],
  newsletter_subscribers: [{ id: id(7), email: "abonne@example.bj", source: "site", created_at: "2026-10-03T10:00:00Z" }],
  announcements: [{ id: id(8), title: "Réunion de coordination", body: "Rendez-vous lundi.", audience: "all", published_at: "2026-10-06T08:00:00Z", created_at: "2026-10-06T08:00:00Z" }],
  reports: [{ id: id(9), author_id: users.member.id, title: "Rapport d'octobre", period_label: "Octobre 2026", content: "Activités menées ce mois-ci avec succès.", status: "submitted", department_slug: "plateau", feedback: null, created_at: "2026-10-07T08:00:00Z", submitted_at: "2026-10-07T09:00:00Z" }],
  partners: [], leadership: [], clauses: [], audit_log: [{ id: 1, actor_email: "admin@sjb.bj", action: "create", entity: "news_posts", meta: { title: "Test" }, created_at: "2026-10-08T08:00:00Z" }],
  site_settings: [{ key: "contact", value: { email: "contact@sjb.bj", phones: ["+229 01 00 00 00 00"], address: "Parakou" } }],
};

export const log = [];
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const chunks = []; for await (const c of req) chunks.push(c);
  const body = Buffer.concat(chunks).toString();
  const send = (status, obj, headers = {}) => { res.writeHead(status, { "Content-Type": "application/json", ...headers }); res.end(obj === undefined ? "" : JSON.stringify(obj)); };
  const auth = (req.headers.authorization ?? "").replace("Bearer ", "");
  const sub = auth.split(".")[1] ? JSON.parse(Buffer.from(auth.split(".")[1], "base64url").toString()).sub : null;

  if (url.pathname === "/auth/v1/user") {
    const u = Object.values(users).find((x) => x.id === sub);
    return u ? send(200, { id: u.id, aud: "authenticated", role: "authenticated", email: u.email, app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" }) : send(401, { message: "invalid" });
  }
  if (url.pathname === "/auth/v1/token") {
    const { email } = JSON.parse(body || "{}");
    const u = Object.values(users).find((x) => x.email === email);
    if (!u) return send(400, { error: "invalid_grant", error_description: "Invalid login credentials" });
    return send(200, { access_token: jwt(u.id), token_type: "bearer", expires_in: 3600, expires_at: 4102444800, refresh_token: "r", user: { id: u.id, email: u.email, aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" } });
  }
  if (url.pathname === "/auth/v1/logout") return send(204);
  if (url.pathname === "/auth/v1/invite") { log.push("INVITE " + body); return send(200, { id: "20000000-0000-0000-0000-000000000001", email: JSON.parse(body).email, aud: "authenticated", role: "authenticated", app_metadata: {}, user_metadata: {}, created_at: "2026-01-01T00:00:00Z" }); }
  if (url.pathname.startsWith("/rest/v1/")) {
    const table = url.pathname.split("/")[3];
    log.push(`${req.method} ${table} ${url.search.slice(0, 80)} ${body.slice(0, 2000)}`);
    const rows = store[table] ?? [];
    const accept = req.headers.accept ?? "";
    const prefer = req.headers.prefer ?? "";
    if (req.method === "GET" || req.method === "HEAD") {
      let out = rows;
      const idEq = url.searchParams.get("id");
      if (idEq?.startsWith("eq.")) out = rows.filter((r) => r.id === idEq.slice(3));
      const statusEq = url.searchParams.get("status");
      if (statusEq?.startsWith("eq.")) out = out.filter((r) => r.status === statusEq.slice(3));
      const range = { "Content-Range": `0-${Math.max(0, out.length - 1)}/${out.length}` };
      if (req.method === "HEAD") return send(200, undefined, range);
      if (accept.includes("vnd.pgrst.object")) return out[0] ? send(200, out[0]) : send(406, { code: "PGRST116", details: "The result contains 0 rows", message: "JSON object requested, multiple (or no) rows returned" });
      return send(200, out, range);
    }
    if (req.method === "POST") return prefer.includes("return=representation") ? send(201, accept.includes("vnd.pgrst.object") ? { id: id(99) } : [{ id: id(99) }]) : send(201);
    if (req.method === "PATCH") return prefer.includes("count=exact") ? send(204, undefined, { "Content-Range": "*/1" }) : send(204);
    if (req.method === "DELETE") return send(204, undefined, { "Content-Range": "*/1" });
  }
  if (url.pathname.startsWith("/storage/v1/")) return send(200, { Key: "ok", signedURL: "/object/sign/x?token=t" });
  send(404, { message: "not found" });
});
server.listen(PORT, () => console.log("mock supabase on", PORT));
export { users };
export const requestLog = log;
// Journal consultable
http.createServer((req, res) => { res.end(log.join("\n")); }).listen(54322);
