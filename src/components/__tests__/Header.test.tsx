import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../Header';

describe('Header', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it('renders the header title', () => {
    renderWithRouter(<Header />);
    expect(screen.getByText('Kanban Boards')).toBeInTheDocument();
  });

  it('renders as a link to home page', () => {
    renderWithRouter(<Header />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders header element', () => {
    renderWithRouter(<Header />);
    const header = screen.getByTestId('app-header');
    expect(header).toBeInTheDocument();
    expect(header.tagName).toBe('HEADER');
  });

  it('renders heading with proper semantics', () => {
    renderWithRouter(<Header />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Kanban Boards');
  });
});
