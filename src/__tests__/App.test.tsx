import { render, screen } from '@testing-library/react';
import App from '../App';
import { BoardProvider } from '../context/BoardContext';

// Mock the pages to simplify testing
jest.mock('../pages/BoardList', () => {
  return function MockBoardList() {
    return <div>Board List Page</div>;
  };
});

jest.mock('../pages/Board', () => {
  return function MockBoard() {
    return <div>Board Page</div>;
  };
});

describe('App', () => {
  const renderApp = () => {
    return render(
      <BoardProvider>
        <App />
      </BoardProvider>
    );
  };

  it('renders without errors', () => {
    expect(() => renderApp()).not.toThrow();
  });

  it('renders the Header component', () => {
    renderApp();
    expect(screen.getByText('Kanban Boards')).toBeInTheDocument();
  });

  it('renders AppLayout wrapper', () => {
    renderApp();
    expect(screen.getByTestId('app-layout')).toBeInTheDocument();
  });

  it('renders BoardList on root path', () => {
    renderApp();
    expect(screen.getByText('Board List Page')).toBeInTheDocument();
  });

  describe('Routing', () => {
    it('has BrowserRouter configured', () => {
      renderApp();
      // BrowserRouter wraps the app, check that navigation structure exists
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('renders within AppLayout structure', () => {
      renderApp();
      const main = screen.getByTestId('main-content');
      expect(main).toBeInTheDocument();
      expect(main.tagName).toBe('MAIN');
    });
  });

  describe('Application Structure', () => {
    it('has header at the top', () => {
      renderApp();
      expect(screen.getByRole('banner')).toBeInTheDocument();
    });

    it('has main content area', () => {
      renderApp();
      expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('uses proper semantic HTML layout', () => {
      renderApp();
      const main = screen.getByRole('main');
      expect(main).toBeInTheDocument();
      expect(main).toContainElement(screen.getByText('Board List Page'));
    });
  });

  describe('Integration', () => {
    it('renders with BoardProvider context', () => {
      // This test verifies the app works with context
      expect(() => renderApp()).not.toThrow();
    });

    it('displays initial route content', () => {
      renderApp();
      // Should render BoardList by default
      expect(screen.getByText('Board List Page')).toBeInTheDocument();
    });
  });
});
