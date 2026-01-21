import type { Board, Column } from "@shared/types";
import { BoardModel } from "../../models/Board";
import { v4 as uuidv4 } from "uuid";

export const columnService = {
  addColumn: async (boardId: string, title: string): Promise<Column | undefined> => {
    const board = await BoardModel.findById(boardId);
    if (!board) return undefined;

    const newColumn: Column = {
      id: uuidv4(),
      title,
      taskIds: [],
    };

    board.columns.push(newColumn);
    await board.save();
    return newColumn;
  },

  updateColumn: async (
    boardId: string,
    columnId: string,
    title: string
  ): Promise<Column | undefined> => {
    const board = await BoardModel.findById(boardId);
    if (!board) return undefined;

    const column = board.columns.find((c) => c.id === columnId);
    if (!column) return undefined;

    column.title = title;
    await board.save();
    return column;
  },

  deleteColumn: async (boardId: string, columnId: string): Promise<boolean> => {
    const board = await BoardModel.findById(boardId);
    if (!board) return false;

    const columnIndex = board.columns.findIndex((c) => c.id === columnId);
    if (columnIndex === -1) return false;

    const column = board.columns[columnIndex];
    if (!column) return false;

    // Remove all tasks in the column
    for (const taskId of column.taskIds) {
      delete board.tasks[taskId];
    }

    board.columns.splice(columnIndex, 1);
    await board.save();
    return true;
  },

  reorderColumns: async (
    boardId: string,
    columnIds: string[]
  ): Promise<Board | undefined> => {
    const board = await BoardModel.findById(boardId);
    if (!board) return undefined;

    const reordered = columnIds
      .map((id) => board.columns.find((c) => c.id === id))
      .filter((c): c is Column => c !== undefined);

    board.columns = reordered;
    await board.save();

    return {
      id: board._id.toString(),
      name: board.name,
      columns: board.columns,
      tasks: board.tasks,
    };
  },
};
