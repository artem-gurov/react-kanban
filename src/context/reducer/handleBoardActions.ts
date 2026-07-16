import { type BoardState, type BoardAction } from "../BoardContext";

export function handleBoardActions(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "SET_BOARDS": {
      return {
        ...state,
        boards: action.payload.boards,
      };
    }

    case "ADD_BOARD": {
      return {
        ...state,
        boards: [
          ...state.boards,
          action.payload.board,
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