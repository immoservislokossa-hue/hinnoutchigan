export type FormKind = "contact" | "engagement" | "adhesion" | "partenaire" | "newsletter" | "presse";

export type SubmitResult =
  | { status: "sent" }
  | { status: "unconfigured" }
  | { status: "error"; message: string };

/**
 * Envoi d'un formulaire vers l'API du site (/api/forms/<type>), qui valide,
 * limite le débit puis enregistre dans Supabase. Si le back-office n'est pas
 * encore relié (503), l'interface le dit honnêtement au visiteur.
 */
export async function submitForm(kind: FormKind, payload: Record<string, string>): Promise<SubmitResult> {
  try {
    const res = await fetch(`/api/forms/${kind}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload }),
    });
    if (res.ok) return { status: "sent" };
    if (res.status === 503) return { status: "unconfigured" };
    if (res.status === 429) return { status: "error", message: "Trop de demandes envoyées. Réessayez dans quelques minutes." };
    if (res.status === 400) return { status: "error", message: "Certaines informations sont invalides. Vérifiez les champs et réessayez." };
    return { status: "error", message: "Le serveur n'a pas pu enregistrer votre demande. Réessayez plus tard." };
  } catch {
    return { status: "error", message: "Connexion impossible. Vérifiez votre réseau et réessayez." };
  }
}
