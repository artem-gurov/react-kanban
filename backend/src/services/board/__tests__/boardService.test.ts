import { boardService } from "../boardService";
import { BoardModel } from "../../../models/Board";

jest.mock("../../../models/Board");

const mockedBoardModel = jest.mocked(BoardModel);

describe("boardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    it("should return all boards", async () => {
      const mockBoards = [
        {
          _id: "board-1",
          name: "Board 1",
          columns: [{ id: "col-1", title: "Column 1", taskIds: [] }],
          tasks: {},
        },
        {
          _id: "board-2",
          name: "Board 2",
          columns: [],
          tasks: {},
        },
      ];

      mockedBoardModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockBoards),
      } as any);

      const result = await boardService.getAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual({
        id: "board-1",
        name: "Board 1",
        columns: [{ id: "col-1", title: "Column 1", taskIds: [] }],
        tasks: {},
      });
      expect(result[1]).toEqual({
        id: "board-2",
        name: "Board 2",
        columns: [],
        tasks: {},
      });
      expect(mockedBoardModel.find).toHaveBeenCalled();
    });

    it("should return empty array when no boards exist", async () => {
      mockedBoardModel.find.mockReturnValue({
        lean: jest.fn().mockResolvedValue([]),
      } as any);

      const result = await boardService.getAll();

      expect(result).toEqual([]);
      expect(mockedBoardModel.find).toHaveBeenCalled();
    });
  });

  describe("getById", () => {
    it("should return a board by id", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "Column 1", taskIds: [] }],
        tasks: { "task-1": { id: "task-1", title: "Task 1", description: "" } },
      };

      mockedBoardModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockBoard),
      } as any);

      const result = await boardService.getById("board-1");

      expect(result).toEqual({
        id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "Column 1", taskIds: [] }],
        tasks: { "task-1": { id: "task-1", title: "Task 1", description: "" } },
      });
      expect(mockedBoardModel.findById).toHaveBeenCalledWith("board-1");
    });

    it("should return undefined when board is not found", async () => {
      mockedBoardModel.findById.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await boardService.getById("non-existent");

      expect(result).toBeUndefined();
      expect(mockedBoardModel.findById).toHaveBeenCalledWith("non-existent");
    });
  });

  describe("create", () => {
    it("should create a new board", async () => {
      const mockCreatedBoard = {
        _id: "new-board-id",
        name: "New Board",
        columns: [],
        tasks: {},
      };

      mockedBoardModel.create.mockResolvedValue(mockCreatedBoard as any);

      const result = await boardService.create("New Board");

      expect(result).toEqual({
        id: "new-board-id",
        name: "New Board",
        columns: [],
        tasks: {},
      });
      expect(mockedBoardModel.create).toHaveBeenCalledWith({
        name: "New Board",
        columns: [],
        tasks: {},
      });
    });

    it("should create a board with empty columns and tasks", async () => {
      const mockCreatedBoard = {
        _id: "board-id",
        name: "Empty Board",
        columns: [],
        tasks: {},
      };

      mockedBoardModel.create.mockResolvedValue(mockCreatedBoard as any);

      const result = await boardService.create("Empty Board");

      expect(result.columns).toEqual([]);
      expect(result.tasks).toEqual({});
    });
  });

  describe("update", () => {
    it("should update a board name", async () => {
      const mockUpdatedBoard = {
        _id: "board-1",
        name: "Updated Board",
        columns: [{ id: "col-1", title: "Column 1", taskIds: [] }],
        tasks: {},
      };

      mockedBoardModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockUpdatedBoard),
      } as any);

      const result = await boardService.update("board-1", "Updated Board");

      expect(result).toEqual({
        id: "board-1",
        name: "Updated Board",
        columns: [{ id: "col-1", title: "Column 1", taskIds: [] }],
        tasks: {},
      });
      expect(mockedBoardModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "board-1",
        { name: "Updated Board" },
        { new: true }
      );
    });

    it("should return undefined when board to update is not found", async () => {
      mockedBoardModel.findByIdAndUpdate.mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as any);

      const result = await boardService.update("non-existent", "New Name");

      expect(result).toBeUndefined();
      expect(mockedBoardModel.findByIdAndUpdate).toHaveBeenCalledWith(
        "non-existent",
        { name: "New Name" },
        { new: true }
      );
    });
  });

  describe("delete", () => {
    it("should delete a board and return true", async () => {
      const mockDeletedBoard = {
        _id: "board-1",
        name: "Deleted Board",
        columns: [],
        tasks: {},
      };

      mockedBoardModel.findByIdAndDelete.mockResolvedValue(mockDeletedBoard as any);

      const result = await boardService.delete("board-1");

      expect(result).toBe(true);
      expect(mockedBoardModel.findByIdAndDelete).toHaveBeenCalledWith("board-1");
    });

    it("should return false when board to delete is not found", async () => {
      mockedBoardModel.findByIdAndDelete.mockResolvedValue(null);

      const result = await boardService.delete("non-existent");

      expect(result).toBe(false);
      expect(mockedBoardModel.findByIdAndDelete).toHaveBeenCalledWith("non-existent");
    });
  });
});
