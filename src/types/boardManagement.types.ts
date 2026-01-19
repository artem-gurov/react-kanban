export type Priority = "none" | "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface Board {
  id: string;
  name: string;
  columns: Column[];
  tasks: Record<string, Task>;
}