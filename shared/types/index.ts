export const PRIORITIES = ["none", "low", "medium", "high"] as const;
export type Priority = typeof PRIORITIES[number];

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: Priority;
};

export interface Column {
  id: string;
  title: string;
  tasks: string[];
};

export interface Board {
  id: string;
  title: string;
  columns: string[];
};

export interface BoardState {
  boards: Board[];
};

export type ApiResponse<T> =
  | { success: true; data: T }
  | { success: false; error: string };
