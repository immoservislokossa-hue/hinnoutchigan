/** Marque visuellement une information manquante à compléter par l'équipe du SJB. */
export function Todo({ what }: { what?: string }) {
  return (
    <span className="todo" title={what ? `À compléter : ${what}` : "À compléter"}>
      À compléter{what ? ` · ${what}` : ""}
    </span>
  );
}
