import Link from "next/link";
import type { ReactNode } from "react";
import { Sunburst } from "./Sunburst";

export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: { label: string; href?: string }[];
  children?: ReactNode;
}) {
  return (
    <section className="surface-dark on-dark relative overflow-hidden pb-20 pt-[calc(var(--header-h)+4rem)] sm:pb-28 sm:pt-[calc(var(--header-h)+6rem)]">
      <Sunburst className="absolute -right-48 -top-48 h-[44rem] w-[44rem] opacity-60 sm:-right-28" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold-400/60 to-transparent" />
      <div className="container-sjb relative">
        <nav aria-label="Fil d'Ariane" className="hero-rise font-display text-[0.68rem] uppercase tracking-[0.25em] text-cream-100/70">
          <ol className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <li>
              <Link href="/" className="transition-colors hover:text-gold-300">
                Accueil
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-3">
                <span aria-hidden="true" className="text-gold-400">
                  ◆
                </span>
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-gold-300">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="text-gold-300">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <span className="eyebrow on-dark hero-rise mt-10" style={{ "--d": "120ms" } as React.CSSProperties}>
          {eyebrow}
        </span>
        <h1
          className="h-display hero-rise mt-6 max-w-4xl text-4xl text-cream-50 sm:text-5xl lg:text-[3.6rem]"
          style={{ "--d": "220ms" } as React.CSSProperties}
        >
          {title}
        </h1>
        {lede && (
          <p
            className="lede hero-rise mt-8 max-w-2xl !text-cream-100/85"
            style={{ "--d": "360ms" } as React.CSSProperties}
          >
            {lede}
          </p>
        )}
        {children && (
          <div className="hero-rise mt-10" style={{ "--d": "480ms" } as React.CSSProperties}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
