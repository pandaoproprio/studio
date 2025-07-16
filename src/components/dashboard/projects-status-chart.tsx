// src/components/dashboard/projects-status-chart.tsx
"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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
} from "@/components/ui/chart"

const chartData = [
  { status: "Planejamento", projects: 4, fill: "var(--color-planning)" },
  { status: "Em Andamento", projects: 6, fill: "var(--color-inProgress)" },
  { status: "Atrasado", projects: 1, fill: "var(--color-delayed)" },
  { status: "Concluído", projects: 8, fill: "var(--color-completed)" },
]

const chartConfig = {
  projects: {
    label: "Projetos",
  },
  planning: {
    label: "Planejamento",
    color: "hsl(var(--chart-2))",
  },
  inProgress: {
    label: "Em Andamento",
    color: "hsl(var(--chart-1))",
  },
  delayed: {
    label: "Atrasado",
    color: "hsl(var(--chart-4))",
  },
  completed: {
    label: "Concluído",
    color: "hsl(var(--chart-5))",
  },
}

export function ProjectsStatusChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline">Status dos Projetos</CardTitle>
        <CardDescription>Visão geral do portfólio de projetos</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{
              left: 10,
            }}
          >
            <YAxis
              dataKey="status"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <XAxis dataKey="projects" type="number" hide />
            <CartesianGrid horizontal={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar
              dataKey="projects"
              radius={5}
              background={{
                fill: "hsl(var(--muted))",
                radius: 5,
              }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
