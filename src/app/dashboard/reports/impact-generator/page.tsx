// src/app/dashboard/reports/impact-generator/page.tsx
"use client";

import { useRef } from "react";
import { ImpactReportForm } from "@/components/reports/impact-report-form";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";

export default function ImpactGeneratorPage() {
  const formRef = useRef<{ getResult: () => any }>(null);

  const handlePrint = () => {
    window.print();
  };

  const result = formRef.current?.getResult();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between no-print">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Gerador de Relatório de Impacto com IA
          </h1>
          <p className="text-muted-foreground">
            Crie relatórios de impacto detalhados e profissionais em minutos.
          </p>
        </div>
        {result?.data && (
            <Button onClick={handlePrint} variant="outline">
                <Printer className="mr-2 h-4 w-4" />
                Exportar para PDF
            </Button>
        )}
      </div>
      <ImpactReportForm ref={formRef} />
    </div>
  );
}
