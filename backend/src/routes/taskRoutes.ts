import { Router } from "express";
import { boardService } from "../services/boardService";
import { ApiError } from "../middleware/errorHandler";
import { asyncHandler } from "./asyncHandler";

const router = Router({ mergeParams: true });

// POST add task
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    if (!title) {
      throw new ApiError(400, "Task title is required");
    }
    boardService.addTask(
      req.params.boardId!,
      req.params.columnId!,
      { title, description, dueDate, priority }
    );
    const board = boardService.getById(req.params.boardId!);
    if (!board) {
      throw new ApiError(404, "Board not found");
    }
    res.status(201).json({
      success: true,
      data: board,
    });
  })
);

// PATCH update task
router.patch(
  "/:taskId",
  asyncHandler(async (req, res) => {
    const { title, description, dueDate, priority } = req.body;
    if (!title) {
      throw new ApiError(400, "Task title is required");
    }
    const task = boardService.updateTask(
      req.params.boardId!,
      req.params.taskId!,
      { title, description, dueDate, priority }
    );
    if (!task) {
      throw new ApiError(404, "Board or task not found");
    }
    res.json({
      success: true,
      data: task,
    });
  })
);

// DELETE task
router.delete(
  "/:taskId",
  asyncHandler(async (req, res) => {
    const deleted = boardService.deleteTask(req.params.boardId!, req.params.taskId!);
    if (!deleted) {
      throw new ApiError(404, "Board or task not found");
    }
    const board = boardService.getById(req.params.boardId!);
    if (!board) {
      throw new ApiError(404, "Board not found");
    }
    res.json({
      success: true,
      data: board,
    });
  })
);

// PATCH move task
router.patch(
  "/:taskId/move",
  asyncHandler(async (req, res) => {
    const { sourceColumnId, destinationColumnId, destinationIndex } = req.body;
    if (
      !sourceColumnId ||
      !destinationColumnId ||
      destinationIndex === undefined
    ) {
      throw new ApiError(400, "sourceColumnId, destinationColumnId, and destinationIndex are required");
    }
    const board = boardService.moveTask(
      req.params.boardId!,
      req.params.taskId!,
      sourceColumnId,
      destinationColumnId,
      destinationIndex
    );
    if (!board) {
      throw new ApiError(404, "Board, task, or column not found");
    }
    res.json({
      success: true,
      data: board,
    });
  })
);

export { router as taskRoutes };
