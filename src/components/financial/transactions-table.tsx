// src/components/financial/transactions-table.tsx
"use client"

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Transaction, TransactionStatus, TransactionType } from "@/lib/types";
import { format } from 'date-fns';

const allInitialTransactions: Transaction[] = [
  { id: "TXN-001", type: "Receita", description: "Doação - Empresa Parceira S.A.", date: new Date("2024-07-28"), amount: 5000, status: "Concluído", category: "Doação" },
  { id: "TXN-002", type: "Despesa", description: "Pagamento - Gráfica Impressão Rápida", date: new Date("2024-07-27"), amount: 850, status: "Concluído", category: "Fornecedores" },
  { id: "TXN-003", type: "Despesa", description: "Aluguel - Sede", date: new Date("2024-07-25"), amount: 5000, status: "Concluído", category: "Infraestrutura" },
  { id: "TXN-004", type: "Receita", description: "Venda de Ingressos - Festa Julina", date: new Date("2024-07-22"), amount: 1230, status: "Pendente", category: "Eventos" },
  { id: "TXN-005", type: "Despesa", description: "Compra de Material de Escritório", date: new Date("2024-07-20"), amount: 320, status: "Concluído", category: "Material de Escritório" },
  { id: "TXN-006", type: "Reembolso", description: "Viagem para conferência - Carlos", date: new Date("2024-07-19"), amount: 450, status: "Aprovado", category: "Viagem" },
  { id: "TXN-007", type: "Despesa", description: "Serviços de Contabilidade", date: new Date("2024-07-18"), amount: 1200, status: "Concluído", category: "Fornecedores" },
  { id: "TXN-008", type: "Receita", description: "Patrocínio - Soluções Tech", date: new Date("2024-07-15"), amount: 10000, status: "Concluído", category: "Patrocínio" },
  { id: "TXN-009", type: "Reembolso", description: "Almoço com cliente - Beatriz", date: new Date("2024-07-14"), amount: 95.50, status: "Recusado", category: "Alimentação" },
  { id: "TXN-010", type: "Despesa", description: "Assinatura Software CRM", date: new Date("2024-07-01"), amount: 250, status: "Concluído", category: "Infraestrutura" },
];

const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
        case "Concluído":
        case "Aprovado":
             return "bg-green-100 text-green-800";
        case "Pendente":
        case "Em Análise":
            return "bg-yellow-100 text-yellow-800";
        case "Cancelado":
        case "Recusado":
            return "bg-red-100 text-red-800";
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
    initialTransactions: Transaction[];
    showAll?: boolean;
}

export function TransactionsTable({ initialTransactions, showAll = false }: TransactionsTableProps) {
    const [transactions, setTransactions] = useState([...allInitialTransactions]);

    useEffect(() => {
        setTransactions(prev => [...initialTransactions, ...prev]
            .filter((v,i,a)=>a.findIndex(t=>(t.id === v.id))===i) // Prevent duplicates
            .sort((a,b) => b.date.getTime() - a.date.getTime())
        )
    }, [initialTransactions]);

    const transactionsToShow = showAll ? transactions : transactions.slice(0, 5);

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Transação</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                 {transactionsToShow.map((transaction) => (
                    <TableRow key={transaction.id}>
                        <TableCell>
                            <div className="font-medium">{transaction.description}</div>
                            <div className="text-sm text-muted-foreground">{transaction.type}</div>
                        </TableCell>
                        <TableCell>{format(transaction.date, 'dd/MM/yyyy')}</TableCell>
                        <TableCell>
                           <Badge variant="secondary">{transaction.category}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge className={getStatusBadgeClass(transaction.status)}>{transaction.status}</Badge>
                        </TableCell>
                        <TableCell className={`text-right font-semibold ${getAmountClass(transaction.type as TransactionType)}`}>
                            {transaction.type === 'Receita' ? '+' : '-'} {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </TableCell>
                    </TableRow>
                 ))}
                 {transactionsToShow.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={5} className="h-24 text-center">Nenhuma transação encontrada.</TableCell>
                    </TableRow>
                 )}
            </TableBody>
        </Table>
    )
}
