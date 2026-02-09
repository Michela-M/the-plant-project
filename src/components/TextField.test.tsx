import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import TextField from './TextField';
import userEvent from '@testing-library/user-event';

describe('TextField', () => {
  it('renders label, placeholder and helper text', () => {
    render(
      <TextField
        label="Name"
        placeholder="Enter your name"
        helperText="We'll never share your name."
        name="name"
      />
    );
  });

  it('renders label as placeholder if placeholder is not provided', () => {
    render(<TextField label="Name" helperText="Enter your name" name="name" />);

    expect(screen.getByLabelText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByText('Enter your name')).toBeInTheDocument();
  });

  it('renders default placeholder when neither label nor placeholder is provided', () => {
    render(<TextField name="name" />);

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it("renders as disabled when the 'disabled' prop is true", () => {
    render(
      <TextField
        label="Name"
        placeholder="Enter your name"
        helperText="We'll never share your name."
        name="name"
        disabled
      />
    );

    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(input).toBeDisabled();
  });

  it("render icon when 'icon' prop is provided", () => {
    const TestIcon = () => <span data-testid="test-icon">Icon</span>;

    render(
      <TextField
        label="Name"
        placeholder="Enter your name"
        helperText="We'll never share your name."
        name="name"
        icon={<TestIcon />}
      />
    );

    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders the correct input type for supported input types', () => {
    const { rerender } = render(
      <TextField label="Email" name="email" type="email" />
    );
    expect(screen.getByLabelText('Email')).toHaveAttribute('type', 'email');

    rerender(<TextField label="Password" name="password" type="password" />);
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    );

    rerender(<TextField label="Age" name="age" type="number" />);
    expect(screen.getByLabelText('Age')).toHaveAttribute('type', 'number');

    rerender(<TextField label="Birthday" name="birthday" type="date" />);
    expect(screen.getByLabelText('Birthday')).toHaveAttribute('type', 'date');
  });

  it('renders a textarea when type is set to "textarea"', () => {
    render(
      <TextField
        label="Description"
        name="description"
        type="textarea"
        placeholder="Enter a description"
      />
    );

    const textarea = screen.getByLabelText(
      'Description'
    ) as HTMLTextAreaElement;
    expect(textarea).toBeInTheDocument();
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('calls onChange handler when input value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <TextField
        label="Name"
        name="name"
        placeholder="Enter your name"
        onChange={handleChange}
      />
    );

    const input = screen.getByLabelText('Name') as HTMLInputElement;
    await user.type(input, 'John Doe');

    expect(handleChange).toHaveBeenCalledTimes(8); // 8 characters typed
  });

  it('calls onBlur handler when input loses focus', async () => {
    const user = userEvent.setup();
    const handleBlur = vi.fn();

    render(
      <TextField
        label="Name"
        name="name"
        placeholder="Enter your name"
        onBlur={handleBlur}
      />
    );

    const input = screen.getByLabelText('Name') as HTMLInputElement;
    await user.click(input); // focus
    await user.click(document.body); // blur

    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('displays error message when error prop is provided', () => {
    render(
      <TextField
        label="Name"
        name="name"
        placeholder="Enter your name"
        error="Name is required"
      />
    );

    expect(screen.getByText('Name is required')).toBeInTheDocument();
  });

  it('applies correct styles when disabled', () => {
    render(
      <TextField
        label="Name"
        name="name"
        placeholder="Enter your name"
        disabled
      />
    );

    const input = screen.getByLabelText('Name') as HTMLInputElement;
    expect(input).toHaveClass(
      'cursor-not-allowed bg-stone-200 border-stone-300'
    );
  });

  // required
  it('displays asterisk when required prop is true', () => {
    render(
      <TextField
        label="Name"
        name="name"
        placeholder="Enter your name"
        required
      />
    );

    expect(screen.getByText('*')).toBeInTheDocument();
  });
});
