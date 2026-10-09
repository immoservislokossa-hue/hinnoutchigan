import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Orbits } from "./Orbits";

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
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
  return (
    <section className="relative overflow-hidden border-b border-cream-300 bg-white pb-20 pt-[calc(var(--header-h)+3.5rem)] text-center sm:pb-28 sm:pt-[calc(var(--header-h)+5rem)]">
      <Orbits className="left-1/2 top-[58%] h-0 w-0" />
      <div className="container-sjb relative">
        <nav aria-label="Fil d'Ariane" className="hero-rise text-sm text-ink-mute" style={d(0)}>
          <ol className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1">
            <li>
              <Link href="/" className="transition-colors hover:text-green-700">
                Accueil
              </Link>
            </li>
            {crumbs.map((c) => (
              <li key={c.label} className="flex items-center gap-2.5">
                <span aria-hidden="true" className="text-cream-300">
                  /
                </span>
                {c.href ? (
                  <Link href={c.href} className="transition-colors hover:text-green-700">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current="page" className="font-medium text-green-800">
                    {c.label}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <span className="hero-rise mx-auto mt-9 inline-flex items-center gap-2.5 rounded-full border border-cream-300 bg-white px-4 py-1.5 text-sm font-medium text-green-800 shadow-sm" style={d(100)}>
          <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold-400" />
          {eyebrow}
        </span>
        <h1 className="h-display hero-rise mx-auto mt-7 max-w-4xl text-[2.5rem] text-green-900 sm:text-6xl lg:text-[4.5rem]" style={d(200)}>
          {title}
        </h1>
        {lede && (
          <p className="lede hero-rise mx-auto mt-7 max-w-2xl" style={d(320)}>
            {lede}
          </p>
        )}
        {children && (
          <div className="hero-rise mt-10 flex flex-wrap justify-center gap-4" style={d(440)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
