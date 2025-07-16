// src/app/dashboard/projects/[projectId]/page.tsx
"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { GanttChart } from "@/components/projects/gantt-chart";
import { Button } from "@/components/ui/button";
import { Plus, GanttChartSquare, KanbanSquare, ArrowLeft } from "lucide-react";
import { ProjectSwitcher } from "@/components/projects/project-switcher";
import Link from "next/link";

type View = "kanban" | "gantt";

export default function ProjectBoardPage({ params }: { params: { projectId: string } }) {
  const [view, setView] = useState<View>("kanban");

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/dashboard/projects">
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Voltar para Projetos</span>
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold font-headline tracking-tight">
                  <ProjectSwitcher />
              </h1>
              <p className="text-muted-foreground">
                  Projeto: {params.projectId}
              </p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button
                variant="outline"
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
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Tarefa
            </Button>
        </div>
      </div>
      <div className="flex-1">
        {view === "kanban" ? <KanbanBoard /> : <GanttChart />}
      </div>
    </div>
  );
}
