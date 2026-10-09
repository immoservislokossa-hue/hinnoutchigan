"use client";

import { useEffect, useRef, useState } from "react";
import { chain } from "@/content/structure";

/**
 * Du terrain à la nation : section « épinglée ». En défilant, on remonte les
 * cinq échelons de l'organisation. Sur mobile : simple liste.
 */
export function ChainScroller() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0;
      setProgress(p);
      setActive(Math.min(chain.length - 1, Math.floor(p * chain.length)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const cur = chain[active];

  return (
    <>
      {/* Mobile : liste simple */}
      <ol className="space-y-4 md:hidden">
        {chain.map((c, i) => (
          <li key={c.level} className="rounded-2xl border border-cream-300 bg-white p-6">
            <p className="font-display text-5xl font-semibold tracking-tight text-green-800">{c.count}</p>
            <h3 className="h-display mt-3 text-xl text-green-900">{c.level}</h3>
            <p className="mt-1 text-sm text-ink-mute">{c.posts}</p>
            <p className="mt-3 text-ink-soft">{c.text}</p>
            <span className="sr-only">Échelon {i + 1} sur 5</span>
          </li>
        ))}
      </ol>

      {/* Bureau : section épinglée */}
      <div ref={ref} className="hidden md:block" style={{ height: `${chain.length * 70 + 40}vh` }}>
        <div className="sticky top-0 flex h-screen items-center">
          <div className="grid w-full items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-green-700">
                Échelon {active + 1} / {chain.length}
              </p>
              <div key={active} style={{ animation: "fade-up .45s var(--ease-out)" }}>
                <p className="font-display text-[9rem] font-semibold leading-none tracking-tighter text-green-800 lg:text-[12rem]">
                  {cur.count}
                </p>
                <h3 className="h-display mt-2 text-4xl text-green-900 lg:text-5xl">{cur.level}</h3>
                <p className="mt-2 text-sm font-semibold uppercase tracking-[0.1em] text-gold-600">{cur.posts}</p>
                <p className="mt-5 max-w-lg text-lg text-ink-soft">{cur.text}</p>
              </div>
            </div>

            <div className="relative">
              <div aria-hidden="true" className="absolute bottom-6 left-[1.35rem] top-6 w-0.5 bg-cream-300">
                <div className="w-full bg-green-800" style={{ height: `${progress * 100}%` }} />
              </div>
              <ol className="relative space-y-3">
                {chain.map((c, i) => {
                  const on = i === active;
                  const done = i < active;
                  return (
                    <li
                      key={c.level}
                      className={`flex items-center gap-5 rounded-2xl border p-4 pr-6 transition-colors duration-300 ${
                        on ? "border-green-800 bg-green-800 text-white" : "border-cream-300 bg-white text-ink"
                      }`}
                    >
                      <span
                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full font-display text-lg font-semibold ${
                          on ? "bg-gold-400 text-green-950" : done ? "bg-green-100 text-green-800" : "bg-cream-100 text-ink-mute"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span>
                        <span className="block font-semibold">{c.level}</span>
                        <span className={`block text-sm ${on ? "text-white/70" : "text-ink-mute"}`}>
                          {c.count} {c.count > 1 ? "instances" : "instance"}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
