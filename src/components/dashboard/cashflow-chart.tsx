// src/components/dashboard/cashflow-chart.tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart"

const chartData = [
  { month: "Jan", revenue: 186, expenses: 80 },
  { month: "Fev", revenue: 305, expenses: 200 },
  { month: "Mar", revenue: 237, expenses: 120 },
  { month: "Abr", revenue: 73, expenses: 190 },
  { month: "Mai", revenue: 209, expenses: 130 },
  { month: "Jun", revenue: 214, expenses: 140 },
]

const chartConfig = {
  revenue: {
    label: "Receitas",
    color: "hsl(var(--chart-2))",
  },
  expenses: {
    label: "Despesas",
    color: "hsl(var(--chart-4))",
  },
}

export function CashflowChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Fluxo de Caixa</CardTitle>
        <CardDescription>Receitas vs. Despesas nos últimos 6 meses</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
            <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}