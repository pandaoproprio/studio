// src/components/dashboard/financial-overview.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown, Scale } from "lucide-react";

const metrics = [
    { title: "Saldo Atual", value: "R$ 75.830,50", icon: Scale },
    { title: "Receitas (Mês)", value: "R$ 15.231,89", icon: TrendingUp, change: "+20.1% vs. mês passado" },
    { title: "Despesas (Mês)", value: "R$ 8.750,00", icon: TrendingDown, change: "+5.2% vs. mês passado" },
    { title: "Lucro / Prejuízo (Mês)", value: "R$ 6.481,89", icon: DollarSign },
];

export function FinancialOverview() {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
                 <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                        <metric.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metric.value}</div>
                        {metric.change && <p className="text-xs text-muted-foreground">{metric.change}</p>}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}