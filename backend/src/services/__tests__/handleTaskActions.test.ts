import { handleTaskActions } from "../handleTaskActions";
import type { BoardState } from "@shared/types";

describe("handleTaskActions", () => {
  let boardState: BoardState;
  const boardId = "board-1";
  const columnId = "col-1";

  beforeEach(() => {
    boardState = {
      boards: [
        {
          id: boardId,
          name: "Test Board",
          columns: [
            {
              id: columnId,
              title: "To Do",
              taskIds: ["task-1"],
            },
            {
              id: "col-2",
              title: "In Progress",
              taskIds: [],
            },
          ],
          tasks: {
            "task-1": {
              id: "task-1",
              title: "Task 1",
              description: "Test task",
            },
          },
        },
      ],
    };
  });

  describe("addTask", () => {
    it("should add a new task to column", () => {
      const task = handleTaskActions.addTask(
        boardState,
        boardId,
        columnId,
        {
          title: "New Task",
          description: "A new task",
          priority: "high",
        }
      );
      expect(task).toBeDefined();
      expect(task?.title).toBe("New Task");
      expect(task?.description).toBe("A new task");
      expect(task?.priority).toBe("high");
    });

    it("should add task id to column taskIds", () => {
      const task = handleTaskActions.addTask(
        boardState,
        boardId,
        columnId,
        { title: "New Task" }
      );
      const board = boardState.boards[0];
      expect(board).toBeDefined();
      const column = board!.columns.find((c) => c.id === columnId);
      expect(column?.taskIds).toContain(task?.id);
    });

    it("should add task to board tasks object", () => {
      const task = handleTaskActions.addTask(
        boardState,
        boardId,
        columnId,
        { title: "New Task" }
      );
      expect(task).toBeDefined();
      const board = boardState.boards[0];
      expect(board).toBeDefined();
      expect(board!.tasks[task!.id]).toBeDefined();
    });

    it("should return undefined for non-existent board", () => {
      const task = handleTaskActions.addTask(
        boardState,
        "non-existent",
        columnId,
        { title: "New Task" }
      );
        expect(task).toBeUndefined();
    });

    it("should return undefined for non-existent column", () => {
      const task = handleTaskActions.addTask(
        boardState,
        boardId,
        "non-existent",
        { title: "New Task" }
      );
        expect(task).toBeUndefined();
    });
  });

  describe("updateTask", () => {
    it("should update task properties", () => {
      const task = handleTaskActions.updateTask(
        boardState,
        boardId,
        "task-1",
        {
          title: "Updated Task",
          description: "Updated description",
          priority: "low",
        }
      );
      expect(task?.title).toBe("Updated Task");
      expect(task?.description).toBe("Updated description");
      expect(task?.priority).toBe("low");
    });

    it("should return undefined for non-existent board", () => {
      const task = handleTaskActions.updateTask(
        boardState,
        "non-existent",
        "task-1",
        { title: "Updated" }
      );
        expect(task).toBeUndefined();
    });

    it("should return undefined for non-existent task", () => {
      const task = handleTaskActions.updateTask(
        boardState,
        boardId,
        "non-existent",
        { title: "Updated" }
      );
        expect(task).toBeUndefined();
    });
  });

  describe("deleteTask", () => {
    it("should delete task from board and column", () => {
      const deleted = handleTaskActions.deleteTask(boardState, boardId, "task-1");
      expect(deleted).toBe(true);
      const board = boardState.boards[0];
      expect(board).toBeDefined();
      expect(board!.tasks["task-1"]).toBeUndefined();
      const column = board!.columns[0];
      expect(column).toBeDefined();
      expect(column!.taskIds).not.toContain("task-1");
    });

    it("should return false for non-existent board", () => {
      const deleted = handleTaskActions.deleteTask(boardState, "non-existent", "task-1");
      expect(deleted).toBe(false);
    });

    it("should return false for non-existent task", () => {
      const deleted = handleTaskActions.deleteTask(boardState, boardId, "non-existent");
      expect(deleted).toBe(false);
    });
  });

  describe("moveTask", () => {
    it("should move task from one column to another", () => {
      const board = handleTaskActions.moveTask(
        boardState,
        boardId,
        "task-1",
        columnId,
        "col-2",
        0
      );
      expect(board).toBeDefined();
      expect(board?.columns.length).toBeGreaterThan(1);
      const columns = board!.columns;
      expect(columns[0]).toBeDefined();
      expect(columns[1]).toBeDefined();
      expect(columns[0]!.taskIds).not.toContain("task-1");
      expect(columns[1]!.taskIds[0]).toBe("task-1");
    });

    it("should insert task at specified index", () => {
      handleTaskActions.addTask(boardState, boardId, "col-2", { title: "Task 2" });
      handleTaskActions.addTask(boardState, boardId, "col-2", { title: "Task 3" });

      const board = handleTaskActions.moveTask(
        boardState,
        boardId,
        "task-1",
        columnId,
        "col-2",
        1
      );

      expect(board).toBeDefined();
      const columns = board!.columns;
      expect(columns[1]).toBeDefined();
      expect(columns[1]!.taskIds[1]).toBe("task-1");
    });

    it("should return undefined for non-existent board", () => {
      const board = handleTaskActions.moveTask(
        boardState,
        "non-existent",
        "task-1",
        columnId,
        "col-2",
        0
      );
        expect(board).toBeUndefined();
    });

    it("should return undefined for non-existent source column", () => {
      const board = handleTaskActions.moveTask(
        boardState,
        boardId,
        "task-1",
        "non-existent",
        "col-2",
        0
      );
        expect(board).toBeUndefined();
    });

    it("should return undefined for non-existent destination column", () => {
      const board = handleTaskActions.moveTask(
        boardState,
        boardId,
        "task-1",
        columnId,
        "non-existent",
        0
      );
        expect(board).toBeUndefined();
    });

    it("should return undefined for non-existent task", () => {
      const board = handleTaskActions.moveTask(
        boardState,
        boardId,
        "non-existent",
        columnId,
        "col-2",
        0
      );
        expect(board).toBeUndefined();
    });
  });
});
