// src/app/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ProjectsStatusChart } from "@/components/dashboard/projects-status-chart";
import { QuickAccessCarousel } from "@/components/dashboard/quick-access-carousel";
import { FinancialOverview } from "@/components/dashboard/financial-overview";

export default function DashboardPage() {
  const [greeting, setGreeting] = useState("Bem-vindo(a)");

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Bom dia");
    } else if (currentHour < 18) {
      setGreeting("Boa tarde");
    } else {
      setGreeting("Boa noite");
    }
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

      <FinancialOverview />

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
