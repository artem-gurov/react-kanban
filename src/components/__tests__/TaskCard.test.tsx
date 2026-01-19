import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import TaskCard from '../TaskCard';

describe('TaskCard', () => {
  const defaultProps = {
    title: 'Test Task',
    boardId: 'board-1',
    taskId: 'task-1',
  };

  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders task title', () => {
    renderWithRouter(<TaskCard {...defaultProps} />);
    expect(screen.getByText('Test Task')).toBeInTheDocument();
  });

  it('renders as a link to task details', () => {
    renderWithRouter(<TaskCard {...defaultProps} />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/boards/board-1/tasks/task-1');
  });

  it('renders as a task card component', () => {
    renderWithRouter(<TaskCard {...defaultProps} />);
    const taskCard = screen.getByTestId('task-card');
    expect(taskCard).toBeInTheDocument();
    expect(taskCard.tagName).toBe('A');
  });

  it('renders with different task titles', () => {
    const { rerender } = renderWithRouter(<TaskCard {...defaultProps} title="First Task" />);
    expect(screen.getByText('First Task')).toBeInTheDocument();

    rerender(
      <BrowserRouter>
        <TaskCard {...defaultProps} title="Second Task" />
      </BrowserRouter>
    );
    expect(screen.getByText('Second Task')).toBeInTheDocument();
  });

  it('renders with different board and task IDs', () => {
    renderWithRouter(<TaskCard title="Test" boardId="board-2" taskId="task-5" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/boards/board-2/tasks/task-5');
  });
});
