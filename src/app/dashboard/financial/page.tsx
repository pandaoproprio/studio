// src/app/dashboard/financial/page.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Download } from "lucide-react";
import { FinancialOverview } from "@/components/dashboard/financial-overview";
import { CashflowChart } from "@/components/dashboard/cashflow-chart";
import { TransactionsTable } from "@/components/dashboard/transactions-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/financial/transaction-form";
import { Transaction } from "@/lib/types";

export default function FinancialPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddTransaction = (newTransaction: Transaction) => {
    setTransactions(prev => [newTransaction, ...prev]);
    setIsDialogOpen(false);
  }

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
           <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Registrar Nova Transação</DialogTitle>
              </DialogHeader>
              <TransactionForm onSubmit={handleAddTransaction} />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <FinancialOverview />
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
            <CashflowChart />
        </div>
        <div className="lg:col-span-2">
            <TransactionsTable recentTransactions={transactions} />
        </div>
      </div>
    </div>
  );
}
