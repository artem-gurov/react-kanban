import { handleColumnActions } from '../handleColumnActions';
import type { BoardAction, BoardState } from '../../BoardContext';

describe('handleColumnActions', () => {
  const mockState: BoardState = {
    boards: [
      {
        id: 'board-1',
        name: 'Test Board',
        columns: [
          { id: 'col-1', title: 'To Do', taskIds: [] },
          { id: 'col-2', title: 'In Progress', taskIds: ['task-1'] },
        ],
        tasks: {
          'task-1': { id: 'task-1', title: 'Test Task' },
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ADD_COLUMN', () => {
    it('should add a new column to the specified board', () => {
      const action = {
        type: 'ADD_COLUMN' as const,
        payload: { boardId: 'board-1', title: 'Done' },
      };

      const result = handleColumnActions(mockState, action);

      const board = result.boards[0];
      expect(board).toBeDefined();
      expect(board!.columns).toHaveLength(3);
      expect(board!.columns[2]!.title).toBe('Done');
      expect(board!.columns[2]!.taskIds).toEqual([]);
      expect(board!.columns[2]!.id).toBeDefined();
    });

    it('should not affect other boards', () => {
      const stateWithMultipleBoards: BoardState = {
        boards: [
          { id: 'board-1', name: 'Board 1', columns: [{ id: 'col-1', title: 'To Do', taskIds: [] }], tasks: {} },
          { id: 'board-2', name: 'Board 2', columns: [{ id: 'col-2', title: 'Backlog', taskIds: [] }], tasks: {} },
        ],
      };

      const action = {
        type: 'ADD_COLUMN' as const,
        payload: { boardId: 'board-1', title: 'Done' },
      };

      const result = handleColumnActions(stateWithMultipleBoards, action);

      expect(result.boards).toHaveLength(2);
      expect(result.boards[0]!.columns).toHaveLength(2);
      expect(result.boards[1]!.columns).toHaveLength(1);
    });

    it('should not mutate the original state', () => {
      const action = {
        type: 'ADD_COLUMN' as const,
        payload: { boardId: 'board-1', title: 'Done' },
      };

      const result = handleColumnActions(mockState, action);

      expect(result).not.toBe(mockState);
      expect(mockState.boards[0]).toBeDefined();
      expect(mockState.boards[0]!.columns).toHaveLength(2);
    });
  });

  describe('UPDATE_COLUMN', () => {
    it('should update the column title', () => {
      const action = {
        type: 'UPDATE_COLUMN' as const,
        payload: { boardId: 'board-1', columnId: 'col-1', title: 'Backlog' },
      };

      const result = handleColumnActions(mockState, action);

      expect(result.boards[0]).toBeDefined();
      expect(result.boards[0]!.columns).toHaveLength(2);
      expect(result.boards[0]!.columns[0]!.title).toBe('Backlog');
      expect(result.boards[0]!.columns[0]!.id).toBe('col-1');
    });

    it('should not update columns with different IDs', () => {
      const action = {
        type: 'UPDATE_COLUMN' as const,
        payload: { boardId: 'board-1', columnId: 'col-1', title: 'Updated Column' },
      };

      const result = handleColumnActions(mockState, action);

      expect(result.boards[0]).toBeDefined();
      expect(result.boards[0]!.columns).toHaveLength(2);
      expect(result.boards[0]!.columns[0]!.title).toBe('Updated Column');
      expect(result.boards[0]!.columns[1]!.title).toBe('In Progress');
    });

    it('should only affect the specified board', () => {
      const stateWithMultipleBoards: BoardState = {
        boards: [
          { id: 'board-1', name: 'Board 1', columns: [{ id: 'col-1', title: 'To Do', taskIds: [] }], tasks: {} },
          { id: 'board-2', name: 'Board 2', columns: [{ id: 'col-1', title: 'To Do', taskIds: [] }], tasks: {} },
        ],
      };

      const action = {
        type: 'UPDATE_COLUMN' as const,
        payload: { boardId: 'board-1', columnId: 'col-1', title: 'Updated' },
      };

      const result = handleColumnActions(stateWithMultipleBoards, action);

      expect(result.boards).toHaveLength(2);
      expect(result.boards[0]!.columns).toHaveLength(1);
      expect(result.boards[1]!.columns).toHaveLength(1);
      expect(result.boards[0]!.columns[0]!.title).toBe('Updated');
      expect(result.boards[1]!.columns[0]!.title).toBe('To Do');
    });

    it('should not mutate the original state', () => {
      const action = {
        type: 'UPDATE_COLUMN' as const,
        payload: { boardId: 'board-1', columnId: 'col-1', title: 'Updated' },
      };

      const result = handleColumnActions(mockState, action);

      expect(result).not.toBe(mockState);
      expect(mockState.boards[0]).toBeDefined();
      expect(mockState.boards[0]!.columns).toHaveLength(2);
      expect(mockState.boards[0]!.columns[0]!.title).toBe('To Do');
    });
  });

  describe('DELETE_COLUMN', () => {
    it('should remove the column with the given ID', () => {
      const action = {
        type: 'DELETE_COLUMN' as const,
        payload: { boardId: 'board-1', columnId: 'col-1' },
      };

      const result = handleColumnActions(mockState, action);

      expect(result.boards[0]).toBeDefined();
      expect(result.boards[0]!.columns).toHaveLength(1);
      expect(result.boards[0]!.columns[0]!.id).toBe('col-2');
    });

    it('should only affect the specified board', () => {
      const stateWithMultipleBoards: BoardState = {
        boards: [
          { id: 'board-1', name: 'Board 1', columns: [{ id: 'col-1', title: 'To Do', taskIds: [] }], tasks: {} },
          { id: 'board-2', name: 'Board 2', columns: [{ id: 'col-1', title: 'To Do', taskIds: [] }], tasks: {} },
        ],
      };

      const action = {
        type: 'DELETE_COLUMN' as const,
        payload: { boardId: 'board-1', columnId: 'col-1' },
      };

      const result = handleColumnActions(stateWithMultipleBoards, action);

      expect(result.boards).toHaveLength(2);
      expect(result.boards[0]!.columns).toHaveLength(0);
      expect(result.boards[1]!.columns).toHaveLength(1);
    });

    it('should not mutate the original state', () => {
      const action = {
        type: 'DELETE_COLUMN' as const,
        payload: { boardId: 'board-1', columnId: 'col-1' },
      };

      const result = handleColumnActions(mockState, action);

      expect(result).not.toBe(mockState);
      expect(mockState.boards[0]).toBeDefined();
      expect(mockState.boards[0]!.columns).toHaveLength(2);
    });
  });

  describe('default case', () => {
    it('should return the same state for unhandled actions', () => {
      const action = {
        type: 'UNKNOWN_ACTION' as any,
        payload: {},
      } as BoardAction;

      const result = handleColumnActions(mockState, action);

      expect(result).toBe(mockState);
    });
  });
});
