import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Todo } from "@/components/ui/Todo";
import { statutoryCalendar } from "@/content/structure";

export const metadata: Metadata = {
  title: "Agenda · Sessions et rendez-vous",
  description: "Assemblées plénières, réunions du Bureau Exécutif National et temps forts statutaires du Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/agenda" },
};

export default function AgendaPage() {
  return (
    <>
      <PageHero
        eyebrow="Agenda"
        crumbs={[{ label: "Actualités", href: "/actualites" }, { label: "Agenda" }]}
        title="Les rendez-vous du SJB"
        lede="Assemblées, sessions et temps forts : le calendrier statutaire de la vie de l'association."
      />

      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Prochaines dates" title="À venir" />
          <Reveal className="mt-12 border border-dashed border-cream-300 bg-cream-100 p-10 text-center">
            <p className="font-serif text-2xl text-ink-soft">
              Aucune date publiée pour le moment. <Todo what="prochaine Assemblée Plénière et événements" />
            </p>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-cream-300 section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Calendrier statutaire" title="Un rythme défini par les statuts" lede="Fréquences et délais fixés par les textes fondamentaux et le décret du 17 août 2026." />
          <ul className="mt-16 divide-y divide-cream-300 border-y border-cream-300">
            {statutoryCalendar.map((c, i) => (
              <Reveal as="li" key={c.title} delay={(i % 3) * 60} className="grid gap-4 py-8 md:grid-cols-[14rem_1fr_1.4fr] md:items-baseline md:gap-10">
                <p className="font-display text-xs uppercase tracking-[0.1em] text-green-700">{c.freq}</p>
                <h3 className="h-display text-lg text-green-900">{c.title}</h3>
                <p className="text-ink-soft">{c.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
