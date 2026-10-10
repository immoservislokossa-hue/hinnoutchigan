import Link from "next/link";
import type { ReactNode } from "react";

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="h-display text-[1.7rem] text-green-900 sm:text-4xl">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-ink-soft">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

const MESSAGES: Record<string, string> = {
  saved: "Enregistré.",
  deleted: "Supprimé.",
  invited: "Invitation envoyée. Le compte est créé.",
  submitted: "Rapport soumis.",
};

export function Flash({ ok, error }: { ok?: string; error?: string }) {
  if (!ok && !error) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={`mb-6 rounded-2xl border px-4 py-3 text-sm ${error ? "border-flag-red/30 bg-flag-red/5 text-flag-red" : "border-green-600/30 bg-green-50 text-green-800"}`}
    >
      {error ?? MESSAGES[ok ?? ""] ?? "Fait."}
    </p>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "gold" | "red" }) {
  const tones = {
    neutral: "bg-cream-100 text-ink-soft",
    green: "bg-green-100 text-green-800",
    gold: "bg-gold-200/60 text-gold-600",
    red: "bg-flag-red/10 text-flag-red",
  };
  return <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]}`}>{children}</span>;
}

export function EmptyState({ children }: { children: ReactNode }) {
  return <div className="rounded-3xl border border-dashed border-cream-300 bg-cream-100 p-8 text-center text-ink-soft">{children}</div>;
}

export function Card({ title, children, className = "" }: { title?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-3xl border border-cream-300 bg-white p-5 sm:p-7 ${className}`}>
      {title && <h2 className="h-display mb-4 text-lg text-green-900">{title}</h2>}
      {children}
    </section>
  );
}

export function Pagination({ base, page, total, size }: { base: string; page: number; total: number; size: number }) {
  const pages = Math.max(1, Math.ceil(total / size));
  if (pages <= 1) return null;
  const href = (p: number) => `${base}${base.includes("?") ? "&" : "?"}page=${p}`;
  return (
    <nav aria-label="Pagination" className="mt-6 flex items-center justify-between gap-3 text-sm">
      {page > 1 ? <Link href={href(page - 1)} className="link-arrow">← Précédent</Link> : <span />}
      <span className="text-ink-mute">Page {page} sur {pages}</span>
      {page < pages ? <Link href={href(page + 1)} className="link-arrow">Suivant →</Link> : <span />}
    </nav>
  );
}

export function SearchBar({ action, q, placeholder = "Rechercher…" }: { action: string; q?: string; placeholder?: string }) {
  return (
    <form action={action} className="mb-5 flex gap-2" role="search">
      <label htmlFor="q" className="sr-only">Rechercher</label>
      <input id="q" name="q" defaultValue={q} placeholder={placeholder} className="field !py-2.5" />
      <button type="submit" className="shrink-0 rounded-xl bg-green-800 px-5 text-sm font-semibold text-white hover:bg-green-900">OK</button>
    </form>
  );
}

/** Texte sûr pour un filtre PostgREST `or()` : retire les caractères de syntaxe. */
export const cleanQuery = (q: string | undefined) => (q ?? "").replace(/[,()%*\\:"']/g, " ").trim().slice(0, 80);
