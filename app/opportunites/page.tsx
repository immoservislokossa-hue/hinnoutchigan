import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

export const metadata: Metadata = {
  title: "Opportunités · Bientôt disponible",
  description: "Emplois, stages, formations, bourses, concours et appels à projets pour les jeunes : le portail d'opportunités du SJB arrive bientôt.",
  alternates: { canonical: "/opportunites" },
};

const categories = ["Emplois", "Stages", "Formations", "Bourses", "Concours", "Appels à projets", "Entrepreneuriat", "Bénévolat", "Événements"];

export default function OpportunitesPage() {
  return (
    <>
      <PageHero
        eyebrow="Opportunités"
        crumbs={[{ label: "Opportunités" }]}
        title="Un portail d'opportunités pour les jeunes"
        lede="Bientôt disponible : trouvez emplois, formations, bourses et appels à candidatures, filtrés par département et par domaine."
      />
      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="Ce qui arrive" title="Neuf catégories pour avancer" />
            <ul className="mt-12 flex flex-wrap gap-3">
              {categories.map((c, i) => (
                <Reveal as="li" key={c} delay={(i % 5) * 70}>
                  <span className="block border border-gold-400/70 px-5 py-3 font-display text-[0.7rem] uppercase tracking-[0.2em] text-green-800">{c}</span>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal>
            <div className="surface-dark on-dark p-10">
              <p className="eyebrow on-dark">Être prévenu</p>
              <h2 className="h-display mt-5 text-2xl text-cream-50">Soyez averti au lancement</h2>
              <p className="mt-4 text-cream-100/75">Laissez votre adresse e-mail : nous vous écrirons dès l&apos;ouverture du portail.</p>
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
