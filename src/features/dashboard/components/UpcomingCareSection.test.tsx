import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UpcomingCareSection from './UpcomingCareSection';

vi.mock('./ScheduleListItem', () => ({
  default: ({
    id,
    name,
    wateringFrequency,
    inferredWateringFrequency,
  }: {
    id: string;
    name: string;
    wateringFrequency: number | null;
    inferredWateringFrequency: number | null;
  }) => (
    <div data-testid={`schedule-item-${id}`}>
      <span>{name}</span>
      <span data-testid={`watering-frequency-${id}`}>{wateringFrequency}</span>
      <span data-testid={`inferred-frequency-${id}`}>
        {String(inferredWateringFrequency)}
      </span>
    </div>
  ),
}));

describe('UpcomingCareSection', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-02T10:00:00'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('groups plants by day and renders one heading per date group', () => {
    const plants = [
      {
        id: 'plant-1',
        name: 'Monstera',
        speciesName: 'Monstera deliciosa',
        nextWateringDate: new Date('2026-03-03T10:00:00'),
        wateringFrequency: 7,
        inferredWateringFrequency: null,
        imageUrl: 'https://example.com/monstera.jpg',
      },
      {
        id: 'plant-2',
        name: 'Snake Plant',
        speciesName: 'Sansevieria trifasciata',
        nextWateringDate: new Date('2026-03-03T18:00:00'),
        wateringFrequency: 10,
        inferredWateringFrequency: null,
        imageUrl: null,
      },
      {
        id: 'plant-3',
        name: 'Fiddle Leaf Fig',
        speciesName: 'Ficus lyrata',
        nextWateringDate: new Date('2026-03-04T12:00:00'),
        wateringFrequency: 5,
        inferredWateringFrequency: null,
        imageUrl: null,
      },
    ];

    render(<UpcomingCareSection plants={plants} />);

    expect(screen.getByText('Monstera')).toBeInTheDocument();
    expect(screen.getByText('Snake Plant')).toBeInTheDocument();
    expect(screen.getByText('Fiddle Leaf Fig')).toBeInTheDocument();

    expect(
      screen.getByRole('heading', { name: 'Tuesday 3 Mar (tomorrow)' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Wednesday 4 Mar (in 2 days)' })
    ).toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 })).toHaveLength(2);
  });

  it('skips plants without nextWateringDate', () => {
    const plants = [
      {
        id: 'plant-1',
        name: 'Monstera',
        speciesName: 'Monstera deliciosa',
        nextWateringDate: null,
        wateringFrequency: 7,
        inferredWateringFrequency: null,
        imageUrl: 'https://example.com/monstera.jpg',
      },
    ];

    render(<UpcomingCareSection plants={plants} />);

    expect(screen.getByText('No upcoming care.')).toBeInTheDocument();
    expect(screen.queryByText('Monstera')).not.toBeInTheDocument();
  });

  it('renders a message when no plants are passed in', () => {
    render(<UpcomingCareSection plants={[]} />);
    expect(screen.getByText('No upcoming care.')).toBeInTheDocument();
  });

  it('passes fallback values to ScheduleListItem when frequencies are missing', () => {
    const plants = [
      {
        id: 'plant-4',
        name: 'Pothos',
        speciesName: 'Epipremnum aureum',
        nextWateringDate: new Date('2026-03-03T09:00:00'),
        wateringFrequency: null,
        inferredWateringFrequency: undefined,
        imageUrl: null,
      },
    ];

    render(<UpcomingCareSection plants={plants} />);

    expect(screen.getByTestId('watering-frequency-plant-4')).toHaveTextContent(
      '0'
    );
    expect(screen.getByTestId('inferred-frequency-plant-4')).toHaveTextContent(
      'null'
    );
  });
});
