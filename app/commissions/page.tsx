import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { commissions } from "@/content/structure";

export const metadata: Metadata = {
  title: "Commissions techniques permanentes",
  description: "Les cinq commissions techniques permanentes du Sénat des Jeunes du Bénin : lois et droits humains, finances, emploi, éducation et relations extérieures.",
  alternates: { canonical: "/commissions" },
};

export default function CommissionsPage() {
  return (
    <>
      <PageHero
        eyebrow="Commissions"
        crumbs={[{ label: "Le Sénat", href: "/le-senat" }, { label: "Commissions" }]}
        title="Cinq commissions pour travailler en profondeur"
        lede="Nommées par le Bureau Exécutif National, les commissions techniques permanentes préparent les travaux du SJB."
      />
      <section className="section-y">
        <div className="container-sjb">
          <ol className="grid gap-px border border-cream-300 bg-cream-300 md:grid-cols-2">
            {commissions.map((c, i) => (
              <Reveal as="li" key={c.n} delay={(i % 2) * 90} className={`group bg-cream-50 p-10 transition-colors duration-500 hover:bg-green-800 ${i === 4 ? "md:col-span-2" : ""}`}>
                <p className="font-display text-5xl font-semibold text-gold-500 transition-colors group-hover:text-gold-300">{c.n}</p>
                <h2 className="h-display mt-6 text-2xl text-green-900 transition-colors group-hover:text-cream-50">{c.name}</h2>
              </Reveal>
            ))}
          </ol>
          <Reveal className="prose-sjb mx-auto mt-20 max-w-3xl">
            <p>
              L&apos;inscription dans une commission est <strong>obligatoire pour tous les membres adhérents engagés</strong>, à
              l&apos;exception des membres du BEN. Elle constitue l&apos;un des critères de l&apos;Indice d&apos;Engagement. Chaque
              commission élit un bureau de trois membres : Président, Secrétaire et Rapporteur. Des commissions spéciales peuvent être
              créées par le BEN sur des questions ponctuelles.
            </p>
          </Reveal>
          <Reveal className="mt-10 text-center">
            <ButtonLink href="/rejoindre">Devenir membre</ButtonLink>
          </Reveal>
        </div>
      </section>
    </>
  );
}
