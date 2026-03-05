import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WaterModal from './WaterModal';

const {
  mockAddCareEntry,
  mockShowError,
  mockShowSuccess,
  mockUseAuth,
  mockCombineDateWithCurrentTime,
  mockGetLocalDateInputValue,
} = vi.hoisted(() => ({
  mockAddCareEntry: vi.fn(),
  mockShowError: vi.fn(),
  mockShowSuccess: vi.fn(),
  mockUseAuth: vi.fn(),
  mockCombineDateWithCurrentTime: vi.fn(),
  mockGetLocalDateInputValue: vi.fn(),
}));

vi.mock('@features/collection/services/addCareEntry', () => ({
  addCareEntry: mockAddCareEntry,
}));

vi.mock('@context/toast/useToast', () => ({
  useToast: () => ({
    showError: mockShowError,
    showSuccess: mockShowSuccess,
  }),
}));

vi.mock('@context/auth/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@utils/combineDateWithCurrentTime', () => ({
  default: mockCombineDateWithCurrentTime,
}));

vi.mock('@utils/getLocalDateInputValue', () => ({
  default: mockGetLocalDateInputValue,
}));

describe('WaterModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      loading: false,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    mockGetLocalDateInputValue.mockReturnValue('2026-03-01');
    mockCombineDateWithCurrentTime.mockReturnValue(
      new Date('2026-03-01T12:00:00.000Z')
    );
    mockAddCareEntry.mockResolvedValue(undefined);
  });

  it('renders modal title and form fields', () => {
    render(<WaterModal plantId="plant-1" setShowWaterModal={vi.fn()} />);

    expect(screen.getByText('Water Plant')).toBeInTheDocument();
    expect(screen.getByLabelText('Date')).toHaveValue('2026-03-01');
    expect(screen.getByLabelText('Notes')).toHaveValue('');
  });

  it('submits a water care entry and closes on success', async () => {
    const setShowWaterModal = vi.fn();
    const user = userEvent.setup();

    render(
      <WaterModal plantId="plant-1" setShowWaterModal={setShowWaterModal} />
    );

    await user.type(screen.getByLabelText('Notes'), 'Watered thoroughly');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockCombineDateWithCurrentTime).toHaveBeenCalledWith('2026-03-01');
      expect(mockAddCareEntry).toHaveBeenCalledWith({
        plantId: 'plant-1',
        userId: 'user-1',
        careType: 'water',
        date: new Date('2026-03-01T12:00:00.000Z'),
        notes: 'Watered thoroughly',
      });
    });

    expect(setShowWaterModal).toHaveBeenCalledWith(false);
    expect(mockShowSuccess).toHaveBeenCalledWith(
      'Plant watered',
      'Care entry added successfully'
    );
  });

  it('shows an error toast when submission fails', async () => {
    const setShowWaterModal = vi.fn();
    const user = userEvent.setup();

    mockAddCareEntry.mockRejectedValueOnce(new Error('failed'));

    render(
      <WaterModal plantId="plant-1" setShowWaterModal={setShowWaterModal} />
    );

    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        'Error',
        'Failed to add care entry'
      );
    });

    expect(setShowWaterModal).not.toHaveBeenCalledWith(false);
  });

  it('validates date and prevents future dates', async () => {
    const user = userEvent.setup();

    render(<WaterModal plantId="plant-1" setShowWaterModal={vi.fn()} />);

    const dateInput = screen.getByLabelText('Date');
    await user.clear(dateInput);
    await user.type(dateInput, '2999-01-01');
    await user.click(screen.getByRole('button', { name: 'Confirm' }));

    await waitFor(() => {
      expect(
        screen.getByText('Date cannot be in the future')
      ).toBeInTheDocument();
    });

    expect(mockAddCareEntry).not.toHaveBeenCalled();
  });

  it('closes the modal when cancel is clicked', async () => {
    const setShowWaterModal = vi.fn();
    const user = userEvent.setup();

    render(
      <WaterModal plantId="plant-1" setShowWaterModal={setShowWaterModal} />
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(setShowWaterModal).toHaveBeenCalledWith(false);
  });
});
