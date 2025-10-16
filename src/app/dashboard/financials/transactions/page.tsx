// src/app/dashboard/financials/transactions/page.tsx
"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionsTable } from "@/components/financial/transactions-table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TransactionForm } from "@/components/financial/transaction-form";
import { Transaction } from "@/lib/types";
import { Download, Filter, PlusCircle } from "lucide-react";

export default function AllTransactionsPage() {
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
                        Todas as Transações
                    </h1>
                    <p className="text-muted-foreground">
                        Visualize, filtre e gerencie todas as movimentações financeiras.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline">
                        <Filter className="mr-2 h-4 w-4" />
                        Filtros
                    </Button>
                    <Button variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
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

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Histórico de Transações</CardTitle>
                    <CardDescription>
                        Abaixo estão todas as transações registradas na plataforma.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <TransactionsTable showAll={true} initialTransactions={transactions} />
                </CardContent>
            </Card>
        </div>
    );
}
