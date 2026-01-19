import { boardReducer } from '../boardReducer';
import type { BoardState, BoardAction } from '../../BoardContext';

describe('boardReducer', () => {
  const mockState: BoardState = {
    boards: [
      {
        id: 'board-1',
        name: 'Test Board',
        columns: [{ id: 'col-1', title: 'To Do', taskIds: ['task-1'] }],
        tasks: {
          'task-1': { id: 'task-1', title: 'Test Task' },
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Board Actions', () => {
    it('should handle ADD_BOARD action', () => {
      const action: BoardAction = {
        type: 'ADD_BOARD',
        payload: { name: 'New Board' },
      };

      const result = boardReducer(mockState, action);

      expect(result.boards).toHaveLength(2);
      expect(result.boards[1]!.name).toBe('New Board');
    });

    it('should handle UPDATE_BOARD action', () => {
      const action: BoardAction = {
        type: 'UPDATE_BOARD',
        payload: { boardId: 'board-1', name: 'Updated Board' },
      };

      const result = boardReducer(mockState, action);

      expect(result.boards).toHaveLength(1);
      expect(result.boards[0]!.name).toBe('Updated Board');
    });

    it('should handle REMOVE_BOARD action', () => {
      const action: BoardAction = {
        type: 'REMOVE_BOARD',
        payload: { boardId: 'board-1' },
      };

      const result = boardReducer(mockState, action);

      expect(result.boards).toHaveLength(0);
    });
  });

  describe('Column Actions', () => {
    it('should handle ADD_COLUMN action', () => {
      const action: BoardAction = {
        type: 'ADD_COLUMN',
        payload: { boardId: 'board-1', title: 'In Progress' },
      };

      const result = boardReducer(mockState, action);

      expect(result.boards).toHaveLength(1);
      expect(result.boards[0]!.columns).toHaveLength(2);
      expect(result.boards[0]!.columns[1]!.title).toBe('In Progress');
    });

    it('should handle UPDATE_COLUMN action', () => {
      const action: BoardAction = {
        type: 'UPDATE_COLUMN',
        payload: { boardId: 'board-1', columnId: 'col-1', title: 'Backlog' },
      };

      const result = boardReducer(mockState, action);

      expect(result.boards).toHaveLength(1);
      expect(result.boards[0]!.columns).toHaveLength(1);
      expect(result.boards[0]!.columns[0]!.title).toBe('Backlog');
    });

    it('should handle DELETE_COLUMN action', () => {
      const action: BoardAction = {
        type: 'DELETE_COLUMN',
        payload: { boardId: 'board-1', columnId: 'col-1' },
      };

      const result = boardReducer(mockState, action);

      expect(result.boards).toHaveLength(1);
      expect(result.boards[0]!.columns).toHaveLength(0);
    });
  });

  describe('Task Actions', () => {
    it('should handle ADD_TASK action', () => {
      const action: BoardAction = {
        type: 'ADD_TASK',
        payload: {
          boardId: 'board-1',
          columnId: 'col-1',
          title: 'New Task',
          description: 'Task description',
          priority: 'high',
        },
      };

      const result = boardReducer(mockState, action);

      expect(result.boards).toHaveLength(1);
      expect(Object.keys(result.boards[0]!.tasks)).toHaveLength(2);
      expect(result.boards[0]!.columns).toHaveLength(1);
      expect(result.boards[0]!.columns[0]!.taskIds).toHaveLength(2);
    });

    it('should handle UPDATE_TASK action', () => {
      const action: BoardAction = {
        type: 'UPDATE_TASK',
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
          title: 'Updated Task',
          description: 'Updated description',
        },
      };

      const result = boardReducer(mockState, action);

      expect(result.boards).toHaveLength(1);
      expect(result.boards[0]!.tasks['task-1']).toBeDefined();
      expect(result.boards[0]!.tasks['task-1']!.title).toBe('Updated Task');
      expect(result.boards[0]!.tasks['task-1']!.description).toBe('Updated description');
    });

    it('should handle DELETE_TASK action', () => {
      const action: BoardAction = {
        type: 'DELETE_TASK',
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
        },
      };

      const result = boardReducer(mockState, action);

      expect(result.boards).toHaveLength(1);
      expect(result.boards[0]!.tasks['task-1']).toBeUndefined();
      expect(result.boards[0]!.columns).toHaveLength(1);
      expect(result.boards[0]!.columns[0]!.taskIds).toEqual([]);
    });
  });

  describe('Action Routing', () => {
    it('should route to correct handler based on action type', () => {
      // Test that actions are properly routed to their handlers
      const taskAction: BoardAction = {
        type: 'ADD_TASK',
        payload: { boardId: 'board-1', columnId: 'col-1', title: 'Task' },
      };

      const columnAction: BoardAction = {
        type: 'ADD_COLUMN',
        payload: { boardId: 'board-1', title: 'Column' },
      };

      const boardAction: BoardAction = {
        type: 'ADD_BOARD',
        payload: { name: 'Board' },
      };

      const taskResult = boardReducer(mockState, taskAction);
      const columnResult = boardReducer(mockState, columnAction);
      const boardResult = boardReducer(mockState, boardAction);

      expect(taskResult.boards).toHaveLength(1);
      expect(columnResult.boards).toHaveLength(1);
      expect(boardResult.boards).toHaveLength(2);

      // Verify each action had the expected effect
      expect(Object.keys(taskResult.boards[0]!.tasks).length).toBeGreaterThan(
        Object.keys(mockState.boards[0]!.tasks).length
      );
      expect(columnResult.boards[0]!.columns.length).toBeGreaterThan(
        mockState.boards[0]!.columns.length
      );
      expect(boardResult.boards.length).toBeGreaterThan(mockState.boards.length);
    });
  });

  describe('Immutability', () => {
    it('should not mutate the original state', () => {
      const originalState = JSON.parse(JSON.stringify(mockState));
      const action: BoardAction = {
        type: 'UPDATE_BOARD',
        payload: { boardId: 'board-1', name: 'Changed' },
      };

      boardReducer(mockState, action);

      expect(mockState).toEqual(originalState);
    });
  });
});
