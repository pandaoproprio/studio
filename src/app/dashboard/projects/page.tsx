// src/app/dashboard/projects/page.tsx
"use client";

import { useState } from "react";
import { KanbanBoard } from "@/components/projects/kanban-board";
import { GanttChart } from "@/components/projects/gantt-chart";
import { Button } from "@/components/ui/button";
import { Plus, GanttChartSquare, KanbanSquare } from "lucide-react";

type View = "kanban" | "gantt";

export default function ProjectsPage() {
  const [view, setView] = useState<View>("kanban");

  return (
    <div className="flex h-full flex-col space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-headline tracking-tight">
            Gestão de Projetos
          </h1>
          <p className="text-muted-foreground">
            Organize suas tarefas com os quadros Kanban e Gantt.
          </p>
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
