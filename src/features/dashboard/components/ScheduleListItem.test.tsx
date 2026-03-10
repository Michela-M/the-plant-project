import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import ScheduleListItem from './ScheduleListItem';

const { mockUseAuth, mockShowSuccess, mockShowError, mockUpdatePlant } =
  vi.hoisted(() => ({
    mockUseAuth: vi.fn(),
    mockShowSuccess: vi.fn(),
    mockShowError: vi.fn(),
    mockUpdatePlant: vi.fn(),
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

vi.mock('@features/collection/services/updatePlant', () => ({
  updatePlant: mockUpdatePlant,
}));

vi.mock('./WaterModal', () => ({
  default: ({ plantId }: { plantId: string }) => (
    <div data-testid="water-modal">WaterModal for {plantId}</div>
  ),
}));

describe('ScheduleListItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
      loading: false,
      setUser: vi.fn(),
      logout: vi.fn(),
    });
    mockUpdatePlant.mockResolvedValue(undefined);
  });

  it('renders correctly', () => {
    render(
      <ScheduleListItem
        id="plant-1"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(screen.getByText('My Monstera')).toBeInTheDocument();
    expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument();
    expect(screen.getByTestId('watering-frequency')).toHaveTextContent(
      'Watering frequency: 7 days'
    );

    const img = screen.getByAltText('My Monstera image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/monstera.jpg');
  });

  it('shows estimated watering frequency when watering frequency is 0', () => {
    render(
      <ScheduleListItem
        id="plant-1"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={0}
        inferredWateringFrequency={8}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(
      screen.getByTestId('estimated-watering-frequency')
    ).toHaveTextContent('Estimated watering frequency: 8 days');
  });

  it("shows 'N/A' when estimated watering frequency is missing", () => {
    render(
      <ScheduleListItem
        id="plant-1"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={0}
        inferredWateringFrequency={null}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(
      screen.getByTestId('estimated-watering-frequency')
    ).toHaveTextContent('Estimated watering frequency: N/A');
    expect(
      screen.getByTestId('estimated-watering-frequency')
    ).not.toHaveTextContent('null days');
  });

  it('uses placeholder image when imageUrl is not provided', () => {
    render(
      <ScheduleListItem
        id="plant-1"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        imageUrl={null}
      />
    );

    const img = screen.getByAltText('My Monstera image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/public/images/placeholder.jpg');
  });

  it('opens options menu and launches WaterModal from menu action', () => {
    render(
      <ScheduleListItem
        id="plant-123"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        imageUrl={null}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Options' }));

    expect(
      screen.getByRole('button', { name: 'Plant watered' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Remove from schedule' })
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Plant watered' }));

    expect(screen.getByTestId('water-modal')).toHaveTextContent(
      'WaterModal for plant-123'
    );
    expect(
      screen.queryByRole('button', { name: 'Plant watered' })
    ).not.toBeInTheDocument();
  });

  it('removes plant from schedule and shows success toast', async () => {
    render(
      <ScheduleListItem
        id="plant-123"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        imageUrl={null}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Options' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove from schedule' })
    );

    await waitFor(() => {
      expect(mockUpdatePlant).toHaveBeenCalledWith(
        'plant-123',
        { trackWatering: false },
        'user-1'
      );
      expect(mockShowSuccess).toHaveBeenCalledWith(
        'Plant removed from schedule successfully'
      );
    });

    expect(
      screen.queryByRole('button', { name: 'Remove from schedule' })
    ).not.toBeInTheDocument();
  });

  it('shows error toast when remove from schedule fails', async () => {
    mockUpdatePlant.mockRejectedValueOnce(new Error('Write failed'));

    render(
      <ScheduleListItem
        id="plant-123"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        imageUrl={null}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Options' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'Remove from schedule' })
    );

    await waitFor(() => {
      expect(mockShowError).toHaveBeenCalledWith(
        'Error removing plant from schedule',
        'Write failed'
      );
    });
  });
});
