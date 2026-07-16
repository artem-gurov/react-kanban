import { type BoardState, type BoardAction } from "../BoardContext";

export function handleTaskActions(state: BoardState, action: BoardAction): BoardState {
  switch (action.type) {
    case "ADD_TASK": {
      const { boardId, columnId, task } = action.payload;

      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== boardId) {
            return board;
          }

          return {
            ...board,
            tasks: {
              ...board.tasks,
              [task.id]: task,
            },
            columns: board.columns.map((column) =>
              column.id === columnId
                ? { ...column, taskIds: [...column.taskIds, task.id] }
                : column
            ),
          };
        }),
      };
    }

    case "UPDATE_TASK": {
      const { boardId, task } = action.payload;

      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== boardId) {
            return board;
          }

          const existingTask = board.tasks[task.id];

          if (!existingTask) {
            return board;
          }

          return {
            ...board,
            tasks: {
              ...board.tasks,
              [task.id]: task,
            },
          };
        }),
      };
    }

    case "DELETE_TASK": {
      const { boardId, taskId } = action.payload;

      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== boardId) return board;

          const { [taskId]: _, ...remainingTasks } = board.tasks;

          return {
            ...board,
            tasks: remainingTasks,
            columns: board.columns.map((column) => ({
              ...column,
              taskIds: column.taskIds.filter((id) => id !== taskId),
            })),
          };
        }),
      };
    }

    case "MOVE_TASK": {
      const { boardId, taskId, sourceColumnId, destinationColumnId, destinationIndex } = action.payload;

      return {
        ...state,
        boards: state.boards.map((board) => {
          if (board.id !== boardId) return board;

          const sourceColumn = board.columns.find((col) => col.id === sourceColumnId);
          const destColumn = board.columns.find((col) => col.id === destinationColumnId);

          if (!sourceColumn || !destColumn) return board;

          // If moving within the same column
          if (sourceColumnId === destinationColumnId) {
            const newTaskIds = Array.from(sourceColumn.taskIds);
            const sourceIndex = newTaskIds.indexOf(taskId);
            if (sourceIndex === -1) return board;

            newTaskIds.splice(sourceIndex, 1);
            newTaskIds.splice(destinationIndex, 0, taskId);

            return {
              ...board,
              columns: board.columns.map((col) =>
                col.id === sourceColumnId
                  ? { ...col, taskIds: newTaskIds }
                  : col
              ),
            };
          }

          // Moving between different columns
          const sourceTaskIds = Array.from(sourceColumn.taskIds);
          const destTaskIds = Array.from(destColumn.taskIds);

          const sourceIndex = sourceTaskIds.indexOf(taskId);
          if (sourceIndex === -1) return board;

          sourceTaskIds.splice(sourceIndex, 1);
          destTaskIds.splice(destinationIndex, 0, taskId);

          return {
            ...board,
            columns: board.columns.map((col) => {
              if (col.id === sourceColumnId) {
                return { ...col, taskIds: sourceTaskIds };
              }
              if (col.id === destinationColumnId) {
                return { ...col, taskIds: destTaskIds };
              }
              return col;
            }),
          };
        }),
      };
    }

    default:
      return state;
  }
}