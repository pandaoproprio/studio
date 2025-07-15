// src/components/projects/kanban-board.tsx
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

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

  const updateTask = (updatedTask: Task) => {
    setColumns(prev => {
        const newColumns = [...prev];
        for (const column of newColumns) {
            const taskIndex = column.tasks.findIndex(t => t.id === updatedTask.id);
            if (taskIndex !== -1) {
                column.tasks[taskIndex] = updatedTask;
                break;
            }
        }
        return newColumns;
    });
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
    let overColumnId: ColumnId | string | undefined;

    if (over.data.current?.type === 'Column') {
      overColumnId = overId;
    } else {
      overColumnId = findTask(overId)?.column.id;
    }

    if (!overColumnId || activeColumnId === overColumnId) {
      // Logic for reordering within the same column
      const activeColumn = findColumn(activeColumnId);
      if (!activeColumn) return;

      const oldIndex = activeColumn.tasks.findIndex(t => t.id === activeId);
      const newIndex = activeColumn.tasks.findIndex(t => t.id === overId);

      if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
        setColumns(prev => {
            const newColumns = [...prev];
            const activeColumnIndex = newColumns.findIndex(c => c.id === activeColumnId);
            if (activeColumnIndex === -1) return prev;

            newColumns[activeColumnIndex] = {
                ...newColumns[activeColumnIndex],
                tasks: arrayMove(activeColumn.tasks, oldIndex, newIndex)
            }
            return newColumns;
        });
      }

      return;
    }
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;
  
    const activeId = active.id.toString();
    const overId = over.id.toString();
  
    if (activeId === overId) return;
  
    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveATask) return;
  
    const isOverATask = over.data.current?.type === "Task";
    const isOverAColumn = over.data.current?.type === "Column";
  
    if (isActiveATask && (isOverATask || isOverAColumn)) {
      setColumns((prev) => {
        const activeTaskData = findTask(activeId);
        if (!activeTaskData) return prev;
  
        const { column: activeColumn, task: activeTask } = activeTaskData;
  
        const overColumnId = isOverAColumn
          ? overId
          : findTask(overId)?.column.id;
  
        if (!overColumnId || activeColumn.id === overColumnId) {
          return prev;
        }
  
        const newColumns = [...prev];
        const originalColumn = newColumns.find((c) => c.id === activeColumn.id);
        const targetColumn = newColumns.find((c) => c.id === overColumnId);
  
        if (!originalColumn || !targetColumn) return prev;
  
        const activeTaskIndex = originalColumn.tasks.findIndex(
          (t) => t.id === activeId
        );
        if (activeTaskIndex === -1) return prev;
  
        // Remove task from original column
        originalColumn.tasks.splice(activeTaskIndex, 1);
  
        // Add task to new column
        if (isOverATask) {
          const overTaskIndex = targetColumn.tasks.findIndex(
            (t) => t.id === overId
          );
          if (overTaskIndex !== -1) {
            targetColumn.tasks.splice(overTaskIndex, 0, activeTask);
          } else {
            targetColumn.tasks.push(activeTask);
          }
        } else {
          // Dropped on a column
          targetColumn.tasks.push(activeTask);
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
          <KanbanColumn key={col.id} column={col} updateTask={updateTask} />
        ))}
      </div>
      <DragOverlay>
        {activeTask ? <KanbanTaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({ column, updateTask }: { column: Column; updateTask: (task: Task) => void }) {
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

function KanbanTaskCard({ task, isOverlay, updateTask }: { task: Task, isOverlay?: boolean, updateTask?: (task: Task) => void }) {
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
    disabled: isOverlay, // Disable sorting when it's an overlay
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
        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
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

  if (isOverlay || !updateTask) {
    return card;
  }

  return (
    <TaskEditDialog task={task} onUpdate={updateTask}>
      {card}
    </TaskEditDialog>
  )
}

function TaskEditDialog({ task, onUpdate, children }: { task: Task; onUpdate: (task: Task) => void; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editedTask, setEditedTask] = useState(task);

    const handleSave = () => {
        onUpdate(editedTask);
        setIsOpen(false);
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
        setEditedTask(prev => ({ ...prev, tags }));
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Título</Label>
                        <Input 
                            id="title" 
                            value={editedTask.title}
                            onChange={(e) => setEditedTask(prev => ({...prev, title: e.target.value}))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição</Label>
                        <Textarea 
                            id="description" 
                            value={editedTask.description}
                            onChange={(e) => setEditedTask(prev => ({...prev, description: e.target.value}))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="priority">Prioridade</Label>
                        <Select 
                            value={editedTask.priority} 
                            onValueChange={(value: "low" | "medium" | "high") => setEditedTask(prev => ({...prev, priority: value}))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione a prioridade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="low">Baixa</SelectItem>
                                <SelectItem value="medium">Média</SelectItem>
                                <SelectItem value="high">Alta</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                        <Input 
                            id="tags" 
                            value={editedTask.tags.join(', ')}
                            onChange={handleTagsChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSave}>Salvar Alterações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}