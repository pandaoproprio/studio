// src/components/dashboard/transactions-table.tsx
"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Transaction } from "@/lib/types";
import { TransactionsTable as FullTransactionsTable } from "@/components/financial/transactions-table";


interface TransactionsTableProps {
    recentTransactions: Transaction[];
}

export function TransactionsTable({ recentTransactions }: TransactionsTableProps) {

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
                    <Link href="/dashboard/financials/transactions">
                        Ver Todas
                        <ArrowUpRight className="h-4 w-4" />
                    </Link>
                </Button>
            </CardHeader>
            <CardContent className="px-0">
                <FullTransactionsTable initialTransactions={recentTransactions} />
            </CardContent>
        </Card>
    )
}
