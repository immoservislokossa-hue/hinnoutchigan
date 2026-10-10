import { PageHeader } from "@/components/admin/ui";
import { ResourceForm } from "@/components/admin/ResourceForm";
import { requireUser } from "@/lib/auth";
import { reportFields } from "@/lib/report-fields";
import { saveReportAction } from "@/lib/espace-actions";

export const metadata = { title: "Nouveau rapport" };

export default async function NewReportPage() {
  const { profile } = await requireUser("/espace/rapports/nouveau");
  return (
    <>
      <PageHeader title="Nouveau rapport" description="Un brouillon reste modifiable. Une fois soumis, il est transmis pour examen." />
      <div className="max-w-3xl">
        <ResourceForm
          fields={reportFields}
          initial={{ department_slug: profile.department_slug ?? "", intent: "draft" }}
          action={saveReportAction.bind(null, null, false)}
          cancelHref="/espace/rapports"
        />
      </div>
    </>
  );
}
