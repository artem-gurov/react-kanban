import { handleBoardActions } from '../handleBoardActions';
import type { BoardAction, BoardState } from '../../BoardContext';

describe('handleBoardActions', () => {
  const mockState: BoardState = {
    boards: [
      {
        id: '1',
        name: 'Test Board',
        columns: [],
        tasks: {},
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ADD_BOARD', () => {
    it('should add a new board with the given name', () => {
      const action = {
        type: 'ADD_BOARD' as const,
        payload: { name: 'New Board' },
      };

      const result = handleBoardActions(mockState, action);

      expect(result.boards).toHaveLength(2);
      expect(result.boards[1]!.name).toBe('New Board');
      expect(result.boards[1]!.columns).toHaveLength(3);
      expect(result.boards[1]!.columns[0]!.title).toBe('To Do');
      expect(result.boards[1]!.columns[1]!.title).toBe('In Progress');
      expect(result.boards[1]!.columns[2]!.title).toBe('Done');
      expect(result.boards[1]!.tasks).toEqual({});
      expect(result.boards[1]!.id).toBeDefined();
    });

    it('should not mutate the original state', () => {
      const action = {
        type: 'ADD_BOARD' as const,
        payload: { name: 'New Board' },
      };

      const result = handleBoardActions(mockState, action);

      expect(result).not.toBe(mockState);
      expect(result.boards).not.toBe(mockState.boards);
      expect(mockState.boards).toHaveLength(1);
    });
  });

  describe('UPDATE_BOARD', () => {
    it('should update the board name', () => {
      const action = {
        type: 'UPDATE_BOARD' as const,
        payload: { boardId: '1', name: 'Updated Board' },
      };

      const result = handleBoardActions(mockState, action);

      expect(result.boards).toHaveLength(1);
      expect(result.boards[0]!.name).toBe('Updated Board');
      expect(result.boards[0]!.id).toBe('1');
    });

    it('should not update boards with different IDs', () => {
      const stateWithMultipleBoards: BoardState = {
        boards: [
          { id: '1', name: 'Board 1', columns: [], tasks: {} },
          { id: '2', name: 'Board 2', columns: [], tasks: {} },
        ],
      };

      const action = {
        type: 'UPDATE_BOARD' as const,
        payload: { boardId: '1', name: 'Updated Board 1' },
      };

      const result = handleBoardActions(stateWithMultipleBoards, action);

      expect(result.boards).toHaveLength(2);
      expect(result.boards[0]!.name).toBe('Updated Board 1');
      expect(result.boards[1]!.name).toBe('Board 2');
    });

    it('should not mutate the original state', () => {
      const action = {
        type: 'UPDATE_BOARD' as const,
        payload: { boardId: '1', name: 'Updated Board' },
      };

      const result = handleBoardActions(mockState, action);

      expect(result).not.toBe(mockState);
      expect(mockState.boards).toHaveLength(1);
      expect(mockState.boards[0]!.name).toBe('Test Board');
    });
  });

  describe('REMOVE_BOARD', () => {
    it('should remove the board with the given ID', () => {
      const action = {
        type: 'REMOVE_BOARD' as const,
        payload: { boardId: '1' },
      };

      const result = handleBoardActions(mockState, action);

      expect(result.boards).toHaveLength(0);
    });

    it('should only remove the specified board', () => {
      const stateWithMultipleBoards: BoardState = {
        boards: [
          { id: '1', name: 'Board 1', columns: [], tasks: {} },
          { id: '2', name: 'Board 2', columns: [], tasks: {} },
          { id: '3', name: 'Board 3', columns: [], tasks: {} },
        ],
      };

      const action = {
        type: 'REMOVE_BOARD' as const,
        payload: { boardId: '2' },
      };

      const result = handleBoardActions(stateWithMultipleBoards, action);

      expect(result.boards).toHaveLength(2);
      expect(result.boards[0]!.id).toBe('1');
      expect(result.boards[1]!.id).toBe('3');
    });

    it('should not mutate the original state', () => {
      const action = {
        type: 'REMOVE_BOARD' as const,
        payload: { boardId: '1' },
      };

      const result = handleBoardActions(mockState, action);

      expect(result).not.toBe(mockState);
      expect(mockState.boards).toHaveLength(1);
    });
  });

  describe('default case', () => {
    it('should return the same state for unhandled actions', () => {
      const action = {
        type: 'UNKNOWN_ACTION' as any,
        payload: {},
      } as BoardAction;

      const result = handleBoardActions(mockState, action);

      expect(result).toBe(mockState);
    });
  });
});
