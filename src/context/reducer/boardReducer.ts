import { type BoardState, type BoardAction } from "../BoardContext";
import { handleColumnActions } from "./handleColumnActions";
import { handleTaskActions } from "./handleTaskActions";
import { handleBoardActions } from "./handleBoardActions";

export function boardReducer(state: BoardState, action: BoardAction): BoardState {
  const taskHandled = handleTaskActions(state, action);
  if (taskHandled !== state) {
    return taskHandled;
  }

  const columnHandled = handleColumnActions(state, action);
  if (columnHandled !== state) {
    return columnHandled;
  }

  const boardHandled = handleBoardActions(state, action);
  if (boardHandled !== state) {
    return boardHandled;
  }

  return state;
}