import { describe, it, expect } from 'vitest';
import TodayCareSection from './TodayCareSection';
import { render, screen } from '@testing-library/react';

describe('TodayCareSection', () => {
  it('renders a ScheduleCard for each plant passed in', () => {
    const plants = [
      {
        id: 'plant-1',
        name: 'Monstera',
        species: 'Monstera deliciosa',
        wateringFrequency: 7,
        inferredWateringFrequency: null,
        lastWateredDate: new Date('2026-03-01T10:00:00Z'),
        imageUrl: 'https://example.com/monstera.jpg',
      },
      {
        id: 'plant-2',
        name: 'Fiddle Leaf Fig',
        species: 'Ficus lyrata',
        wateringFrequency: 5,
        inferredWateringFrequency: null,
        lastWateredDate: new Date('2026-03-01T12:00:00Z'),
        imageUrl: null,
      },
    ];

    render(<TodayCareSection plants={plants} />);

    expect(screen.getByText('Monstera')).toBeInTheDocument();
    expect(screen.getByText('Fiddle Leaf Fig')).toBeInTheDocument();
    expect(screen.getAllByTestId('schedule-card')).toHaveLength(2);
  });

  it('renders nothing when no plants are passed in', () => {
    render(<TodayCareSection plants={[]} />);
    expect(screen.queryByTestId('schedule-card')).not.toBeInTheDocument();
  });
});
