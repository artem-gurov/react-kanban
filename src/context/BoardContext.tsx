import { createContext, useEffect, useReducer } from "react";
import type { Board, Priority } from "../types/boardManagement.types";
import { boardReducer } from "./reducer/boardReducer";

export type BoardState = {
  boards: Board[];
}

const STORAGE_KEY = "board-management-state";

function loadState(): BoardState {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : initialState;
}

const initialState: BoardState = {
  boards: [
    {
      id: "1",
      name: "Test Board 1",
      columns: [
        { id: "todo", title: "To Do", taskIds: ["t1", "t2"] },
        { id: "in-progress", title: "In Progress", taskIds: ["t3"] },
        { id: "done", title: "Done", taskIds: [] },
      ],
      tasks: {
        t1: { id: "t1", title: "Task 1", description: "This is task 1" },
        t2: { id: "t2", title: "Task 2", description: "This is task 2" },
        t3: { id: "t3", title: "Task 3", description: "This is task 3" },
      },
    },
  ],
};

export type BoardAction =
  | { type: "ADD_BOARD"; payload: { name: string } }
  | { type: "UPDATE_BOARD"; payload: { boardId: string; name: string } }
  | { type: "REMOVE_BOARD"; payload: { boardId: string } }
  | { type: "ADD_COLUMN"; payload: { boardId: string; title: string } }
  | { type: "UPDATE_COLUMN"; payload: { boardId: string; columnId: string; title: string } }
  | { type: "DELETE_COLUMN"; payload: { boardId: string; columnId: string } }
  | { type: "REORDER_COLUMNS"; payload: { boardId: string; columnIds: string[] } }
  | { type: "ADD_TASK"; payload: { boardId: string; columnId: string; title: string; description?: string; dueDate?: string; priority?: Priority } }
  | { type: "UPDATE_TASK"; payload: { boardId: string; taskId: string; title: string; description?: string; dueDate?: string; priority?: Priority } }
  | { type: "DELETE_TASK"; payload: { boardId: string; taskId: string } }
  | { type: "MOVE_TASK"; payload: { boardId: string; taskId: string; sourceColumnId: string; destinationColumnId: string; destinationIndex: number } };

type BoardContextType = BoardState & {
  dispatch: React.Dispatch<BoardAction>;
}

export const BoardContext = createContext<BoardContextType | undefined>(
  undefined
);

export function BoardProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(boardReducer, initialState, loadState);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  return (
    <BoardContext.Provider value={{ ...state, dispatch }}>
      {children}
    </BoardContext.Provider>
  );
};