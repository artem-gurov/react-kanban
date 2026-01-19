import { type BoardState, type BoardAction } from "../BoardContext";

export function handleBoardActions(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "ADD_BOARD": {
      return {
        ...state,
        boards: [
          ...state.boards,
          {
            id: crypto.randomUUID(),
            name: action.payload.name,
            columns: [
              {
                id: crypto.randomUUID(),
                title: "To Do",
                taskIds: [],
              },
              {
                id: crypto.randomUUID(),
                title: "In Progress",
                taskIds: [],
              },
              {
                id: crypto.randomUUID(),
                title: "Done",
                taskIds: [],
              },
            ],
            tasks: {},
          },
        ],
      };
    }

    case "UPDATE_BOARD": {
      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== action.payload.boardId) {
            return board;
          }

          return {
            ...board,
            name: action.payload.name,
          };
        }),
      };
    }

    case "REMOVE_BOARD": {
      return {
        ...state,
        boards: state.boards.filter(
          (board) => board.id !== action.payload.boardId
        ),
      };
    }

    default:
      return state;
  }
}