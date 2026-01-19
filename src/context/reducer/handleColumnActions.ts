import { type BoardState, type BoardAction } from "../BoardContext";

export function handleColumnActions(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "ADD_COLUMN": {
      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== action.payload.boardId) {
            return board;
          }

          return {
            ...board,
            columns: [
              ...board.columns,
              {
                id: crypto.randomUUID(),
                title: action.payload.title,
                taskIds: [],
              },
            ],
          };
        }),
      };
    }

    case "UPDATE_COLUMN": {
      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== action.payload.boardId) {
            return board;
          }

          return {
            ...board,
            columns: board.columns.map((column) => {
              if (column.id !== action.payload.columnId) {
                return column;
              }

              return {
                ...column,
                title: action.payload.title,
              };
            }),
          };
        }),
      };
    }

    case "DELETE_COLUMN": {
      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== action.payload.boardId) {
            return board;
          }

          return {
            ...board,
            columns: board.columns.filter((column) => column.id !== action.payload.columnId),
          };
        }),
      };
    }

    case "REORDER_COLUMNS": {
      const { boardId, columnIds } = action.payload;
      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== boardId) {
            return board;
          }

          const columnMap = new Map(board.columns.map((col) => [col.id, col]));
          const reorderedColumns = columnIds
            .map((id) => columnMap.get(id))
            .filter((col): col is NonNullable<typeof col> => col !== undefined);

          return {
            ...board,
            columns: reorderedColumns,
          };
        }),
      };
    }

    default:
      return state;
  }
}