import { v4 as uuidv4 } from "uuid";
import type { Board, BoardState, Column } from "@shared/types";

export const handleColumnActions = {
  addColumn: (
    boardState: BoardState,
    boardId: string,
    title: string
  ): Column | undefined => {
    const board = boardState.boards.find((b) => b.id === boardId);
    if (!board) return undefined;

    const newColumn: Column = {
      id: uuidv4(),
      title,
      taskIds: [],
    };
    board.columns.push(newColumn);
    return newColumn;
  },

  updateColumn: (
    boardState: BoardState,
    boardId: string,
    columnId: string,
    title: string
  ): Column | undefined => {
    const board = boardState.boards.find((b) => b.id === boardId);
    if (!board) return undefined;

    const column = board.columns.find((c) => c.id === columnId);
    if (!column) return undefined;

    column.title = title;
    return column;
  },

  deleteColumn: (
    boardState: BoardState,
    boardId: string,
    columnId: string
  ): boolean => {
    const board = boardState.boards.find((b) => b.id === boardId);
    if (!board) return false;

    const columnIndex = board.columns.findIndex((c) => c.id === columnId);
    if (columnIndex === -1) return false;

    board.columns.splice(columnIndex, 1);
    return true;
  },

  reorderColumns: (
    boardState: BoardState,
    boardId: string,
    columnIds: string[]
  ): Board | undefined => {
    const board = boardState.boards.find((b) => b.id === boardId);
    if (!board) return undefined;

    const columnMap = new Map(board.columns.map((c) => [c.id, c]));
    board.columns = columnIds
      .map((id) => columnMap.get(id))
      .filter((c) => c !== undefined) as Column[];

    return board;
  },
};
