import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Button, { IconButton } from './Button';

describe('Button', () => {
  it('renders the label', () => {
    render(<Button label="Click me" />);

    expect(
      screen.getByRole('button', { name: /click me/i })
    ).toBeInTheDocument();
  });

  it('renders the icon when provided', () => {
    render(<Button label="With Icon" icon={<span data-testid="icon" />} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('uses filled variant by default', () => {
    render(<Button label="Default" />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-green-800');
  });

  it('applies outlined variant classes', () => {
    render(<Button label="Outlined" variant="outlined" />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('border-green-800');
  });

  it('applies ghost variant classes', () => {
    render(<Button label="Ghost" variant="ghost" />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('text-green-800');
  });

  it('applies error tone classes', () => {
    render(<Button label="Error" tone="error" />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-red-800');
  });

  it('applies small size classes', () => {
    render(<Button label="Small" size="sm" />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('text-sm');
    expect(button.className).toContain('px-2');
    expect(button.className).toContain('py-1');
    expect(button.className).toContain('rounded-sm');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button label="Click" onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('shows spinner when loading is true', () => {
    render(<Button label="Loading" loading={true} />);

    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('does not show spinner when loading is false', () => {
    render(<Button label="Not Loading" loading={false} />);

    const button = screen.getByRole('button');
    expect(button.querySelector('.absolute')).not.toBeInTheDocument();
  });
});

describe('IconButton', () => {
  it('renders the icon', () => {
    render(<IconButton icon={<span data-testid="icon" />} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('uses filled variant by default', () => {
    render(<IconButton icon={<span />} />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-green-800');
  });

  it('applies outlined variant classes', () => {
    render(<IconButton variant="outlined" icon={<span />} />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('border-green-800');
  });

  it('applies ghost variant classes', () => {
    render(<IconButton variant="ghost" icon={<span />} />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('text-green-800');
  });

  it('applies small size classes', () => {
    render(<IconButton size="sm" icon={<span />} />);

    const button = screen.getByRole('button');
    expect(button.className).toContain('p-1');
    expect(button.className).toContain('rounded-sm');
  });

  it('uses label for aria-label when provided', () => {
    render(<IconButton icon={<span />} label="Delete" />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Delete');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<IconButton icon={<span />} onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
