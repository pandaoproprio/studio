// src/app/dashboard/financial/page.tsx

import { Button } from "@/components/ui/button";
import { PlusCircle, Download } from "lucide-react";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { TransactionsTable } from "@/components/dashboard/transactions-table";

export default function FinancialPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Gestão Financeira
          </h1>
          <p className="text-muted-foreground">
            Acompanhe a saúde financeira da sua organização em tempo real.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Exportar Relatório
          </Button>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        </div>
      </div>
      
      <FinancialOverview />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <CashflowChart />
        </div>
        <div className="lg:col-span-2">
            <TransactionsTable />
        </div>
      </div>
    </div>
  );
}