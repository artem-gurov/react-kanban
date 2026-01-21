import type { Task } from "@shared/types";
import { taskService } from "../taskService";
import { BoardModel } from "../../../models/Board";

jest.mock("../../../models/Board");

const mockedBoardModel = jest.mocked(BoardModel);

describe("taskService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("addTask", () => {
    it("should add a new task to a column", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: [] },
          { id: "col-2", title: "Done", taskIds: [] },
        ],
        tasks: {} as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.addTask("board-1", "col-1", {
        title: "New Task",
        description: "Task description",
        priority: "high",
      });

      expect(result).toBeDefined();
      expect(result?.title).toBe("New Task");
      expect(result?.description).toBe("Task description");
      expect(result?.priority).toBe("high");
      expect(result?.id).toBeDefined();
      expect(mockBoard.columns).toHaveLength(2);
      expect(mockBoard.columns[0]!.taskIds).toContain(result!.id);
      expect(mockBoard.tasks[result!.id]).toEqual(result);
      expect(mockBoard.save).toHaveBeenCalled();
    });

    it("should return undefined when board is not found", async () => {
      mockedBoardModel.findById.mockResolvedValue(null);

      const result = await taskService.addTask("non-existent", "col-1", {
        title: "New Task",
        description: "",
      });

      expect(result).toBeUndefined();
    });

    it("should return undefined when column is not found", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: [] }],
        tasks: {} as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.addTask("board-1", "non-existent-col", {
        title: "New Task",
        description: "",
      });

      expect(result).toBeUndefined();
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should add task with minimal fields", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: [] }],
        tasks: {} as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.addTask("board-1", "col-1", {
        title: "Minimal Task",
        description: "",
      });

      expect(result).toBeDefined();
      expect(result?.title).toBe("Minimal Task");
      expect(result?.description).toBe("");
      expect(result?.id).toBeDefined();
    });

    it("should add task to column with existing tasks", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: ["task-1", "task-2"] }],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
          "task-2": { id: "task-2", title: "Task 2", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.addTask("board-1", "col-1", {
        title: "Task 3",
        description: "",
      });

      expect(result).toBeDefined();
      expect(mockBoard.columns).toHaveLength(1);
      expect(mockBoard.columns[0]!.taskIds).toHaveLength(3);
      expect(mockBoard.columns[0]!.taskIds[2]).toBe(result!.id);
      expect(Object.keys(mockBoard.tasks)).toHaveLength(3);
    });
  });

  describe("updateTask", () => {
    it("should update a task", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: ["task-1"] }],
        tasks: {
          "task-1": {
            id: "task-1",
            title: "Old Title",
            description: "Old description",
            priority: "low",
          },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.updateTask("board-1", "task-1", {
        title: "New Title",
        description: "New description",
        priority: "high",
      });

      expect(result).toBeDefined();
      expect(result?.id).toBe("task-1");
      expect(result?.title).toBe("New Title");
      expect(result?.description).toBe("New description");
      expect(result?.priority).toBe("high");
      expect(mockBoard.tasks["task-1"]).toEqual(result);
      expect(mockBoard.save).toHaveBeenCalled();
    });

    it("should return undefined when board is not found", async () => {
      mockedBoardModel.findById.mockResolvedValue(null);

      const result = await taskService.updateTask("non-existent", "task-1", {
        title: "New Title",
        description: "",
      });

      expect(result).toBeUndefined();
    });

    it("should return undefined when task is not found", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: ["task-1"] }],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.updateTask("board-1", "non-existent-task", {
        title: "New Title",
        description: "",
      });

      expect(result).toBeUndefined();
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should update task with optional fields", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: ["task-1"] }],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.updateTask("board-1", "task-1", {
        title: "Updated Task",
        description: "With description",
        dueDate: "2026-12-31",
        priority: "medium",
      });

      expect(result?.dueDate).toBe("2026-12-31");
      expect(result?.priority).toBe("medium");
    });
  });

  describe("deleteTask", () => {
    it("should delete a task from its column", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: ["task-1", "task-2"] },
          { id: "col-2", title: "Done", taskIds: ["task-3"] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
          "task-2": { id: "task-2", title: "Task 2", description: "" },
          "task-3": { id: "task-3", title: "Task 3", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.deleteTask("board-1", "task-1");

      expect(result).toBe(true);
      expect(mockBoard.columns).toHaveLength(2);
      expect(mockBoard.columns[0]!.taskIds).toEqual(["task-2"]);
      expect(mockBoard.tasks["task-1"]).toBeUndefined();
      expect(mockBoard.tasks["task-2"]).toBeDefined();
      expect(mockBoard.tasks["task-3"]).toBeDefined();
      expect(mockBoard.save).toHaveBeenCalled();
    });

    it("should return false when board is not found", async () => {
      mockedBoardModel.findById.mockResolvedValue(null);

      const result = await taskService.deleteTask("non-existent", "task-1");

      expect(result).toBe(false);
    });

    it("should return false when task is not found", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: ["task-1"] }],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.deleteTask("board-1", "non-existent-task");

      expect(result).toBe(false);
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should delete task that appears in multiple columns", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: ["task-1", "task-2"] },
          { id: "col-2", title: "Done", taskIds: ["task-1", "task-3"] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
          "task-2": { id: "task-2", title: "Task 2", description: "" },
          "task-3": { id: "task-3", title: "Task 3", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.deleteTask("board-1", "task-1");

      expect(result).toBe(true);
      expect(mockBoard.columns).toHaveLength(2);
      expect(mockBoard.columns[0]!.taskIds).toEqual(["task-2"]);
      expect(mockBoard.columns[1]!.taskIds).toEqual(["task-3"]);
      expect(mockBoard.tasks["task-1"]).toBeUndefined();
    });
  });

  describe("moveTask", () => {
    it("should move a task between columns", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: ["task-1", "task-2"] },
          { id: "col-2", title: "In Progress", taskIds: ["task-3"] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
          "task-2": { id: "task-2", title: "Task 2", description: "" },
          "task-3": { id: "task-3", title: "Task 3", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask("board-1", "task-1", "col-1", "col-2", 1);

      expect(result).toBeDefined();
      expect(mockBoard.columns).toHaveLength(2);
      expect(mockBoard.columns[0]!.taskIds).toEqual(["task-2"]);
      expect(mockBoard.columns[1]!.taskIds).toEqual(["task-3", "task-1"]);
      expect(mockBoard.save).toHaveBeenCalled();
    });

    it("should move task within the same column", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: ["task-1", "task-2", "task-3"] }],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
          "task-2": { id: "task-2", title: "Task 2", description: "" },
          "task-3": { id: "task-3", title: "Task 3", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask("board-1", "task-1", "col-1", "col-1", 2);

      expect(result).toBeDefined();
      expect(mockBoard.columns).toHaveLength(1);
      expect(mockBoard.columns[0]!.taskIds).toEqual(["task-2", "task-3", "task-1"]);
      expect(mockBoard.save).toHaveBeenCalled();
    });

    it("should return undefined when board is not found", async () => {
      mockedBoardModel.findById.mockResolvedValue(null);

      const result = await taskService.moveTask(
        "non-existent",
        "task-1",
        "col-1",
        "col-2",
        0
      );

      expect(result).toBeUndefined();
    });

    it("should return undefined when source column is not found", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: ["task-1"] }],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask(
        "board-1",
        "task-1",
        "non-existent-col",
        "col-1",
        0
      );

      expect(result).toBeUndefined();
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should return undefined when destination column is not found", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [{ id: "col-1", title: "To Do", taskIds: ["task-1"] }],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask(
        "board-1",
        "task-1",
        "col-1",
        "non-existent-col",
        0
      );

      expect(result).toBeUndefined();
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should return undefined when task is not found", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: ["task-1"] },
          { id: "col-2", title: "Done", taskIds: [] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask(
        "board-1",
        "non-existent-task",
        "col-1",
        "col-2",
        0
      );

      expect(result).toBeUndefined();
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should return undefined when task is not in source column", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: ["task-2"] },
          { id: "col-2", title: "Done", taskIds: [] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
          "task-2": { id: "task-2", title: "Task 2", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask("board-1", "task-1", "col-1", "col-2", 0);

      expect(result).toBeUndefined();
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should return undefined when destination index is negative", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: ["task-1"] },
          { id: "col-2", title: "Done", taskIds: [] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask("board-1", "task-1", "col-1", "col-2", -1);

      expect(result).toBeUndefined();
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should return undefined when destination index exceeds column length", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: ["task-1"] },
          { id: "col-2", title: "Done", taskIds: ["task-2"] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
          "task-2": { id: "task-2", title: "Task 2", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask("board-1", "task-1", "col-1", "col-2", 5);

      expect(result).toBeUndefined();
      expect(mockBoard.save).not.toHaveBeenCalled();
    });

    it("should move task to beginning of destination column", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: ["task-1"] },
          { id: "col-2", title: "Done", taskIds: ["task-2", "task-3"] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
          "task-2": { id: "task-2", title: "Task 2", description: "" },
          "task-3": { id: "task-3", title: "Task 3", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask("board-1", "task-1", "col-1", "col-2", 0);

      expect(result).toBeDefined();
      expect(mockBoard.columns).toHaveLength(2);
      expect(mockBoard.columns[1]!.taskIds).toEqual(["task-1", "task-2", "task-3"]);
    });

    it("should return board data after successful move", async () => {
      const mockBoard = {
        _id: "board-1",
        name: "Test Board",
        columns: [
          { id: "col-1", title: "To Do", taskIds: ["task-1"] },
          { id: "col-2", title: "Done", taskIds: [] },
        ],
        tasks: {
          "task-1": { id: "task-1", title: "Task 1", description: "" },
        } as Record<string, Task>,
        save: jest.fn().mockResolvedValue(undefined),
      };

      mockedBoardModel.findById.mockResolvedValue(mockBoard as any);

      const result = await taskService.moveTask("board-1", "task-1", "col-1", "col-2", 0);

      expect(result?.id).toBe("board-1");
      expect(result?.name).toBe("Test Board");
      expect(result?.columns).toEqual(mockBoard.columns);
      expect(result?.tasks).toEqual(mockBoard.tasks);
    });
  });
});
