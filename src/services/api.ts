// API service for boards, columns, and tasks
import type { Board, Task } from "@shared/types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export async function fetchBoards(): Promise<Board[]> {
  const res = await fetch(`${API_BASE_URL}/boards`);
  if (!res.ok) throw new Error("Failed to fetch boards");
  return (await res.json()).data;
}

export async function fetchBoard(boardId: string): Promise<Board> {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}`);
  if (!res.ok) throw new Error("Failed to fetch board");
  return (await res.json()).data;
}

export async function createBoard(name: string): Promise<Board> {
  const res = await fetch(`${API_BASE_URL}/boards`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create board");
  return (await res.json()).data;
}

export async function updateBoard(boardId: string, name: string): Promise<Board> {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update board");
 return (await res.json()).data;
}

export async function deleteBoard(boardId: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete board");
}

// Columns
export async function createColumn(boardId: string, title: string): Promise<Board> {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}/columns`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create column");
  return (await res.json()).data;
}

export async function updateColumn(boardId: string, columnId: string, title: string) {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}/columns/${columnId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to update column");
  return (await res.json()).data;
}

export async function deleteColumn(boardId: string, columnId: string) {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}/columns/${columnId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete column");
}

// Tasks
export async function createTask(boardId: string, columnId: string, task: Omit<Task, "id">) {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}/columns/${columnId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return (await res.json()).data;
}

export async function updateTask(boardId: string, taskId: string, taskData: any) {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}/tasks/${taskId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return (await res.json()).data;
}

export async function deleteTask(boardId: string, taskId: string) {
  const res = await fetch(`${API_BASE_URL}/boards/${boardId}/tasks/${taskId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
}
