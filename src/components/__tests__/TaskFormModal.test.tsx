import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskFormModal from '../TaskFormModal';

describe('TaskFormModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
  };

  it('renders with default title "Add Task"', () => {
    render(<TaskFormModal {...defaultProps} />);
    expect(screen.getByText('Add Task')).toBeInTheDocument();
  });

  it('renders with custom title', () => {
    render(<TaskFormModal {...defaultProps} title="Edit Task" />);
    expect(screen.getByText('Edit Task')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<TaskFormModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Add Task')).not.toBeInTheDocument();
  });

  describe('Form Fields', () => {
    it('renders all form fields', () => {
      render(<TaskFormModal {...defaultProps} />);

      expect(screen.getByLabelText(/Title/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Due Date/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Priority/)).toBeInTheDocument();
    });

    it('shows required indicator for title field', () => {
      render(<TaskFormModal {...defaultProps} />);
      expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('renders empty form by default', () => {
      render(<TaskFormModal {...defaultProps} />);

      expect(screen.getByLabelText(/Title/)).toHaveValue('');
      expect(screen.getByLabelText(/Description/)).toHaveValue('');
      expect(screen.getByLabelText(/Due Date/)).toHaveValue('');
      expect(screen.getByLabelText(/Priority/)).toHaveValue('none');
    });

    it('populates form with existing task data', () => {
      const task = {
        id: 'task-1',
        title: 'Existing Task',
        description: 'Task description',
        dueDate: '2026-12-31',
        priority: 'high' as const,
      };

      render(<TaskFormModal {...defaultProps} task={task} />);

      expect(screen.getByLabelText(/Title/)).toHaveValue('Existing Task');
      expect(screen.getByLabelText(/Description/)).toHaveValue('Task description');
      expect(screen.getByLabelText(/Due Date/)).toHaveValue('2026-12-31');
      expect(screen.getByLabelText(/Priority/)).toHaveValue('high');
    });
  });

  describe('Form Validation', () => {
    it('shows error when submitting without title', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      await user.click(screen.getByText('Save'));

      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows error when submitting with whitespace-only title', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/Title/), '   ');
      await user.click(screen.getByText('Save'));

      expect(screen.getByText('Title is required')).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('clears validation error when user types in title', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      await user.click(screen.getByText('Save'));
      expect(screen.getByText('Title is required')).toBeInTheDocument();

      await user.type(screen.getByLabelText(/Title/), 'New Task');
      await user.click(screen.getByText('Save'));

      expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
    });
  });

  describe('Form Submission', () => {
    it('calls onSubmit with form data', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      // Use paste instead of keyboard to avoid timing issues
      await user.click(screen.getByLabelText(/Title/));
      await user.paste('New Task');

      await user.click(screen.getByLabelText(/Description/));
      await user.paste('Task description');

      await user.click(screen.getByLabelText(/Due Date/));
      await user.paste('2026-12-31');

      await user.selectOptions(screen.getByLabelText(/Priority/), 'high');
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          title: 'New Task',
          description: 'Task description',
          dueDate: '2026-12-31',
          priority: 'high',
        });
      });
    });

    it('trims whitespace from title and description', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      // Use paste instead of keyboard
      await user.click(screen.getByLabelText(/Title/));
      await user.paste('  Test Task  ');

      await user.click(screen.getByLabelText(/Description/));
      await user.paste('  Description  ');

      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Test Task',
            description: 'Description',
          })
        );
      });
    });

    it('sets description to undefined when empty', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/Title/), 'Task without description');
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Task without description',
            description: undefined,
          })
        );
      });
    });

    it('sets dueDate to undefined when empty', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/Title/), 'Task without due date');
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith(
          expect.objectContaining({
            title: 'Task without due date',
            dueDate: undefined,
          })
        );
      });
    });

    it('resets form after successful submission', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      await user.type(screen.getByLabelText(/Title/), 'Test Task');
      await user.type(screen.getByLabelText(/Description/), 'Description');
      await user.click(screen.getByText('Save'));

      await waitFor(() => {
        expect(screen.getByLabelText(/Title/)).toHaveValue('');
        expect(screen.getByLabelText(/Description/)).toHaveValue('');
      });
    });
  });

  describe('Form Cancellation', () => {
    it('calls onClose when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      await user.click(screen.getByText('Cancel'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('resets form to original values when cancelled', async () => {
      const user = userEvent.setup();
      const task = {
        id: 'task-1',
        title: 'Original Task',
        description: 'Original description',
        priority: 'low' as const,
      };

      render(<TaskFormModal {...defaultProps} task={task} />);

      await user.clear(screen.getByLabelText(/Title/));
      await user.type(screen.getByLabelText(/Title/), 'Changed Task');
      await user.click(screen.getByText('Cancel'));

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('clears errors when cancelled', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      await user.click(screen.getByText('Save'));
      expect(screen.getByText('Title is required')).toBeInTheDocument();

      await user.click(screen.getByText('Cancel'));

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Priority Options', () => {
    it('renders all priority options', () => {
      render(<TaskFormModal {...defaultProps} />);

      const select = screen.getByLabelText(/Priority/);
      expect(select).toBeInTheDocument();

      expect(screen.getByRole('option', { name: 'Low' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'Medium' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'High' })).toBeInTheDocument();
    });

    it('defaults to none priority', () => {
      render(<TaskFormModal {...defaultProps} />);
      expect(screen.getByLabelText(/Priority/)).toHaveValue('none');
    });

    it('allows changing priority', async () => {
      const user = userEvent.setup();
      render(<TaskFormModal {...defaultProps} />);

      await user.selectOptions(screen.getByLabelText(/Priority/), 'low');
      expect(screen.getByLabelText(/Priority/)).toHaveValue('low');

      await user.selectOptions(screen.getByLabelText(/Priority/), 'high');
      expect(screen.getByLabelText(/Priority/)).toHaveValue('high');
    });
  });
});
