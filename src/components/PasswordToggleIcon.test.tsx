import { describe, expect, it, vi } from 'vitest';
import PasswordToggleIcon from './PasswordToggleIcon';
import { screen, render } from '@testing-library/react';

describe('PasswordToggleIcon', () => {
  it('renders the eye icon when visible is false', () => {
    render(<PasswordToggleIcon visible={false} onToggle={() => {}} />);

    expect(screen.getByLabelText('show password')).toBeInTheDocument();
  });

  it('renders the eye-off icon when visible is true', () => {
    render(<PasswordToggleIcon visible={true} onToggle={() => {}} />);

    expect(screen.getByLabelText('hide password')).toBeInTheDocument();
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<PasswordToggleIcon visible={false} onToggle={onToggle} />);

    const button = screen.getByLabelText('show password');
    button.click();

    expect(onToggle).toHaveBeenCalled();
  });
});
