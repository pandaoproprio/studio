// src/components/projects/kanban/KanbanTaskCard.tsx
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GripVertical } from "lucide-react";
import type { Task } from "@/lib/types";
import { TaskEditDialog } from "./TaskEditDialog";

const priorityClasses = {
  urgent: "bg-red-600 border-red-600 text-white",
  high: "bg-orange-500 border-orange-500 text-white",
  medium: "bg-yellow-500 border-yellow-500 text-black",
  low: "bg-blue-500 border-blue-500 text-white",
};

interface KanbanTaskCardProps {
    task: Task;
    isOverlay?: boolean;
    updateTask?: (task: Task) => void;
}

export function KanbanTaskCard({ task, isOverlay, updateTask }: KanbanTaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "Task",
      task,
    },
    disabled: isOverlay,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  
  const completedSubtasks = task.subtasks.filter(st => st.completed).length;
  const totalSubtasks = task.subtasks.length;
  
  if (isDragging) {
    return (
        <div
            ref={setNodeRef}
            style={style}
            className="h-[148px] rounded-lg bg-primary/10 border-2 border-dashed border-primary"
        />
    );
  }

  const card = (
    <Card 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`cursor-grab shadow-md hover:shadow-lg transition-shadow ${isOverlay ? 'ring-2 ring-primary' : 'active:cursor-grabbing'}`}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{task.description}</p>
        {totalSubtasks > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <GripVertical className="h-4 w-4" />
                <span>{completedSubtasks} de {totalSubtasks} subtarefas</span>
            </div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              className={`capitalize ${priorityClasses[task.priority]}`}
            >
              {task.priority}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
             {task.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isOverlay || !updateTask) {
    return card;
  }

  return (
    <TaskEditDialog task={task} onUpdate={updateTask}>
      {card}
    </TaskEditDialog>
  )
}
