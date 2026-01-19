import { handleTaskActions } from '../handleTaskActions';
import type { BoardAction, BoardState } from '../../BoardContext';

describe('handleTaskActions', () => {
  const mockState: BoardState = {
    boards: [
      {
        id: 'board-1',
        name: 'Test Board',
        columns: [
          { id: 'col-1', title: 'To Do', taskIds: ['task-1'] },
          { id: 'col-2', title: 'In Progress', taskIds: [] },
        ],
        tasks: {
          'task-1': {
            id: 'task-1',
            title: 'Test Task',
            description: 'Test Description',
            priority: 'medium',
          },
        },
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('ADD_TASK', () => {
    it('should add a new task to the specified column', () => {
      const action = {
        type: 'ADD_TASK' as const,
        payload: {
          boardId: 'board-1',
          columnId: 'col-2',
          title: 'New Task',
          description: 'New Description',
          priority: 'high' as const,
        },
      };

      const result = handleTaskActions(mockState, action);
      expect(result.boards).toHaveLength(1);
      expect(result.boards[0]!.tasks).toBeDefined();
      const taskIds = Object.keys(result.boards[0]!.tasks);

      expect(taskIds).toHaveLength(2);
      expect(result.boards[0]!.columns).toHaveLength(2);
      expect(result.boards[0]!.columns[1]!.taskIds).toHaveLength(1);

      const newTaskId = result.boards[0]!.columns[1]!.taskIds[0];
      expect(newTaskId).toBeDefined();
      const newTask = result.boards[0]!.tasks[newTaskId!];

      expect(newTask).toBeDefined();
      expect(newTask!.title).toBe('New Task');
      expect(newTask!.description).toBe('New Description');
      expect(newTask!.priority).toBe('high');
    });

    it('should add task with optional fields', () => {
      const action = {
        type: 'ADD_TASK' as const,
        payload: {
          boardId: 'board-1',
          columnId: 'col-2',
          title: 'Simple Task',
        },
      };

      const result = handleTaskActions(mockState, action);
      expect(result.boards[0]).toBeDefined();
      expect(result.boards[0]!.columns[1]).toBeDefined();
      expect(result.boards[0]!.columns[1]!.taskIds).toHaveLength(1);

      const newTaskId = result.boards[0]!.columns[1]!.taskIds[0];
      expect(newTaskId).toBeDefined();
      const newTask = result.boards[0]!.tasks[newTaskId!];

      expect(newTask).toBeDefined();
      expect(newTask!.title).toBe('Simple Task');
      expect(newTask!.description).toBeUndefined();
      expect(newTask!.priority).toBeUndefined();
    });

    it('should add task with dueDate', () => {
      const dueDate = '2026-12-31';
      const action = {
        type: 'ADD_TASK' as const,
        payload: {
          boardId: 'board-1',
          columnId: 'col-2',
          title: 'Task with Due Date',
          dueDate,
        },
      };

      const result = handleTaskActions(mockState, action);
      expect(result.boards[0]).toBeDefined();
      expect(result.boards[0]!.columns[1]).toBeDefined();
      expect(result.boards[0]!.columns[1]!.taskIds).toHaveLength(1);
      const newTaskId = result.boards[0]!.columns[1]!.taskIds[0];
      expect(newTaskId).toBeDefined();
      const newTask = result.boards[0]!.tasks[newTaskId!];
      expect(newTask).toBeDefined();

      expect(newTask!.dueDate).toBe(dueDate);
    });

    it('should not affect other boards', () => {
      const stateWithMultipleBoards: BoardState = {
        boards: [
          { id: 'board-1', name: 'Board 1', columns: [{ id: 'col-1', title: 'To Do', taskIds: [] }], tasks: {} },
          { id: 'board-2', name: 'Board 2', columns: [{ id: 'col-2', title: 'To Do', taskIds: [] }], tasks: {} },
        ],
      };

      const action = {
        type: 'ADD_TASK' as const,
        payload: {
          boardId: 'board-1',
          columnId: 'col-1',
          title: 'New Task',
        },
      };

      const result = handleTaskActions(stateWithMultipleBoards, action);
      expect(result.boards).toHaveLength(2);

      expect(Object.keys(result.boards[0]!.tasks)).toHaveLength(1);
      expect(Object.keys(result.boards[1]!.tasks)).toHaveLength(0);
    });

    it('should not mutate the original state', () => {
      const action = {
        type: 'ADD_TASK' as const,
        payload: {
          boardId: 'board-1',
          columnId: 'col-2',
          title: 'New Task',
        },
      };

      const result = handleTaskActions(mockState, action);

      expect(result).not.toBe(mockState);
      expect(Object.keys(mockState.boards[0]!.tasks)).toHaveLength(1);
    });
  });

  describe('UPDATE_TASK', () => {
    it('should update task properties', () => {
      const action = {
        type: 'UPDATE_TASK' as const,
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
          title: 'Updated Task',
          description: 'Updated Description',
          priority: 'high' as const,
        },
      };

      const result = handleTaskActions(mockState, action);
      const updatedTask = result.boards[0]!.tasks['task-1'];
      expect(updatedTask).toBeDefined();

      expect(updatedTask!.title).toBe('Updated Task');
      expect(updatedTask!.description).toBe('Updated Description');
      expect(updatedTask!.priority).toBe('high');
    });

    it('should preserve task ID when updating', () => {
      const action = {
        type: 'UPDATE_TASK' as const,
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
          title: 'Updated Task',
        },
      };

      const result = handleTaskActions(mockState, action);
      expect(result.boards[0]!.tasks['task-1']).toBeDefined();

      expect(result.boards[0]!.tasks['task-1']!.id).toBe('task-1');
    });

    it('should update dueDate', () => {
      const newDueDate = '2027-01-01';
      const action = {
        type: 'UPDATE_TASK' as const,
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
          title: 'Task with Updated Date',
          dueDate: newDueDate,
        },
      };

      const result = handleTaskActions(mockState, action);
      expect(result.boards[0]!.tasks['task-1']).toBeDefined();

      expect(result.boards[0]!.tasks['task-1']!.dueDate).toBe(newDueDate);
    });

    it('should only affect the specified board', () => {
      const stateWithMultipleBoards: BoardState = {
        boards: [
          {
            id: 'board-1',
            name: 'Board 1',
            columns: [{ id: 'col-1', title: 'To Do', taskIds: ['task-1'] }],
            tasks: { 'task-1': { id: 'task-1', title: 'Task 1' } },
          },
          {
            id: 'board-2',
            name: 'Board 2',
            columns: [{ id: 'col-2', title: 'To Do', taskIds: ['task-1'] }],
            tasks: { 'task-1': { id: 'task-1', title: 'Task 1 Copy' } },
          },
        ],
      };

      const action = {
        type: 'UPDATE_TASK' as const,
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
          title: 'Updated Task',
        },
      };

      const result = handleTaskActions(stateWithMultipleBoards, action);
      expect(result.boards).toHaveLength(2);
      expect(result.boards[0]!.tasks['task-1']).toBeDefined();
      expect(result.boards[1]!.tasks['task-1']).toBeDefined();

      expect(result.boards[0]!.tasks['task-1']!.title).toBe('Updated Task');
      expect(result.boards[1]!.tasks['task-1']!.title).toBe('Task 1 Copy');
    });

    it('should not mutate the original state', () => {
      const action = {
        type: 'UPDATE_TASK' as const,
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
          title: 'Updated Task',
        },
      };

      const result = handleTaskActions(mockState, action);

      expect(result).not.toBe(mockState);
      expect(mockState.boards[0]!.tasks['task-1']).toBeDefined();
      expect(mockState.boards[0]!.tasks['task-1']!.title).toBe('Test Task');
    });
  });

  describe('DELETE_TASK', () => {
    it('should remove the task from tasks and column', () => {
      const action = {
        type: 'DELETE_TASK' as const,
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
        },
      };

      const result = handleTaskActions(mockState, action);

      expect(result.boards[0]!.tasks['task-1']).toBeUndefined();
      expect(result.boards[0]!.columns[0]!.taskIds).toEqual([]);
    });

    it('should handle deleting tasks from multiple columns', () => {
      const stateWithMultipleTasks: BoardState = {
        boards: [
          {
            id: 'board-1',
            name: 'Test Board',
            columns: [
              { id: 'col-1', title: 'To Do', taskIds: ['task-1', 'task-2'] },
              { id: 'col-2', title: 'In Progress', taskIds: ['task-3'] },
            ],
            tasks: {
              'task-1': { id: 'task-1', title: 'Task 1' },
              'task-2': { id: 'task-2', title: 'Task 2' },
              'task-3': { id: 'task-3', title: 'Task 3' },
            },
          },
        ],
      };

      const action = {
        type: 'DELETE_TASK' as const,
        payload: {
          boardId: 'board-1',
          taskId: 'task-2',
        },
      };

      const result = handleTaskActions(stateWithMultipleTasks, action);

      expect(result.boards[0]!.tasks['task-2']).toBeUndefined();
      expect(result.boards[0]!.columns[0]!.taskIds).toEqual(['task-1']);
      expect(result.boards[0]!.columns[1]!.taskIds).toEqual(['task-3']);
    });

    it('should only affect the specified board', () => {
      const stateWithMultipleBoards: BoardState = {
        boards: [
          {
            id: 'board-1',
            name: 'Board 1',
            columns: [{ id: 'col-1', title: 'To Do', taskIds: ['task-1'] }],
            tasks: { 'task-1': { id: 'task-1', title: 'Task 1' } },
          },
          {
            id: 'board-2',
            name: 'Board 2',
            columns: [{ id: 'col-2', title: 'To Do', taskIds: ['task-1'] }],
            tasks: { 'task-1': { id: 'task-1', title: 'Task 1 Copy' } },
          },
        ],
      };

      const action = {
        type: 'DELETE_TASK' as const,
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
        },
      };

      const result = handleTaskActions(stateWithMultipleBoards, action);
      expect(result.boards).toHaveLength(2);

      expect(result.boards[0]!.tasks['task-1']).toBeUndefined();
      expect(result.boards[1]!.tasks['task-1']).toBeDefined();
    });

    it('should not mutate the original state', () => {
      const action = {
        type: 'DELETE_TASK' as const,
        payload: {
          boardId: 'board-1',
          taskId: 'task-1',
        },
      };

      const result = handleTaskActions(mockState, action);

      expect(result).not.toBe(mockState);
      expect(mockState.boards[0]).toBeDefined();
      expect(mockState.boards[0]!.tasks['task-1']).toBeDefined();
    });
  });

  describe('default case', () => {
    it('should return the same state for unhandled actions', () => {
      const action = {
        type: 'UNKNOWN_ACTION' as any,
        payload: { boardId: '', taskId: '' },
      } as BoardAction;

      const result = handleTaskActions(mockState, action);

      expect(result).toBe(mockState);
    });
  });
});
