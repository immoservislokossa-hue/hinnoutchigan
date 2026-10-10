// Génère supabase/seed.sql à partir de content/structure.ts (source de vérité du contenu initial).
// Usage : node --experimental-strip-types scripts/generate-seed.mjs
import { writeFileSync } from "node:fs";
import { departments, news, documents } from "../content/structure.ts";

const q = (v) => (v === null || v === undefined ? "null" : `'${String(v).replaceAll("'", "''")}'`);
const out = [];
out.push("-- Données initiales. Généré par scripts/generate-seed.mjs : ne pas modifier à la main.");
out.push("begin;");

out.push("\n-- Départements");
out.push("insert into public.departments (slug, name, seat, region, sort) values");
out.push(departments.map((d, i) => `  (${q(d.slug)}, ${q(d.name)}, ${q(d.seat)}, ${q(d.region)}, ${i})`).join(",\n"));
out.push("on conflict (slug) do update set name = excluded.name, seat = excluded.seat, region = excluded.region, sort = excluded.sort;");

out.push("\n-- Communes");
out.push("insert into public.communes (department_slug, name) values");
out.push(departments.flatMap((d) => d.communes.map((c) => `  (${q(d.slug)}, ${q(c)})`)).join(",\n"));
out.push("on conflict (department_slug, name) do nothing;");

out.push("\n-- Actualités initiales");
out.push("insert into public.news_posts (slug, title, excerpt, body, category, document_path, published, published_at) values");
out.push(
  news
    .map((n) => `  (${q(n.slug)}, ${q(n.title)}, ${q(n.excerpt)}, ${q(n.body.join("\n\n"))}, ${q(n.category)}, ${q(n.doc ?? null)}, true, ${q(n.iso + "T08:00:00+01:00")})`)
    .join(",\n"),
);
out.push("on conflict (slug) do nothing;");

out.push("\n-- Documents officiels");
out.push("insert into public.documents (title, kind, reference, doc_date, file_path, visibility)");
out.push(
  "select v.title, v.kind, v.reference, v.doc_date::date, v.file_path, 'public'::public.doc_visibility from (values",
);
const iso = { "31 mars 2026": "2026-03-31", "17 août 2026": "2026-08-17" };
out.push(
  documents.map((d) => `  (${q(d.title)}, ${q(d.kind)}, ${q(d.ref)}, ${q(iso[d.date])}, ${q(d.file)})`).join(",\n"),
);
out.push(") as v(title, kind, reference, doc_date, file_path)");
out.push("where not exists (select 1 from public.documents x where x.file_path = v.file_path);");

out.push("\n-- Réglages du site : valeurs vides, à renseigner depuis le back-office (/admin/parametres)");
out.push("insert into public.site_settings (key, value) values");
out.push(
  [
    ["contact", { email: "", phones: [], address: "" }],
    ["social", { facebook: "", instagram: "", tiktok: "", linkedin: "", youtube: "", whatsapp: "" }],
    ["president", { name: "", message: "", vision: "", priorities: "", actions: "", commitments: "", photo_path: "" }],
    ["press", { contact: "" }],
    ["legal", { registry_number: "", publication_director: "", host: "", retention: "" }],
  ]
    .map(([k, v]) => `  (${q(k)}, ${q(JSON.stringify(v))}::jsonb)`)
    .join(",\n"),
);
out.push("on conflict (key) do nothing;");
out.push("\ncommit;");

writeFileSync(new URL("../supabase/seed.sql", import.meta.url), out.join("\n") + "\n");
console.log("supabase/seed.sql généré");
