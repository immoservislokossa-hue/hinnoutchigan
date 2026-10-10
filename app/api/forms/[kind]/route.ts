import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { formSchemas, isFormKind } from "@/lib/forms-schema";
import { createAdminClient, hasServiceRole } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY = 24_000;
const WINDOW_MS = 10 * 60_000;
const MAX_PER_WINDOW = 5;
const MAX_PER_DAY = 25;

const json = (body: Record<string, unknown>, status = 200) =>
  NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });

function clientIp(req: Request) {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}

function hashIp(ip: string) {
  const salt = process.env.FORMS_HASH_SALT ?? process.env.SUPABASE_SERVICE_ROLE_KEY?.slice(-24) ?? "sjb";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 40);
}

export async function POST(req: Request, ctx: { params: Promise<{ kind: string }> }) {
  const { kind } = await ctx.params;
  if (!isFormKind(kind)) return json({ error: "unknown_form" }, 404);

  // Même origine uniquement (anti-CSRF pour une API JSON publique)
  const origin = req.headers.get("origin");
  if (origin) {
    try {
      if (new URL(origin).host !== req.headers.get("host")) return json({ error: "forbidden" }, 403);
    } catch {
      return json({ error: "forbidden" }, 403);
    }
  }
  if (!(req.headers.get("content-type") ?? "").includes("application/json")) return json({ error: "bad_request" }, 415);
  if (Number(req.headers.get("content-length") ?? 0) > MAX_BODY) return json({ error: "too_large" }, 413);

  let raw: unknown;
  try {
    const text = await req.text();
    if (text.length > MAX_BODY) return json({ error: "too_large" }, 413);
    raw = JSON.parse(text);
  } catch {
    return json({ error: "bad_request" }, 400);
  }
  const payload = (raw as { payload?: Record<string, unknown> })?.payload;
  if (!payload || typeof payload !== "object") return json({ error: "bad_request" }, 400);

  // Piège à robots : réponse positive sans rien enregistrer
  if (typeof payload.website === "string" && payload.website.trim()) return json({ ok: true });

  const parsed = formSchemas[kind].safeParse(payload);
  if (!parsed.success) {
    return json({ error: "invalid", fields: parsed.error.issues.map((i) => String(i.path[0] ?? "")) }, 400);
  }

  if (!hasServiceRole()) return json({ error: "not_configured" }, 503);

  const db = createAdminClient();
  const ipHash = hashIp(clientIp(req));
  const table = kind === "newsletter" ? "newsletter_subscribers" : "form_submissions";

  // Limitation de débit par adresse IP (hachée)
  const since = (ms: number) => new Date(Date.now() - ms).toISOString();
  const [recent, daily] = await Promise.all([
    db.from(table).select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since(WINDOW_MS)),
    db.from(table).select("id", { count: "exact", head: true }).eq("ip_hash", ipHash).gte("created_at", since(86_400_000)),
  ]);
  if ((recent.count ?? 0) >= MAX_PER_WINDOW || (daily.count ?? 0) >= MAX_PER_DAY) return json({ error: "rate_limited" }, 429);

  if (kind === "newsletter") {
    const { email } = parsed.data as { email: string };
    const { error } = await db.from("newsletter_subscribers").insert({ email, ip_hash: ipHash, source: "site" });
    // 23505 : déjà inscrit — on répond positivement (pas d'énumération des abonnés)
    if (error && error.code !== "23505") return json({ error: "server_error" }, 500);
    return json({ ok: true });
  }

  const { error } = await db.from("form_submissions").insert({
    kind,
    payload: parsed.data,
    ip_hash: ipHash,
    user_agent: (req.headers.get("user-agent") ?? "").slice(0, 300),
  });
  if (error) return json({ error: "server_error" }, 500);
  return json({ ok: true });
}
