// src/app/dashboard/projects/page.tsx
"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { GanttChart } from "@/components/projects/gantt-chart";
import { Button } from "@/components/ui/button";
import { Plus, GanttChartSquare, KanbanSquare } from "lucide-react";
import { ProjectSwitcher } from "@/components/projects/project-switcher";

type View = "kanban" | "gantt";

export default function ProjectsPage() {
  const [view, setView] = useState<View>("kanban");

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <div>
            <h1 className="text-3xl font-bold font-headline tracking-tight">
                Gestão de Projetos
            </h1>
            <p className="text-muted-foreground">
                Selecione um projeto para visualizar suas tarefas.
            </p>
            </div>
            <ProjectSwitcher />
        </div>
        <div className="flex gap-2">
            <Button
                variant="outline"
                size="sm"
                onClick={() => setView(view === "kanban" ? "gantt" : "kanban")}
            >
                {view === "kanban" ? (
                <>
                    <GanttChartSquare className="mr-2 h-4 w-4" />
                    Ver Gantt
                </>
                ) : (
                <>
                    <KanbanSquare className="mr-2 h-4 w-4" />
                    Ver Kanban
                </>
                )}
            </Button>
            <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Novo Projeto
            </Button>
        </div>
      </div>
      <div className="flex-1">
        {view === "kanban" ? <KanbanBoard /> : <GanttChart />}
      </div>
    </div>
  );
}
