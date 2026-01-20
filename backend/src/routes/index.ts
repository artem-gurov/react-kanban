import { Router } from "express";
import { boardRoutes } from "./boardRoutes";
import { columnRoutes } from "./columnRoutes";
import { taskRoutes } from "./taskRoutes";

const router = Router();

// Board routes
router.use("/boards", boardRoutes);

// Column routes
router.use("/boards/:boardId/columns", columnRoutes);

// Task routes - for tasks within columns
router.use("/boards/:boardId/columns/:columnId/tasks", taskRoutes);

// Task routes - for task updates and moves
router.use("/boards/:boardId/tasks", taskRoutes);

export { router as boardRoutes };
