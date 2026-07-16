import type { Board } from "@shared/types";
import { BoardModel } from "../models/Board.model";

export const boardService = {
  getAll: async (): Promise<Board[]> => {
    const boards = await BoardModel.find().lean();
    return boards.map((board) => ({
      id: board._id.toString(),
      title: board.title,
      columns: board.columns,
      tasks: board.tasks,
    }));
  },

  getById: async (id: string): Promise<Board> => {
    const board = await BoardModel.findById(id).populate({
      path: "columns",
      populate: { path: "tasks" },
    });
    if (!board) throw new Error("Board not found");
    return {
      id: board._id.toString(),
      title: board.title,
      columns: board.columns,
      tasks: board.tasks,
    };
  },

  create: async (title: string): Promise<Board> => {
    const board = await BoardModel.create({ title, columns: [], tasks: {} });
    return {
      id: board._id.toString(),
      title: board.title,
      columns: board.columns,
      tasks: {},
    };
  },

  update: async (id: string, title: string): Promise<Board | undefined> => {
    const board = await BoardModel.findByIdAndUpdate(
      id,
      { title },
      { new: true }
    ).lean();
    if (!board) return undefined;
    return {
      id: board._id.toString(),
      title: board.title,
      columns: board.columns,
      tasks: board.tasks,
    };
  },

  delete: async (id: string): Promise<boolean> => {
    const result = await BoardModel.findByIdAndDelete(id);
    return !!result;
  },
};
