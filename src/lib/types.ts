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
