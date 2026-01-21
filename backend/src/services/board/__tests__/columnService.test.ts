import { columnService } from "../columnService";
import { BoardModel } from "../../../models/Board";

jest.mock("../../../models/Board");

const mockedBoardModel = jest.mocked(BoardModel);

describe("columnService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addColumn", () => {
    it("should add a new column to a board", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "Existing Column", taskIds: [] }],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.addColumn("board-1", "New Column");

      expect(result).toBeDefined();
      expect(result?.title).toBe("New Column");
      expect(result?.taskIds).toEqual([]);
      expect(result?.id).toBeDefined();
      expect(mockBoard.columns).toHaveLength(2);
      expect(mockBoard.save).toHaveBeenCalled();
      expect(mockedBoardModel.findById).toHaveBeenCalledWith("board-1");
    });

    it("should return undefined when board is not found", async () => {
      mockedBoardModel.findById.mockResolvedValue(null);

      const result = await columnService.addColumn("non-existent", "New Column");

      expect(result).toBeUndefined();
      expect(mockedBoardModel.findById).toHaveBeenCalledWith("non-existent");
    });

    it("should add column to empty board", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Empty Board",
        columns: [],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.addColumn("board-1", "First Column");

      expect(result).toBeDefined();
      expect(result?.title).toBe("First Column");
      expect(mockBoard.columns).toHaveLength(1);
      expect(mockBoard.save).toHaveBeenCalled();
    });
  });

  describe("updateColumn", () => {
    it("should update a column title", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "Old Title", taskIds: [] },
          { id: "col-2", title: "Another Column", taskIds: [] },
        ],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.updateColumn("board-1", "col-1", "New Title");

      expect(result).toBeDefined();
      expect(result?.title).toBe("New Title");
      expect(result?.id).toBe("col-1");
      expect(mockBoard.columns[0]).toBeDefined();
      expect(mockBoard.columns[0]?.title).toBe("New Title");
      expect(mockBoard.save).toHaveBeenCalled();
      expect(mockedBoardModel.findById).toHaveBeenCalledWith("board-1");
    });

    it("should return undefined when board is not found", async () => {
      mockedBoardModel.findById.mockResolvedValue(null);

      const result = await columnService.updateColumn("non-existent", "col-1", "New Title");

      expect(result).toBeUndefined();
      expect(mockedBoardModel.findById).toHaveBeenCalledWith("non-existent");
    });

    it("should return undefined when column is not found", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "Existing Column", taskIds: [] }],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.updateColumn("board-1", "non-existent-col", "New Title");

      expect(result).toBeUndefined();
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should preserve taskIds when updating column title", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "Old Title", taskIds: ["task-1", "task-2"] }],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.updateColumn("board-1", "col-1", "Updated Title");

      expect(result?.taskIds).toEqual(["task-1", "task-2"]);
    });
  });

  describe("deleteColumn", () => {
    it("should delete a column and its tasks", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "Column to Delete", taskIds: ["task-1", "task-2"] },
          { id: "col-2", title: "Keep This", taskIds: [] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
          "task-2": { id: "task-2", title: "Task 2", description: "" },
          "task-3": { id: "task-3", title: "Task 3", description: "" },
        },
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.deleteColumn("board-1", "col-1");

      expect(result).toBe(true);
      expect(mockBoard.columns).toHaveLength(1);
      expect(mockBoard.columns[0]?.id).toBe("col-2");
      expect(mockBoard.tasks["task-1"]).toBeUndefined();
      expect(mockBoard.tasks["task-2"]).toBeUndefined();
      expect(mockBoard.tasks["task-3"]).toBeDefined();
      expect(mockBoard.save).toHaveBeenCalled();
    });

    it("should return false when board is not found", async () => {
      mockedBoardModel.findById.mockResolvedValue(null);

      const result = await columnService.deleteColumn("non-existent", "col-1");

      expect(result).toBe(false);
    });

    it("should return false when column is not found", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "Existing Column", taskIds: [] }],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.deleteColumn("board-1", "non-existent-col");

      expect(result).toBe(false);
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should delete column with no tasks", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "Empty Column", taskIds: [] }],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.deleteColumn("board-1", "col-1");

      expect(result).toBe(true);
      expect(mockBoard.columns).toHaveLength(0);
      expect(mockBoard.save).toHaveBeenCalled();
    });
  });

  describe("reorderColumns", () => {
    it("should reorder columns", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "First", taskIds: [] },
          { id: "col-2", title: "Second", taskIds: [] },
          { id: "col-3", title: "Third", taskIds: [] },
        ],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.reorderColumns("board-1", ["col-3", "col-1", "col-2"]);

      expect(result).toBeDefined();
      expect(result?.columns[0]?.id).toBe("col-3");
      expect(result?.columns[1]?.id).toBe("col-1");
      expect(result?.columns[2]?.id).toBe("col-2");
      expect(mockBoard.save).toHaveBeenCalled();
    });

    it("should return undefined when board is not found", async () => {
      mockedBoardModel.findById.mockResolvedValue(null);

      const result = await columnService.reorderColumns("non-existent", ["col-1", "col-2"]);

      expect(result).toBeUndefined();
    });

    it("should filter out non-existent column ids", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "First", taskIds: [] },
          { id: "col-2", title: "Second", taskIds: [] },
        ],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.reorderColumns("board-1", [
        "col-2",
        "non-existent",
        "col-1",
      ]);

      expect(result).toBeDefined();
      expect(result?.columns).toHaveLength(2);
      expect(result?.columns[0]?.id).toBe("col-2");
      expect(result?.columns[1]?.id).toBe("col-1");
    });

    it("should handle empty column order", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "First", taskIds: [] },
          { id: "col-2", title: "Second", taskIds: [] },
        ],
        tasks: {},
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.reorderColumns("board-1", []);

      expect(result).toBeDefined();
      expect(result?.columns).toHaveLength(0);
      expect(mockBoard.save).toHaveBeenCalled();
    });

    it("should return board with all data after reordering", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "First", taskIds: [] },
          { id: "col-2", title: "Second", taskIds: [] },
        ],
        tasks: { "task-1": { id: "task-1", title: "Task 1", description: "" } },
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await columnService.reorderColumns("board-1", ["col-2", "col-1"]);

      expect(result?.id).toBe("board-1");
      expect(result?.name).toBe("Test Board");
      expect(result?.tasks).toEqual({
        "task-1": { id: "task-1", title: "Task 1", description: "" },
      });
    });
  });
});
