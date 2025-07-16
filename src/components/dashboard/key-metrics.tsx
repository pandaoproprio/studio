// src/components/dashboard/key-metrics.tsx
"use client";

import { useEffect, useState } from "react";
import { DollarSign, Users, TrendingUp, Package } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getAccountStatusSummaryAction } from "@/lib/actions";
import { type AccountStatusSummaryOutput } from "@/ai/flows/account-status-summary";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ElementType;
}

function MetricCard({ title, value, icon: Icon }: MetricCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}

function MetricCardSkeleton() {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <Skeleton className="h-4 w-32" />
            </CardHeader>
            <CardContent>
                <Skeleton className="h-8 w-24" />
            </CardContent>
        </Card>
    )
}

export function KeyMetrics() {
  const [summary, setSummary] = useState<AccountStatusSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setIsLoading(true);
        const result = await getAccountStatusSummaryAction();
        if (result.data) {
          setSummary(result.data);
        } else {
          setError(result.error || "Failed to load summary.");
        }
      } catch (e) {
        setError("An unexpected error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  if (isLoading) {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
        </div>
    )
  }

  if (error || !summary) {
    return <div className="text-destructive">Erro ao carregar métricas. Tente novamente mais tarde.</div>
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard title="Gasto Atual" value={summary.spendLevel} icon={DollarSign} />
      <MetricCard title="Usuários Ativos" value={summary.numberOfUsers.toString()} icon={Users} />
      <MetricCard title="Gasto Projetado (Anual)" value={summary.projectedSpendNextYear} icon={TrendingUp} />
      <MetricCard title="Módulos Utilizados" value={summary.modulesUsed.length.toString()} icon={Package} />
    </div>
  );
}
