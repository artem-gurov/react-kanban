import { Router } from "express";
import { boardService } from "../services/board/boardService";
import { ApiError } from "../middleware/errorHandler";
import type { ApiResponse } from "@shared/types";
import { asyncHandler } from "./asyncHandler";

const router = Router();

// GET all boards
router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const boards = await boardService.getAll();
    const response: ApiResponse<typeof boards> = {
      success: true,
      data: boards,
    };
    res.json(response);
  })
);

// GET single board
router.get(
  "/:boardId",
  asyncHandler(async (req, res) => {
    const board = await boardService.getById(req.params.boardId!);
    if (!board) {
      throw new ApiError(404, "Board not found");
    }
    const response: ApiResponse<typeof board> = {
      success: true,
      data: board,
    };
    res.json(response);
  })
);

// POST create board
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
      throw new ApiError(400, "Board name is required");
    }
    const board = await boardService.create(name);
    res.status(201).json({
      success: true,
      data: board,
    });
  })
);

// PATCH update board
router.patch(
  "/:boardId",
  asyncHandler(async (req, res) => {
    const { name } = req.body;
    if (!name) {
      throw new ApiError(400, "Board name is required");
    }
    const board = await boardService.update(req.params.boardId!, name);
    if (!board) {
      throw new ApiError(404, "Board not found");
    }
    res.json({
      success: true,
      data: board,
    });
  })
);

// DELETE board
router.delete(
  "/:boardId",
  asyncHandler(async (req, res) => {
    const deleted = await boardService.delete(req.params.boardId!);
    if (!deleted) {
      throw new ApiError(404, "Board not found");
    }
    res.json({
      success: true,
      data: { id: req.params.boardId },
    });
  })
);

export { router as boardRoutes };
