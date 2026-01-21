import { Router } from "express";
import { boardService } from "../services/board/boardService";
import { columnService } from "../services/board/columnService";
import { ApiError } from "../middleware/errorHandler";
import { asyncHandler } from "./asyncHandler";

const router = Router({ mergeParams: true });

// POST add column
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
      throw new ApiError(400, "Column title is required");
    }
    await columnService.addColumn(req.params.boardId!, title);
    const board = await boardService.getById(req.params.boardId!);
    if (!board) {
      throw new ApiError(404, "Board not found");
    }
    res.status(201).json({
      success: true,
      data: board,
    });
  })
);

// PATCH reorder columns - must be before /:columnId to avoid matching "reorder" as columnId
router.patch(
  "/reorder",
  asyncHandler(async (req, res) => {
    const { columnIds } = req.body;
    if (!Array.isArray(columnIds)) {
      throw new ApiError(400, "columnIds array is required");
    }
    const board = await columnService.reorderColumns(req.params.boardId!, columnIds);
    if (!board) {
      throw new ApiError(404, "Board not found");
    }
    res.json({
      success: true,
      data: board,
    });
  })
);

// PATCH update column
router.patch(
  "/:columnId",
  asyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
      throw new ApiError(400, "Column title is required");
    }
    const column = await columnService.updateColumn(
      req.params.boardId!,
      req.params.columnId!,
      title
    );
    if (!column) {
      throw new ApiError(404, "Board or column not found");
    }
    res.json({
      success: true,
      data: column,
    });
  })
);

// DELETE column
router.delete(
  "/:columnId",
  asyncHandler(async (req, res) => {
    const deleted = await columnService.deleteColumn(
      req.params.boardId!,
      req.params.columnId!
    );
    if (!deleted) {
      throw new ApiError(404, "Board or column not found");
    }
    const board = await boardService.getById(req.params.boardId!);
    if (!board) {
      throw new ApiError(404, "Board not found");
    }
    res.json({
      success: true,
      data: board,
    });
  })
);

export { router as columnRoutes };
