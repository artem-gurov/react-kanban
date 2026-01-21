import request from "supertest";
import express from "express";
import { boardRoutes } from "../boardRoutes";
import { boardService } from "../../services/board/boardService";

jest.mock("../../services/board/boardService");

const mockedBoardService = jest.mocked(boardService);

const app = express();
app.use(express.json());
app.use("/api/boards", boardRoutes);

const sampleBoard = {
  id: "board-1",
  name: "Sample Board",
  columns: [],
  tasks: {},
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Board Routes", () => {
  describe("GET /api/boards", () => {
    it("should return all boards", async () => {
      mockedBoardService.getAll.mockResolvedValue([sampleBoard]);

      const response = await request(app).get("/api/boards");
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(mockedBoardService.getAll).toHaveBeenCalledTimes(1);
    });
  });

  describe("GET /api/boards/:boardId", () => {
    it("should return a single board", async () => {
      mockedBoardService.getById.mockResolvedValue(sampleBoard);
      const boardId = sampleBoard.id;

      const response = await request(app).get(`/api/boards/${boardId}`);
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(boardId);
      expect(mockedBoardService.getById).toHaveBeenCalledWith(boardId);
    });

    it("should return 404 for non-existent board", async () => {
      mockedBoardService.getById.mockResolvedValue(undefined);

      const response = await request(app).get("/api/boards/non-existent-id");
      expect(response.status).toBe(404);
      expect(mockedBoardService.getById).toHaveBeenCalledWith("non-existent-id");
    });
  });

  describe("POST /api/boards", () => {
    it("should create a new board", async () => {
      const createdBoard = { ...sampleBoard, id: "board-2", name: "New Test Board" };
      mockedBoardService.create.mockResolvedValue(createdBoard);

      const response = await request(app)
        .post("/api/boards")
        .send({ name: "New Test Board" });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("New Test Board");
      expect(response.body.data.id).toBeDefined();
      expect(mockedBoardService.create).toHaveBeenCalledWith("New Test Board");
    });

    it("should return 400 if name is missing", async () => {
      const response = await request(app)
        .post("/api/boards")
        .send({});

      expect(response.status).toBe(400);
      expect(mockedBoardService.create).not.toHaveBeenCalled();
    });
  });

  describe("PATCH /api/boards/:boardId", () => {
    it("should update a board", async () => {
      const updatedBoard = { ...sampleBoard, name: "Updated Board Name" };
      mockedBoardService.update.mockResolvedValue(updatedBoard);
      const boardId = sampleBoard.id;

      const response = await request(app)
        .patch(`/api/boards/${boardId}`)
        .send({ name: "Updated Board Name" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.name).toBe("Updated Board Name");
      expect(mockedBoardService.update).toHaveBeenCalledWith(boardId, "Updated Board Name");
    });

    it("should return 404 for non-existent board", async () => {
      mockedBoardService.update.mockResolvedValue(undefined);

      const response = await request(app)
        .patch("/api/boards/non-existent-id")
        .send({ name: "Updated" });

      expect(response.status).toBe(404);
      expect(mockedBoardService.update).toHaveBeenCalledWith("non-existent-id", "Updated");
    });

    it("should return 400 if name is missing", async () => {
      const boardId = sampleBoard.id;

      const response = await request(app)
        .patch(`/api/boards/${boardId}`)
        .send({});

      expect(response.status).toBe(400);
      expect(mockedBoardService.update).not.toHaveBeenCalled();
    });
  });

  describe("DELETE /api/boards/:boardId", () => {
    it("should delete a board", async () => {
      mockedBoardService.delete.mockResolvedValue(true);
      const boardId = sampleBoard.id;

      const response = await request(app).delete(`/api/boards/${boardId}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(boardId);
      expect(mockedBoardService.delete).toHaveBeenCalledWith(boardId);
    });

    it("should return 404 for non-existent board", async () => {
      mockedBoardService.delete.mockResolvedValue(false);

      const response = await request(app).delete("/api/boards/non-existent-id");
      expect(response.status).toBe(404);
      expect(mockedBoardService.delete).toHaveBeenCalledWith("non-existent-id");
    });
  });
});
