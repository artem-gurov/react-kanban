import { render, screen } from '@testing-library/react';
import Icon from '../Icon';

describe('Icon', () => {
  describe('trash icon', () => {
    it('renders trash icon', () => {
      render(<Icon type="trash" />);
      const svg = screen.getByTestId('icon-trash');
      expect(svg).toBeInTheDocument();
    });

    it('renders with proper SVG attributes', () => {
      render(<Icon type="trash" />);
      const svg = screen.getByTestId('icon-trash');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('kanban icon', () => {
    it('renders kanban icon', () => {
      render(<Icon type="kanban" />);
      const svg = screen.getByTestId('icon-kanban');
      expect(svg).toBeInTheDocument();
    });

    it('renders with proper SVG attributes', () => {
      render(<Icon type="kanban" />);
      const svg = screen.getByTestId('icon-kanban');
      expect(svg).toHaveAttribute('fill', 'currentColor');
      expect(svg).toHaveAttribute('viewBox', '0 0 20 20');
    });
  });

  describe('plus icon', () => {
    it('renders plus icon', () => {
      render(<Icon type="plus" />);
      const svg = screen.getByTestId('icon-plus');
      expect(svg).toBeInTheDocument();
    });

    it('renders with proper SVG attributes', () => {
      render(<Icon type="plus" />);
      const svg = screen.getByTestId('icon-plus');
      expect(svg).toHaveAttribute('fill', 'none');
      expect(svg).toHaveAttribute('stroke', 'currentColor');
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });
  });

  describe('sizes', () => {
    it('applies small size and class', () => {
      render(<Icon type="trash" size="sm" />);
      const svg = screen.getByTestId('icon-trash');
      expect(svg).toHaveAttribute('data-size', 'sm');
      expect(svg).toHaveClass('w-4', 'h-4');
    });

    it('applies medium size and class by default', () => {
      render(<Icon type="trash" />);
      const svg = screen.getByTestId('icon-trash');
      expect(svg).toHaveAttribute('data-size', 'md');
      expect(svg).toHaveClass('w-5', 'h-5');
    });

    it('applies large size and class', () => {
      render(<Icon type="trash" size="lg" />);
      const svg = screen.getByTestId('icon-trash');
      expect(svg).toHaveAttribute('data-size', 'lg');
      expect(svg).toHaveClass('w-6', 'h-6');
    });
  });

  describe('custom styling', () => {
    it('applies custom className', () => {
      render(<Icon type="trash" className="custom-class" />);
      const svg = screen.getByTestId('icon-trash');
      expect(svg).toHaveClass('custom-class');
    });

    it('combines size class with custom className', () => {
      render(<Icon type="plus" size="lg" className="text-red-500" />);
      const svg = screen.getByTestId('icon-plus');
      expect(svg).toHaveClass('w-6', 'h-6', 'text-red-500');
    });
  });
});
