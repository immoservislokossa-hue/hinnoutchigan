import { EmptyState, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/data";

export const metadata = { title: "Annonces" };

export default async function AnnouncementsPage() {
  await requireUser("/espace/annonces");
  const supabase = await createClient();
  const { data } = await supabase.from("announcements").select("id,title,body,published_at").order("published_at", { ascending: false }).limit(50);
  return (
    <>
      <PageHeader title="Annonces" description="Messages du Bureau Exécutif National et du secrétariat." />
      {!data || data.length === 0 ? (
        <EmptyState>Aucune annonce.</EmptyState>
      ) : (
        <ul className="space-y-4">
          {data.map((a) => (
            <li key={a.id as string} className="rounded-3xl border border-cream-300 p-5 sm:p-7">
              <p className="text-xs text-ink-mute">{formatDate(a.published_at as string)}</p>
              <h2 className="h-display mt-1 text-xl text-green-900">{a.title as string}</h2>
              <p className="mt-3 whitespace-pre-line text-ink-soft">{a.body as string}</p>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
