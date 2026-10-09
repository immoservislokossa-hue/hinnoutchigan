"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { submitForm, type FormKind } from "@/lib/forms";
import { site } from "@/content/site";

export type FieldDef = {
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "textarea" | "select" | "number";
  required?: boolean;
  options?: string[];
  placeholder?: string;
  autoComplete?: string;
  half?: boolean;
  hint?: string;
};

type Status = "idle" | "sending" | "sent" | "unconfigured" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function Form({
  kind,
  fields,
  submitLabel,
  successTitle,
  successText,
  consentText = "J'accepte que mes données soient traitées par le Sénat des Jeunes du Bénin pour répondre à ma demande.",
  notice,
}: {
  kind: FormKind;
  fields: FieldDef[];
  submitLabel: string;
  successTitle: string;
  successText: string;
  consentText?: string;
  notice?: React.ReactNode;
}) {
  const uid = useId();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverError, setServerError] = useState("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (data.get("website")) return; // piège à robots

    const next: Record<string, string> = {};
    const payload: Record<string, string> = {};
    for (const f of fields) {
      const v = String(data.get(f.name) ?? "").trim();
      payload[f.name] = v;
      if (f.required && !v) next[f.name] = "Ce champ est obligatoire.";
      else if (v && f.type === "email" && !EMAIL_RE.test(v)) next[f.name] = "Adresse e-mail invalide.";
      else if (v && f.type === "tel" && v.replace(/[^\d]/g, "").length < 8) next[f.name] = "Numéro de téléphone invalide.";
      else if (v && f.type === "textarea" && f.required && v.length < 10) next[f.name] = "Merci de détailler un peu plus (10 caractères minimum).";
    }
    if (!data.get("consent")) next.consent = "Votre consentement est nécessaire pour envoyer ce formulaire.";
    setErrors(next);
    if (Object.keys(next).length) {
      const first = form.querySelector<HTMLElement>("[aria-invalid='true']");
      first?.focus();
      return;
    }

    setStatus("sending");
    const res = await submitForm(kind, payload);
    if (res.status === "sent") {
      setStatus("sent");
      form.reset();
    } else if (res.status === "unconfigured") {
      setStatus("unconfigured");
    } else {
      setServerError(res.message);
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="card-lux p-10 text-center sm:p-14">
        <p className="eyebrow justify-center">Message transmis</p>
        <h3 className="h-display mt-5 text-2xl text-green-900 sm:text-3xl">{successTitle}</h3>
        <p className="mx-auto mt-5 max-w-md text-ink-soft">{successText}</p>
        <button type="button" onClick={() => setStatus("idle")} className="link-arrow mt-8">
          Envoyer un autre message
        </button>
      </div>
    );
  }

  if (status === "unconfigured") {
    return (
      <div role="status" className="card-lux p-10 sm:p-14">
        <p className="eyebrow">Envoi en ligne bientôt actif</p>
        <h3 className="h-display mt-5 text-2xl text-green-900">Votre message n&apos;a pas encore été transmis</h3>
        <p className="mt-5 text-ink-soft">
          Le service d&apos;envoi des formulaires est en cours d&apos;activation. Pour être sûr d&apos;être lu, écrivez-nous
          directement
          {site.contact.email ? (
            <>
              {" "}
              à{" "}
              <a className="underline decoration-gold-400 underline-offset-4" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </>
          ) : (
            " via notre page de contact"
          )}
          .
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="link-arrow mt-8">
          Revenir au formulaire
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card-lux p-7 sm:p-10" aria-describedby={`${uid}-live`}>
      {notice && <div className="mb-8 border-l-2 border-gold-500 bg-cream-100 p-5 text-sm leading-relaxed text-ink-soft">{notice}</div>}
      <div className="grid gap-x-6 gap-y-7 sm:grid-cols-2">
        {fields.map((f) => {
          const id = `${uid}-${f.name}`;
          const err = errors[f.name];
          const common = {
            id,
            name: f.name,
            required: f.required,
            placeholder: f.placeholder,
            autoComplete: f.autoComplete,
            "aria-invalid": err ? true : undefined,
            "aria-describedby": err ? `${id}-err` : f.hint ? `${id}-hint` : undefined,
            className: "field",
          } as const;
          return (
            <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
              <label htmlFor={id} className="field-label">
                {f.label}
                {f.required && <span aria-hidden="true"> *</span>}
              </label>
              {f.type === "textarea" ? (
                <textarea {...common} />
              ) : f.type === "select" ? (
                <select {...common} defaultValue="">
                  <option value="" disabled>
                    Sélectionner…
                  </option>
                  {f.options?.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input {...common} type={f.type ?? "text"} inputMode={f.type === "tel" ? "tel" : undefined} />
              )}
              {f.hint && !err && (
                <p id={`${id}-hint`} className="mt-2 text-xs text-ink-mute">
                  {f.hint}
                </p>
              )}
              {err && (
                <p id={`${id}-err`} className="mt-2 text-sm text-flag-red">
                  {err}
                </p>
              )}
            </div>
          );
        })}

        {/* Piège à robots : invisible pour les humains */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Ne pas remplir
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <div className="sm:col-span-2">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-ink-soft">
            <input
              type="checkbox"
              name="consent"
              aria-invalid={errors.consent ? true : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-green-700"
            />
            <span>
              {consentText}{" "}
              <Link href="/confidentialite" className="underline decoration-gold-400 underline-offset-4">
                Politique de confidentialité
              </Link>
              .
            </span>
          </label>
          {errors.consent && <p className="mt-2 text-sm text-flag-red">{errors.consent}</p>}
        </div>
      </div>

      <div className="mt-9 flex flex-wrap items-center gap-6">
        <Button type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Envoi en cours…" : submitLabel}
        </Button>
        <p className="text-xs text-ink-mute">* Champs obligatoires</p>
      </div>
      <p id={`${uid}-live`} aria-live="polite" className="mt-5 text-sm text-flag-red">
        {status === "error" ? serverError : ""}
      </p>
    </form>
  );
}
