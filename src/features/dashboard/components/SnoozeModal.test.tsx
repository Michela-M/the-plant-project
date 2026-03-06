import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import SnoozeModal from './SnoozeModal';

const { mockUpdateNextWatering, mockUseAuth, mockShowSuccess, mockShowError } =
  vi.hoisted(() => ({
    mockUpdateNextWatering: vi.fn(),
    mockUseAuth: vi.fn(),
    mockShowSuccess: vi.fn(),
    mockShowError: vi.fn(),
  }));

vi.mock('../services/updateNextWateringDate', () => ({
  updateNextWatering: mockUpdateNextWatering,
}));

vi.mock('@context/auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@context/toast/useToast', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}));

describe('SnoozeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      loading: false,
      setUser: vi.fn(),
      logout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('renders modal content and options', () => {
    render(<SnoozeModal plantId="plant-1" setShowSnoozeModal={vi.fn()} />);

    expect(screen.getByText('No need to water today!')).toBeInTheDocument();
    expect(screen.getByLabelText('Remind me tomorrow')).toBeInTheDocument();
    expect(screen.getByLabelText("Don't remind me")).toBeInTheDocument();
    expect(screen.getByLabelText('Number of days')).toHaveValue(2);
  });

  it('submits tomorrow option by default', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-05T10:30:00.000Z'));

    const setShowSnoozeModal = vi.fn();

    render(
      <SnoozeModal plantId="plant-1" setShowSnoozeModal={setShowSnoozeModal} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await vi.runAllTimersAsync();
    await Promise.resolve();

    expect(mockUpdateNextWatering).toHaveBeenCalledTimes(1);
    const nextWateringDate = mockUpdateNextWatering.mock.calls[0][2] as Date;
    expect(mockUpdateNextWatering).toHaveBeenCalledWith(
      'plant-1',
      'user-1',
      new Date('2026-03-06T10:30:00.000Z')
    );
    expect(nextWateringDate).toEqual(new Date('2026-03-06T10:30:00.000Z'));
    expect(setShowSnoozeModal).toHaveBeenCalledWith(false);
    expect(mockShowSuccess).toHaveBeenCalledWith(
      'Watering reminder snoozed successfully!'
    );
  });

  it('submits custom snooze days when days input is used', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-05T10:30:00.000Z'));

    render(<SnoozeModal plantId="plant-1" setShowSnoozeModal={vi.fn()} />);

    const daysInput = screen.getByLabelText('Number of days');
    fireEvent.focus(daysInput);
    fireEvent.change(daysInput, { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));
    await vi.runAllTimersAsync();
    await Promise.resolve();

    expect(mockUpdateNextWatering).toHaveBeenCalledTimes(1);
    const nextWateringDate = mockUpdateNextWatering.mock.calls[0][2] as Date;
    expect(mockUpdateNextWatering).toHaveBeenCalledWith(
      'plant-1',
      'user-1',
      new Date('2026-03-10T10:30:00.000Z')
    );
    expect(nextWateringDate).toEqual(new Date('2026-03-10T10:30:00.000Z'));
  });

  it('shows validation message for invalid snooze days and blocks submit', async () => {
    render(<SnoozeModal plantId="plant-1" setShowSnoozeModal={vi.fn()} />);

    const daysInput = screen.getByLabelText('Number of days');
    fireEvent.focus(daysInput);
    fireEvent.change(daysInput, { target: { value: '0' } });
    fireEvent.blur(daysInput);
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(screen.getByText('Must be greater than 0')).toBeInTheDocument();
      expect(daysInput).toHaveAttribute('aria-invalid', 'true');
      expect(mockUpdateNextWatering).not.toHaveBeenCalled();
    });
  });

  it('submits null nextWateringDate for do not remind option', async () => {
    render(<SnoozeModal plantId="plant-1" setShowSnoozeModal={vi.fn()} />);

    fireEvent.click(screen.getByLabelText("Don't remind me"));
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockUpdateNextWatering).toHaveBeenCalledWith(
        'plant-1',
        'user-1',
        null
      );
    });
  });

  it('closes without updating when no user is available', async () => {
    const setShowSnoozeModal = vi.fn();

    mockUseAuth.mockReturnValue({
      user: null,
      loading: false,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <SnoozeModal plantId="plant-1" setShowSnoozeModal={setShowSnoozeModal} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockUpdateNextWatering).not.toHaveBeenCalled();
      expect(setShowSnoozeModal).toHaveBeenCalledWith(false);
      expect(mockShowError).toHaveBeenCalledWith(
        'User not authenticated. Please log in again.'
      );
    });
  });

  it('shows an error toast when snoozing fails', async () => {
    const setShowSnoozeModal = vi.fn();

    mockUpdateNextWatering.mockRejectedValueOnce(new Error('Write failed'));

    render(
      <SnoozeModal plantId="plant-1" setShowSnoozeModal={setShowSnoozeModal} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        'Error snoozing reminder',
        'Write failed'
      );
      expect(setShowSnoozeModal).not.toHaveBeenCalledWith(false);
    });
  });

  it('closes when cancel is clicked', () => {
    const setShowSnoozeModal = vi.fn();

    render(
      <SnoozeModal plantId="plant-1" setShowSnoozeModal={setShowSnoozeModal} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(setShowSnoozeModal).toHaveBeenCalledWith(false);
  });
});
