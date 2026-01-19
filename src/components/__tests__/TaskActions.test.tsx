import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskActions from '../TaskActions';
import { BoardProvider } from '../../context/BoardContext';

const mockOnClose = jest.fn();

describe('TaskActions', () => {
  const mockTask = {
    id: 'task-1',
    title: 'Test Task',
    description: 'Test description',
    priority: 'medium' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.confirm as jest.Mock).mockReturnValue(true);
  });

  const renderWithContext = (component: React.ReactElement) => {
    return render(<BoardProvider>{component}</BoardProvider>);
  };

  it('renders Edit and Delete buttons', () => {
    renderWithContext(
      <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
    );

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  describe('Edit Functionality', () => {
    it('opens edit modal when Edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithContext(
        <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
      );

      await user.click(screen.getByText('Edit'));

      expect(screen.getByText('Edit Task')).toBeInTheDocument();
    });

    it('populates edit form with task data', async () => {
      const user = userEvent.setup();
      renderWithContext(
        <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
      );

      await user.click(screen.getByText('Edit'));

      expect(screen.getByLabelText(/Title/)).toHaveValue('Test Task');
      expect(screen.getByLabelText(/Description/)).toHaveValue('Test description');
      expect(screen.getByLabelText(/Priority/)).toHaveValue('medium');
    });

    it('closes edit modal and parent modal after saving', async () => {
      const user = userEvent.setup();
      renderWithContext(
        <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
      );

      await user.click(screen.getByText('Edit'));

      const titleInput = screen.getByLabelText(/Title/);
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Task');
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('can cancel editing', async () => {
      const user = userEvent.setup();
      renderWithContext(
        <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
      );

      await user.click(screen.getByText('Edit'));
      expect(screen.getByText('Edit Task')).toBeInTheDocument();

      await user.click(screen.getByText('Cancel'));

      await waitFor(() => {
        expect(screen.queryByText('Edit Task')).not.toBeInTheDocument();
      });
    });
  });

  describe('Delete Functionality', () => {
    it('shows confirmation dialog when Delete is clicked', async () => {
      const user = userEvent.setup();
      renderWithContext(
        <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
      );

      await user.click(screen.getByText('Delete'));

      await waitFor(() => {
        expect(screen.getByText('Delete Task')).toBeInTheDocument();
        expect(screen.getByText(/Are you sure you want to delete/)).toBeInTheDocument();
      });
    });

    it('calls onClose after successful delete', async () => {
      const user = userEvent.setup();
      renderWithContext(
        <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
      );

      await user.click(screen.getByTestId('delete-task-button'));

      // Wait for dialog and click the confirm delete button (not the main delete button)
      const deleteButtons = await screen.findAllByRole('button', { name: 'Delete' });
      // The second button is the one in the dialog
      await user.click(deleteButtons[1]!);

      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('does not call onClose when delete is cancelled', async () => {
      const user = userEvent.setup();
      renderWithContext(
        <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
      );

      await user.click(screen.getByText('Delete'));

      const cancelButton = await screen.findByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Button Styling', () => {
    it('renders Edit button', () => {
      renderWithContext(
        <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
      );

      const editButton = screen.getByTestId('edit-task-button');
      expect(editButton).toBeInTheDocument();
      expect(editButton).toHaveTextContent('Edit');
    });

    it('renders Delete button', () => {
      renderWithContext(
        <TaskActions boardId="board-1" task={mockTask} onClose={mockOnClose} />
      );

      const deleteButton = screen.getByTestId('delete-task-button');
      expect(deleteButton).toBeInTheDocument();
      expect(deleteButton).toHaveTextContent('Delete');
    });
  });
});
