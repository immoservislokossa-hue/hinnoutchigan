import { deptOptions, type Field } from "@/lib/admin/resources";

export const reportFields: Field[] = [
  { name: "title", label: "Titre du rapport", type: "text", required: true, maxLength: 200 },
  { name: "period_label", label: "Période", type: "text", required: true, half: true, maxLength: 80, placeholder: "ex. Octobre 2026 ou T3 2026" },
  { name: "department_slug", label: "Département concerné", type: "select", half: true, options: deptOptions },
  { name: "content", label: "Contenu (activités, résultats, difficultés, besoins)", type: "textarea", rows: 14, required: true, maxLength: 20000 },
  { name: "intent", label: "Que faire de ce rapport ?", type: "select", required: true, options: [{ value: "draft", label: "Enregistrer comme brouillon" }, { value: "submit", label: "Soumettre à mon responsable" }] },
];
