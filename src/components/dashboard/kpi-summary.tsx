// src/components/dashboard/kpi-summary.tsx
"use client";

import { useEffect, useState } from "react";
import { Bot, AlertCircle, TrendingUp, TrendingDown } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccountStatusSummaryAction } from "@/lib/actions";

type SummaryData = {
  narrativeSummary: string;
  attentionPoints: string[];
};

export function KpiSummary() {
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const result = await getAccountStatusSummaryAction();
        if (result.data) {
          setSummary(result.data);
        } else {
          setError(result.error || "A IA não conseguiu gerar o resumo.");
        }
      } catch (e) {
        setError("Ocorreu um erro ao buscar o resumo da IA.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Bot className="w-5 h-5 text-primary" />
          KPIs Analíticos
        </CardTitle>
        <CardDescription>
          Um resumo da semana gerado por IA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        ) : summary ? (
          <div className="space-y-4">
            <div>
                <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><TrendingUp className="w-4 h-4"/> Resumo Narrativo</h4>
                <p className="text-sm text-muted-foreground">{summary.narrativeSummary}</p>
            </div>
             <div>
                <h4 className="font-semibold text-sm mb-1 flex items-center gap-2"><TrendingDown className="w-4 h-4"/> Pontos de Atenção</h4>
                 <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    {summary.attentionPoints.map((point, i) => <li key={i}>{point}</li>)}
                 </ul>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
