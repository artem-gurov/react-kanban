import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Column from '../Column';

describe('Column', () => {
  const mockOnRename = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnAddTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.confirm as jest.Mock).mockReturnValue(true);
  });

  const defaultProps = {
    columnId: 'column-1',
    title: 'To Do',
    taskIds: [],
    onRename: mockOnRename,
    onDelete: mockOnDelete,
  };

  it('renders column with title', () => {
    render(<Column {...defaultProps} />);
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Column {...defaultProps}>
        <div>Test Child</div>
      </Column>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  describe('Column Title Editing', () => {
    it('shows input when title is clicked', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} />);

      const title = screen.getByText('To Do');
      await user.click(title);

      const input = screen.getByRole('textbox');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('To Do');
      expect(input).toHaveFocus();
    });

    it('calls onRename when Enter is pressed with new title', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} />);

      await user.click(screen.getByText('To Do'));
      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, 'In Progress{Enter}');

      expect(mockOnRename).toHaveBeenCalledWith('In Progress');
    });

    it('calls onRename when input loses focus', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} />);

      await user.click(screen.getByText('To Do'));
      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, 'Done');
      fireEvent.blur(input);

      expect(mockOnRename).toHaveBeenCalledWith('Done');
    });

    it('does not call onRename if title is unchanged', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} />);

      await user.click(screen.getByText('To Do'));
      const input = screen.getByRole('textbox');
      fireEvent.blur(input);

      expect(mockOnRename).not.toHaveBeenCalled();
    });

    it('does not call onRename if title is empty or whitespace', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} />);

      await user.click(screen.getByText('To Do'));
      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, '   ');
      fireEvent.blur(input);

      expect(mockOnRename).not.toHaveBeenCalled();
    });

    it('cancels editing when Escape is pressed', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} />);

      await user.click(screen.getByText('To Do'));
      const input = screen.getByRole('textbox');

      await user.clear(input);
      await user.type(input, 'New Title{Escape}');

      expect(mockOnRename).not.toHaveBeenCalled();
      expect(screen.getByText('To Do')).toBeInTheDocument();
    });
  });

  describe('Column Deletion', () => {
    it('shows delete button', () => {
      render(<Column {...defaultProps} />);
      expect(screen.getByTitle('Delete column')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete column')).toBeInTheDocument();
    });

    it('shows confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} />);

      await user.click(screen.getByTitle('Delete column'));

      await waitFor(() => {
        expect(screen.getByText('Delete List')).toBeInTheDocument();
        expect(screen.getByText(/All tasks in this list will be lost/)).toBeInTheDocument();
      });
    });

    it('calls onDelete when deletion is confirmed', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} />);

      await user.click(screen.getByTitle('Delete column'));

      const deleteButton = await screen.findByText('Delete');
      await user.click(deleteButton);

      await waitFor(() => {
        expect(mockOnDelete).toHaveBeenCalled();
      });
    });

    it('does not call onDelete when confirmation is cancelled', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} />);

      await user.click(screen.getByTitle('Delete column'));

      const cancelButton = await screen.findByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnDelete).not.toHaveBeenCalled();
    });
  });

  describe('Add Task Functionality', () => {
    it('shows Add a task button when onAddTask is provided', () => {
      render(<Column {...defaultProps} onAddTask={mockOnAddTask} />);
      expect(screen.getByText('Add a task')).toBeInTheDocument();
    });

    it('does not show Add a task button when onAddTask is not provided', () => {
      render(<Column {...defaultProps} />);
      expect(screen.queryByText('Add a task')).not.toBeInTheDocument();
    });

    it('opens task form modal when Add a task is clicked', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} onAddTask={mockOnAddTask} />);

      await user.click(screen.getByText('Add a task'));

      expect(screen.getByText('Add a task')).toBeInTheDocument();
    });

    it('calls onAddTask when form is submitted', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} onAddTask={mockOnAddTask} />);

      await user.click(screen.getByText('Add a task'));
      const input = screen.getByLabelText(/Title/);
      await user.type(input, 'New Task');
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockOnAddTask).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'New Task',
          })
        );
      });
    });

    it('closes modal after task is added', async () => {
      const user = userEvent.setup();
      render(<Column {...defaultProps} onAddTask={mockOnAddTask} />);

      await user.click(screen.getByText('Add a task'));

      const input = screen.getByLabelText(/Title/);
      await user.type(input, 'New Task');
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.queryByText('Save')).not.toBeInTheDocument();
      });
    });
  });
});
