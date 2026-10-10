import Link from "next/link";
import type { CSSProperties } from "react";
import { Briefcase, Handshake, GraduationCap, Globe, HeartPulse, Lightbulb, MessagesSquare, ShieldCheck, Sprout, Users } from "lucide-react";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Orbits } from "@/components/ui/Orbits";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { InteractiveMap } from "@/components/home/InteractiveMap";
import { ChainScroller } from "@/components/home/ChainScroller";
import { actions, keyFigures, pillars, subGroups } from "@/content/structure";
import { getNews } from "@/lib/data";
import { site } from "@/content/site";

const actionIcons = {
  "academie-citoyenne": GraduationCap,
  "paix-cohesion": Handshake,
  "education-emploi": Briefcase,
  "sante-social": HeartPulse,
  "projets-partenariats": Lightbulb,
  plaidoyer: MessagesSquare,
} as const;

const pillarIcons = [Users, Sprout, Globe];

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default async function HomePage() {
  const news = await getNews({ limit: 2 });
  return (
    <>
      {/* ---------- Hero centré ---------- */}
      <section className="relative flex min-h-[100svh] flex-col overflow-hidden bg-white pt-[var(--header-h)]">
        <Orbits className="left-1/2 top-[46%] h-0 w-0" scale={0.9} />
        <div className="container-sjb relative flex flex-1 flex-col items-center justify-center py-16 text-center">
          <span
            className="hero-rise inline-flex max-w-full items-center gap-2.5 rounded-full border border-cream-300 bg-white px-4 py-1.5 text-center text-[0.8rem] font-medium leading-snug text-green-800 shadow-sm sm:text-sm"
            style={d(0)}
          >
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold-400" />
            République du Bénin · Association de jeunesse
          </span>

          <h1 className="h-display mt-9 text-[clamp(2.25rem,10.5vw,7.25rem)] leading-[1] text-green-900">
            <span className="mask-line">
              <span style={d(120)}>Toujours là,</span>
            </span>
            <span className="mask-line">
              <span style={d(260)}>
                <span className="bg-[linear-gradient(transparent_72%,var(--color-gold-300)_72%,var(--color-gold-300)_94%,transparent_94%)] px-2">
                  tel le soleil.
                </span>
              </span>
            </span>
          </h1>

          <p className="lede hero-rise mx-auto mt-9 max-w-2xl" style={d(520)}>
            Le Sénat des Jeunes du Bénin est une école d&apos;engagement, de formation et d&apos;action : une voix, un cadre et des
            responsabilités pour chaque jeune qui veut servir son pays.
          </p>

          <div className="hero-rise mt-10 flex w-full max-w-sm flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4" style={d(680)}>
            <ButtonLink href="/rejoindre" variant="gold">
              Rejoindre le SJB
            </ButtonLink>
            <ButtonLink href="/le-senat" variant="outline-dark">
              Découvrir le Sénat
            </ButtonLink>
          </div>
        </div>

        <div className="container-sjb relative pb-10">
          <dl className="hero-rise mx-auto grid max-w-4xl grid-cols-2 rounded-3xl border border-cream-300 bg-white shadow-[0_18px_40px_-28px_rgb(8_38_19/0.35)] sm:grid-cols-4" style={d(840)}>
            {keyFigures.map((f, i) => (
              <div key={f.label} className={`px-4 py-6 text-center ${i % 2 ? "border-l border-cream-300" : ""} ${i > 1 ? "border-t border-cream-300 sm:border-t-0" : ""} ${i > 0 ? "sm:border-l sm:border-cream-300" : ""}`}>
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-display text-4xl font-semibold tracking-tight text-green-800 sm:text-5xl">
                    <Counter value={f.value} />
                  </span>
                  <span className="mt-1 block text-sm text-ink-mute">{f.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Bandeau typographique ---------- */}
      <div className="marquee overflow-hidden border-y border-cream-300 bg-white py-8" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center">
              {["Démocratie participative", "Développement humain intégral", "Panafricanisme civique", site.motto].map((t) => (
                <li key={t + k} className="flex items-center">
                  <span className="outline-text px-8 font-display text-6xl font-bold tracking-tight sm:text-7xl">{t}</span>
                  <span className="h-3 w-3 rounded-full bg-gold-400" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ---------- Mission (bento) ---------- */}
      <section className="section-y">
        <div className="container-sjb">
          <SectionHeading
            align="center"
            eyebrow="Notre mission"
            title="Une école d'engagement au service de la jeunesse béninoise"
          />
          <div className="mt-16 grid gap-5 md:grid-cols-3">
            <Reveal className="md:col-span-2">
              <div className="flex h-full flex-col justify-between rounded-3xl border border-cream-300 bg-green-50 p-9 sm:p-12">
                <p className="font-display text-[1.4rem] font-medium leading-snug tracking-tight text-green-900 sm:text-4xl">
                  Un Bénin où chaque jeune, quelle que soit son origine ou sa condition sociale, dispose des ressources, des compétences
                  et des espaces pour contribuer pleinement au développement national.
                </p>
                <div className="mt-10">
                  <TextLink href="/le-senat">Lire notre vision</TextLink>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="flex h-full flex-col justify-between rounded-3xl border border-cream-300 p-9">
                <ShieldCheck className="h-9 w-9 text-green-700" strokeWidth={1.6} aria-hidden="true" />
                <div className="mt-10">
                  <p className="font-display text-2xl font-semibold tracking-tight text-green-900">Sans prise de position partisane</p>
                  <p className="mt-3 text-ink-soft">Association à but non lucratif, régie par la loi n° 2025-19.</p>
                </div>
              </div>
            </Reveal>
            {pillars.map((p, i) => {
              const Icon = pillarIcons[i];
              return (
                <Reveal key={p.title} delay={i * 100}>
                  <article className="card-lux h-full p-9">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-green-700">
                      <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
                    </span>
                    <h3 className="h-display mt-7 text-2xl text-green-900">{p.title}</h3>
                    <p className="mt-3 text-ink-soft">{p.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------- Du terrain à la nation ---------- */}
      <section className="border-t border-cream-300 pt-[clamp(4rem,8vw,7.5rem)]">
        <div className="container-sjb">
          <SectionHeading
            align="center"
            eyebrow="Une présence nationale"
            title="De l'arrondissement à la nation"
            lede="Cinq échelons coordonnés, du terrain jusqu'au Bureau Exécutif National. Faites défiler pour les remonter un par un."
          />
          <div className="mt-12 md:mt-4">
            <ChainScroller />
          </div>
          <div className="pb-[clamp(4rem,8vw,7rem)] text-center md:pt-4">
            <ButtonLink href="/organisation" variant="outline-dark">
              Voir l&apos;organisation complète
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ---------- Territoires ---------- */}
      <section className="section-y border-t border-cream-300">
        <div className="container-sjb">
          <SectionHeading
            align="center"
            eyebrow="Territoires"
            title="Douze départements, soixante-dix-sept communes"
            lede="Touchez ou survolez un département pour découvrir ses communes et sa coordination."
          />
          <div className="mt-16">
            <InteractiveMap />
          </div>
        </div>
      </section>

      {/* ---------- Actions ---------- */}
      <section className="section-y border-t border-cream-300">
        <div className="container-sjb">
          <SectionHeading align="center" eyebrow="Actions & projets" title="Agir pour et avec la jeunesse" />
          <ul className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {actions.map((a, i) => {
              const Icon = actionIcons[a.slug as keyof typeof actionIcons] ?? Lightbulb;
              return (
                <Reveal as="li" key={a.slug} delay={(i % 3) * 90}>
                  <article className="card-lux h-full p-8">
                    <div className="flex items-center justify-between">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-green-50 text-green-700">
                        <Icon className="h-6 w-6" strokeWidth={1.7} aria-hidden="true" />
                      </span>
                      <span className="rounded-full bg-cream-100 px-3 py-1 text-xs font-medium text-ink-mute">{a.tag}</span>
                    </div>
                    <h3 className="h-display mt-7 text-2xl text-green-900">{a.title}</h3>
                    <p className="mt-3 text-[0.97rem] text-ink-soft">{a.text}</p>
                  </article>
                </Reveal>
              );
            })}
          </ul>
          <div className="mt-12 text-center">
            <TextLink href="/actions">Toutes les actions</TextLink>
          </div>
        </div>
      </section>

      {/* ---------- Trois générations ---------- */}
      <section className="section-y border-t border-cream-300">
        <div className="container-sjb">
          <SectionHeading
            align="center"
            eyebrow="Trois générations, une seule maison"
            title="Chaque âge a sa place et son rôle"
          />
          <ul className="mt-16 grid gap-5 md:grid-cols-3">
            {subGroups.map((g, i) => (
              <Reveal as="li" key={g.code} delay={i * 110}>
                <article className="card-lux flex h-full flex-col p-9">
                  <p className="outline-text font-display text-7xl font-bold tracking-tight">{g.code}</p>
                  <p className="mt-4 inline-flex w-fit rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-800">{g.ages}</p>
                  <h3 className="h-display mt-6 text-xl text-green-900">{g.name}</h3>
                  <p className="mt-3 flex-1 text-[0.97rem] text-ink-soft">{g.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <TextLink href="/sous-groupes">En savoir plus sur les sous-groupes</TextLink>
          </div>
        </div>
      </section>

      {/* ---------- Actualités ---------- */}
      <section className="section-y border-t border-cream-300">
        <div className="container-sjb">
          <SectionHeading align="center" eyebrow="À la une" title="Actualités & communiqués" />
          <ul className="mt-16 grid gap-5 md:grid-cols-2">
            {news.map((n, i) => (
              <Reveal as="li" key={n.slug} delay={i * 110}>
                <Link href={`/actualites/${n.slug}`} className="card-lux group block h-full p-9 sm:p-10">
                  <p className="flex items-center gap-3 text-sm text-ink-mute">
                    <span className="rounded-full bg-green-50 px-3 py-1 font-medium text-green-800">{n.category}</span>
                    <time dateTime={n.iso}>{n.date}</time>
                  </p>
                  <h3 className="h-display mt-6 text-2xl leading-snug text-green-900 sm:text-3xl">{n.title}</h3>
                  <p className="mt-4 text-ink-soft">{n.excerpt}</p>
                  <span className="link-arrow mt-8">
                    <span>Lire</span>
                    <span className="btn-arrow" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
          <div className="mt-12 text-center">
            <TextLink href="/actualites">Toutes les actualités</TextLink>
          </div>
        </div>
      </section>

      {/* ---------- Rejoindre ---------- */}
      <section className="section-y border-t border-cream-300">
        <div className="container-sjb">
          <SectionHeading
            align="center"
            eyebrow="Passez à l'action"
            title="Votre place est parmi nous"
            lede="Adhérer, vous engager ou construire un partenariat : trois chemins pour servir ensemble la jeunesse béninoise."
          />
          <ul className="mt-16 grid gap-5 md:grid-cols-3">
            {[
              { t: "Devenir membre", d: "Déposez votre demande d'adhésion et entrez dans l'école d'engagement du SJB.", h: "/rejoindre", b: "Adhérer", v: "gold" as const },
              { t: "Je veux m'engager", d: "Bénévole, formateur, expert ou porteur de projet : proposez vos talents.", h: "/engagement", b: "M'engager", v: "primary" as const },
              { t: "Devenir partenaire", d: "Institutions, entreprises, ONG : construisons une convention utile à la jeunesse.", h: "/partenaires", b: "Collaborer", v: "outline-dark" as const },
            ].map((c, i) => (
              <Reveal as="li" key={c.t} delay={i * 110}>
                <div className="card-lux flex h-full flex-col p-9">
                  <h3 className="h-display text-2xl text-green-900">{c.t}</h3>
                  <p className="mt-3 flex-1 text-ink-soft">{c.d}</p>
                  <div className="mt-8">
                    <ButtonLink href={c.h} variant={c.v} small>
                      {c.b}
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-20 text-center">
            <p className="h-display text-3xl text-green-800 sm:text-4xl">{site.motto}.</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
