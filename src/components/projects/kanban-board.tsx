"use client";

import { useState } from "react";
import { Column, ColumnId, Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragOverlay,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [
      { id: "task-1", title: "Definir escopo do Projeto Social", description: "Reunião com stakeholders para alinhar expectativas.", priority: "high", tags: ["Planning", "Q1"] },
      { id: "task-2", title: "Pesquisa de fornecedores para materiais", description: "Orçar materiais didáticos e lanches.", priority: "medium", tags: ["Procurement"] },
    ],
  },
  {
    id: "todo",
    title: "A Fazer",
    tasks: [
      { id: "task-3", title: "Criar campanha de marketing para doações", description: "Elaborar posts para redes sociais e e-mail marketing.", priority: "high", tags: ["Marketing"] },
      { id: "task-4", title: "Agendar treinamento de voluntários", description: "Definir data e local do treinamento inicial.", priority: "low", tags: ["HR", "Training"] },
    ],
  },
  {
    id: "in-progress",
    title: "Em Andamento",
    tasks: [
      { id: "task-5", title: "Desenvolver o website do projeto", description: "Implementar a página de doações.", priority: "high", tags: ["Tech", "Website"] },
    ],
  },
  {
    id: "done",
    title: "Concluído",
    tasks: [
      { id: "task-6", title: "Registrar a organização legalmente", description: "CNPJ e demais documentos emitidos.", priority: "medium", tags: ["Legal"] },
    ],
  },
];

const priorityClasses = {
  high: "bg-red-500 border-red-500",
  medium: "bg-yellow-500 border-yellow-500",
  low: "bg-green-500 border-green-500",
};

export function KanbanBoard() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px
      },
    })
  );

  const findColumn = (id: ColumnId | string): Column | undefined => {
    return columns.find((col) => col.id === id);
  };
  
  const findTask = (id: string): { column: Column, task: Task } | undefined => {
    for (const column of columns) {
      const task = column.tasks.find(t => t.id === id);
      if (task) {
        return { column, task };
      }
    }
    return undefined;
  }

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    const activeTaskData = findTask(activeId);
    if (!activeTaskData) return;

    const activeColumnId = activeTaskData.column.id;
    const overColumnId = over.data.current?.type === "Column" ? overId : findTask(overId)?.column.id;

    if (!overColumnId || activeColumnId === overColumnId) {
      // Logic for reordering within the same column
      const activeColumn = findColumn(activeColumnId);
      if (!activeColumn) return;

      setColumns(prev => {
        const activeColumnIndex = prev.findIndex(c => c.id === activeColumnId);
        if (activeColumnIndex === -1) return prev;

        const oldIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
        const newIndex = activeColumn.tasks.findIndex(t => t.id === overId);
        if (oldIndex === -1 || newIndex === -1) return prev;
        
        const newColumns = [...prev];
        newColumns[activeColumnIndex] = {
            ...newColumns[activeColumnIndex],
            tasks: arrayMove(activeColumn.tasks, oldIndex, newIndex)
        }
        return newColumns;
      });

      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id.toString();
    const overId = over.id.toString();

    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveATask) return;

    const isOverAColumn = over.data.current?.type === "Column";
    const isOverATask = over.data.current?.type === "Task";

    if (isActiveATask && (isOverAColumn || isOverATask)) {
      setColumns((prev) => {
        const activeTaskData = findTask(activeId);
        if (!activeTaskData) return prev;

        const activeColumnId = activeTaskData.column.id;
        const overColumnId = isOverAColumn ? overId : findTask(overId)?.column.id;
        
        if (!overColumnId || activeColumnId === overColumnId) {
            return prev;
        }

        const newColumns = [...prev];
        const activeColumn = newColumns.find(c => c.id === activeColumnId);
        const overColumn = newColumns.find(c => c.id === overColumnId);
        
        if (!activeColumn || !overColumn) return prev;

        const activeTaskIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
        if (activeTaskIndex === -1) return prev;
        
        const [movedTask] = activeColumn.tasks.splice(activeTaskIndex, 1);
        
        if (isOverATask) {
            const overTaskIndex = overColumn.tasks.findIndex(t => t.id === overId);
            if (overTaskIndex !== -1) {
                overColumn.tasks.splice(overTaskIndex, 0, movedTask);
            } else {
                 overColumn.tasks.push(movedTask);
            }
        } else {
            overColumn.tasks.push(movedTask);
        }

        return newColumns;
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      collisionDetection={closestCorners}
    >
      <div className="flex h-full w-full gap-4 overflow-x-auto pb-4">
        {columns.map((col) => (
          <KanbanColumn key={col.id} column={col} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanTaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({ column }: { column: Column }) {
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
                <KanbanTaskCard key={task.id} task={task} />
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

function KanbanTaskCard({ task, isOverlay }: { task: Task, isOverlay?: boolean }) {
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
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };
  
  if (isDragging) {
    return (
        <div
        ref={setNodeRef}
        style={style}
        className="h-[148px] rounded-lg bg-primary/10 border-2 border-dashed border-primary"
        />
    );
  }

  return (
    <Card 
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`cursor-grab shadow-md hover:shadow-lg transition-shadow ${isOverlay ? 'ring-2 ring-primary' : 'active:cursor-grabbing'}`}
    >
      <CardHeader className="p-4">
        <CardTitle className="text-base">{task.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground">{task.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge
              className={`text-white ${priorityClasses[task.priority]}`}
            >
              {task.priority}
            </Badge>
            {task.tags.map(tag => <Badge key={tag} variant="outline">{tag}</Badge>)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
