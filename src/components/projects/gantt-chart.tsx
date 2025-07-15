"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { subDays, addDays, format, differenceInDays } from 'date-fns';

const chartData = [
  { task: "Projeto Social", start: subDays(new Date(), 30), end: addDays(new Date(), 0) },
  { task: "Marketing", start: subDays(new Date(), 10), end: addDays(new Date(), 10) },
  { task: "Website", start: subDays(new Date(), 5), end: addDays(new Date(), 25) },
  { task: "Legal", start: subDays(new Date(), 45), end: subDays(new Date(), 15) },
  { task: "Treinamento", start: addDays(new Date(), 2), end: addDays(new Date(), 12) },
];

const processedData = chartData.map(item => {
    const today = new Date();
    today.setHours(0,0,0,0);
    const startDay = subDays(item.start, differenceInDays(item.start, today));
    const duration = differenceInDays(item.end, item.start);
    const before = differenceInDays(item.start, startDay);
    return {
        name: item.task,
        range: [before, before + duration],
        uv: [before, duration],
    }
});


export function GanttChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Cronograma do Projeto (Gantt)</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <ChartContainer
          config={{
            uv: {
                label: "Duração",
                color: "hsl(var(--primary))",
            }
          }}
          className="h-[400px] w-full"
        >
          <BarChart
            layout="vertical"
            data={processedData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="uv" stackId="a" fill="hsl(var(--primary))" barSize={20} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
