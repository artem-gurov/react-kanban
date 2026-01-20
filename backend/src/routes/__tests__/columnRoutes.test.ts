import request from "supertest";
import express from "express";
import { columnRoutes } from "../columnRoutes";
import { boardService } from "../../services/boardService";

jest.mock("../../services/boardService");

const mockedBoardService = jest.mocked(boardService);

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
      mockedBoardService.addColumn.mockReturnValue({ id: "col-3", title: "Test Column", taskIds: [] });
      mockedBoardService.getById.mockReturnValue(sampleBoard);

      const response = await request(app)
        .post(`/${boardId}/columns`)
        .send({ title: "Test Column" });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(sampleBoard.id);
      expect(response.body.data.columns).toBeDefined();
      expect(response.body.data.tasks).toBeDefined();
      expect(mockedBoardService.addColumn).toHaveBeenCalledWith(boardId, "Test Column");
      expect(mockedBoardService.getById).toHaveBeenCalledWith(boardId);
    });

    it("should return 400 if title is missing", async () => {
      const response = await request(app)
        .post(`/${boardId}/columns`)
        .send({});

      expect(response.status).toBe(400);
      expect(mockedBoardService.addColumn).not.toHaveBeenCalled();
    });

    it("should return 404 for non-existent board", async () => {
      mockedBoardService.addColumn.mockReturnValue(undefined);
      mockedBoardService.getById.mockReturnValue(undefined);

      const response = await request(app)
        .post("/non-existent/columns")
        .send({ title: "Test Column" });

      expect(response.status).toBe(404);
      expect(mockedBoardService.addColumn).toHaveBeenCalledWith("non-existent", "Test Column");
    });
  });

  describe("PATCH /:boardId/columns/:columnId", () => {
    it("should update a column", async () => {
      const columnId = sampleBoard.columns[0]!.id;
      mockedBoardService.updateColumn.mockReturnValue({ id: columnId, title: "Updated Column", taskIds: [] });

      const response = await request(app)
        .patch(`/${boardId}/columns/${columnId}`)
        .send({ title: "Updated Column" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe("Updated Column");
      expect(mockedBoardService.updateColumn).toHaveBeenCalledWith(boardId, columnId, "Updated Column");
    });

    it("should return 404 for non-existent column", async () => {
      mockedBoardService.updateColumn.mockReturnValue(undefined);

      const response = await request(app)
        .patch(`/${boardId}/columns/non-existent`)
        .send({ title: "Updated" });

      expect(response.status).toBe(404);
      expect(mockedBoardService.updateColumn).toHaveBeenCalledWith(boardId, "non-existent", "Updated");
    });
  });

  describe("DELETE /:boardId/columns/:columnId", () => {
    it("should delete a column", async () => {
      mockedBoardService.deleteColumn.mockReturnValue(true);
      mockedBoardService.getById.mockReturnValue(sampleBoard);
      const columnId = "col-delete";

      const response = await request(app).delete(
        `/${boardId}/columns/${columnId}`
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(sampleBoard.id);
      expect(response.body.data.columns).toBeDefined();
      expect(mockedBoardService.deleteColumn).toHaveBeenCalledWith(boardId, columnId);
      expect(mockedBoardService.getById).toHaveBeenCalledWith(boardId);
    });

    it("should return 404 for non-existent column", async () => {
      mockedBoardService.deleteColumn.mockReturnValue(false);
      mockedBoardService.getById.mockReturnValue(undefined);

      const response = await request(app).delete(
        `/${boardId}/columns/non-existent`
      );

      expect(response.status).toBe(404);
      expect(mockedBoardService.deleteColumn).toHaveBeenCalledWith(boardId, "non-existent");
    });
  });

  describe("PATCH /:boardId/columns/reorder", () => {
    it("should reorder columns", async () => {
      const columnIds = sampleBoard.columns.map((c) => c.id).reverse();
      mockedBoardService.reorderColumns.mockReturnValue({ ...sampleBoard, columns: [...sampleBoard.columns].reverse() });

      const response = await request(app)
        .patch(`/${boardId}/columns/reorder`)
        .send({ columnIds });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(mockedBoardService.reorderColumns).toHaveBeenCalledWith(boardId, columnIds);
    });

    it("should return 400 if columnIds is not an array", async () => {
      const response = await request(app)
        .patch(`/${boardId}/columns/reorder`)
        .send({ columnIds: "not-an-array" });

      expect(response.status).toBe(400);
      expect(mockedBoardService.reorderColumns).not.toHaveBeenCalled();
    });
  });
});
