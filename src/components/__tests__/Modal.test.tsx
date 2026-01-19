import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from '../Modal';

describe('Modal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('renders when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </Modal>
    );
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Modal isOpen={true} onClose={mockOnClose}>
        <div>Child 1</div>
        <div>Child 2</div>
      </Modal>
    );
    expect(screen.getByText('Child 1')).toBeInTheDocument();
    expect(screen.getByText('Child 2')).toBeInTheDocument();
  });

  describe('Close Functionality', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = screen.getByTestId('modal-backdrop');
      if (backdrop) {
        await user.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('does not call onClose when modal content is clicked', async () => {
      const user = userEvent.setup();
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      await user.click(screen.getByText('Modal Content'));

      expect(mockOnClose).not.toHaveBeenCalled();
    });

    it('calls onClose when Escape key is pressed', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('does not call onClose when other keys are pressed', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Enter' });
      fireEvent.keyDown(document, { key: 'a' });

      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  describe('Event Listeners', () => {
    it('adds keydown event listener when modal opens', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');

      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
    });

    it('removes keydown event listener when close button is clicked', async () => {
      const user = userEvent.setup();
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      const closeButton = screen.getByRole('button', { name: 'Close' });
      await user.click(closeButton);

      // Simulate the modal actually closing by rerendering with isOpen=false
      rerender(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      await waitFor(() => {
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      });

      removeEventListenerSpy.mockRestore();
    });

    it('removes keydown event listener when backdrop is clicked', async () => {
      const user = userEvent.setup();
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = screen.getByTestId('modal-backdrop');
      await user.click(backdrop);

      // Simulate the modal actually closing by rerendering with isOpen=false
      rerender(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      await waitFor(() => {
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      });

      removeEventListenerSpy.mockRestore();
    });

    it('removes keydown event listener when Escape key is pressed', async () => {
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { rerender } = render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      fireEvent.keyDown(document, { key: 'Escape' });

      // Simulate the modal actually closing by rerendering with isOpen=false
      rerender(
        <Modal isOpen={false} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      await waitFor(() => {
        expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));
      });

      removeEventListenerSpy.mockRestore();
    });
  });

  describe('Styling', () => {
    it('renders backdrop with correct structure', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      const backdrop = screen.getByTestId('modal-backdrop');
      expect(backdrop).toBeInTheDocument();
      expect(backdrop).toHaveAttribute('data-testid', 'modal-backdrop');
    });

    it('renders content container with correct structure', () => {
      render(
        <Modal isOpen={true} onClose={mockOnClose}>
          <div>Modal Content</div>
        </Modal>
      );

      const content = screen.getByTestId('modal-content');
      expect(content).toBeInTheDocument();
      expect(content).toContainElement(screen.getByText('Modal Content'));
    });
  });
});