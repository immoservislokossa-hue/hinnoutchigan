import Link from "next/link";
import { departments } from "@/content/structure";
import { Reveal } from "@/components/ui/Reveal";

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

/** Cartogramme : les 12 départements disposés selon leur position géographique (nord en haut). */
export function Cartogram({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <ul
      aria-label="Les douze départements du Bénin"
      className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4 md:[grid-auto-rows:minmax(7rem,auto)]"
    >
      {departments.map((d, i) => {
        const [c, r] = pos[d.slug];
        return (
          <li
            key={d.slug}
            className="md:[grid-column:var(--c)] md:[grid-row:var(--r)]"
            style={{ "--c": c, "--r": r } as React.CSSProperties}
          >
            <Reveal delay={i * 55} className="h-full">
              <Link
                href={`/territoires/${d.slug}`}
                className={`group relative flex h-full min-h-[7rem] flex-col justify-between overflow-hidden p-4 sm:p-5 transition-all duration-500 ${
                  dark
                    ? "border border-gold-400/30 bg-white/[0.04] hover:border-gold-300 hover:bg-gold-400"
                    : "border border-cream-300 bg-cream-50 hover:border-gold-400 hover:bg-green-800"
                }`}
              >
                <span
                  className={`whitespace-nowrap font-display text-[0.6rem] uppercase tracking-[0.16em] transition-colors ${
                    dark ? "text-gold-300 group-hover:text-green-950" : "text-gold-600 group-hover:text-gold-300"
                  }`}
                >
                  {d.communes.length} commune{d.communes.length > 1 ? "s" : ""}
                </span>
                <span>
                  <span
                    className={`block font-display text-lg font-semibold tracking-[0.08em] transition-colors sm:text-xl ${
                      dark ? "text-cream-50 group-hover:text-green-950" : "text-green-900 group-hover:text-cream-50"
                    }`}
                  >
                    {d.name}
                  </span>
                  <span
                    className={`mt-1 block font-serif text-base italic transition-colors ${
                      dark ? "text-cream-100/65 group-hover:text-green-900" : "text-ink-mute group-hover:text-cream-100/80"
                    }`}
                  >
                    {d.seat}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="absolute right-4 top-4 h-2 w-2 rotate-45 bg-gold-400 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
              </Link>
            </Reveal>
          </li>
        );
      })}
    </ul>
  );
}
