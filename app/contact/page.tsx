import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Todo } from "@/components/ui/Todo";
import { ContactForm } from "@/components/forms/forms";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez le secrétariat du Bureau Exécutif National du Sénat des Jeunes du Bénin.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        crumbs={[{ label: "Contact" }]}
        title="Écrivez-nous"
        lede="Une question, une proposition, une demande d'information : le secrétariat du Bureau Exécutif National vous répond."
      />
      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="Coordonnées officielles" title="Nous joindre" />
            <dl className="mt-12 space-y-8">
              {[
                ["Siège", <>{site.seat}</>],
                ["Adresse", site.contact.address ?? <Todo what="adresse physique" />],
                ["Courriel", site.contact.email ? <a className="underline decoration-gold-400 underline-offset-4" href={`mailto:${site.contact.email}`}>{site.contact.email}</a> : <Todo what="courriel officiel" />],
                ["Téléphone", site.contact.phones.length ? site.contact.phones.join(" · ") : <Todo what="numéros officiels" />],
              ].map(([k, v], i) => (
                <Reveal key={String(k)} delay={i * 80}>
                  <dt className="font-display text-[0.68rem] uppercase tracking-[0.28em] text-gold-600">{k}</dt>
                  <dd className="mt-2 font-serif text-2xl text-green-900">{v}</dd>
                </Reveal>
              ))}
            </dl>
          </div>
          <Reveal>
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
