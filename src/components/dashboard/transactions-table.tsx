// src/components/dashboard/transactions-table.tsx
"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Transaction, TransactionStatus, TransactionType } from "@/lib/types";
import { format } from 'date-fns';

const initialTransactions: Transaction[] = [
  { id: "TXN-001", type: "Receita", description: "Doação - Empresa Parceira S.A.", date: new Date("2024-07-28"), amount: 5000, status: "Concluído", category: "Doação" },
  { id: "TXN-002", type: "Despesa", description: "Pagamento - Gráfica Impressão Rápida", date: new Date("2024-07-27"), amount: 850, status: "Concluído", category: "Fornecedores" },
  { id: "TXN-003", type: "Despesa", description: "Aluguel - Sede", date: new Date("2024-07-25"), amount: 5000, status: "Concluído", category: "Infraestrutura" },
  { id: "TXN-004", type: "Receita", description: "Venda de Ingressos - Festa Julina", date: new Date("2024-07-22"), amount: 1230, status: "Pendente", category: "Eventos" },
  { id: "TXN-005", type: "Despesa", description: "Compra de Material de Escritório", date: new Date("2024-07-20"), amount: 320, status: "Concluído", category: "Material de Escritório" },
];

const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
        case "Concluído": return "bg-green-100 text-green-800";
        case "Pendente": return "bg-yellow-100 text-yellow-800";
        case "Cancelado": return "bg-red-100 text-red-800";
        case "Em Análise": return "bg-blue-100 text-blue-800";
        case "Recusado": return "bg-orange-100 text-orange-800";
        default: return "bg-gray-100 text-gray-800";
    }
}

const getAmountClass = (type: TransactionType) => {
    switch (type) {
        case "Receita": return "text-green-600";
        case "Despesa": return "text-red-600";
        case "Reembolso": return "text-orange-600";
        default: return "text-foreground";
    }
}

interface TransactionsTableProps {
    recentTransactions: Transaction[];
}

export function TransactionsTable({ recentTransactions }: TransactionsTableProps) {
    const allTransactions = [...recentTransactions, ...initialTransactions].slice(0, 5);

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle className="font-headline">Últimas Transações</CardTitle>
                    <CardDescription>
                        As transações mais recentes da sua organização.
                    </CardDescription>
                </div>
                <Button asChild size="sm" className="ml-auto gap-1">
                    <Link href="#">
                        Ver Todas
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead className="text-right">Valor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {allTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <div className="font-medium">{transaction.description}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {format(transaction.date, 'dd/MM/yyyy')} - <span className="capitalize">{transaction.category}</span>
                                    </div>
                                </TableCell>
                                <TableCell className={`text-right font-semibold ${getAmountClass(transaction.type as TransactionType)}`}>
                                    {transaction.type === 'Receita' ? '+' : '-'} {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                </TableCell>
                            </TableRow>
                         ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
