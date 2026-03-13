import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
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

  it('should use status/polite live region for info toasts', () => {
    render(
      <Toast message="Info toast" type="info" open={true} onClose={() => {}} />
    );

    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  it('should use alert/assertive live region for warning toasts', () => {
    render(
      <Toast
        message="Warning toast"
        type="warning"
        open={true}
        onClose={() => {}}
      />
    );

    const toast = screen.getByRole('alert');
    expect(toast).toHaveAttribute('aria-live', 'assertive');
  });

  it('should stay open while hovering over the toast', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Toast message="Hover test" open={true} onClose={onClose} />);

    const toast = screen.getByRole('status');
    fireEvent.mouseEnter(toast);

    vi.advanceTimersByTime(5000);
    expect(onClose).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('should resume auto-close countdown when hover ends', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Toast message="Hover leave test" open={true} onClose={onClose} />);

    const toast = screen.getByRole('status');
    fireEvent.mouseEnter(toast);
    vi.advanceTimersByTime(5000);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseLeave(toast);
    vi.advanceTimersByTime(3999);
    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it('should pause auto-close while close button is focused and resume on blur', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();

    render(<Toast message="Focus test" open={true} onClose={onClose} />);

    const closeButton = screen.getByRole('button', {
      name: 'Close notification',
    });

    fireEvent.focus(closeButton);
    vi.advanceTimersByTime(5000);
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.blur(closeButton);
    vi.advanceTimersByTime(3999);
    expect(onClose).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
