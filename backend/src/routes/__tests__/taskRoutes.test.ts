import request from "supertest";
import express from "express";
import { taskRoutes } from "../taskRoutes";
import { boardService } from "../../services/board/boardService";
import { taskService } from "../../services/board/taskService";
import type { Board, Task } from "@shared/types";

jest.mock("../../services/board/boardService");
jest.mock("../../services/board/taskService");

const mockedBoardService = jest.mocked(boardService);
const mockedTaskService = jest.mocked(taskService);

const app = express();
app.use(express.json());
app.use("/:boardId/columns/:columnId/tasks", taskRoutes);
app.use("/:boardId/tasks", taskRoutes);

const sampleBoard: Board = {
  id: "board-1",
  name: "Sample Board",
  columns: [
    { id: "col-1", title: "One", taskIds: ["task-1"] },
    { id: "col-2", title: "Two", taskIds: [] },
  ],
  tasks: {
    "task-1": { id: "task-1", title: "Task 1", description: "", priority: "medium" },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Task Routes", () => {
  const boardId = sampleBoard.id;
  const columnId = sampleBoard.columns[0]!.id;
  const taskId = sampleBoard.columns[0]!.taskIds[0]!;

  describe("POST /:boardId/columns/:columnId/tasks", () => {
    it("should add a task to a column", async () => {
      mockedTaskService.addTask.mockResolvedValue({ id: "task-2", title: "New Task", description: "A new task", priority: "high" });
      mockedBoardService.getById.mockResolvedValue(sampleBoard);

      const response = await request(app)
        .post(`/${boardId}/columns/${columnId}/tasks`)
        .send({
          title: "New Task",
          description: "A new task",
          priority: "high",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(sampleBoard.id);
      expect(response.body.data.columns).toBeDefined();
      expect(response.body.data.tasks).toBeDefined();
      expect(mockedTaskService.addTask).toHaveBeenCalledWith(boardId, columnId, {
        title: "New Task",
        description: "A new task",
        priority: "high",
      });
      expect(mockedBoardService.getById).toHaveBeenCalledWith(boardId);
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(app)
        .post(`/${boardId}/columns/${columnId}/tasks`)
        .send({ description: "No title" });

      expect(response.status).toBe(400);
      expect(mockedTaskService.addTask).not.toHaveBeenCalled();
    });

    it("should return 404 for non-existent board or column", async () => {
      mockedTaskService.addTask.mockResolvedValue(undefined);
      mockedBoardService.getById.mockResolvedValue(undefined);

      const response = await request(app)
        .post(`/non-existent/columns/${columnId}/tasks`)
        .send({ title: "New Task" });

      expect(response.status).toBe(404);
      expect(mockedTaskService.addTask).toHaveBeenCalled();
    });
  });

  describe("PATCH /:boardId/tasks/:taskId", () => {
    it("should update a task", async () => {
      const existingTask = sampleBoard.tasks[taskId]!;
      const updatedTask: Task = { ...existingTask, title: "Updated Task" };
      mockedTaskService.updateTask.mockResolvedValue(updatedTask);

      const response = await request(app)
        .patch(`/${boardId}/tasks/${taskId}`)
        .send({
          title: "Updated Task",
          description: "Updated description",
          priority: "low",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Updated Task");
      expect(mockedTaskService.updateTask).toHaveBeenCalledWith(boardId, taskId, {
        title: "Updated Task",
        description: "Updated description",
        priority: "low",
      });
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(app)
        .patch(`/${boardId}/tasks/${taskId}`)
        .send({ description: "No title" });

      expect(response.status).toBe(400);
      expect(mockedTaskService.updateTask).not.toHaveBeenCalled();
    });

    it("should return 404 for non-existent task", async () => {
      mockedTaskService.updateTask.mockResolvedValue(undefined);

      const response = await request(app)
        .patch(`/${boardId}/tasks/non-existent`)
        .send({ title: "Updated" });

      expect(response.status).toBe(404);
      expect(mockedTaskService.updateTask).toHaveBeenCalled();
    });
  });

  describe("DELETE /:boardId/tasks/:taskId", () => {
    it("should delete a task", async () => {
      mockedTaskService.deleteTask.mockResolvedValue(true);
      mockedBoardService.getById.mockResolvedValue(sampleBoard);
      const newTaskId = "task-delete";

      const response = await request(app).delete(
        `/${boardId}/tasks/${newTaskId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(sampleBoard.id);
      expect(response.body.data.columns).toBeDefined();
      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith(boardId, newTaskId);
      expect(mockedBoardService.getById).toHaveBeenCalledWith(boardId);
    });

    it("should return 404 for non-existent task", async () => {
      mockedTaskService.deleteTask.mockResolvedValue(false);
      mockedBoardService.getById.mockResolvedValue(undefined);

      const response = await request(app).delete(
        `/${boardId}/tasks/non-existent`
      );

      expect(response.status).toBe(404);
      expect(mockedTaskService.deleteTask).toHaveBeenCalledWith(boardId, "non-existent");
    });
  });

  describe("PATCH /:boardId/tasks/:taskId/move", () => {
    it("should move a task to another column", async () => {
      const sourceColumnId = sampleBoard.columns[0]!.id;
      const destColumnId = sampleBoard.columns[1]!.id;
      mockedTaskService.moveTask.mockResolvedValue(sampleBoard);
      const task = { id: "task-move" } as Task;
      mockedBoardService.getById.mockResolvedValue({
        ...sampleBoard,
        columns: sampleBoard.columns.map((c, idx) =>
          idx === 0 ? { ...c, taskIds: [task.id] } : c
        ),
      });
      mockedTaskService.addTask.mockResolvedValue(task);

      const response = await request(app)
        .patch(`/${boardId}/tasks/${task?.id}/move`)
        .send({
          sourceColumnId,
          destinationColumnId: destColumnId,
          destinationIndex: 0,
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockedTaskService.moveTask).toHaveBeenCalledWith(
        boardId,
        task?.id,
        sourceColumnId,
        destColumnId,
        0
      );
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app)
        .patch(`/${boardId}/tasks/${taskId}/move`)
        .send({ sourceColumnId: "col-1" });

      expect(response.status).toBe(400);
      expect(mockedTaskService.moveTask).not.toHaveBeenCalled();
    });

    it("should return 404 for non-existent board or columns", async () => {
      mockedTaskService.moveTask.mockResolvedValue(undefined);

      const response = await request(app)
        .patch(`/${boardId}/tasks/${taskId}/move`)
        .send({
          sourceColumnId: "non-existent",
          destinationColumnId: "col-2",
          destinationIndex: 0,
        });

      expect(response.status).toBe(404);
      expect(mockedTaskService.moveTask).toHaveBeenCalled();
    });
  });
});
