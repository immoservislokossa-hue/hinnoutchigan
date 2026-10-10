import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { Todo } from "@/components/ui/Todo";
import { PressForm } from "@/components/forms/forms";
import { keyFigures } from "@/content/structure";
import { site } from "@/content/site";
import { getSiteSettings } from "@/lib/data";

export const metadata: Metadata = {
  title: "Presse · Kit média",
  description: "Logo officiel, présentation, chiffres clés et contact presse du Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/presse" },
};

export default async function PressePage() {
  const cfg = await getSiteSettings();
  return (
    <>
      <PageHero
        eyebrow="Presse"
        crumbs={[{ label: "Actualités", href: "/actualites" }, { label: "Presse" }]}
        title="Kit média"
        lede="Tout ce qu'il faut aux journalistes et partenaires pour présenter le SJB fidèlement."
      />
      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <Reveal>
            <div className="relative mx-auto max-w-sm p-5">
              <span aria-hidden="true" className="absolute inset-0 border border-gold-400" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.jpg" alt="Logo officiel du Sénat des Jeunes du Bénin" width={680} height={708} className="relative h-auto w-full bg-white p-2" />
            </div>
            <div className="mt-8 text-center">
              <ButtonLink href="/logo.jpg" variant="outline-dark" small download>
                Télécharger le logo
              </ButtonLink>
              <p className="mx-auto mt-5 max-w-xs text-xs text-ink-mute">
                Le logo ne peut être modifié sans validation de l&apos;Assemblée Plénière (art. 6.2 des statuts).
              </p>
            </div>
          </Reveal>

          <div>
            <SectionHeading eyebrow="À propos" title="Présentation en bref" />
            <Reveal delay={120} className="prose-sjb mt-8">
              <p>
                Le Sénat des Jeunes du Bénin (SJB) est une association de droit béninois à but non lucratif, fondée sur la démocratie
                participative, le développement humain intégral et le panafricanisme civique. Son siège est à Parakou. Il est membre
                fondateur du Sénat des Jeunes d&apos;Afrique.
              </p>
              <p>Devise : « {site.motto} ».</p>
            </Reveal>
            <dl className="mt-10 grid grid-cols-2 gap-px bg-cream-300 sm:grid-cols-4">
              {keyFigures.map((f) => (
                <div key={f.label} className="flex flex-col-reverse bg-cream-50 p-5 text-center">
                  <dt className="mt-1 font-display text-xs uppercase tracking-[0.2em] text-ink-mute">{f.label}</dt>
                  <dd className="font-display text-3xl font-semibold text-green-800">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-10 text-ink-soft">
              Contact presse : {cfg.press.contact ?? <Todo what="nom, courriel et téléphone du responsable communication" />}
            </p>
            <p className="mt-3 text-sm text-ink-mute">
              Les prises de parole publiques au nom du SJB sont réservées aux responsables de la communication habilités.
            </p>
          </div>
        </div>
      </section>
      <section className="section-y border-t border-cream-300">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.3fr] lg:gap-24">
          <SectionHeading eyebrow="Demande média" title="Interview, accréditation, information" />
          <Reveal>
            <PressForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
