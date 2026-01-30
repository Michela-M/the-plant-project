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

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button label="Click" onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
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

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<IconButton icon={<span />} onClick={onClick} />);

    await user.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
