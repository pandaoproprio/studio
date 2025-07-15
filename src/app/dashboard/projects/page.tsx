import { KanbanBoard } from "@/components/projects/kanban-board";
import { Button } from "@/components/ui/button";
import { Plus, GanttChartSquare } from "lucide-react";

export default function ProjectsPage() {
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
            <Button variant="outline">
                <GanttChartSquare className="mr-2 h-4 w-4" />
                Ver Gantt
            </Button>
            <Button>
                <Plus className="mr-2 h-4 w-4" />
                Novo Projeto
            </Button>
        </div>
      </div>
      <div className="flex-1">
        <KanbanBoard />
      </div>
    </div>
  );
}
