import type { BoardState, Task } from "@shared/types";
import { handleBoardActions } from "./handleBoardActions";
import { handleColumnActions } from "./handleColumnActions";
import { handleTaskActions } from "./handleTaskActions";

let boardState: BoardState = {
  boards: [
    {
      id: "1",
      name: "Test Board 1",
      columns: [
        { id: "todo", title: "To Do", taskIds: ["t1", "t2"] },
        { id: "in-progress", title: "In Progress", taskIds: ["t3"] },
        { id: "done", title: "Done", taskIds: [] },
      ],
      tasks: {
        t1: { id: "t1", title: "Task 1", description: "This is task 1" },
        t2: { id: "t2", title: "Task 2", description: "This is task 2" },
        t3: { id: "t3", title: "Task 3", description: "This is task 3" },
      },
    },
  ],
};

// Board operations
export const boardService = {
  // Board actions
  getAll: () => handleBoardActions.getAll(boardState),
  getById: (id: string) => handleBoardActions.getById(boardState, id),
  create: (name: string) => handleBoardActions.create(boardState, name),
  update: (id: string, name: string) =>
    handleBoardActions.update(boardState, id, name),
  delete: (id: string) => handleBoardActions.delete(boardState, id),

  // Column actions
  addColumn: (boardId: string, title: string) =>
    handleColumnActions.addColumn(boardState, boardId, title),
  updateColumn: (boardId: string, columnId: string, title: string) =>
    handleColumnActions.updateColumn(boardState, boardId, columnId, title),
  deleteColumn: (boardId: string, columnId: string) =>
    handleColumnActions.deleteColumn(boardState, boardId, columnId),
  reorderColumns: (boardId: string, columnIds: string[]) =>
    handleColumnActions.reorderColumns(boardState, boardId, columnIds),

  // Task actions
  addTask: (
    boardId: string,
    columnId: string,
    task: Omit<Task, 'id'>
  ) =>
    handleTaskActions.addTask(boardState, boardId, columnId, task),
  updateTask: (
    boardId: string,
    taskId: string,
    task: Omit<Task, 'id'>
  ) =>
    handleTaskActions.updateTask(boardState, boardId, taskId, task),
  deleteTask: (boardId: string, taskId: string) =>
    handleTaskActions.deleteTask(boardState, boardId, taskId),
  moveTask: (
    boardId: string,
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ) =>
    handleTaskActions.moveTask(
      boardState,
      boardId,
      taskId,
      sourceColumnId,
      destinationColumnId,
      destinationIndex
    ),
};
