import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Todo } from "@/components/ui/Todo";
import { ButtonLink } from "@/components/ui/Button";
import { departments, teamPosts } from "@/content/structure";
import { getEvents, getLeadership, getNews, normalizePost } from "@/lib/data";

type Params = { slug: string };

export function generateStaticParams() {
  return departments.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const d = departments.find((x) => x.slug === slug);
  if (!d) return {};
  return {
    title: `Département ${d.name} · Territoires`,
    description: `La coordination départementale du ${d.name} (chef-lieu : ${d.seat}) du Sénat des Jeunes du Bénin : ${d.communes.length} commune${d.communes.length > 1 ? "s" : ""}.`,
    alternates: { canonical: `/territoires/${d.slug}` },
  };
}

export default async function DepartmentPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const index = departments.findIndex((x) => x.slug === slug);
  if (index === -1) notFound();
  const d = departments[index];
  const [leaders, deptNews, deptEvents] = await Promise.all([
    getLeadership(`dept:${d.slug}`),
    getNews({ department: d.slug, limit: 4 }),
    getEvents({ department: d.slug, upcomingOnly: true }),
  ]);
  const byPost = new Map(leaders.map((l) => [normalizePost(l.post), l]));
  const prev = departments[(index + departments.length - 1) % departments.length];
  const next = departments[(index + 1) % departments.length];

  return (
    <>
      <PageHero
        eyebrow={`Région ${d.region}`}
        crumbs={[{ label: "Territoires", href: "/territoires" }, { label: d.name }]}
        title={`Coordination départementale ${d.of}`}
        lede={`Chef-lieu : ${d.seat}. ${d.communes.length} commune${d.communes.length > 1 ? "s" : ""} couverte${d.communes.length > 1 ? "s" : ""} par les sections communales du SJB.`}
      />

      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.4fr] lg:gap-24">
          <div>
            <SectionHeading eyebrow="Responsables" title="L'équipe de la coordination" />
            <Reveal delay={150} className="prose-sjb mt-8">
              <p>
                Le Président de la coordination départementale est le visage du SJB dans son département : il représente l&apos;association
                auprès du Préfet, des responsables des sections communales et des partenaires, et rend compte chaque mois à la
                coordination régionale.
              </p>
              {leaders.length === 0 && (
                <p>
                  <Todo what={`noms des responsables du département ${d.name}`} />
                </p>
              )}
            </Reveal>
          </div>
          <ol className="grid gap-px border border-cream-300 bg-cream-300 sm:grid-cols-2">
            {teamPosts.map((p, i) => (
              <Reveal as="li" key={p} delay={(i % 2) * 70} className="flex items-start gap-4 bg-cream-50 p-5">
                <span className="font-display text-sm font-semibold text-gold-600">{String(i + 1).padStart(2, "0")}</span>
                <span>
                  <span className="block font-semibold leading-snug text-green-900">{p}</span>
                  {byPost.get(normalizePost(p)) && <span className="mt-0.5 block text-sm text-ink-soft">{byPost.get(normalizePost(p))?.name}</span>}
                </span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-cream-300 section-y">
        <div className="container-sjb">
          <SectionHeading eyebrow="Sections communales" title={`${d.communes.length} commune${d.communes.length > 1 ? "s" : ""}, ${d.communes.length} section${d.communes.length > 1 ? "s" : ""} communale${d.communes.length > 1 ? "s" : ""}`} />
          <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {d.communes.map((c, i) => (
              <Reveal as="li" key={c} delay={(i % 3) * 80}>
                <div className="card-lux flex items-center justify-between p-6">
                  <span className="h-display text-lg text-green-900">{c}</span>
                  {c === d.seat && <span className="font-display text-xs uppercase tracking-[0.1em] text-green-700">Chef-lieu</span>}
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-sjb">
          <div className="grid gap-5 md:grid-cols-2">
            <Reveal>
              <div className="card-lux h-full p-6 sm:p-9">
                <h2 className="h-display text-xl text-green-900">Actualités du département</h2>
                {deptNews.length ? (
                  <ul className="mt-5 space-y-4">
                    {deptNews.map((n) => (
                      <li key={n.slug}>
                        <Link href={`/actualites/${n.slug}`} className="link-arrow">
                          {n.title}
                        </Link>
                        <p className="mt-1 text-sm text-ink-mute">{n.date}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4">
                    <Todo what={`actualités du département ${d.name}`} />
                  </p>
                )}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="card-lux h-full p-6 sm:p-9">
                <h2 className="h-display text-xl text-green-900">Activités à venir</h2>
                {deptEvents.length ? (
                  <ul className="mt-5 space-y-4">
                    {deptEvents.map((e) => (
                      <li key={e.id}>
                        <p className="font-semibold text-green-900">{e.title}</p>
                        <p className="text-sm capitalize text-ink-mute">{e.when}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-4">
                    <Todo what={`activités du département ${d.name}`} />
                  </p>
                )}
              </div>
            </Reveal>
          </div>

          <nav aria-label="Départements voisins" className="mt-20 flex flex-wrap items-center justify-between gap-6 border-t border-cream-300 pt-10">
            <Link href={`/territoires/${prev.slug}`} className="link-arrow">
              ← {prev.name}
            </Link>
            <ButtonLink href="/territoires" variant="outline-dark" arrow={false}>
              Tous les territoires
            </ButtonLink>
            <Link href={`/territoires/${next.slug}`} className="link-arrow">
              {next.name} →
            </Link>
          </nav>
        </div>
      </section>
    </>
  );
}
