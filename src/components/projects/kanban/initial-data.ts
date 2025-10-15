// src/components/projects/kanban/initial-data.ts
import type { Column } from "@/lib/types";

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
        { id: "task-5", title: "Desenvolver o website do projeto", description: "Implementar a página de doações. Depende da definição do gateway de pagamento.", priority: "high", tags: ["Tech", "Website"], subtasks: [
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
