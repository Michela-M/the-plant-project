import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CareModal from './CareModal';

const {
  mockGetAllPlants,
  mockAddCareEntry,
  mockShowError,
  mockShowSuccess,
  mockUseAuth,
  mockCombineDateWithCurrentTime,
  mockGetLocalDateInputValue,
  mockReload,
} = vi.hoisted(() => ({
  mockGetAllPlants: vi.fn(),
  mockAddCareEntry: vi.fn(),
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

    Object.defineProperty(window, 'location', {
      configurable: true,
      writable: true,
      value: { ...window.location, reload: mockReload },
    });
  });

  it('fetches plants and renders the plant select when plantId is not provided', async () => {
    render(<CareModal setShowCareModal={vi.fn()} />);

    expect(mockGetAllPlants).toHaveBeenCalledWith('user-1');
    expect(await screen.findByLabelText('Select plant')).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Monstera' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Snake Plant' })
    ).toBeInTheDocument();
  });

  it('shows a loading spinner while plants are being fetched', () => {
    mockGetAllPlants.mockReturnValueOnce(new Promise(() => {}));

    render(<CareModal setShowCareModal={vi.fn()} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('submits a care entry using selected plant option', async () => {
    const setShowCareModal = vi.fn();
    const user = userEvent.setup();

    render(<CareModal setShowCareModal={setShowCareModal} />);

    await screen.findByLabelText('Select plant');
    await user.selectOptions(screen.getByLabelText('Select plant'), 'Monstera');
    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(mockAddCareEntry).toHaveBeenCalledWith({
        date: new Date('2026-03-01T12:00:00.000Z'),
        careType: 'water',
        notes: '',
        otherCareType: '',
        plantId: 'plant-1',
        userId: 'user-1',
      });
    });

    expect(mockShowSuccess).toHaveBeenCalledWith(
      'Care entry added successfully'
    );
    expect(setShowCareModal).toHaveBeenCalledWith(false);
    expect(mockReload).toHaveBeenCalled();
  });

  it('uses provided plantId and skips plant fetching', async () => {
    const user = userEvent.setup();

    render(<CareModal setShowCareModal={vi.fn()} plantId="plant-99" />);

    expect(mockGetAllPlants).not.toHaveBeenCalled();
    expect(screen.queryByLabelText('Select plant')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Create' }));

    await waitFor(() => {
      expect(mockAddCareEntry).toHaveBeenCalledWith(
        expect.objectContaining({
          plantId: 'plant-99',
        })
      );
    });
  });
});
