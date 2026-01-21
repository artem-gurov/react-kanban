import type { Board } from "@shared/types";
import { BoardModel } from "../../models/Board";

export const boardService = {
  getAll: async (): Promise<Board[]> => {
    const boards = await BoardModel.find().lean();
    return boards.map((board) => ({
      id: board._id.toString(),
      name: board.name,
      columns: board.columns,
      tasks: board.tasks,
    }));
  },

  getById: async (id: string): Promise<Board | undefined> => {
    const board = await BoardModel.findById(id).lean();
    if (!board) return undefined;
    return {
      id: board._id.toString(),
      name: board.name,
      columns: board.columns,
      tasks: board.tasks,
    };
  },

  create: async (name: string): Promise<Board> => {
    const board = await BoardModel.create({ name, columns: [], tasks: {} });
    return {
      id: board._id.toString(),
      name: board.name,
      columns: board.columns,
      tasks: {},
    };
  },

  update: async (id: string, name: string): Promise<Board | undefined> => {
    const board = await BoardModel.findByIdAndUpdate(
      id,
      { name },
      { new: true }
    ).lean();
    if (!board) return undefined;
    return {
      id: board._id.toString(),
      name: board.name,
      columns: board.columns,
      tasks: board.tasks,
    };
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await BoardModel.findByIdAndDelete(id);
    return !!result;
  },
};
