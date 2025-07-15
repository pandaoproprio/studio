import { ImpactReportForm } from "@/components/reports/impact-report-form";

export default function ImpactGeneratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Gerador de Relatório de Impacto com IA
        </h1>
        <p className="text-muted-foreground">
          Crie relatórios de impacto detalhados e profissionais em minutos.
        </p>
      </div>
      <ImpactReportForm />
    </div>
  );
}
