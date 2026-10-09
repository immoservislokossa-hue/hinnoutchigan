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
      <div className="flex items-center gap-2 rounded-full border border-cream-300 bg-green-50 p-1.5 pl-5 transition-colors focus-within:border-gold-300">
        <input
          id={id}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="Votre adresse e-mail"
          className="min-w-0 flex-1 bg-transparent py-2 text-sm text-green-900 placeholder:text-ink-soft focus:outline-none"
        />
        <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="absolute -left-[9999px] h-0 w-0" />
        <button
          type="submit"
          disabled={state === "sending"}
          className="rounded-full bg-gold-400 px-5 py-2.5 text-sm font-semibold text-green-950 transition-colors hover:bg-gold-300"
        >
          {state === "sending" ? "…" : "Valider"}
        </button>
      </div>
      <p aria-live="polite" className="mt-3 min-h-5 text-xs text-ink-soft">
        {state === "invalid" && "Adresse e-mail invalide."}
        {state === "sent" && "Merci, votre inscription est enregistrée."}
        {state === "unconfigured" && "L'inscription en ligne sera bientôt activée."}
        {state === "error" && "Inscription impossible pour le moment. Réessayez plus tard."}
      </p>
    </form>
  );
}
