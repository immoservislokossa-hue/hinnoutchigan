"use client";

import { useId, useState, type FormEvent } from "react";
import { submitForm } from "@/lib/forms";

export function NewsletterForm() {
  const id = useId();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "unconfigured" | "error" | "invalid">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (data.get("website")) return;
    const email = String(data.get("email") ?? "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return setState("invalid");
    setState("sending");
    const res = await submitForm("newsletter", { email });
    setState(res.status === "sent" ? "sent" : res.status === "unconfigured" ? "unconfigured" : "error");
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-4">
      <label htmlFor={id} className="sr-only">
        Votre adresse e-mail
      </label>
      <div className="flex border border-gold-400/50 transition-colors focus-within:border-gold-300">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Votre adresse e-mail"
          className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-sm text-cream-50 placeholder:text-cream-100/45 focus:outline-none"
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0" />
        <button
          type="submit"
          disabled={state === "sending"}
          className="border-l border-gold-400/50 px-5 font-display text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-gold-300 transition-colors hover:bg-gold-400 hover:text-green-950 focus-visible:bg-gold-400 focus-visible:text-green-950"
        >
          {state === "sending" ? "…" : "Valider"}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-xs text-cream-100/70">
        {state === "invalid" && "Adresse e-mail invalide."}
        {state === "sent" && "Merci, votre inscription est enregistrée."}
        {state === "unconfigured" && "L'inscription en ligne sera bientôt activée."}
        {state === "error" && "Inscription impossible pour le moment. Réessayez plus tard."}
      </p>
    </form>
  );
}
