import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InputDialog from '../InputDialog';

describe('InputDialog', () => {
  const mockOnClose = jest.fn();
  const mockOnSubmit = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onSubmit: mockOnSubmit,
    title: 'Enter Name',
    label: 'Name',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and label when open', () => {
    render(<InputDialog {...defaultProps} />);

    expect(screen.getByText('Enter Name')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    render(<InputDialog {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Enter Name')).not.toBeInTheDocument();
  });

  it('renders input field with placeholder', () => {
    render(<InputDialog {...defaultProps} placeholder="Enter your name" />);

    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();
  });

  it('renders default button text', () => {
    render(<InputDialog {...defaultProps} />);

    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders custom button text', () => {
    render(
      <InputDialog
        {...defaultProps}
        submitText="Create"
        cancelText="Discard"
      />
    );

    expect(screen.getByText('Create')).toBeInTheDocument();
    expect(screen.getByText('Discard')).toBeInTheDocument();
  });

  it('populates input with defaultValue', () => {
    render(<InputDialog {...defaultProps} defaultValue="Test Value" />);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Test Value');
  });

  it('calls onSubmit and onClose with trimmed value when form is submitted', async () => {
    const user = userEvent.setup();
    render(<InputDialog {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '  Test Value  ');
    await user.click(screen.getByText('Submit'));

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Value');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onSubmit when Enter key is pressed', async () => {
    const user = userEvent.setup();
    render(<InputDialog {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Test Value{Enter}');

    expect(mockOnSubmit).toHaveBeenCalledWith('Test Value');
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not submit when value is empty', async () => {
    const user = userEvent.setup();
    render(<InputDialog {...defaultProps} />);

    await user.click(screen.getByText('Submit'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('does not submit when value is only whitespace', async () => {
    const user = userEvent.setup();
    render(<InputDialog {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, '   ');
    await user.click(screen.getByText('Submit'));

    expect(mockOnSubmit).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<InputDialog {...defaultProps} />);

    await user.click(screen.getByText('Cancel'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<InputDialog {...defaultProps} />);

    const backdrop = screen.getByTestId('modal-backdrop');
    await user.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onClose when escape key is pressed', async () => {
    const user = userEvent.setup();
    render(<InputDialog {...defaultProps} />);

    await user.keyboard('{Escape}');

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('disables submit button when value is empty', () => {
    render(<InputDialog {...defaultProps} />);

    const submitButton = screen.getByText('Submit');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when value is provided', async () => {
    const user = userEvent.setup();
    render(<InputDialog {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Test');

    const submitButton = screen.getByText('Submit');
    expect(submitButton).not.toBeDisabled();
  });

  it('resets value when reopened', () => {
    const { rerender } = render(
      <InputDialog {...defaultProps} defaultValue="Initial" />
    );

    expect(screen.getByRole('textbox')).toHaveValue('Initial');

    rerender(
      <InputDialog {...defaultProps} isOpen={false} defaultValue="Initial" />
    );

    rerender(
      <InputDialog {...defaultProps} isOpen={true} defaultValue="Updated" />
    );

    expect(screen.getByRole('textbox')).toHaveValue('Updated');
  });

  it('updates input value when typing', async () => {
    const user = userEvent.setup();
    render(<InputDialog {...defaultProps} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'New Value');

    expect(input).toHaveValue('New Value');
  });
});
