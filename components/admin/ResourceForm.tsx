"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import type { Field } from "@/lib/admin/resources";
import type { FormState } from "@/lib/admin/actions";

export function SubmitButton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={`btn ${className}`}>
      <span>{pending ? "Enregistrement…" : children}</span>
      <span className="btn-arrow" aria-hidden="true" />
    </button>
  );
}

export function FieldInput({ f, value, fileHint }: { f: Field; value: string; fileHint?: React.ReactNode }) {
  const id = `f-${f.name}`;
  const common = { id, name: f.name, disabled: f.readOnly, "aria-describedby": f.help ? `${id}-help` : undefined, className: "field" } as const;
  return (
    <div className={f.half ? "" : "sm:col-span-2"}>
      {f.type === "checkbox" ? (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-cream-300 px-4 py-3 text-sm font-medium text-green-900">
          <input type="checkbox" name={f.name} defaultChecked={value === "on"} className="h-5 w-5 accent-green-800" />
          {f.label}
        </label>
      ) : (
        <>
          <label htmlFor={id} className="field-label">
            {f.label}
            {f.required && <span aria-hidden="true"> *</span>}
          </label>
          {f.type === "textarea" ? (
            <textarea {...common} rows={f.rows ?? 5} defaultValue={value} maxLength={f.maxLength} style={{ minHeight: "auto" }} />
          ) : f.type === "select" ? (
            <select {...common} defaultValue={value}>
              <option value="">{f.required ? "Sélectionner…" : "— Aucun —"}</option>
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          ) : f.type === "file" ? (
            <>
              <input {...common} type="file" accept={f.bucket === "public-files" ? "image/jpeg,image/png,image/webp,application/pdf" : "image/jpeg,image/png,image/webp,application/pdf,.doc,.docx"} className="field file:mr-4 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-800" />
              {fileHint}
            </>
          ) : (
            <input
              {...common}
              type={f.type === "datetime" ? "datetime-local" : f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
              defaultValue={value}
              maxLength={f.maxLength}
              placeholder={f.placeholder}
              required={f.required && f.type !== "slug"}
              inputMode={f.type === "number" ? "numeric" : undefined}
            />
          )}
        </>
      )}
      {f.help && (
        <p id={`${id}-help`} className="mt-1.5 text-xs text-ink-mute">
          {f.help}
        </p>
      )}
    </div>
  );
}

/** Formulaire générique : conserve la saisie en cas d'erreur serveur. */
export function ResourceForm({
  fields,
  initial,
  action,
  cancelHref,
  submitLabel = "Enregistrer",
  fileHints = {},
}: {
  fields: Field[];
  initial: Record<string, string>;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  cancelHref: string;
  submitLabel?: string;
  fileHints?: Record<string, React.ReactNode>;
}) {
  const [state, formAction] = useActionState(action, {} as FormState);
  const errRef = useRef<HTMLParagraphElement>(null);
  useEffect(() => {
    if (state.error) errRef.current?.focus();
  }, [state]);
  const val = (name: string) => state.values?.[name] ?? initial[name] ?? "";

  return (
    <form action={formAction} key={state.error ? `${state.error}|${JSON.stringify(state.values ?? {})}` : "initial"} className="space-y-6" encType="multipart/form-data">
      {state.error && (
        <p ref={errRef} tabIndex={-1} role="alert" className="rounded-2xl border border-flag-red/30 bg-flag-red/5 px-4 py-3 text-sm text-flag-red">
          {state.error}
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <FieldInput key={f.name} f={f} value={val(f.name)} fileHint={fileHints[f.name]} />
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <SubmitButton>{submitLabel}</SubmitButton>
        <Link href={cancelHref} className="link-arrow">
          Annuler
        </Link>
      </div>
    </form>
  );
}
