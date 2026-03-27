import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ScheduleCard from './ScheduleCard';

vi.mock('./WaterModal', () => ({
  default: ({ plantId }: { plantId: string }) => (
    <div data-testid="water-modal">WaterModal for {plantId}</div>
  ),
}));

vi.mock('./SnoozeModal', () => ({
  default: ({ plantId }: { plantId: string }) => (
    <div data-testid="snooze-modal">SnoozeModal for {plantId}</div>
  ),
}));

describe('ScheduleCard', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders plant information correctly', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-02T12:00:00'));

    render(
      <ScheduleCard
        id="plant-1"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        lastWateredDate={new Date('2026-03-01T10:00:00')}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(screen.getByText('My Monstera')).toBeInTheDocument();
    expect(screen.getByText('Monstera Deliciosa')).toBeInTheDocument();
    expect(screen.getByTestId('watering-frequency')).toHaveTextContent(
      '7 days'
    );
    expect(screen.getByTestId('last-watered-date')).toHaveTextContent(
      'yesterday'
    );

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/monstera.jpg');
    expect(img.alt).toBe('My Monstera image');
  });

  it('shows estimated watering frequency when watering frequency is 0', () => {
    render(
      <ScheduleCard
        id="plant-1"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={0}
        inferredWateringFrequency={8}
        lastWateredDate={new Date('2026-03-01T10:00:00')}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(
      screen.getByTestId('estimated-watering-frequency')
    ).toHaveTextContent('8 days');
  });

  it("shows 'N/A' when estimated watering frequency is missing", () => {
    render(
      <ScheduleCard
        id="plant-1"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={0}
        inferredWateringFrequency={null}
        lastWateredDate={new Date('2026-03-01T10:00:00')}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(
      screen.getByTestId('estimated-watering-frequency')
    ).toHaveTextContent('N/A');
    expect(
      screen.getByTestId('estimated-watering-frequency')
    ).not.toHaveTextContent('null days');
  });

  it("shows 'N/A' for last watered date when it's null", () => {
    render(
      <ScheduleCard
        id="plant-1"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        lastWateredDate={null}
        imageUrl="https://example.com/monstera.jpg"
      />
    );

    expect(screen.getByTestId('last-watered-date')).toHaveTextContent('N/A');
  });

  it('uses placeholder image when imageUrl is null', () => {
    render(
      <ScheduleCard
        id="plant-1"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        lastWateredDate={new Date('2026-03-01T10:00:00')}
        imageUrl={null}
      />
    );

    const img = screen.getByRole('img') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain('/images/placeholder.jpg');
    expect(img.alt).toBe('No photo available for My Monstera');
  });

  it('opens WaterModal when Watered is clicked', () => {
    render(
      <ScheduleCard
        id="plant-123"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        lastWateredDate={new Date('2026-03-01T10:00:00')}
        imageUrl={null}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Watered' }));

    expect(screen.getByTestId('water-modal')).toHaveTextContent(
      'WaterModal for plant-123'
    );
  });

  it('opens SnoozeModal when Snooze is clicked', () => {
    render(
      <ScheduleCard
        id="plant-123"
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        lastWateredDate={new Date('2026-03-01T10:00:00')}
        imageUrl={null}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Snooze' }));

    expect(screen.getByTestId('snooze-modal')).toHaveTextContent(
      'SnoozeModal for plant-123'
    );
  });
});
