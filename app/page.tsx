import Link from "next/link";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Counter } from "@/components/ui/Counter";
import { Sunburst } from "@/components/ui/Sunburst";
import { Logo } from "@/components/ui/Logo";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Ornament } from "@/components/ui/Ornament";
import { Cartogram } from "@/components/home/Cartogram";
import { actions, chain, keyFigures, news, pillars, subGroups } from "@/content/structure";
import { site } from "@/content/site";

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="surface-dark on-dark relative flex min-h-[100svh] flex-col overflow-hidden">
        <Sunburst className="absolute -right-[22rem] top-1/2 h-[64rem] w-[64rem] -translate-y-1/2 sm:-right-[14rem] lg:right-[-6rem]" rays={64} />
        <div className="absolute right-[12%] top-1/2 hidden h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-gold-400/10 blur-3xl lg:block" style={{ animation: "sun-breathe 7s ease-in-out infinite" }} />

        <div className="container-sjb relative flex flex-1 items-center pb-16 pt-[calc(var(--header-h)+3rem)] sm:pb-20">
          <div className="grid w-full items-center gap-14 lg:grid-cols-[1.35fr_1fr]">
            <div>
              <span className="eyebrow on-dark hero-rise">République du Bénin · Association de jeunesse</span>
              <h1 className="h-display mt-8 text-[2.6rem] leading-[1.08] text-cream-50 sm:text-6xl lg:text-[4.6rem]">
                <span className="hero-rise block" style={{ "--d": "150ms" } as React.CSSProperties}>
                  Toujours là,
                </span>
                <span
                  className="hero-rise block font-serif font-medium italic tracking-normal text-gold-300"
                  style={{ "--d": "320ms" } as React.CSSProperties}
                >
                  tel le soleil.
                </span>
              </h1>
              <p
                className="lede hero-rise mt-9 max-w-xl !text-cream-100/85"
                style={{ "--d": "520ms" } as React.CSSProperties}
              >
                Le Sénat des Jeunes du Bénin est une école d&apos;engagement, de formation et d&apos;action : une voix, un cadre et
                des responsabilités pour chaque jeune qui veut servir son pays.
              </p>
              <div className="hero-rise mt-11 flex flex-wrap gap-4" style={{ "--d": "720ms" } as React.CSSProperties}>
                <ButtonLink href="/rejoindre" variant="gold">
                  Rejoindre le SJB
                </ButtonLink>
                <ButtonLink href="/le-senat" variant="outline">
                  Découvrir le Sénat
                </ButtonLink>
              </div>
            </div>

            <div className="hero-rise hidden justify-self-center lg:block" style={{ "--d": "600ms" } as React.CSSProperties}>
              <div style={{ animation: "float-y 9s ease-in-out infinite" }}>
                <div className="relative p-3">
                  <span className="absolute inset-0 border border-gold-400/70" aria-hidden="true" />
                  <span className="absolute inset-[7px] border border-gold-400/30" aria-hidden="true" />
                  <div className="relative bg-white p-2 shadow-[0_40px_80px_-30px_rgb(0_0_0/0.6)]">
                    <Logo size={340} priority className="h-auto w-[19rem]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chiffres clés */}
        <div className="relative border-t border-gold-400/30 bg-green-950/55 backdrop-blur-sm">
          <dl className="container-sjb grid grid-cols-2 divide-gold-400/20 sm:grid-cols-4 sm:divide-x">
            {keyFigures.map((f) => (
              <div key={f.label} className="px-2 py-5 text-center sm:px-6 sm:py-7">
                <dt className="sr-only">{f.label}</dt>
                <dd>
                  <span className="block font-display text-3xl font-semibold text-gold-300 sm:text-4xl">
                    <Counter value={f.value} />
                  </span>
                  <span className="mt-1.5 block font-display text-[0.62rem] uppercase tracking-[0.28em] text-cream-100/75">
                    {f.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- Bandeau défilant ---------- */}
      <div className="marquee overflow-hidden border-b border-cream-300 bg-cream-100 py-5" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center">
              {["Démocratie participative", "Développement humain intégral", "Panafricanisme civique", site.motto].map((t) => (
                <li key={t + k} className="flex items-center">
                  <span className="px-10 font-serif text-2xl italic text-green-800">{t}</span>
                  <span className="h-2 w-2 rotate-45 bg-gold-400" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ---------- Mission ---------- */}
      <section className="section-y">
        <div className="container-sjb grid gap-16 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
          <div>
            <SectionHeading
              eyebrow="Notre mission"
              title="Une école d'engagement au service de la jeunesse béninoise"
              lede="Un Bénin où chaque jeune, quelle que soit son origine ou sa condition sociale, dispose des ressources, des compétences et des espaces pour contribuer pleinement au développement national."
            />
            <Reveal delay={260} className="mt-10">
              <TextLink href="/le-senat">Lire notre vision</TextLink>
            </Reveal>
          </div>
          <ol className="space-y-0">
            {pillars.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 120} className="group relative border-t border-cream-300 py-9 first:border-t-0 first:pt-0">
                <div className="flex gap-7">
                  <span className="font-display text-4xl font-semibold text-gold-500/80 transition-colors group-hover:text-gold-500">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="h-display text-xl text-green-900 sm:text-2xl">{p.title}</h3>
                    <p className="mt-3 text-ink-soft">{p.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- Chaîne de commandement ---------- */}
      <section className="section-y bg-cream-100">
        <div className="container-sjb">
          <SectionHeading
            align="center"
            eyebrow="Une présence nationale"
            title="De l'arrondissement à la nation"
            lede="Cinq échelons coordonnés, du terrain jusqu'au Bureau Exécutif National, pour que chaque voix remonte et que chaque décision redescende."
          />
          <ol className="relative mx-auto mt-20 max-w-4xl">
            <span aria-hidden="true" className="absolute bottom-4 left-[1.15rem] top-4 w-px bg-gradient-to-b from-gold-400 via-gold-400/60 to-transparent sm:left-1/2" />
            {[...chain].reverse().map((c, i) => (
              <Reveal
                as="li"
                key={c.level}
                dir={i % 2 === 0 ? "left" : "right"}
                delay={80}
                className={`relative mb-12 pl-14 last:mb-0 sm:w-1/2 sm:pl-0 ${i % 2 === 0 ? "sm:pr-14 sm:text-right" : "sm:ml-auto sm:pl-14"}`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-2 flex h-[2.3rem] w-[2.3rem] items-center justify-center border border-gold-500 bg-cream-50 font-display text-xs font-semibold text-green-800 left-0 ${
                    i % 2 === 0 ? "sm:left-auto sm:-right-[1.15rem]" : "sm:-left-[1.15rem]"
                  }`}
                >
                  {i + 1}
                </span>
                <p className="font-display text-[0.66rem] uppercase tracking-[0.28em] text-gold-600">
                  {c.posts} · {c.count} {c.count > 1 ? "instances" : "instance"}
                </p>
                <h3 className="h-display mt-2 text-xl text-green-900">{c.level}</h3>
                <p className="mt-2 text-ink-soft">{c.text}</p>
              </Reveal>
            ))}
          </ol>
          <Reveal className="mt-16 text-center">
            <ButtonLink href="/organisation" variant="outline-dark">
              Voir l&apos;organisation complète
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/* ---------- Territoires ---------- */}
      <section className="surface-dark on-dark section-y relative overflow-hidden">
        <div className="container-sjb relative grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeading
              dark
              eyebrow="Territoires"
              title="Douze départements, soixante-dix-sept communes"
              lede="Le SJB est organisé pour couvrir l'ensemble du territoire. Sélectionnez un département pour découvrir ses communes et sa coordination."
            />
            <Reveal delay={240} className="mt-10">
              <ButtonLink href="/territoires" variant="gold">
                Explorer les territoires
              </ButtonLink>
            </Reveal>
          </div>
          <Cartogram tone="dark" />
        </div>
      </section>

      {/* ---------- Actions ---------- */}
      <section className="section-y">
        <div className="container-sjb">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading eyebrow="Actions & projets" title="Agir pour et avec la jeunesse" />
            <Reveal>
              <TextLink href="/actions">Toutes les actions</TextLink>
            </Reveal>
          </div>
          <ul className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {actions.slice(0, 6).map((a, i) => (
              <Reveal as="li" key={a.slug} delay={(i % 3) * 110}>
                <article className="card-lux h-full p-8">
                  <p className="font-display text-[0.64rem] uppercase tracking-[0.28em] text-gold-600">{a.tag}</p>
                  <h3 className="h-display mt-4 text-xl text-green-900">{a.title}</h3>
                  <p className="mt-4 text-[0.97rem] text-ink-soft">{a.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Trois générations ---------- */}
      <section className="section-y bg-cream-100">
        <div className="container-sjb">
          <SectionHeading
            align="center"
            eyebrow="Trois générations, une seule maison"
            title="Chaque âge a sa place et son rôle"
            lede="Le SJB organise ses membres en trois sous-groupes complémentaires : apprendre, structurer, transmettre."
          />
          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {subGroups.map((g, i) => (
              <Reveal as="li" key={g.code} delay={i * 130}>
                <article className="card-lux flex h-full flex-col p-9">
                  <p className="font-display text-5xl font-semibold text-gold-500">{g.code}</p>
                  <p className="mt-2 font-display text-[0.66rem] uppercase tracking-[0.25em] text-ink-mute">{g.ages}</p>
                  <h3 className="h-display mt-6 text-lg text-green-900">{g.name}</h3>
                  <p className="mt-4 flex-1 text-[0.97rem] text-ink-soft">{g.text}</p>
                </article>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mt-14 text-center">
            <TextLink href="/sous-groupes">En savoir plus sur les sous-groupes</TextLink>
          </Reveal>
        </div>
      </section>

      {/* ---------- Actualités ---------- */}
      <section className="section-y">
        <div className="container-sjb">
          <div className="flex flex-wrap items-end justify-between gap-8">
            <SectionHeading eyebrow="À la une" title="Actualités & communiqués" />
            <Reveal>
              <TextLink href="/actualites">Toutes les actualités</TextLink>
            </Reveal>
          </div>
          <ul className="mt-16 grid gap-8 md:grid-cols-2">
            {news.map((n, i) => (
              <Reveal as="li" key={n.slug} delay={i * 130}>
                <Link href={`/actualites/${n.slug}`} className="card-lux group block h-full p-9 sm:p-11">
                  <p className="flex items-center gap-4 font-display text-[0.66rem] uppercase tracking-[0.25em] text-gold-600">
                    <span>{n.category}</span>
                    <span className="h-px w-8 bg-gold-400" />
                    <time dateTime={n.iso}>{n.date}</time>
                  </p>
                  <h3 className="h-display mt-5 text-2xl leading-snug text-green-900">{n.title}</h3>
                  <p className="mt-4 text-ink-soft">{n.excerpt}</p>
                  <span className="link-arrow mt-8">
                    <span>Lire</span>
                    <span className="btn-arrow" aria-hidden="true" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Rejoindre ---------- */}
      <section className="surface-dark on-dark section-y relative overflow-hidden">
        <Sunburst className="absolute left-1/2 top-1/2 h-[70rem] w-[70rem] -translate-x-1/2 -translate-y-1/2 opacity-40" />
        <div className="container-sjb relative">
          <SectionHeading
            dark
            align="center"
            eyebrow="Passez à l'action"
            title="Votre place est parmi nous"
            lede="Adhérer, vous engager ou construire un partenariat : trois chemins pour servir ensemble la jeunesse béninoise."
          />
          <ul className="mt-16 grid gap-6 md:grid-cols-3">
            {[
              { t: "Devenir membre", d: "Déposez votre demande d'adhésion et entrez dans l'école d'engagement du SJB.", h: "/rejoindre", b: "Adhérer" },
              { t: "Je veux m'engager", d: "Bénévole, formateur, expert ou porteur de projet : proposez vos talents.", h: "/engagement", b: "M'engager" },
              { t: "Devenir partenaire", d: "Institutions, entreprises, ONG : construisons une convention utile à la jeunesse.", h: "/partenaires", b: "Collaborer" },
            ].map((c, i) => (
              <Reveal as="li" key={c.t} delay={i * 130}>
                <div className="card-dark flex h-full flex-col p-9">
                  <h3 className="h-display text-xl text-cream-50">{c.t}</h3>
                  <p className="mt-4 flex-1 text-cream-100/75">{c.d}</p>
                  <div className="mt-8">
                    <ButtonLink href={c.h} variant="outline" small>
                      {c.b}
                    </ButtonLink>
                  </div>
                </div>
              </Reveal>
            ))}
          </ul>
          <Reveal className="mx-auto mt-20 max-w-xl">
            <Ornament />
            <p className="mt-8 text-center font-serif text-3xl italic text-gold-200">« {site.motto} »</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
