"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getAccountStatusSummaryAction } from "@/lib/actions";
import type { AccountStatusSummaryOutput } from "@/ai/flows/account-status-summary";
import { Loader2, Users, Package, CircleDollarSign, BarChart } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "../ui/skeleton";

export function AccountStatus() {
  const [summary, setSummary] = useState<AccountStatusSummaryOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetSummary = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getAccountStatusSummaryAction();
      if (result.data) {
        setSummary(result.data);
      } else {
        setError(result.error || "Failed to get summary.");
      }
    } catch (e) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl">Resumo da Conta</CardTitle>
        <CardDescription>Veja um resumo do status da sua conta gerado por IA.</CardDescription>
      </CardHeader>
      <CardContent>
        {!summary && !isLoading && (
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border-2 border-dashed border-border p-8 text-center">
            <h3 className="font-headline text-lg font-semibold">Gerar Resumo da Conta</h3>
            <p className="text-sm text-muted-foreground">Clique no botão abaixo para que nossa IA analise e resuma sua conta.</p>
            <Button onClick={handleGetSummary} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                "Obter Resumo"
              )}
            </Button>
          </div>
        )}

        {isLoading && <SummarySkeleton />}

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {summary && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard icon={Users} title="Usuários" value={summary.numberOfUsers.toString()} />
              <InfoCard icon={CircleDollarSign} title="Nível de Gasto" value={summary.spendLevel} className="capitalize" />
              <InfoCard icon={BarChart} title="Gasto Projetado" value={summary.projectedSpendNextYear} />
              <InfoCard icon={Package} title="Módulos" value={summary.modulesUsed.join(', ')} />
            </div>
             <Button variant="outline" onClick={() => setSummary(null)}>Gerar novamente</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function InfoCard({ icon: Icon, title, value, className }: { icon: React.ElementType, title: string, value: string, className?: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${className}`}>{value}</div>
      </CardContent>
    </Card>
  )
}

function SummarySkeleton() {
  return (
     <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
           <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
