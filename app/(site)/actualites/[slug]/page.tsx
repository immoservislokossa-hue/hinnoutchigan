import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { news } from "@/content/structure";

type Params = { slug: string };

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const n = news.find((x) => x.slug === slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.excerpt,
    alternates: { canonical: `/actualites/${n.slug}` },
    openGraph: { type: "article", publishedTime: n.iso, title: n.title, description: n.excerpt },
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const n = news.find((x) => x.slug === slug);
  if (!n) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: n.title,
    datePublished: n.iso,
    description: n.excerpt,
    publisher: { "@type": "Organization", name: "Sénat des Jeunes du Bénin" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow={`${n.category} · ${n.date}`}
        crumbs={[{ label: "Actualités", href: "/actualites" }, { label: "Article" }]}
        title={n.title}
      />
      <article className="section-y">
        <div className="container-sjb">
          <Reveal className="prose-sjb mx-auto max-w-3xl text-lg">
            <p className="lede !text-ink">{n.excerpt}</p>
            {n.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
          <div className="mx-auto mt-14 flex max-w-3xl flex-wrap items-center justify-between gap-6 border-t border-cream-300 pt-10">
            <Link href="/actualites" className="link-arrow">
              ← Toutes les actualités
            </Link>
            {n.doc && (
              <ButtonLink href={n.doc} variant="outline-dark" small>
                Télécharger le document
              </ButtonLink>
            )}
          </div>
        </div>
      </article>
    </>
  );
}
