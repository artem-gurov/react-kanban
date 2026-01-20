import { v4 as uuidv4 } from "uuid";
import type { Board, BoardState } from "@shared/types";

export const handleBoardActions = {
  getAll: (boardState: BoardState) => boardState.boards,

  getById: (boardState: BoardState, id: string) => {
    return boardState.boards.find((b) => b.id === id);
  },

  create: (boardState: BoardState, name: string): Board => {
    const newBoard: Board = {
      id: uuidv4(),
      name,
      columns: [],
      tasks: {},
    };
    boardState.boards.push(newBoard);
    return newBoard;
  },

  update: (
    boardState: BoardState,
    id: string,
    name: string
  ): Board | undefined => {
    const board = boardState.boards.find((b) => b.id === id);
    if (!board) return undefined;
    board.name = name;
    return board;
  },

  delete: (boardState: BoardState, id: string): boolean => {
    const index = boardState.boards.findIndex((b) => b.id === id);
    if (index === -1) return false;
    boardState.boards.splice(index, 1);
    return true;
  },
};
