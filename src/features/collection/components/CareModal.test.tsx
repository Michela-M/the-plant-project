import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import CareModal from './CareModal';

const {
  mockGetAllPlants,
  mockAddCareEntry,
  mockUpdateWateringDates,
  mockShowError,
  mockShowSuccess,
  mockUseAuth,
  mockCombineDateWithCurrentTime,
  mockGetLocalDateInputValue,
  mockReload,
} = vi.hoisted(() => ({
  mockGetAllPlants: vi.fn(),
  mockAddCareEntry: vi.fn(),
  mockUpdateWateringDates: vi.fn(),
  mockShowError: vi.fn(),
  mockShowSuccess: vi.fn(),
  mockUseAuth: vi.fn(),
  mockCombineDateWithCurrentTime: vi.fn(),
  mockGetLocalDateInputValue: vi.fn(),
  mockReload: vi.fn(),
}));

vi.mock('@features/collection/services/getAllPlants', () => ({
  getAllPlants: mockGetAllPlants,
}));

vi.mock('@features/collection/services/addCareEntry', () => ({
  addCareEntry: mockAddCareEntry,
}));

vi.mock('../utils/updateWateringDates', () => ({
  default: mockUpdateWateringDates,
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

describe('CareModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      loading: false,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    mockGetAllPlants.mockResolvedValue([
      { id: 'plant-1', name: 'Monstera' },
      { id: 'plant-2', name: 'Snake Plant' },
    ]);

    mockGetLocalDateInputValue.mockReturnValue('2026-03-01');
    mockCombineDateWithCurrentTime.mockReturnValue(
      new Date('2026-03-01T12:00:00.000Z')
    );

    mockAddCareEntry.mockResolvedValue(undefined);
    mockUpdateWateringDates.mockResolvedValue({
      inferredWateringFrequency: 0,
      lastWateredDate: new Date('2026-03-01T12:00:00.000Z'),
      secondLastWateredDate: null,
      nextWateringDate: null,
    });

    Object.defineProperty(globalThis, 'location', {
      configurable: true,
      writable: true,
      value: { ...globalThis.location, reload: mockReload },
    });
  });

  it('fetches plants and renders the plant select when plantId is not provided', async () => {
    render(<CareModal setShowCareModal={vi.fn()} />);

    expect(mockGetAllPlants).toHaveBeenCalledWith('user-1');
    // Find the input by placeholder since the accessible name may not be set
    const combo = await screen.findByPlaceholderText('Select plant');
    expect(combo).toBeInTheDocument();
    // Open dropdown and check options
    const toggleButton = screen.getByLabelText('Toggle options');
    await userEvent.click(toggleButton);
    expect(screen.getByText('Monstera')).toBeInTheDocument();
    expect(screen.getByText('Snake Plant')).toBeInTheDocument();
  });

  it('shows a loading spinner while plants are being fetched', () => {
    mockGetAllPlants.mockReturnValueOnce(new Promise(() => {}));

    render(<CareModal setShowCareModal={vi.fn()} />);

    expect(screen.getByText('Loading plants...')).toBeInTheDocument();
  });

  it('does not fetch plants or show an error while user id is not available', () => {
    mockUseAuth.mockReturnValueOnce({
      user: null,
      loading: true,
      setUser: vi.fn(),
      logout: vi.fn(),
    });

    render(<CareModal setShowCareModal={vi.fn()} />);

    expect(screen.getByText('Loading plants...')).toBeInTheDocument();
    expect(mockGetAllPlants).not.toHaveBeenCalled();
    expect(mockShowError).not.toHaveBeenCalled();
  });

  it('submits a care entry using selected plant option', async () => {
    const setShowCareModal = vi.fn();
    const user = userEvent.setup();

    render(<CareModal setShowCareModal={setShowCareModal} />);

    const combo = await screen.findByPlaceholderText('Select plant');
    const toggleButton = screen.getByLabelText('Toggle options');
    await user.click(toggleButton);
    await user.click(screen.getByText('Monstera'));
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(mockUpdateWateringDates).toHaveBeenCalledWith(
        'plant-1',
        'user-1',
        {
          date: new Date('2026-03-01T12:00:00.000Z'),
        }
      );
      expect(mockAddCareEntry).toHaveBeenCalledWith({
        date: new Date('2026-03-01T12:00:00.000Z'),
        careType: 'water',
        notes: '',
        otherCareType: '',
        plantId: 'plant-1',
        userId: 'user-1',
        inferredWateringFrequency: 0,
        lastWateredDate: new Date('2026-03-01T12:00:00.000Z'),
        secondLastWateredDate: null,
        nextWateringDate: null,
      });
    });

    expect(mockShowSuccess).toHaveBeenCalledWith(
      'Care entry added successfully'
    );
    expect(setShowCareModal).toHaveBeenCalledWith(false);
  });

  it('uses provided plantId and skips plant fetching', async () => {
    const user = userEvent.setup();

    render(<CareModal setShowCareModal={vi.fn()} plantId="plant-99" />);

    expect(mockGetAllPlants).not.toHaveBeenCalled();
    expect(screen.queryByLabelText('Select plant')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(mockUpdateWateringDates).toHaveBeenCalledWith(
        'plant-99',
        'user-1',
        {
          date: new Date('2026-03-01T12:00:00.000Z'),
        }
      );
      expect(mockAddCareEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          plantId: 'plant-99',
        })
      );
    });
  });
});
