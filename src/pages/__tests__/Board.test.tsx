import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import userEvent from '@testing-library/user-event';
import { Routes, Route, MemoryRouter } from 'react-router-dom';
import Board from '../Board';
import { BoardProvider } from '../../context/BoardContext';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

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

describe('Board', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    localStorage.setItem('board-management-state', JSON.stringify(mockInitialState));
  });

  const renderWithProviders = (route = '/boards/1') => {
    return render(
      <MemoryRouter initialEntries={[route]}>
        <BoardProvider>
          <Routes>
            <Route path="/boards/:boardId" element={<Board />} />
            <Route path="/boards/:boardId/tasks/:taskId" element={<Board />} />
          </Routes>
        </BoardProvider>
      </MemoryRouter>
    );
  };

  it('renders board name', () => {
    renderWithProviders();
    expect(screen.getByText('Test Board 1')).toBeInTheDocument();
  });

  it('renders "Board not found" for invalid board ID', () => {
    renderWithProviders('/boards/invalid-id');
    expect(screen.getByText('Board not found')).toBeInTheDocument();
  });

  describe('Board Title Editing', () => {
    it('shows input when title is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(screen.getByText('Test Board 1'));

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('Test Board 1');
    });

    it('saves title on Enter key', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(screen.getByText('Test Board 1'));
      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, 'Updated Board{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Updated Board')).toBeInTheDocument();
      });
    });

    it('saves title on blur', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(screen.getByText('Test Board 1'));
      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, 'Updated Board');
      await act(async () => {
        input.blur();
      });

      await waitFor(() => {
        expect(screen.getByText('Updated Board')).toBeInTheDocument();
      });
    });

    it('cancels editing on Escape key', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(screen.getByText('Test Board 1'));
      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, 'Changed{Escape}');

      expect(screen.getByText('Test Board 1')).toBeInTheDocument();
    });

    it('does not save if title is unchanged', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(screen.getByText('Test Board 1'));
      const input = screen.getByRole('textbox');
      await act(async () => {
        input.blur();
      });

      // Should still show original title
      expect(screen.getByText('Test Board 1')).toBeInTheDocument();
    });
  });

  describe('Board Deletion', () => {
    it('shows delete button', () => {
      renderWithProviders();
      expect(screen.getByTitle('Delete board')).toBeInTheDocument();
    });

    it('shows confirmation dialog when delete is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(screen.getByTitle('Delete board'));

      await waitFor(() => {
        expect(screen.getByText('Delete Board')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      });
    });

    it('navigates to home after deletion', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(screen.getByTitle('Delete board'));

      const deleteButton = await screen.findByText('Delete');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith('/');
      });
    });

    it('does not delete when confirmation is cancelled', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(screen.getByTitle('Delete board'));

      const cancelButton = await screen.findByText('Cancel');
      await user.click(cancelButton);

      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  describe('Columns', () => {
    it('renders all columns', () => {
      renderWithProviders();
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Done')).toBeInTheDocument();
    });

    it('renders tasks in columns', () => {
      renderWithProviders();
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    it('shows Add Column button', () => {
      renderWithProviders();
      expect(screen.getByText('Add another list')).toBeInTheDocument();
    });

    it('opens dialog when Add Column is clicked', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      await user.click(screen.getByText('Add another list'));

      await waitFor(() => {
        expect(screen.getByText('Add New List')).toBeInTheDocument();
        expect(screen.getByLabelText('List Title')).toBeInTheDocument();
      });
    });

    it('adds column when title is provided', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const columnsBefore = screen.getAllByRole('button', { name: /Delete column/i });
      const beforeCount = columnsBefore.length;

      await user.click(screen.getByText('Add another list'));

      const input = await screen.findByLabelText('List Title');
      await user.type(input, 'Done');
      const submitButton = screen.getByRole('button', { name: 'Add List' });
      await user.click(submitButton);

      await waitFor(() => {
        const columnsAfter = screen.getAllByRole('button', { name: /Delete column/i });
        expect(columnsAfter.length).toBe(beforeCount + 1);
      });
    });

    it('does not add column when dialog is cancelled', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const columnsBefore = screen.getAllByRole('button', { name: /Delete column/i });
      const beforeCount = columnsBefore.length;

      await user.click(screen.getByText('Add another list'));
      await user.click(screen.getByText('Cancel'));

      const columnsAfter = screen.getAllByRole('button', { name: /Delete column/i });
      expect(columnsAfter.length).toBe(beforeCount);
    });
  });

  describe('Task Modal', () => {
    it('does not show task modal by default', () => {
      renderWithProviders();
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });

    it('shows task modal when taskId is in URL', () => {
      renderWithProviders('/boards/1/tasks/t1');

      // The modal should be rendered
      // Check for task details modal elements
      expect(screen.getByText('This is task 1')).toBeInTheDocument();
    });
  });

  describe('Column Actions', () => {
    it('updates column title', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const todoColumn = screen.getByText('To Do');
      await user.click(todoColumn);

      const input = screen.getByRole('textbox');
      await user.clear(input);
      await user.type(input, 'Backlog{Enter}');

      await waitFor(() => {
        expect(screen.getByText('Backlog')).toBeInTheDocument();
      });
    });

    it('deletes column', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      // Find the delete button for the first column
      const deleteButtons = screen.getAllByTitle('Delete column');
      expect(deleteButtons.length).toBeGreaterThan(0);
      await user.click(deleteButtons[0]!);

      // Confirm deletion
      const deleteButton = await screen.findByRole('button', { name: 'Delete' });
      await user.click(deleteButton);

      await waitFor(() => {
        // The "To Do" column should be removed
        const columns = screen.queryAllByText('To Do');
        expect(columns.length).toBe(0);
      });
    });
  });

  describe('Task Actions', () => {
    it('adds task to column', async () => {
      const user = userEvent.setup();
      renderWithProviders();

      const addTaskButtons = screen.getAllByText('Add a task');
      expect(addTaskButtons.length).toBeGreaterThan(0);
      await user.click(addTaskButtons[0]!);

      expect(screen.getByText('Add Task')).toBeInTheDocument();

      await user.type(screen.getByLabelText(/Title/), 'New Task');
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByText('New Task')).toBeInTheDocument();
      });
    });
  });

  describe('Layout and Styling', () => {
    it('renders columns in a container', () => {
      renderWithProviders();
      const columnsContainer = screen.getByTestId('columns-container');
      expect(columnsContainer).toBeInTheDocument();
    });

    it('renders add column button', () => {
      renderWithProviders();
      const addColumnButton = screen.getByTestId('add-column-button');
      expect(addColumnButton).toBeInTheDocument();
      expect(addColumnButton).toHaveTextContent('Add another list');
    });
  });
});
