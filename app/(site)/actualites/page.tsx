import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Todo } from "@/components/ui/Todo";
import { news } from "@/content/structure";

export const metadata: Metadata = {
  title: "Actualités & communiqués",
  description: "Communiqués, décrets et comptes rendus officiels du Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/actualites" },
};

export default function ActualitesPage() {
  const sorted = [...news].sort((a, b) => b.iso.localeCompare(a.iso));
  return (
    <>
      <PageHero
        eyebrow="Actualités"
        crumbs={[{ label: "Actualités" }]}
        title="Communiqués et actualités du SJB"
        lede="Les décisions, textes et rendez-vous qui rythment la vie du Sénat des Jeunes du Bénin."
      />
      <section className="section-y">
        <div className="container-sjb">
          <ul className="grid gap-8 md:grid-cols-2">
            {sorted.map((n, i) => (
              <Reveal as="li" key={n.slug} delay={(i % 2) * 120}>
                <Link href={`/actualites/${n.slug}`} className="card-lux group block h-full p-10">
                  <p className="flex flex-wrap items-center gap-4 font-display text-xs uppercase tracking-[0.1em] text-gold-600">
                    <span>{n.category}</span>
                    <span className="h-px w-8 bg-gold-400" />
                    <time dateTime={n.iso}>{n.date}</time>
                  </p>
                  <h2 className="h-display mt-5 text-2xl leading-snug text-green-900">{n.title}</h2>
                  <p className="mt-4 text-ink-soft">{n.excerpt}</p>
                  <span className="link-arrow mt-8">
                    <span>Lire l&apos;article</span>
                    <span className="btn-arrow" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mx-auto mt-20 max-w-2xl border border-dashed border-cream-300 p-8 text-center">
            <p className="font-serif text-xl text-ink-soft">
              Les prochaines publications du Bureau Exécutif National apparaîtront ici. <Todo what="premiers articles et communiqués" />
            </p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
