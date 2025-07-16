
import { KeyMetrics } from "@/components/dashboard/key-metrics";
import { ProjectsStatusChart } from "@/components/dashboard/projects-status-chart";
import { QuickAccessCarousel } from "@/components/dashboard/quick-access-carousel";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline tracking-tight">
          Bem-vinda, Joana!
        </h1>
        <p className="text-muted-foreground">
          Aqui está um resumo das atividades e métricas da sua organização.
        </p>
      </div>

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
