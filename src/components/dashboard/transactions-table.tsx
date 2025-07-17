// src/components/dashboard/transactions-table.tsx
"use client"

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

type TransactionStatus = "Concluído" | "Pendente" | "Cancelado";
type TransactionType = "Receita" | "Despesa";

const transactions = [
  { id: "TXN-001", type: "Receita", description: "Doação - Empresa Parceira S.A.", date: "28/07/2024", amount: "+ R$ 5.000,00", status: "Concluído" },
  { id: "TXN-002", type: "Despesa", description: "Pagamento - Gráfica Impressão Rápida", date: "27/07/2024", amount: "- R$ 850,00", status: "Concluído" },
  { id: "TXN-003", type: "Despesa", description: "Aluguel - Sede", date: "25/07/2024", amount: "- R$ 5.000,00", status: "Concluído" },
  { id: "TXN-004", type: "Receita", description: "Venda de Ingressos - Festa Julina", date: "22/07/2024", amount: "+ R$ 1.230,00", status: "Pendente" },
  { id: "TXN-005", type: "Despesa", description: "Compra de Material de Escritório", date: "20/07/2024", amount: "- R$ 320,00", status: "Concluído" },
];

const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
        case "Concluído": return "bg-green-100 text-green-800";
        case "Pendente": return "bg-yellow-100 text-yellow-800";
        case "Cancelado": return "bg-red-100 text-red-800";
        default: return "bg-gray-100 text-gray-800";
    }
}

const getAmountClass = (type: TransactionType) => {
    return type === "Receita" ? "text-green-600" : "text-red-600";
}

export function TransactionsTable() {
    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center">
                <div className="grid gap-2">
                    <CardTitle className="font-headline">Últimas Transações</CardTitle>
                    <CardDescription>
                        As 5 transações mais recentes da sua organização.
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
                         {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>
                                    <div className="font-medium">{transaction.description}</div>
                                    <div className="text-sm text-muted-foreground">{transaction.date}</div>
                                </TableCell>
                                <TableCell className={`text-right font-semibold ${getAmountClass(transaction.type as TransactionType)}`}>
                                    {transaction.amount}
                                </TableCell>
                            </TableRow>
                         ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}