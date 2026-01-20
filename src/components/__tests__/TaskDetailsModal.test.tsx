import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TaskDetailsModal from '../TaskDetailsModal';
import type { Task } from '@shared/types';
import { BoardProvider } from '../../context/BoardContext';

const mockOnClose = jest.fn();
const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe('TaskDetailsModal', () => {
  const mockTask: Task = {
    id: 'task-1',
    title: 'Test Task',
    description: 'This is a test task',
    priority: 'high',
    dueDate: '2026-12-31',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        <BoardProvider>
          {component}
        </BoardProvider>
      </BrowserRouter>
    );
  };

  it('renders task title', () => {
    renderWithRouter(
      <TaskDetailsModal
        task={mockTask}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOpen={true}
      />
    );
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders task description', () => {
    renderWithRouter(
      <TaskDetailsModal
        task={mockTask}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOpen={true}
      />
    );
    expect(screen.getByText('This is a test task')).toBeInTheDocument();
  });

  it('renders "No description" when description is missing', () => {
    const taskWithoutDescription = { ...mockTask, description: undefined };
    renderWithRouter(
      <TaskDetailsModal
        task={taskWithoutDescription}
        onClose={mockOnClose}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        isOpen={true}
      />
    );
    expect(screen.getByText('No description')).toBeInTheDocument();
  });

  describe('Priority Display', () => {
    it('renders high priority badge', () => {
      renderWithRouter(
        <TaskDetailsModal
          task={mockTask}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      const priorityBadge = screen.getByTestId('priority-badge');
      expect(priorityBadge).toHaveTextContent('high');
      expect(priorityBadge).toHaveAttribute('data-priority', 'high');
    });

    it('renders medium priority badge', () => {
      const taskWithMediumPriority = { ...mockTask, priority: 'medium' as const };
      renderWithRouter(
        <TaskDetailsModal
          task={taskWithMediumPriority}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      const priorityBadge = screen.getByTestId('priority-badge');
      expect(priorityBadge).toHaveTextContent('medium');
      expect(priorityBadge).toHaveAttribute('data-priority', 'medium');
    });

    it('renders low priority badge', () => {
      const taskWithLowPriority = { ...mockTask, priority: 'low' as const };
      renderWithRouter(
        <TaskDetailsModal
          task={taskWithLowPriority}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      const priorityBadge = screen.getByTestId('priority-badge');
      expect(priorityBadge).toHaveTextContent('low');
      expect(priorityBadge).toHaveAttribute('data-priority', 'low');
    });

    it('renders default priority when priority is undefined', () => {
      const taskWithoutPriority = { ...mockTask, priority: undefined };
      renderWithRouter(
        <TaskDetailsModal
          task={taskWithoutPriority}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      const priorityBadge = screen.getByTestId('priority-badge');
      expect(priorityBadge).toHaveTextContent('none');
      expect(priorityBadge).toHaveAttribute('data-priority', 'none');
    });
  });

  describe('Due Date Display', () => {
    it('renders formatted due date', () => {
      renderWithRouter(
        <TaskDetailsModal
          task={mockTask}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      expect(screen.getByText('Dec 31, 2026')).toBeInTheDocument();
    });

    it('does not render due date section when dueDate is missing', () => {
      const taskWithoutDueDate = { ...mockTask, dueDate: undefined };
      renderWithRouter(
        <TaskDetailsModal
          task={taskWithoutDueDate}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      expect(screen.queryByText(/Due Date/i)).not.toBeInTheDocument();
    });

    it('formats different dates correctly', () => {
      const taskWithDifferentDate = { ...mockTask, dueDate: '2027-01-15' };
      renderWithRouter(
        <TaskDetailsModal
          task={taskWithDifferentDate}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      expect(screen.getByText('Jan 15, 2027')).toBeInTheDocument();
    });
  });

  describe('Modal Behavior', () => {
    it('renders when task is provided', () => {
      renderWithRouter(
        <TaskDetailsModal
          task={mockTask}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      expect(screen.getByText('Test Task')).toBeInTheDocument();
    });

    it('closes modal when close button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <TaskDetailsModal
          task={mockTask}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onEdit when edit button is clicked', async () => {
      const user = userEvent.setup();
      renderWithRouter(
        <TaskDetailsModal
          task={mockTask}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );

      const editButton = screen.getByTestId('edit-task-button');
      await user.click(editButton);

      expect(mockOnEdit).toHaveBeenCalledTimes(1);
    });
  });

  describe('Task Actions', () => {
    it('renders Edit and Delete buttons', () => {
      renderWithRouter(
        <TaskDetailsModal
          task={mockTask}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('Section Headers', () => {
    it('renders all section headers', () => {
      renderWithRouter(
        <TaskDetailsModal
          task={mockTask}
          onClose={mockOnClose}
          onEdit={mockOnEdit}
          onDelete={mockOnDelete}
          isOpen={true}
        />
      );
      expect(screen.getByText('Description')).toBeInTheDocument();
      expect(screen.getByText('Priority')).toBeInTheDocument();
      expect(screen.getByText('Due Date')).toBeInTheDocument();
    });
  });
});
