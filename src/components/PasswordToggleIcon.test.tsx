import { describe, expect, it, vi } from 'vitest';
import PasswordToggleIcon from './PasswordToggleIcon';
import { screen, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('PasswordToggleIcon', () => {
  it('renders the eye icon when visible is false', () => {
    render(<PasswordToggleIcon visible={false} onToggle={() => {}} />);

    const button = screen.getByRole('button', { name: 'Show password' });
    expect(button).toBeInTheDocument();
  });

  it('renders the eye-off icon when visible is true', () => {
    render(<PasswordToggleIcon visible={true} onToggle={() => {}} />);

    const button = screen.getByRole('button', { name: 'Hide password' });
    expect(button).toBeInTheDocument();
  });

  it('calls onToggle when clicked', async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();
    render(<PasswordToggleIcon visible={false} onToggle={onToggle} />);

    const button = screen.getByRole('button', { name: 'Show password' });
    await user.click(button);

    expect(onToggle).toHaveBeenCalled();
  });
});
