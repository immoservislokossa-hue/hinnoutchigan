"use client";

import { useActionState } from "react";
import type { Field } from "@/lib/admin/resources";
import type { FormState } from "@/lib/admin/actions";
import { FieldInput, SubmitButton } from "./ResourceForm";

export type Section = { title: string; description?: string; fields: Field[] };

export function SettingsForm({
  sections,
  initial,
  action,
  photoHint,
}: {
  sections: Section[];
  initial: Record<string, string>;
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  photoHint?: React.ReactNode;
}) {
  const [state, formAction] = useActionState(action, {} as FormState);
  const val = (n: string) => state.values?.[n] ?? initial[n] ?? "";
  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-8">
      {state.error && (
        <p role="alert" className="rounded-2xl border border-flag-red/30 bg-flag-red/5 px-4 py-3 text-sm text-flag-red">
          {state.error}
        </p>
      )}
      {sections.map((s) => (
        <fieldset key={s.title} className="rounded-3xl border border-cream-300 p-5 sm:p-7">
          <legend className="px-2 font-display text-lg font-semibold text-green-900">{s.title}</legend>
          {s.description && <p className="mb-5 text-sm text-ink-mute">{s.description}</p>}
          <div className="grid gap-5 sm:grid-cols-2">
            {s.fields.map((f) => (
              <FieldInput key={f.name} f={f} value={val(f.name)} fileHint={f.type === "file" ? photoHint : undefined} />
            ))}
          </div>
        </fieldset>
      ))}
      <SubmitButton>Enregistrer les paramètres</SubmitButton>
    </form>
  );
}
