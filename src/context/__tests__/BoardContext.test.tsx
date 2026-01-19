import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BoardProvider, BoardContext } from '../BoardContext';
import { useContext } from 'react';

const mockInitialState = {
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

describe('BoardContext', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('board-management-state', JSON.stringify(mockInitialState));
  });

  describe('BoardProvider', () => {
    it('renders children', () => {
      render(
        <BoardProvider>
          <div>Test Child</div>
        </BoardProvider>
      );

      expect(screen.getByText('Test Child')).toBeInTheDocument();
    });

    it('provides initial state with default board', () => {
      const TestComponent = () => {
        const context = useContext(BoardContext);
        return (
          <div>
            <span data-testid="board-count">{context?.boards.length}</span>
            <span data-testid="first-board-name">{context?.boards[0]?.name}</span>
          </div>
        );
      };

      render(
        <BoardProvider>
          <TestComponent />
        </BoardProvider>
      );

      expect(screen.getByTestId('board-count')).toHaveTextContent('1');
      expect(screen.getByTestId('first-board-name')).toHaveTextContent('Test Board 1');
    });

    it('provides dispatch function', () => {
      const TestComponent = () => {
        const context = useContext(BoardContext);
        return (
          <div>
            <span data-testid="has-dispatch">
              {typeof context?.dispatch === 'function' ? 'true' : 'false'}
            </span>
          </div>
        );
      };

      render(
        <BoardProvider>
          <TestComponent />
        </BoardProvider>
      );

      expect(screen.getByTestId('has-dispatch')).toHaveTextContent('true');
    });

    it('initializes with test data', () => {
      const TestComponent = () => {
        const context = useContext(BoardContext);
        const board = context?.boards[0];

        return (
          <div>
            <span data-testid="column-count">{board?.columns.length}</span>
            <span data-testid="task-count">{Object.keys(board?.tasks || {}).length}</span>
          </div>
        );
      };

      render(
        <BoardProvider>
          <TestComponent />
        </BoardProvider>
      );

      expect(screen.getByTestId('column-count')).toHaveTextContent('3');
      expect(screen.getByTestId('task-count')).toHaveTextContent('3');
    });
  });

  describe('State Management', () => {
    it('updates state when actions are dispatched', async () => {
      const TestComponent = () => {
        const context = useContext(BoardContext);

        const addBoard = () => {
          context?.dispatch({
            type: 'ADD_BOARD',
            payload: { name: 'New Test Board' },
          });
        };

        return (
          <div>
            <span data-testid="board-count">{context?.boards.length}</span>
            <button onClick={addBoard}>Add Board</button>
          </div>
        );
      };

      render(
        <BoardProvider>
          <TestComponent />
        </BoardProvider>
      );

      expect(screen.getByTestId('board-count')).toHaveTextContent('1');

      const user = userEvent.setup();
      const button = screen.getByText('Add Board');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('board-count')).toHaveTextContent('2');
      });
    });

    it('handles ADD_COLUMN action', async () => {
      const TestComponent = () => {
        const context = useContext(BoardContext);
        const board = context?.boards[0];

        const addColumn = () => {
          if (board) {
            context?.dispatch({
              type: 'ADD_COLUMN',
              payload: { boardId: board.id, title: 'New Column' },
            });
          }
        };

        return (
          <div>
            <span data-testid="column-count">{board?.columns.length}</span>
            <button onClick={addColumn}>Add Column</button>
          </div>
        );
      };

      render(
        <BoardProvider>
          <TestComponent />
        </BoardProvider>
      );

      expect(screen.getByTestId('column-count')).toHaveTextContent('3');

      const user = userEvent.setup();
      const button = screen.getByText('Add Column');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('column-count')).toHaveTextContent('4');
      });
    });

    it('handles ADD_TASK action', async () => {
      const TestComponent = () => {
        const context = useContext(BoardContext);
        const board = context?.boards[0];

        const addTask = () => {
          if (board && board.columns[0]) {
            context?.dispatch({
              type: 'ADD_TASK',
              payload: {
                boardId: board.id,
                columnId: board.columns[0].id,
                title: 'New Task',
              },
            });
          }
        };

        return (
          <div>
            <span data-testid="task-count">{Object.keys(board?.tasks || {}).length}</span>
            <button onClick={addTask}>Add Task</button>
          </div>
        );
      };

      render(
        <BoardProvider>
          <TestComponent />
        </BoardProvider>
      );

      expect(screen.getByTestId('task-count')).toHaveTextContent('3');

      const user = userEvent.setup();
      const button = screen.getByText('Add Task');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('task-count')).toHaveTextContent('4');
      });
    });

    it('handles DELETE_TASK action', async () => {
      const TestComponent = () => {
        const context = useContext(BoardContext);
        const board = context?.boards[0];

        const deleteTask = () => {
          if (board) {
            const firstTaskId = Object.keys(board.tasks)[0];
            if (firstTaskId) {
              context?.dispatch({
              type: 'DELETE_TASK',
              payload: {
                boardId: board.id,
                taskId: firstTaskId,
              },
            });
            }
          }
        };

        return (
          <div>
            <span data-testid="task-count">{Object.keys(board?.tasks || {}).length}</span>
            <button onClick={deleteTask}>Delete Task</button>
          </div>
        );
      };

      render(
        <BoardProvider>
          <TestComponent />
        </BoardProvider>
      );

      expect(screen.getByTestId('task-count')).toHaveTextContent('3');

      const user = userEvent.setup();
      const button = screen.getByText('Delete Task');
      await user.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('task-count')).toHaveTextContent('2');
      });
    });
  });

  describe('Initial State', () => {
    it('has correct initial board structure', () => {
      const TestComponent = () => {
        const context = useContext(BoardContext);
        const board = context?.boards[0];

        return (
          <div>
            <span data-testid="board-id">{board?.id}</span>
            <span data-testid="board-name">{board?.name}</span>
            <span data-testid="has-columns">{board?.columns ? 'true' : 'false'}</span>
            <span data-testid="has-tasks">{board?.tasks ? 'true' : 'false'}</span>
          </div>
        );
      };

      render(
        <BoardProvider>
          <TestComponent />
        </BoardProvider>
      );

      expect(screen.getByTestId('board-id')).toHaveTextContent('1');
      expect(screen.getByTestId('board-name')).toHaveTextContent('Test Board 1');
      expect(screen.getByTestId('has-columns')).toHaveTextContent('true');
      expect(screen.getByTestId('has-tasks')).toHaveTextContent('true');
    });

    it('has correct column structure', () => {
      const TestComponent = () => {
        const context = useContext(BoardContext);
        const board = context?.boards[0];
        const column = board?.columns[0];

        return (
          <div>
            <span data-testid="column-id">{column?.id}</span>
            <span data-testid="column-title">{column?.title}</span>
            <span data-testid="column-task-count">{column?.taskIds.length}</span>
          </div>
        );
      };

      render(
        <BoardProvider>
          <TestComponent />
        </BoardProvider>
      );

      expect(screen.getByTestId('column-id')).toHaveTextContent('todo');
      expect(screen.getByTestId('column-title')).toHaveTextContent('To Do');
      expect(screen.getByTestId('column-task-count')).toHaveTextContent('2');
    });
  });
});
