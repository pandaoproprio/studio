// src/components/projects/kanban/KanbanColumn.tsx
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Column, Task } from "@/lib/types";
import { PlusCircle } from "lucide-react";
import { KanbanTaskCard } from "./KanbanTaskCard";

interface KanbanColumnProps {
    column: Column;
    updateTask: (task: Task) => void;
}

export function KanbanColumn({ column, updateTask }: KanbanColumnProps) {
    const { setNodeRef } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
  });
  
  return (
    <div ref={setNodeRef} className="flex w-80 shrink-0 flex-col rounded-lg bg-secondary">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-headline font-semibold">{column.title}</h3>
        <Badge variant="secondary">{column.tasks.length}</Badge>
      </div>
      <div className="flex-1 space-y-4 p-4 overflow-y-auto">
        <SortableContext items={column.tasks.map(t => t.id)}>
            {column.tasks.map((task) => (
                <KanbanTaskCard key={task.id} task={task} updateTask={updateTask} />
            ))}
        </SortableContext>
        <Button variant="ghost" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar tarefa
        </Button>
      </div>
    </div>
  );
}
