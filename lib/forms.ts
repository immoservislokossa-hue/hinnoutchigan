export type FormKind = "contact" | "engagement" | "adhesion" | "partenaire" | "newsletter" | "presse";

export type SubmitResult =
  | { status: "sent" }
  | { status: "unconfigured" }
  | { status: "error"; message: string };

/**
 * Envoi d'un formulaire vers le back-office.
 * Tant que NEXT_PUBLIC_FORMS_ENDPOINT n'est pas défini, rien n'est transmis
 * et l'interface le dit honnêtement à l'utilisateur (statut « unconfigured »).
 * Contrat attendu : POST JSON { kind, payload, submittedAt } → réponse 2xx.
 */
export async function submitForm(kind: FormKind, payload: Record<string, string>): Promise<SubmitResult> {
  const endpoint = process.env.NEXT_PUBLIC_FORMS_ENDPOINT;
  if (!endpoint) return { status: "unconfigured" };
  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, payload, submittedAt: new Date().toISOString() }),
    });
    if (!res.ok) return { status: "error", message: "Le serveur n'a pas pu enregistrer votre demande." };
    return { status: "sent" };
  } catch {
    return { status: "error", message: "Connexion impossible. Vérifiez votre réseau et réessayez." };
  }
}
