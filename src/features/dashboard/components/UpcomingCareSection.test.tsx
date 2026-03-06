import { afterEach, beforeEach, describe, it, expect, vi } from 'vitest';
import UpcomingCareSection from './UpcomingCareSection';
import { render, screen } from '@testing-library/react';

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
        species: 'Monstera deliciosa',
        nextWateringDate: new Date('2026-03-03T10:00:00'),
        wateringFrequency: 7,
        inferredWateringFrequency: null,
        imageUrl: 'https://example.com/monstera.jpg',
      },
      {
        id: 'plant-2',
        name: 'Snake Plant',
        species: 'Sansevieria trifasciata',
        nextWateringDate: new Date('2026-03-03T18:00:00'),
        wateringFrequency: 10,
        inferredWateringFrequency: null,
        imageUrl: null,
      },
      {
        id: 'plant-3',
        name: 'Fiddle Leaf Fig',
        species: 'Ficus lyrata',
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
        species: 'Monstera deliciosa',
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
});
