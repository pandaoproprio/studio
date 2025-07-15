export type ColumnId = "backlog" | "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  tags: string[];
}

export interface Column {
  id: ColumnId;
  title: string;
  tasks: Task[];
}
