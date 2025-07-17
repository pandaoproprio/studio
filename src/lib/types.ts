export type ColumnId = "backlog" | "todo" | "in-progress" | "review" | "done" | "blocked";

export interface Subtask {
    id: string;
    title: string;
    completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "urgent";
  tags: string[];
  subtasks: Subtask[];
}

export interface Column {
  id: ColumnId;
  title: string;
  tasks: Task[];
}

export type TransactionType = "Receita" | "Despesa" | "Reembolso";
export type TransactionStatus = "Concluído" | "Pendente" | "Cancelado" | "Em Análise" | "Recusado";

export interface Transaction {
    id: string;
    type: TransactionType;
    description: string;
    amount: number;
    date: Date;
    category: string;
    status: TransactionStatus;
}
