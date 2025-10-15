// src/app/dashboard/projects/[projectId]/financials/page.tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, PlusCircle, Scale, TrendingDown, TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TransactionsTable } from "@/components/financial/transactions-table";
import { Transaction } from "@/lib/types";

const projectFinancials = {
    budget: 25000,
    spent: 18750,
    revenue: 5000,
    balance: 25000 - 18750,
};

const categorySpending = [
    { category: 'Marketing', total: 4500, fill: "var(--color-marketing)" },
    { category: 'Recursos Humanos', total: 8000, fill: "var(--color-hr)" },
    { category: 'Infraestrutura', total: 3250, fill: "var(--color-infra)" },
    { category: 'Fornecedores', total: 3000, fill: "var(--color-vendors)" },
];

const chartConfig = {
  total: { label: "Total Gasto" },
  marketing: { label: "Marketing", color: "hsl(var(--chart-1))" },
  hr: { label: "Recursos Humanos", color: "hsl(var(--chart-2))" },
  infra: { label: "Infraestrutura", color: "hsl(var(--chart-3))" },
  vendors: { label: "Fornecedores", color: "hsl(var(--chart-4))" },
};

export default function ProjectFinancialsPage() {
    const remainingBudget = projectFinancials.budget - projectFinancials.spent;
    const spentPercentage = (projectFinancials.spent / projectFinancials.budget) * 100;

    const mockTransactions: Transaction[] = [
        { id: "TXN-P001", type: "Despesa", description: "Anúncios em Redes Sociais", date: new Date("2024-07-20"), amount: 1500, status: "Concluído", category: "Marketing" },
        { id: "TXN-P002", type: "Despesa", description: "Pagamento Freelancer Design", date: new Date("2024-07-18"), amount: 3000, status: "Concluído", category: "Recursos Humanos" },
        { id: "TXN-P003", type: "Receita", description: "Doação específica para o projeto", date: new Date("2024-07-15"), amount: 5000, status: "Concluído", category: "Doação" },
    ];


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                 <div>
                    <h2 className="text-2xl font-bold font-headline tracking-tight">
                        Financeiro do Projeto
                    </h2>
                    <p className="text-muted-foreground">
                        Acompanhe o orçamento, gastos e transações específicas deste projeto.
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

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Orçamento Total</CardTitle>
                        <Scale className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projectFinancials.budget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Gasto</CardTitle>
                        <TrendingDown className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projectFinancials.spent.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                        <p className="text-xs text-muted-foreground">{spentPercentage.toFixed(1)}% do orçamento</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Receitas Vinculadas</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{projectFinancials.revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
                        <Scale className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">{remainingBudget.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
                <Card className="lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="font-headline">Gastos por Categoria</CardTitle>
                        <CardDescription>Distribuição dos gastos do projeto por categoria.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
                            <BarChart accessibilityLayer data={categorySpending}>
                                <CartesianGrid vertical={false} />
                                <XAxis
                                dataKey="category"
                                tickLine={false}
                                tickMargin={10}
                                axisLine={false}
                                />
                                <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent hideLabel />}
                                />
                                <Bar dataKey="total" radius={8} />
                            </BarChart>
                        </ChartContainer>
                    </CardContent>
                </Card>
                 <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle className="font-headline">Últimas Transações do Projeto</CardTitle>
                    </CardHeader>
                    <CardContent className="px-0">
                         <TransactionsTable initialTransactions={mockTransactions} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}