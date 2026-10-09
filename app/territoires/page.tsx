import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { InteractiveMap } from "@/components/home/InteractiveMap";
import { departments, keyFigures, regions } from "@/content/structure";

export const metadata: Metadata = {
  title: "Territoires · Régions, départements et communes",
  description:
    "Le SJB couvre six régions, douze départements, soixante-dix-sept communes et cinq cent quarante-six arrondissements du Bénin. Explorez chaque territoire.",
  alternates: { canonical: "/territoires" },
};

export default function TerritoiresPage() {
  return (
    <>
      <PageHero
        eyebrow="Territoires"
        crumbs={[{ label: "Territoires" }]}
        title="Le SJB, partout au Bénin"
        lede="Des coordinations régionales et départementales, des sections communales et d'arrondissement : une présence au plus près des jeunes."
      />

      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Carte des départements" title="Sélectionnez un département" lede="Disposés selon leur position géographique, du nord au sud." />
          <div className="mt-16">
            <InteractiveMap />
          </div>
        </div>
      </section>

      <section className="border-t border-cream-300 section-y">
        <div className="container-sjb">
          <dl className="grid gap-px bg-cream-300 sm:grid-cols-2 lg:grid-cols-4">
            {keyFigures.map((f) => (
              <div key={f.label} className="bg-white p-10 text-center">
                <dt className="font-display text-xs uppercase tracking-[0.3em] text-ink-soft">{f.label}</dt>
                <dd className="mt-4 font-display text-6xl font-semibold text-green-700">
                  <Counter value={f.value} />
                </dd>
                <p className="mt-3 text-sm text-ink-soft">{f.note}</p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading
            eyebrow="Six coordinations régionales"
            title="Deux départements par région"
            lede="Selon les anciens découpages territoriaux du Bénin, chaque coordination régionale réunit sous sa tutelle deux départements."
          />
          <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regions.map((r, i) => (
              <Reveal as="li" key={r.name} delay={(i % 3) * 100}>
                <article className="card-lux h-full p-9">
                  <p className="font-display text-xs uppercase tracking-[0.1em] text-gold-600">Région {i + 1}</p>
                  <h3 className="h-display mt-4 text-xl text-green-900">{r.name}</h3>
                  <ul className="mt-6 space-y-2">
                    {r.departments.map((slug) => {
                      const d = departments.find((x) => x.slug === slug)!;
                      return (
                        <li key={slug}>
                          <Link href={`/territoires/${slug}`} className="link-arrow">
                            {d.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
