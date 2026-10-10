import test from "node:test";
import assert from "node:assert/strict";
import { slugify, fromLocalInput, toLocalInput, isIsoDate } from "../lib/admin/util.ts";
import { formSchemas, isFormKind } from "../lib/forms-schema.ts";
import { safeNext } from "../lib/safe-next.ts";
import { normalizePost } from "../lib/text.ts";

test("slugify retire accents et symboles", () => {
  assert.equal(slugify("Révision des instances : décret n°002-08/2026 !"), "revision-des-instances-decret-n-002-08-2026");
  assert.equal(slugify("   "), "");
});

test("les dates locales sont interprétées à l'heure du Bénin (UTC+1)", () => {
  assert.equal(fromLocalInput("2026-10-10T14:30"), "2026-10-10T13:30:00.000Z");
  assert.equal(toLocalInput("2026-10-10T13:30:00.000Z"), "2026-10-10T14:30");
  assert.equal(fromLocalInput("10/10/2026"), null);
  assert.ok(isIsoDate("2026-02-28"));
  assert.ok(!isIsoDate("2026-13-40"));
});

test("safeNext refuse les redirections externes", () => {
  assert.equal(safeNext("/admin/actualites"), "/admin/actualites");
  for (const bad of ["//evil.com", "https://evil.com", "/\\evil.com", "javascript:alert(1)", "", null, undefined, "/a\r\nSet-Cookie: x"]) {
    assert.equal(safeNext(bad), "/espace");
  }
});

test("normalizePost rapproche les intitulés de postes", () => {
  assert.equal(normalizePost("Président(e)"), normalizePost("Président"));
  assert.equal(normalizePost("Trésorier(ère) Général(e) Adjoint(e)"), normalizePost("trésorier général adjoint"));
});

test("schémas de formulaires : cas valides et invalides", () => {
  assert.ok(isFormKind("contact") && !isFormKind("admin"));
  const ok = formSchemas.contact.safeParse({ nom: "Ada Lovelace", email: "ADA@Example.BJ", objet: "Adhésion", message: "Bonjour, je souhaite adhérer." });
  assert.ok(ok.success);
  assert.equal(ok.data.email, "ada@example.bj");
  assert.ok(!formSchemas.contact.safeParse({ nom: "A", email: "x", objet: "", message: "court" }).success);
  assert.ok(!formSchemas.engagement.safeParse({ nom: "Do", prenom: "Re", departement: "Plateau", commune: "Pobè", age: "abc", telephone: "0153754043", type: "Bénévole" }).success);
  assert.ok(formSchemas.newsletter.safeParse({ email: "a@b.bj" }).success);
  assert.ok(!formSchemas.newsletter.safeParse({ email: "a@b" }).success);
  // les champs inconnus (ex. tentative d'injection de colonnes) sont écartés
  const stripped = formSchemas.newsletter.safeParse({ email: "a@b.bj", role: "super_admin" });
  assert.ok(stripped.success && !("role" in stripped.data));
});
