import { createContext, useReducer } from "react";
import type { Board, Column, Task } from "@shared/types";
import { boardReducer } from "./reducer/boardReducer";
import {
  fetchBoards,
  fetchBoard,
  createBoard,
  updateBoard,
  deleteBoard,
  createColumn,
  updateColumn,
  deleteColumn,
  createTask,
  // updateTask,
  // deleteTask,
} from "../services/api";

export type BoardState = {
  boards: Board[];
}

// const STORAGE_KEY = "board-management-state";

// function loadState(): BoardState {
//   const raw = localStorage.getItem(STORAGE_KEY);
//   return raw ? JSON.parse(raw) : initialState;
// }

// const initialState: BoardState = {
//   boards: [
//     {
//       id: "1",
//       name: "Test Board 1",
//       columns: [
//         { id: "todo", title: "To Do", taskIds: ["t1", "t2"] },
//         { id: "in-progress", title: "In Progress", taskIds: ["t3"] },
//         { id: "done", title: "Done", taskIds: [] },
//       ],
//       tasks: {
//         t1: { id: "t1", title: "Task 1", description: "This is task 1" },
//         t2: { id: "t2", title: "Task 2", description: "This is task 2" },
//         t3: { id: "t3", title: "Task 3", description: "This is task 3" },
//       },
//     },
//   ],
// };

const initialState: BoardState = {
  boards: [],
};

export type BoardAction =
  | { type: "SET_BOARDS"; payload: { boards: Board[] } }
  | { type: "ADD_BOARD"; payload: { board: Board } }
  | { type: "UPDATE_BOARD"; payload: { boardId: string; name: string } }
  | { type: "REMOVE_BOARD"; payload: { boardId: string } }
  | { type: "ADD_COLUMN"; payload: { boardId: string; column: Column } }
  | { type: "UPDATE_COLUMN"; payload: { boardId: string; columnId: string; title: string } }
  | { type: "DELETE_COLUMN"; payload: { boardId: string; columnId: string } }
  | { type: "REORDER_COLUMNS"; payload: { boardId: string; columnIds: string[] } }
  | { type: "ADD_TASK"; payload: { boardId: string; columnId: string; task: Task } }
  | { type: "UPDATE_TASK"; payload: { boardId: string; task: Task } }
  | { type: "DELETE_TASK"; payload: { boardId: string; taskId: string } }
  | { type: "MOVE_TASK"; payload: { boardId: string; taskId: string; sourceColumnId: string; destinationColumnId: string; destinationIndex: number } };

type BoardContextType = BoardState & {
  loadBoards: () => Promise<void>;
  loadBoard: (boardId: string) => Promise<void>;
  handleAddBoard: (name: string) => Promise<void>;
  handleUpdateBoard: (boardId: string, name: string) => Promise<void>;
  handleRemoveBoard: (boardId: string) => Promise<void>;
  handleAddColumn: (boardId: string, title: string) => Promise<void>;
  // handleUpdateColumn: (boardId: string, columnId: string, title: string) => Promise<void>;
  // handleDeleteColumn: (boardId: string, columnId: string) => Promise<void>;
  // handleReorderColumns: (boardId: string, columnIds: string[]) => void;
  handleAddTask: (boardId: string, columnId: string, task: Omit<Task, "id">) => Promise<void>;
  // handleUpdateTask: (boardId: string, taskId: string, task: Task) => Promise<void>;
  // handleDeleteTask: (boardId: string, taskId: string) => Promise<void>;
  dispatch: React.Dispatch<BoardAction>;
}

export const BoardContext = createContext<BoardContextType | undefined>(
  undefined
);

export function BoardProvider({ children }: React.PropsWithChildren) {
  const [state, dispatch] = useReducer(boardReducer, initialState);

  // useEffect(() => {
  //   localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  // }, [state]);

  const loadBoards = async () => {
    const boards = await fetchBoards();
    dispatch({ type: "SET_BOARDS", payload: { boards } });
  };

  const loadBoard = async (boardId: string) => {
    const board = await fetchBoard(boardId);
    dispatch({ type: "SET_BOARDS", payload: { boards: [board] } });
  };

  const handleAddBoard = async (name: string) => {
    const newBoard = await createBoard(name);
    dispatch({ type: "ADD_BOARD", payload: { board: newBoard } });
  };

  const handleUpdateBoard = async (boardId: string, name: string) => {
    const updatedBoard = await updateBoard(boardId, name);
    dispatch({ type: "UPDATE_BOARD", payload: { boardId, name: updatedBoard.name } });
  }

  const handleRemoveBoard = async (boardId: string) => {
    await deleteBoard(boardId);
    dispatch({ type: "REMOVE_BOARD", payload: { boardId } });
  }

  const handleAddColumn = async (boardId: string, title: string) => {
    const board = await createColumn(boardId, title);
    //dispatch({ type: "ADD_COLUMN", payload: { boardId, column } });
    dispatch({ type: "SET_BOARDS", payload: { boards: [board] } });
  }

  const handleAddTask = async (boardId: string, columnId: string, task: Omit<Task, "id">) => {
    const newTask = await createTask(boardId, columnId, task);
    dispatch({ type: "ADD_TASK", payload: { boardId, columnId, task: newTask } });
  };

  // const handleUpdateTask = async (boardId: string, taskId: string, task: Task) => {
  //   const updatedTask = await updateTask(boardId, taskId, task);
  //   dispatch({ type: "UPDATE_TASK", payload: { boardId, task: updatedTask } });
  // };

  // const handleDeleteTask = async (boardId: string, taskId: string) => {
  //   await deleteTask(boardId, taskId);
  //   dispatch({ type: "DELETE_TASK", payload: { boardId, taskId } });
  // };

  return (
    <BoardContext.Provider value={{
        ...state,
        loadBoards,
        loadBoard,
        handleAddBoard,
        handleUpdateBoard,
        handleRemoveBoard,
        handleAddColumn,
        // handleUpdateColumn,
        // handleDeleteColumn,
        // handleReorderColumns,
        handleAddTask,
        // handleUpdateTask,
        // handleDeleteTask,
        dispatch
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};