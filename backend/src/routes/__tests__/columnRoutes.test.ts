import request from "supertest";
import express from "express";
import { columnRoutes } from "../columnRoutes";
import { boardService } from "../../services/board/boardService";
import { columnService } from "../../services/board/columnService";

jest.mock("../../services/board/boardService");
jest.mock("../../services/board/columnService");

const mockedBoardService = jest.mocked(boardService);
const mockedColumnService = jest.mocked(columnService);

const app = express();
app.use(express.json());
app.use("/:boardId/columns", columnRoutes);

const sampleBoard = {
  id: "board-1",
  name: "Sample Board",
  columns: [
    { id: "col-1", title: "One", taskIds: ["task-1"] },
    { id: "col-2", title: "Two", taskIds: [] },
  ],
  tasks: {
    "task-1": { id: "task-1", title: "Task 1", description: "" },
  },
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Column Routes", () => {
  const boardId = sampleBoard.id;

  describe("POST /:boardId/columns", () => {
    it("should add a column to a board", async () => {
      mockedColumnService.addColumn.mockResolvedValue({ id: "col-3", title: "Test Column", taskIds: [] });
      mockedBoardService.getById.mockResolvedValue(sampleBoard);

      const response = await request(app)
        .post(`/${boardId}/columns`)
        .send({ title: "Test Column" });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(sampleBoard.id);
      expect(response.body.data.columns).toBeDefined();
      expect(response.body.data.tasks).toBeDefined();
      expect(mockedColumnService.addColumn).toHaveBeenCalledWith(boardId, "Test Column");
      expect(mockedBoardService.getById).toHaveBeenCalledWith(boardId);
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(app)
        .post(`/${boardId}/columns`)
        .send({});

      expect(response.status).toBe(400);
      expect(mockedColumnService.addColumn).not.toHaveBeenCalled();
    });

    it("should return 404 for non-existent board", async () => {
      mockedColumnService.addColumn.mockResolvedValue(undefined);
      mockedBoardService.getById.mockResolvedValue(undefined);

      const response = await request(app)
        .post("/non-existent/columns")
        .send({ title: "Test Column" });

      expect(response.status).toBe(404);
      expect(mockedColumnService.addColumn).toHaveBeenCalledWith("non-existent", "Test Column");
    });
  });

  describe("PATCH /:boardId/columns/:columnId", () => {
    it("should update a column", async () => {
      const columnId = sampleBoard.columns[0]!.id;
      mockedColumnService.updateColumn.mockResolvedValue({ id: columnId, title: "Updated Column", taskIds: [] });

      const response = await request(app)
        .patch(`/${boardId}/columns/${columnId}`)
        .send({ title: "Updated Column" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Updated Column");
      expect(mockedColumnService.updateColumn).toHaveBeenCalledWith(boardId, columnId, "Updated Column");
    });

    it("should return 404 for non-existent column", async () => {
      mockedColumnService.updateColumn.mockResolvedValue(undefined);

      const response = await request(app)
        .patch(`/${boardId}/columns/non-existent`)
        .send({ title: "Updated" });

      expect(response.status).toBe(404);
      expect(mockedColumnService.updateColumn).toHaveBeenCalledWith(boardId, "non-existent", "Updated");
    });
  });

  describe("DELETE /:boardId/columns/:columnId", () => {
    it("should delete a column", async () => {
      mockedColumnService.deleteColumn.mockResolvedValue(true);
      mockedBoardService.getById.mockResolvedValue(sampleBoard);
      const columnId = "col-delete";

      const response = await request(app).delete(
        `/${boardId}/columns/${columnId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(sampleBoard.id);
      expect(response.body.data.columns).toBeDefined();
      expect(mockedColumnService.deleteColumn).toHaveBeenCalledWith(boardId, columnId);
      expect(mockedBoardService.getById).toHaveBeenCalledWith(boardId);
    });

    it("should return 404 for non-existent column", async () => {
      mockedColumnService.deleteColumn.mockResolvedValue(false);
      mockedBoardService.getById.mockResolvedValue(undefined);

      const response = await request(app).delete(
        `/${boardId}/columns/non-existent`
      );

      expect(response.status).toBe(404);
      expect(mockedColumnService.deleteColumn).toHaveBeenCalledWith(boardId, "non-existent");
    });
  });

  describe("PATCH /:boardId/columns/reorder", () => {
    it("should reorder columns", async () => {
      const columnIds = sampleBoard.columns.map((c) => c.id).reverse();
      mockedColumnService.reorderColumns.mockResolvedValue({ ...sampleBoard, columns: [...sampleBoard.columns].reverse() });

      const response = await request(app)
        .patch(`/${boardId}/columns/reorder`)
        .send({ columnIds });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockedColumnService.reorderColumns).toHaveBeenCalledWith(boardId, columnIds);
    });

    it("should return 400 if columnIds is not an array", async () => {
      const response = await request(app)
        .patch(`/${boardId}/columns/reorder`)
        .send({ columnIds: "not-an-array" });

      expect(response.status).toBe(400);
      expect(mockedColumnService.reorderColumns).not.toHaveBeenCalled();
    });
  });
});
