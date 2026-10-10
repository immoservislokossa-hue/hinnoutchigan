"use client";

import { useActionState } from "react";
import { SubmitButton } from "./ResourceForm";
import { uploadClauseAction } from "@/lib/espace-actions";
import type { FormState } from "@/lib/admin/actions";

export function ClauseForm() {
  const [state, action] = useActionState(uploadClauseAction, {} as FormState);
  return (
    <form action={action} encType="multipart/form-data" className="space-y-5">
      {state.error && <p role="alert" className="rounded-2xl border border-flag-red/30 bg-flag-red/5 px-4 py-3 text-sm text-flag-red">{state.error}</p>}
      <div>
        <label htmlFor="file" className="field-label">Clause signée (scan ou photo, PDF/JPG/PNG)</label>
        <input id="file" name="file" type="file" required accept="image/jpeg,image/png,image/webp,application/pdf" className="field file:mr-4 file:rounded-full file:border-0 file:bg-green-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-green-800" />
      </div>
      <div>
        <label htmlFor="signed_on" className="field-label">Date de signature</label>
        <input id="signed_on" name="signed_on" type="date" className="field" />
      </div>
      <SubmitButton>Déposer la clause</SubmitButton>
    </form>
  );
}
