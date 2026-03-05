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
    const setShowSnoozeModal = vi.fn();
    const submitTime = new Date();

    render(
      <SnoozeModal plantId="plant-1" setShowSnoozeModal={setShowSnoozeModal} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockUpdateNextWatering).toHaveBeenCalledTimes(1);
      const nextWateringDate = mockUpdateNextWatering.mock.calls[0][2] as Date;
      expect(mockUpdateNextWatering).toHaveBeenCalledWith(
        'plant-1',
        'user-1',
        expect.any(Date)
      );
      expect(nextWateringDate).toBeInstanceOf(Date);
      const dayDiff = Math.round(
        (nextWateringDate.getTime() - submitTime.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      expect(dayDiff).toBe(1);
      expect(setShowSnoozeModal).toHaveBeenCalledWith(false);
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Watering reminder snoozed successfully!'
      );
    });
  });

  it('submits custom snooze days when days input is used', async () => {
    const submitTime = new Date();

    render(<SnoozeModal plantId="plant-1" setShowSnoozeModal={vi.fn()} />);

    const daysInput = screen.getByLabelText('Number of days');
    fireEvent.focus(daysInput);
    fireEvent.change(daysInput, { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockUpdateNextWatering).toHaveBeenCalledTimes(1);
      const nextWateringDate = mockUpdateNextWatering.mock.calls[0][2] as Date;
      expect(mockUpdateNextWatering).toHaveBeenCalledWith(
        'plant-1',
        'user-1',
        expect.any(Date)
      );
      expect(nextWateringDate).toBeInstanceOf(Date);
      const dayDiff = Math.round(
        (nextWateringDate.getTime() - submitTime.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      expect(dayDiff).toBe(5);
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

  it('closes when cancel is clicked', () => {
    const setShowSnoozeModal = vi.fn();

    render(
      <SnoozeModal plantId="plant-1" setShowSnoozeModal={setShowSnoozeModal} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(setShowSnoozeModal).toHaveBeenCalledWith(false);
  });
});
