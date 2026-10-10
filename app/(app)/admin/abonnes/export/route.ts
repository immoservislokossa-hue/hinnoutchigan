import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { isLeadershipRole } from "@/lib/roles";

export const dynamic = "force-dynamic";

const csv = (v: string) => `"${v.replace(/"/g, '""')}"`;
/** Neutralise l'injection de formules dans les tableurs. */
const safe = (v: string) => (/^[=+\-@\t\r]/.test(v) ? `'${v}` : v);

export async function GET() {
  const { profile } = await getSession();
  if (!profile || profile.status !== "active" || !isLeadershipRole(profile.role)) return new NextResponse("Non autorisé", { status: 401 });
  const supabase = await createClient();
  const { data } = await supabase.from("newsletter_subscribers").select("email,source,created_at").is("unsubscribed_at", null).order("created_at", { ascending: false }).limit(50000);
  const lines = ["email,source,date_inscription", ...(data ?? []).map((r) => [csv(safe(String(r.email))), csv(String(r.source)), csv(String(r.created_at))].join(","))];
  return new NextResponse("﻿" + lines.join("\r\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="abonnes-sjb-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
