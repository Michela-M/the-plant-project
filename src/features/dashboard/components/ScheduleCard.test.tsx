import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import ScheduleCard from './ScheduleCard';

describe('ScheduleCard', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders plant information correctly', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-02T12:00:00'));

    render(
      <ScheduleCard
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

    const img = screen.getByAltText('My Monstera image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe('https://example.com/monstera.jpg');
  });

  it('shows estimated watering frequency when watering frequency is 0', () => {
    render(
      <ScheduleCard
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

  it("shows 'N/A' for last watered date when it's null", () => {
    render(
      <ScheduleCard
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
        name="My Monstera"
        species="Monstera Deliciosa"
        wateringFrequency={7}
        inferredWateringFrequency={8}
        lastWateredDate={new Date('2026-03-01T10:00:00')}
        imageUrl={null}
      />
    );

    const img = screen.getByAltText('My Monstera image') as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toBe(
      'https://larchcottage.co.uk/wp-content/uploads/2024/05/placeholder.jpg'
    );
  });
});
