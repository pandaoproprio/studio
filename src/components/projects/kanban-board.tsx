"use client";

import { Column, ColumnId, Task } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";

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
  return (
    <div className="flex h-full w-full gap-4 overflow-x-auto pb-4">
      {initialColumns.map((col) => (
        <KanbanColumn key={col.id} column={col} />
      ))}
    </div>
  );
}

function KanbanColumn({ column }: { column: Column }) {
  return (
    <div className="flex w-80 shrink-0 flex-col rounded-lg bg-secondary">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-headline font-semibold">{column.title}</h3>
        <Badge variant="secondary">{column.tasks.length}</Badge>
      </div>
      <div className="flex-1 space-y-4 p-4 overflow-y-auto">
        {column.tasks.map((task) => (
          <KanbanTaskCard key={task.id} task={task} />
        ))}
        <Button variant="ghost" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" />
            Adicionar tarefa
        </Button>
      </div>
    </div>
  );
}

function KanbanTaskCard({ task }: { task: Task }) {
  return (
    <Card className="cursor-grab active:cursor-grabbing shadow-md hover:shadow-lg transition-shadow">
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
