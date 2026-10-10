"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Button } from "@/components/ui/Button";
import { requestResetAction, setPasswordAction, signInAction, type AuthState } from "@/lib/auth-actions";

const initial: AuthState = {};

function Message({ state }: { state: AuthState }) {
  return (
    <p aria-live="polite" className={`min-h-6 text-sm ${state.error ? "text-flag-red" : "text-green-700"}`}>
      {state.error ?? state.ok ?? ""}
    </p>
  );
}

export function LoginForm({ next, notice }: { next: string; notice?: string }) {
  const [state, action, pending] = useActionState(signInAction, initial);
  return (
    <form action={action} className="card-lux space-y-5 p-6 sm:p-9" noValidate>
      <input type="hidden" name="next" value={next} />
      {notice && <p className="rounded-xl bg-gold-200/40 px-4 py-3 text-sm text-ink-soft">{notice}</p>}
      <div>
        <label htmlFor="email" className="field-label">
          Adresse e-mail
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className="field" />
      </div>
      <div>
        <label htmlFor="password" className="field-label">
          Mot de passe
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" />
      </div>
      <Message state={state} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Connexion…" : "Se connecter"}
      </Button>
      <p className="text-center text-sm">
        <Link href="/mot-de-passe-oublie" className="link-arrow !text-sm">
          Mot de passe oublié ?
        </Link>
      </p>
    </form>
  );
}

export function ResetRequestForm() {
  const [state, action, pending] = useActionState(requestResetAction, initial);
  return (
    <form action={action} className="card-lux space-y-5 p-6 sm:p-9" noValidate>
      <div>
        <label htmlFor="email" className="field-label">
          Adresse e-mail du compte
        </label>
        <input id="email" name="email" type="email" autoComplete="email" required className="field" />
      </div>
      <Message state={state} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Envoi…" : "Recevoir un lien"}
      </Button>
    </form>
  );
}

export function NewPasswordForm() {
  const [state, action, pending] = useActionState(setPasswordAction, initial);
  return (
    <form action={action} className="card-lux space-y-5 p-6 sm:p-9" noValidate>
      <div>
        <label htmlFor="password" className="field-label">
          Nouveau mot de passe
        </label>
        <input id="password" name="password" type="password" autoComplete="new-password" required minLength={10} className="field" />
        <p className="mt-2 text-xs text-ink-mute">10 caractères minimum, avec majuscule, minuscule et chiffre.</p>
      </div>
      <div>
        <label htmlFor="confirm" className="field-label">
          Confirmer le mot de passe
        </label>
        <input id="confirm" name="confirm" type="password" autoComplete="new-password" required className="field" />
      </div>
      <Message state={state} />
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? "Enregistrement…" : "Enregistrer et continuer"}
      </Button>
    </form>
  );
}
