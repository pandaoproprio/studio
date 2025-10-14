
"use client";

import { useEffect, useState } from "react";
import { KeyMetrics } from "@/components/dashboard/key-metrics";
import { ProjectsStatusChart } from "@/components/dashboard/projects-status-chart";
import { QuickAccessCarousel } from "@/components/dashboard/quick-access-carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getDailyTipAction } from "@/lib/actions";


export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Bem-vindo(a)");
  const [tip, setTip] = useState("Carregando dica do dia...");
  const [isLoadingTip, setIsLoadingTip] = useState(true);

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Bom dia");
    } else if (currentHour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }

    const fetchTip = async () => {
        try {
            setIsLoadingTip(true);
            const result = await getDailyTipAction();
            if (result.data) {
                setTip(result.data.tip);
            } else {
                setTip("Não foi possível carregar a dica de hoje. Tente novamente mais tarde.");
            }
        } catch (error) {
            setTip("Ocorreu um erro ao buscar a dica do dia.");
        } finally {
            setIsLoadingTip(false);
        }
    }
    fetchTip();

  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          {greeting}, Juan Pablo!
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo das atividades e métricas da sua organização.
        </p>
      </div>
      
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader className="pb-2">
            <CardTitle className="text-lg font-headline flex items-center gap-2">
                <Lightbulb className="text-primary h-5 w-5"/>
                <span>Dica do Dia com IA</span>
            </CardTitle>
        </CardHeader>
        <CardContent>
            {isLoadingTip ? (
                <Skeleton className="h-5 w-3/4" />
            ) : (
                <p className="text-muted-foreground">{tip}</p>
            )}
        </CardContent>
      </Card>

      <KeyMetrics />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
            <ProjectsStatusChart />
        </div>
        <div className="lg:col-span-2">
           <QuickAccessCarousel />
        </div>
      </div>

    </div>
  );
}
