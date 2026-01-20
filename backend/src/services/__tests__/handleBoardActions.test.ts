import { handleBoardActions } from "../handleBoardActions";
import type { BoardState } from "@shared/types";

describe("handleBoardActions", () => {
  let boardState: BoardState;

  beforeEach(() => {
    boardState = {
      boards: [
        {
          id: "board-1",
          name: "Test Board",
          columns: [],
          tasks: {},
        },
      ],
    };
  });

  describe("getAll", () => {
    it("should return all boards", () => {
      const boards = handleBoardActions.getAll(boardState);
      expect(boards).toHaveLength(1);
      const board = boards[0];
      expect(board).toBeDefined();
      expect(board!.name).toBe("Test Board");
    });

    it("should return empty array when no boards exist", () => {
      boardState.boards = [];
      const boards = handleBoardActions.getAll(boardState);
      expect(boards).toEqual([]);
    });
  });

  describe("getById", () => {
    it("should return board by id", () => {
      const board = handleBoardActions.getById(boardState, "board-1");
      expect(board).toBeDefined();
      expect(board?.name).toBe("Test Board");
    });

    it("should return undefined for non-existent board", () => {
      const board = handleBoardActions.getById(boardState, "non-existent");
      expect(board).toBeUndefined();
    });
  });

  describe("create", () => {
    it("should create a new board with generated id", () => {
      const board = handleBoardActions.create(boardState, "New Board");
      expect(board.name).toBe("New Board");
      expect(board.id).toBeDefined();
      expect(board.columns).toEqual([]);
      expect(board.tasks).toEqual({});
    });

    it("should add board to boardState", () => {
      handleBoardActions.create(boardState, "New Board");
      expect(boardState.boards).toHaveLength(2);
    });
  });

  describe("update", () => {
    it("should update board name", () => {
      const board = handleBoardActions.update(boardState, "board-1", "Updated Name");
      expect(board?.name).toBe("Updated Name");
    });

    it("should return undefined for non-existent board", () => {
      const board = handleBoardActions.update(boardState, "non-existent", "Updated Name");
      expect(board).toBeUndefined();
    });
  });

  describe("delete", () => {
    it("should delete board by id", () => {
      const deleted = handleBoardActions.delete(boardState, "board-1");
      expect(deleted).toBe(true);
      expect(boardState.boards).toHaveLength(0);
    });

    it("should return false for non-existent board", () => {
      const deleted = handleBoardActions.delete(boardState, "non-existent");
      expect(deleted).toBe(false);
    });
  });
});
