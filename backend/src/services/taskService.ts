import type { Board, Task } from "@shared/types";
import { BoardModel } from "../../models/Board";
import { v4 as uuidv4 } from "uuid";

export const taskService = {
  addTask: async (
    boardId: string,
    columnId: string,
    task: Omit<Task, "id">
  ): Promise<Task | undefined> => {
    const board = await BoardModel.findById(boardId);
    if (!board) return undefined;

    const column = board.columns.find((c) => c.id === columnId);
    if (!column) return undefined;

    const newTask: Task = {
      id: uuidv4(),
      ...task,
    };

    board.tasks[newTask.id] = newTask;
    column.taskIds.push(newTask.id);
    await board.save();

    return newTask;
  },

  updateTask: async (
    boardId: string,
    taskId: string,
    taskUpdate: Omit<Task, "id">
  ): Promise<Task | undefined> => {
    const board = await BoardModel.findById(boardId);
    if (!board) return undefined;

    const task = board.tasks[taskId];
    if (!task) return undefined;

    const updatedTask: Task = {
      id: taskId,
      ...taskUpdate,
    };

    board.tasks[taskId] = updatedTask;
    await board.save();

    return updatedTask;
  },

  deleteTask: async (boardId: string, taskId: string): Promise<boolean> => {
    const board = await BoardModel.findById(boardId);
    if (!board) return false;

    if (!(taskId in board.tasks)) return false;

    // Remove task from all columns
    for (const column of board.columns) {
      const index = column.taskIds.indexOf(taskId);
      if (index !== -1) {
        column.taskIds.splice(index, 1);
      }
    }

    delete board.tasks[taskId];
    await board.save();
    return true;
  },

  moveTask: async (
    boardId: string,
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    destinationIndex: number
  ): Promise<Board | undefined> => {
    const board = await BoardModel.findById(boardId);
    if (!board) return undefined;

    const sourceColumn = board.columns.find((c) => c.id === sourceColumnId);
    const destColumn = board.columns.find((c) => c.id === destinationColumnId);

    if (!sourceColumn || !destColumn || !(taskId in board.tasks)) {
      return undefined;
    }

    // Remove from source
    const sourceIndex = sourceColumn.taskIds.indexOf(taskId);
    if (sourceIndex === -1) {
      // Task is not in the specified source column; do not move it
      return undefined;
    }
    sourceColumn.taskIds.splice(sourceIndex, 1);
    // Validate destination index and add to destination
    if (destinationIndex < 0 || destinationIndex > destColumn.taskIds.length) {
      return undefined;
    }
    destColumn.taskIds.splice(destinationIndex, 0, taskId);

    await board.save();

    return {
      id: board._id.toString(),
      name: board.name,
      columns: board.columns,
      tasks: board.tasks,
    };
  },
};
