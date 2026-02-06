import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Toast from './Toast';

describe('Toast Component', () => {
  it('should render correctly when open', () => {
    render(
      <Toast
        message="Test message"
        detail="Detailed message"
        open={true}
        onClose={() => {}}
      />
    );

    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Detailed message')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('info-icon')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    render(<Toast message="Test message" open={false} onClose={() => {}} />);

    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });

  it('should display the correct icon based on type', () => {
    const types = ['info', 'warning', 'error', 'success'] as const;

    types.forEach((type) => {
      render(
        <Toast
          message="Test message"
          type={type}
          open={true}
          onClose={() => {}}
        />
      );

      expect(screen.getByTestId(`${type}-icon`)).toBeInTheDocument();
    });
  });

  it('should auto-close after 4 seconds', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Toast message="Auto close test" open={true} onClose={onClose} />);

    vi.advanceTimersByTime(4000);

    expect(onClose).toHaveBeenCalled();

    vi.useRealTimers();
  });
});
