"use client";

import Link from "next/link";
import { useState } from "react";
import { departments } from "@/content/structure";

const pos: Record<string, [string, number]> = {
  atacora: ["1 / 3", 1],
  alibori: ["3 / 5", 1],
  donga: ["1 / 3", 2],
  borgou: ["3 / 5", 2],
  collines: ["2 / 4", 3],
  couffo: ["1 / 2", 4],
  zou: ["2 / 4", 4],
  plateau: ["4 / 5", 4],
  mono: ["1 / 2", 5],
  atlantique: ["2 / 4", 5],
  oueme: ["4 / 5", 5],
  littoral: ["2 / 4", 6],
};

/**
 * Carte interactive : les 12 départements disposés selon leur position
 * (nord en haut). Survol, focus ou clic : le panneau affiche communes et région.
 */
export function InteractiveMap() {
  const [active, setActive] = useState("plateau");
  const current = departments.find((d) => d.slug === active) ?? departments[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8">
      <ul aria-label="Les douze départements du Bénin" className="grid grid-cols-2 gap-3 md:grid-cols-4 md:[grid-auto-rows:minmax(5.5rem,auto)]">
        {departments.map((d) => {
          const [c, r] = pos[d.slug];
          const on = d.slug === active;
          return (
            <li key={d.slug} className="md:[grid-column:var(--c)] md:[grid-row:var(--r)]" style={{ "--c": c, "--r": r } as React.CSSProperties}>
              <button
                type="button"
                onMouseEnter={() => setActive(d.slug)}
                onFocus={() => setActive(d.slug)}
                onClick={() => setActive(d.slug)}
                aria-pressed={on}
                className={`flex h-full min-h-[5.5rem] w-full flex-col justify-between rounded-2xl border p-4 text-left transition-colors duration-200 ${
                  on
                    ? "border-green-800 bg-green-800 text-white"
                    : "border-cream-300 bg-white text-green-900 hover:border-green-800"
                }`}
              >
                <span className={`text-xs font-medium ${on ? "text-gold-300" : "text-ink-mute"}`}>
                  {d.communes.length} commune{d.communes.length > 1 ? "s" : ""}
                </span>
                <span className="font-display text-lg font-semibold tracking-tight">{d.name}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div
        aria-live="polite"
        className="rounded-3xl border border-cream-300 bg-green-50 p-8 sm:p-10"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-green-700">
          Région {current.region}
        </p>
        <h3 key={current.slug} className="h-display mt-3 text-4xl text-green-900 sm:text-5xl" style={{ animation: "fade-up .35s var(--ease-out)" }}>
          {current.name}
        </h3>
        <p className="mt-3 text-ink-soft">
          Chef-lieu : <strong className="text-green-900">{current.seat}</strong>
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {current.communes.map((c) => (
            <li
              key={c}
              className="rounded-full border border-cream-300 bg-white px-3.5 py-1.5 text-sm text-green-900"
            >
              {c}
            </li>
          ))}
        </ul>
        <div className="mt-8">
          <Link href={`/territoires/${current.slug}`} className="link-arrow">
            <span>Voir la coordination {current.of}</span>
            <span className="btn-arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
