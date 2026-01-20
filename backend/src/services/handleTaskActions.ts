import { v4 as uuidv4 } from "uuid";
import type { Board, BoardState, Task } from "@shared/types";

export const handleTaskActions = {
  addTask: (
    boardState: BoardState,
    boardId: string,
    columnId: string,
    task: Omit<Task, 'id'>
  ): Task | undefined => {
    const board = boardState.boards.find((b) => b.id === boardId);
    if (!board) return undefined;

    const column = board.columns.find((c) => c.id === columnId);
    if (!column) return undefined;

    const newTask: Task = {
      id: uuidv4(),
      ...task,
    };

    board.tasks[newTask.id] = newTask;
    column.taskIds.push(newTask.id);
    return newTask;
  },

  updateTask: (
    boardState: BoardState,
    boardId: string,
    taskId: string,
    task: Omit<Task, 'id'>
  ): Task | undefined => {
    const board = boardState.boards.find((b) => b.id === boardId);
    if (!board) return undefined;

    const existingTask = board.tasks[taskId];
    if (!existingTask) return undefined;

    existingTask.title = task.title;
    existingTask.description = task.description;
    existingTask.dueDate = task.dueDate;
    existingTask.priority = task.priority;

    return existingTask;
  },

  deleteTask: (
    boardState: BoardState,
    boardId: string,
    taskId: string
  ): boolean => {
    const board = boardState.boards.find((b) => b.id === boardId);
    if (!board) return false;

    // Check if task exists
    if (!board.tasks[taskId]) return false;

    // Remove task from board
    delete board.tasks[taskId];

    // Remove task ID from all columns
    for (const column of board.columns) {
      const index = column.taskIds.indexOf(taskId);
      if (index !== -1) {
        column.taskIds.splice(index, 1);
      }
    }

    return true;
  },

  moveTask: (
    boardState: BoardState,
    boardId: string,
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ): Board | undefined => {
    const board = boardState.boards.find((b) => b.id === boardId);
    if (!board) return undefined;

    const sourceColumn = board.columns.find((c) => c.id === sourceColumnId);
    const destColumn = board.columns.find((c) => c.id === destinationColumnId);

    if (!sourceColumn || !destColumn) return undefined;

    // Remove from source
    const taskIndex = sourceColumn.taskIds.indexOf(taskId);
    if (taskIndex === -1) return undefined;
    sourceColumn.taskIds.splice(taskIndex, 1);

    // Add to destination
    destColumn.taskIds.splice(destinationIndex, 0, taskId);

    return board;
  },
};
