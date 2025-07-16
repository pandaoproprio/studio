// src/components/projects/kanban-board.tsx
"use client";

import { useState } from "react";
import { Column, ColumnId, Task, Subtask } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { GripVertical, Plus, PlusCircle, Trash2 } from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Separator } from "../ui/separator";

export const initialColumns: Column[] = [
  {
    id: "backlog",
    title: "Backlog",
    tasks: [
      { id: "task-1", title: "Definir escopo do Projeto Social", description: "Reunião com stakeholders para alinhar expectativas.", priority: "high", tags: ["Planning", "Q1"], subtasks: [] },
      { id: "task-2", title: "Pesquisa de fornecedores para materiais", description: "Orçar materiais didáticos e lanches.", priority: "medium", tags: ["Procurement"], subtasks: [] },
    ],
  },
  {
    id: "todo",
    title: "A Fazer",
    tasks: [
      { id: "task-3", title: "Criar campanha de marketing para doações", description: "Elaborar posts para redes sociais e e-mail marketing.", priority: "high", tags: ["Marketing"], subtasks: [
          {id: 'sub-1', title: "Definir público-alvo", completed: true},
          {id: 'sub-2', title: "Escrever copy para posts", completed: false},
      ] },
      { id: "task-4", title: "Agendar treinamento de voluntários", description: "Definir data e local do treinamento inicial.", priority: "low", tags: ["HR", "Training"], subtasks: [] },
    ],
  },
  {
    id: "in-progress",
    title: "Em Andamento",
    tasks: [
      { id: "task-5", title: "Desenvolver o website do projeto", description: "Implementar a página de doações.", priority: "high", tags: ["Tech", "Website"], subtasks: [
        {id: 'sub-3', title: "Criar layout no Figma", completed: true},
        {id: 'sub-4', title: "Desenvolver front-end", completed: true},
        {id: 'sub-5', title: "Conectar com gateway de pagamento", completed: false},
      ] },
    ],
  },
  {
    id: "review",
    title: "Aguardando Revisão",
    tasks: [],
  },
  {
    id: "done",
    title: "Concluído",
    tasks: [
      { id: "task-6", title: "Registrar a organização legalmente", description: "CNPJ e demais documentos emitidos.", priority: "medium", tags: ["Legal"], subtasks: [] },
    ],
  },
  {
    id: "blocked",
    title: "Impedido",
    tasks: [],
  }
];

const priorityClasses = {
  urgent: "bg-red-600 border-red-600 text-white",
  high: "bg-orange-500 border-orange-500 text-white",
  medium: "bg-yellow-500 border-yellow-500 text-black",
  low: "bg-blue-500 border-blue-500 text-white",
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
  
  const findTaskInColumns = (taskId: string, cols: Column[]): { column: Column, task: Task } | undefined => {
    for (const column of cols) {
      const task = column.tasks.find(t => t.id === taskId);
      if (task) {
        return { column, task };
      }
    }
    return undefined;
  }

  const updateTaskInColumns = (updatedTask: Task) => {
    setColumns(prev => 
        prev.map(col => ({
            ...col,
            tasks: col.tasks.map(t => t.id === updatedTask.id ? updatedTask : t)
        }))
    );
  }

  const onDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeTaskData = findTaskInColumns(active.id.toString(), columns);
    if (!activeTaskData) return;

    const activeColumnId = activeTaskData.column.id;
    let overColumnId: ColumnId | string | undefined = over.id.toString();

    // Check if dropping on a column or a task
    if (over.data.current?.type === 'Task') {
      overColumnId = findTaskInColumns(over.id.toString(), columns)?.column.id;
    } else {
      overColumnId = over.id.toString();
    }

    if (!overColumnId || activeColumnId === overColumnId) {
       // Logic for reordering within the same column
       const activeColumn = findColumn(activeColumnId);
       if (!activeColumn) return;
 
       const oldIndex = activeColumn.tasks.findIndex(t => t.id === active.id);
       const newIndex = activeColumn.tasks.findIndex(t => t.id === over.id);
 
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

    // Logic for moving between columns is handled in onDragOver
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
  
    const isActiveATask = active.data.current?.type === "Task";
    if (!isActiveATask) return;
  
    const isOverAColumn = over.data.current?.type === "Column";
    const isOverATask = over.data.current?.type === "Task";
  
    if (isActiveATask && (isOverAColumn || isOverATask)) {
      setColumns((prev) => {
        const activeId = active.id.toString();
        const overId = over.id.toString();
        
        const activeTaskData = findTaskInColumns(activeId, prev);
        if (!activeTaskData) return prev;
        
        const { column: activeColumn, task: activeTask } = activeTaskData;
        
        const overColumnId = isOverAColumn ? overId : findTaskInColumns(overId, prev)?.column.id;
        
        if (!overColumnId || activeColumn.id === overColumnId) {
          // Handle reordering within the same column
           const column = findColumn(activeColumn.id);
           if (!column) return prev;
           const oldIndex = column.tasks.findIndex(t => t.id === activeId);
           const newIndex = isOverATask ? column.tasks.findIndex(t => t.id === overId) : column.tasks.length;
 
           if (oldIndex !== newIndex && oldIndex !== -1 && newIndex !== -1) {
                const newColumns = [...prev];
                const colIndex = newColumns.findIndex(c => c.id === activeColumn.id);
                newColumns[colIndex].tasks = arrayMove(column.tasks, oldIndex, newIndex);
                return newColumns;
           }
           return prev;

        }
  
        // Handle moving to a different column
        const newColumns = [...prev];
        const originalColIndex = newColumns.findIndex(c => c.id === activeColumn.id);
        const targetColIndex = newColumns.findIndex(c => c.id === overColumnId);
  
        if (originalColIndex === -1 || targetColIndex === -1) return prev;
  
        const activeTaskIndex = newColumns[originalColIndex].tasks.findIndex(t => t.id === activeId);
        if (activeTaskIndex === -1) return prev;
  
        // Remove task from original column
        const [movedTask] = newColumns[originalColIndex].tasks.splice(activeTaskIndex, 1);
  
        // Add task to new column
        if (isOverATask) {
          const overTaskIndex = newColumns[targetColIndex].tasks.findIndex(t => t.id === overId);
          newColumns[targetColIndex].tasks.splice(overTaskIndex, 0, movedTask);
        } else {
          // Dropped on a column
          newColumns[targetColIndex].tasks.push(movedTask);
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
          <KanbanColumn key={col.id} column={col} updateTask={updateTaskInColumns} />
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

function TaskEditDialog({ task, onUpdate, children }: { task: Task; onUpdate: (task: Task) => void; children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editedTask, setEditedTask] = useState(task);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

    const handleSave = () => {
        onUpdate(editedTask);
        setIsOpen(false);
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
        setEditedTask(prev => ({ ...prev, tags }));
    }

    const handleSubtaskChange = (subtaskId: string, completed: boolean) => {
        setEditedTask(prev => ({
            ...prev,
            subtasks: prev.subtasks.map(st => st.id === subtaskId ? {...st, completed} : st)
        }))
    }

    const handleAddSubtask = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubtaskTitle.trim()) return;
        const newSubtask: Subtask = {
            id: `sub-${Date.now()}`,
            title: newSubtaskTitle.trim(),
            completed: false
        }
        setEditedTask(prev => ({...prev, subtasks: [...prev.subtasks, newSubtask]}));
        setNewSubtaskTitle("");
    }
    
    const handleRemoveSubtask = (subtaskId: string) => {
        setEditedTask(prev => ({
            ...prev,
            subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
        }))
    }

    // Reset state if dialog is closed without saving
    React.useEffect(() => {
        if (isOpen) {
            setEditedTask(task);
        }
    }, [isOpen, task]);

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Editar Tarefa</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
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
                            rows={4}
                            value={editedTask.description}
                            onChange={(e) => setEditedTask(prev => ({...prev, description: e.target.value}))}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="priority">Prioridade</Label>
                            <Select 
                                value={editedTask.priority} 
                                onValueChange={(value: "low" | "medium" | "high" | "urgent") => setEditedTask(prev => ({...prev, priority: value}))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione a prioridade" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="low">Baixa</SelectItem>
                                    <SelectItem value="medium">Média</SelectItem>
                                    <SelectItem value="high">Alta</SelectItem>
                                    <SelectItem value="urgent">Urgente</SelectItem>
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
                    <Separator />
                    <div className="space-y-4">
                        <Label>Subtarefas</Label>
                        <div className="space-y-2">
                            {editedTask.subtasks.map(subtask => (
                                <div key={subtask.id} className="flex items-center gap-2 group">
                                    <Checkbox 
                                        id={subtask.id} 
                                        checked={subtask.completed}
                                        onCheckedChange={(checked) => handleSubtaskChange(subtask.id, !!checked)}
                                    />
                                    <label htmlFor={subtask.id} className="flex-1 text-sm">{subtask.title}</label>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => handleRemoveSubtask(subtask.id)}>
                                        <Trash2 className="h-4 w-4 text-destructive"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                         <form onSubmit={handleAddSubtask} className="flex gap-2">
                            <Input 
                                placeholder="Adicionar nova subtarefa..."
                                value={newSubtaskTitle}
                                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            />
                            <Button type="submit" variant="secondary">
                                <Plus className="h-4 w-4 mr-2" /> Adicionar
                            </Button>
                        </form>
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
