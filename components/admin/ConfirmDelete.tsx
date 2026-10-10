"use client";

/** Bouton de suppression avec confirmation native (fonctionne sans bibliothèque). */
export function ConfirmDelete({ action, label = "Supprimer", message = "Supprimer définitivement cet élément ?" }: { action: () => Promise<void>; label?: string; message?: string }) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      <button type="submit" className="rounded-full border border-flag-red/40 px-5 py-2.5 text-sm font-semibold text-flag-red hover:bg-flag-red/5">
        {label}
      </button>
    </form>
  );
}
