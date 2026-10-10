import { EmptyState, PageHeader } from "@/components/admin/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate } from "@/lib/data";

export const metadata = { title: "Documents" };

export default async function DocumentsSpacePage() {
  await requireUser("/espace/documents");
  const supabase = await createClient();
  // La RLS ne renvoie que les documents que ce compte a le droit de voir
  const { data } = await supabase.from("documents").select("id,title,kind,reference,doc_date,visibility,file_path").order("created_at", { ascending: false }).limit(200);
  const labels: Record<string, string> = { public: "Public", members: "Membres", ben: "BEN" };
  return (
    <>
      <PageHeader title="Documents" description="Documents officiels et internes accessibles à votre compte." />
      {!data || data.length === 0 ? (
        <EmptyState>Aucun document disponible.</EmptyState>
      ) : (
        <ul className="divide-y divide-cream-300 rounded-3xl border border-cream-300">
          {data.map((d) => {
            const isPublicPath = (d.file_path as string).startsWith("/") || /^https?:/.test(d.file_path as string);
            const href = isPublicPath ? (d.file_path as string) : `/espace/fichier/${d.id}`;
            return (
              <li key={d.id as string} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="font-semibold text-green-900">{d.title as string}</p>
                  <p className="text-xs text-ink-mute">{[d.kind, d.reference, d.doc_date ? formatDate(d.doc_date as string) : null, labels[d.visibility as string]].filter(Boolean).join(" · ")}</p>
                </div>
                <a href={href} target="_blank" rel="noopener noreferrer" className="link-arrow">Ouvrir</a>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
