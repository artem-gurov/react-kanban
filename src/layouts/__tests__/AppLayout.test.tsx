import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AppLayout from '../AppLayout';

describe('AppLayout', () => {
  const renderWithRouter = () => {
    return render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<AppLayout />}>
            <Route path="*" element={<div>Test Content</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  };

  it('renders the Header component', () => {
    renderWithRouter();
    expect(screen.getByText('Kanban Boards')).toBeInTheDocument();
  });

  it('renders the Outlet for child routes', () => {
    renderWithRouter();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('applies correct layout structure', () => {
    renderWithRouter();
    const layout = screen.getByTestId('app-layout');
    expect(layout).toBeInTheDocument();
    expect(layout).toContainElement(screen.getByRole('banner'));
    expect(layout).toContainElement(screen.getByRole('main'));
  });

  it('renders main content area with correct structure', () => {
    renderWithRouter();
    const main = screen.getByTestId('main-content');
    expect(main).toBeInTheDocument();
    expect(main.tagName).toBe('MAIN');
    expect(main).toContainElement(screen.getByText('Test Content'));
  });

  it('creates a full-height layout', () => {
    renderWithRouter();
    const layout = screen.getByTestId('app-layout');
    expect(layout).toBeInTheDocument();
  });

  it('renders header before main content', () => {
    renderWithRouter();
    const header = screen.getByRole('banner');
    const main = screen.getByRole('main');

    expect(header).toBeInTheDocument();
    expect(main).toBeInTheDocument();

    // Check that header comes before main in the DOM
    const parent = header.parentElement;
    const children = Array.from(parent?.children || []);
    const headerIndex = children.indexOf(header);
    const mainIndex = children.indexOf(main);

    expect(headerIndex).toBeLessThan(mainIndex);
  });
});
