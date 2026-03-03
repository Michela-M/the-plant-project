import { describe, it, expect } from 'vitest';
import UpcomingCareSection from './UpcomingCareSection';
import { render, screen } from '@testing-library/react';

describe('UpcomingCareSection', () => {
  it('renders a ScheduleListItem for each plant passed in', () => {
    const plants = [
      {
        id: 'plant-1',
        name: 'Monstera',
        species: 'Monstera deliciosa',
        nextWateringDate: new Date('2026-03-03T10:00:00Z'),
        wateringFrequency: 7,
        inferredWateringFrequency: null,
        imageUrl: 'https://example.com/monstera.jpg',
      },
      {
        id: 'plant-2',
        name: 'Fiddle Leaf Fig',
        species: 'Ficus lyrata',
        nextWateringDate: new Date('2026-03-04T12:00:00Z'),
        wateringFrequency: 5,
        inferredWateringFrequency: null,
        imageUrl: null,
      },
    ];

    render(<UpcomingCareSection plants={plants} />);

    expect(screen.getByText('Monstera')).toBeInTheDocument();
    expect(screen.getByText('Fiddle Leaf Fig')).toBeInTheDocument();
  });

  it('renders a message when no plants are passed in', () => {
    render(<UpcomingCareSection plants={[]} />);
    expect(screen.getByText('No upcoming care.')).toBeInTheDocument();
  });
});
