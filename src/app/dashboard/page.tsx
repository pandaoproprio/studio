
"use client";

import { useEffect, useState } from "react";
import { KeyMetrics } from "@/components/dashboard/key-metrics";
import { ProjectsStatusChart } from "@/components/dashboard/projects-status-chart";
import { QuickAccessCarousel } from "@/components/dashboard/quick-access-carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";


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

    // Simulação de uma chamada de IA para uma dica.
    // Em um cenário real, isso viria de um flow Genkit.
    setTimeout(() => {
      const tips = [
        "Analise os riscos de tarefas no seu quadro Kanban para antecipar gargalos.",
        "Use o gerador de relatórios de progresso para manter seus stakeholders informados.",
        "Fortaleça o relacionamento com seus contatos usando o diagnóstico de IA no CRM.",
        "Crie vídeos de impacto a partir de textos para engajar sua comunidade.",
      ];
      setTip(tips[Math.floor(Math.random() * tips.length)]);
      setIsLoadingTip(false);
    }, 1500);

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
                <p className="text-primary-foreground/90">{tip}</p>
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
