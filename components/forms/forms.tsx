import { Form, type FieldDef } from "./Form";
import { departments } from "@/content/structure";

const deptOptions = departments.map((d) => d.name);

const contactFields: FieldDef[] = [
  { name: "nom", label: "Nom et prénoms", required: true, half: true, autoComplete: "name" },
  { name: "email", label: "Adresse e-mail", type: "email", required: true, half: true, autoComplete: "email" },
  { name: "telephone", label: "Téléphone", type: "tel", half: true, autoComplete: "tel" },
  {
    name: "objet",
    label: "Objet",
    type: "select",
    required: true,
    half: true,
    options: ["Information générale", "Adhésion", "Partenariat", "Presse et médias", "Signalement", "Autre"],
  },
  { name: "message", label: "Votre message", type: "textarea", required: true },
];

export function ContactForm() {
  return (
    <Form
      kind="contact"
      fields={contactFields}
      submitLabel="Envoyer le message"
      successTitle="Merci pour votre message"
      successText="Il a bien été transmis au secrétariat du Bureau Exécutif National. Nous vous répondrons dans les meilleurs délais."
    />
  );
}

const engagementFields: FieldDef[] = [
  { name: "nom", label: "Nom", required: true, half: true, autoComplete: "family-name" },
  { name: "prenom", label: "Prénoms", required: true, half: true, autoComplete: "given-name" },
  { name: "departement", label: "Département", type: "select", required: true, half: true, options: deptOptions },
  { name: "commune", label: "Commune", required: true, half: true },
  { name: "age", label: "Âge", type: "number", required: true, half: true },
  { name: "telephone", label: "Téléphone (WhatsApp si possible)", type: "tel", required: true, half: true, autoComplete: "tel" },
  { name: "email", label: "Adresse e-mail", type: "email", half: true, autoComplete: "email" },
  {
    name: "type",
    label: "Type d'engagement souhaité",
    type: "select",
    required: true,
    half: true,
    options: ["Bénévole", "Participant aux activités", "Formateur", "Expert", "Partenaire", "Porteur de projet"],
  },
  { name: "competences", label: "Domaine de compétence ou centre d'intérêt", half: true },
  { name: "disponibilite", label: "Disponibilité", half: true, placeholder: "Ex. week-ends, soirées…" },
  { name: "message", label: "Pourquoi souhaitez-vous vous engager ?", type: "textarea" },
];

export function EngagementForm() {
  return (
    <Form
      kind="engagement"
      fields={engagementFields}
      submitLabel="Je m'engage"
      successTitle="Merci pour votre engagement"
      successText="Votre souhait d'engagement a bien été reçu. Un responsable de votre territoire vous contactera. Rappel : cette démarche n'est pas une adhésion officielle."
      notice={
        <>
          <strong className="text-green-800">Important :</strong> ce formulaire exprime une volonté d&apos;engagement. Il ne vaut pas
          adhésion. Selon les statuts (art. 9.7), seule la procédure formelle d&apos;adhésion confère la qualité de membre.
        </>
      }
    />
  );
}

const adhesionFields: FieldDef[] = [
  { name: "nom", label: "Nom", required: true, half: true, autoComplete: "family-name" },
  { name: "prenom", label: "Prénoms", required: true, half: true, autoComplete: "given-name" },
  { name: "naissance", label: "Date de naissance", required: true, half: true, placeholder: "JJ/MM/AAAA" },
  { name: "sexe", label: "Sexe", type: "select", required: true, half: true, options: ["Féminin", "Masculin"] },
  { name: "departement", label: "Département", type: "select", required: true, half: true, options: deptOptions },
  { name: "commune", label: "Commune", required: true, half: true },
  { name: "telephone", label: "Téléphone", type: "tel", required: true, half: true, autoComplete: "tel" },
  { name: "email", label: "Adresse e-mail", type: "email", required: true, half: true, autoComplete: "email" },
  { name: "profession", label: "Profession ou niveau d'études", half: true },
  {
    name: "commission",
    label: "Commission souhaitée",
    type: "select",
    half: true,
    options: [
      "Lois et Droits humains",
      "Finances et Questions économiques",
      "Emploi, Entrepreneuriat et Affaires sociales",
      "Éducation, Culture et Sports",
      "Relations extérieures, Coopération et Panafricanisme",
    ],
  },
  { name: "motivation", label: "Lettre de motivation", type: "textarea", required: true },
];

export function AdhesionForm() {
  return (
    <Form
      kind="adhesion"
      fields={adhesionFields}
      submitLabel="Envoyer ma demande d'adhésion"
      successTitle="Demande d'adhésion enregistrée"
      successText="Votre demande sera examinée par le Bureau Exécutif National puis soumise à validation de l'Assemblée Plénière."
      notice={
        <>
          La demande d&apos;adhésion est adressée au Président et <strong className="text-green-800">validée en Assemblée Plénière</strong>
          . Le paiement des droits d&apos;adhésion, la délivrance du reçu et de la carte de membre se font hors ligne, selon la procédure
          des statuts.
        </>
      }
    />
  );
}

const partnerFields: FieldDef[] = [
  { name: "organisation", label: "Organisation", required: true, half: true },
  { name: "contact", label: "Personne de contact", required: true, half: true, autoComplete: "name" },
  { name: "telephone", label: "Téléphone", type: "tel", required: true, half: true, autoComplete: "tel" },
  { name: "email", label: "Adresse e-mail", type: "email", required: true, half: true, autoComplete: "email" },
  {
    name: "type",
    label: "Type de partenariat souhaité",
    type: "select",
    required: true,
    half: true,
    options: ["Technique", "Financier", "Institutionnel", "Associatif", "Média", "Autre"],
  },
  { name: "domaine", label: "Domaine", required: true, half: true, placeholder: "Éducation, santé, numérique…" },
  { name: "proposition", label: "Description de votre proposition", type: "textarea", required: true },
];

export function PartnerForm() {
  return (
    <Form
      kind="partenaire"
      fields={partnerFields}
      submitLabel="Proposer un partenariat"
      successTitle="Proposition reçue"
      successText="Merci. Votre proposition sera étudiée par le Bureau Exécutif National. Tout partenariat est formalisé par une convention signée par les deux parties."
      consentText="J'accepte que ces informations soient utilisées par le Sénat des Jeunes du Bénin pour étudier ma proposition."
    />
  );
}

const pressFields: FieldDef[] = [
  { name: "nom", label: "Nom et prénoms", required: true, half: true, autoComplete: "name" },
  { name: "media", label: "Média ou rédaction", required: true, half: true },
  { name: "email", label: "Adresse e-mail", type: "email", required: true, half: true, autoComplete: "email" },
  { name: "telephone", label: "Téléphone", type: "tel", half: true, autoComplete: "tel" },
  { name: "demande", label: "Votre demande (interview, accréditation, information)", type: "textarea", required: true },
];

export function PressForm() {
  return (
    <Form
      kind="presse"
      fields={pressFields}
      submitLabel="Envoyer la demande"
      successTitle="Demande de presse reçue"
      successText="Notre équipe de communication vous répondra rapidement."
    />
  );
}
