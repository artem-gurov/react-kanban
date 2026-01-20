import { handleColumnActions } from "../handleColumnActions";
import type { BoardState } from "@shared/types";

describe("handleColumnActions", () => {
  let boardState: BoardState;
  const boardId = "board-1";

  beforeEach(() => {
    boardState = {
      boards: [
        {
          id: boardId,
          name: "Test Board",
          columns: [
            { id: "col-1", title: "To Do", taskIds: [] },
            { id: "col-2", title: "In Progress", taskIds: [] },
          ],
          tasks: {},
        },
      ],
    };
  });

  describe("addColumn", () => {
    it("should add a new column to board", () => {
      const column = handleColumnActions.addColumn(boardState, boardId, "New Column");
      expect(column).toBeDefined();
      expect(column?.title).toBe("New Column");
      expect(column?.taskIds).toEqual([]);
    });

    it("should add column to board's columns array", () => {
      handleColumnActions.addColumn(boardState, boardId, "New Column");
      const board = boardState.boards[0];
      expect(board).toBeDefined();
      expect(board!.columns).toHaveLength(3);
    });

    it("should return undefined for non-existent board", () => {
      const column = handleColumnActions.addColumn(boardState, "non-existent", "New Column");
        expect(column).toBeUndefined();
    });
  });

  describe("updateColumn", () => {
    it("should update column title", () => {
      const column = handleColumnActions.updateColumn(
        boardState,
        boardId,
        "col-1",
        "Updated Title"
      );
      expect(column?.title).toBe("Updated Title");
    });

    it("should return undefined for non-existent board", () => {
      const column = handleColumnActions.updateColumn(
        boardState,
        "non-existent",
        "col-1",
        "Updated Title"
      );
        expect(column).toBeUndefined();
    });

    it("should return undefined for non-existent column", () => {
      const column = handleColumnActions.updateColumn(
        boardState,
        boardId,
        "non-existent",
        "Updated Title"
      );
        expect(column).toBeUndefined();
    });
  });

  describe("deleteColumn", () => {
    it("should delete column from board", () => {
      const deleted = handleColumnActions.deleteColumn(boardState, boardId, "col-1");
      expect(deleted).toBe(true);
      const board = boardState.boards[0];
      expect(board).toBeDefined();
      expect(board!.columns).toHaveLength(1);
    });

    it("should return false for non-existent board", () => {
      const deleted = handleColumnActions.deleteColumn(boardState, "non-existent", "col-1");
      expect(deleted).toBe(false);
    });

    it("should return false for non-existent column", () => {
      const deleted = handleColumnActions.deleteColumn(boardState, boardId, "non-existent");
      expect(deleted).toBe(false);
    });
  });

  describe("reorderColumns", () => {
    it("should reorder columns by provided ids", () => {
      const board = handleColumnActions.reorderColumns(boardState, boardId, [
        "col-2",
        "col-1",
      ]);
      expect(board).toBeDefined();
      expect(board?.columns.length).toBeGreaterThan(1);
      const columns = board!.columns;
      expect(columns[0]).toBeDefined();
      expect(columns[1]).toBeDefined();
      expect(columns[0]!.id).toBe("col-2");
      expect(columns[1]!.id).toBe("col-1");
    });

    it("should filter out non-existent column ids", () => {
      const board = handleColumnActions.reorderColumns(boardState, boardId, [
        "col-1",
        "non-existent",
      ]);
      expect(board?.columns).toHaveLength(1);
      expect(board?.columns.length).toBeGreaterThan(0);
      const columns = board!.columns;
      expect(columns[0]).toBeDefined();
      expect(columns[0]!.id).toBe("col-1");
    });

    it("should return undefined for non-existent board", () => {
      const board = handleColumnActions.reorderColumns(boardState, "non-existent", [
        "col-1",
      ]);
        expect(board).toBeUndefined();
    });
  });
});
